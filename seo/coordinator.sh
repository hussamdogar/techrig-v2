#!/usr/bin/env bash
# Ops engine coordinator (slim, portable).
# Runs one Operations Track agent unattended from inside seo/.
# Usage: ./coordinator.sh <agent-name> [seed-keyword]
# Agents: keyword-researcher | content-writer | onsite-audit | refresh-recommender
#
# For scheduling, call this from cron, Windows Task Scheduler, or launchd.
# For manual use you do not need this file: open Claude Code in seo/ and type the trigger.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCK_FILE="$SCRIPT_DIR/state/.lock"
LOCK_TIMEOUT=3600
REPORT_DIR="$SCRIPT_DIR/reports"
DATE_STAMP="$(date +%Y-%m-%d)"
AGENT_NAME="${1:-}"
SEED_ARG="${2:-}"

VALID_AGENTS=("keyword-researcher" "content-writer" "onsite-audit" "refresh-recommender")

if [[ -z "$AGENT_NAME" ]]; then
  echo "Usage: $0 <agent-name> [seed-keyword]"
  echo "Agents: ${VALID_AGENTS[*]}"
  exit 1
fi

valid=false
for a in "${VALID_AGENTS[@]}"; do [[ "$AGENT_NAME" == "$a" ]] && valid=true; done
if [[ "$valid" != "true" ]]; then
  echo "Invalid agent: $AGENT_NAME"; echo "Agents: ${VALID_AGENTS[*]}"; exit 1
fi

PROMPT_FILE="$SCRIPT_DIR/prompts/$AGENT_NAME.md"
REPORT_FILE="$REPORT_DIR/$DATE_STAMP-$AGENT_NAME.md"
[[ -f "$PROMPT_FILE" ]] || { echo "Prompt missing: $PROMPT_FILE"; exit 1; }
mkdir -p "$REPORT_DIR" "$SCRIPT_DIR/state"

# Single-run lock so scheduled runs never overlap.
if [[ -f "$LOCK_FILE" ]]; then
  t=$(head -1 "$LOCK_FILE" 2>/dev/null || echo 0); now=$(date +%s); age=$(( now - t ))
  if (( age > LOCK_TIMEOUT )); then echo "Stale lock (${age}s). Removing."; rm -f "$LOCK_FILE";
  else echo "Locked by $(tail -1 "$LOCK_FILE") (${age}s ago). Aborting."; exit 1; fi
fi
echo "$(date +%s)" > "$LOCK_FILE"; echo "$AGENT_NAME" >> "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

# Auth check.
if ! claude auth status >/dev/null 2>&1; then
  echo "ERROR: claude CLI not authenticated. Run: claude  (then sign in)."; exit 1
fi

cd "$SCRIPT_DIR"   # so .mcp.json (dfs-mcp, semrush, gsc) is discovered

# Build the prompt body, prepending headers the agents understand.
prompt_body="$(cat "$PROMPT_FILE")"
[[ -n "$SEED_ARG" ]] && prompt_body="SEED_KEYWORD: $SEED_ARG"$'\n\n'"$prompt_body"
[[ "$AGENT_NAME" == "content-writer" ]] && prompt_body="MODE: AUTO"$'\n\n'"$prompt_body"

echo "Agent: $AGENT_NAME  Seed: ${SEED_ARG:-<none>}  $(date -u +%FT%TZ)"
echo "Report: $REPORT_FILE"
echo "---------------------------------"

exit_code=0
claude -p "$prompt_body" --dangerously-skip-permissions 2>&1 | tee "$REPORT_FILE" || exit_code=$?

echo "---------------------------------"
if [[ $exit_code -ne 0 ]]; then echo "Agent exited $exit_code."; exit $exit_code; fi

# Optional: auto-commit the run if this is a git repo.
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if [[ -n "$(git status --porcelain . 2>/dev/null)" ]]; then
    git add -A . && git commit -m "seo($AGENT_NAME): run $DATE_STAMP" >/dev/null 2>&1 || true
    echo "Committed."
  fi
fi
echo "Done."

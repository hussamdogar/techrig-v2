# Refresh Recommender (System 4, run inside seo/)

You find published pages that are decaying or unindexed and produce a prioritised refresh queue with a specific action per URL. This is NOT an auto-rewriter. You recommend; the user acts.

## Spine (read first)
The shared persona, standards, and `project_config.md` load via the root CLAUDE.md. If invoked bare, read `../_shared/persona.md`, `../_shared/standards.md`, and `../project_config.md` first. Do not fabricate ages, flags, or coverage states. Cite `coverage_state` verbatim.

## Requires
The Google Search Console MCP, for URL Inspection (indexing status). If the GSC MCP is not available, stop and tell the user System 4 needs it wired.

## Read next
1. `context/site-config.md`: the site and sitemap URL
2. `context/services.md`: which URLs are commercial / money pages (higher priority)
3. `state/content-queue.json`: to skip URLs System 2 already handles (status `queued`, `in_progress`, `needs_review`)
Optional: if `state/refresh-candidates.json` exists (from your own pre-scan), use it as input and skip the scan in Step A.

## Step A: Build the candidate set (the scan)
WebFetch the sitemap from `context/site-config.md`, list the post and page URLs. For each URL:
- Fetch the page and extract the publish and last-modified dates (from the visible date, meta tags, or Article JSON-LD). Compute age in days from the most recent of the two.
- Query the GSC MCP URL Inspection for the URL and read its `coverage_state` and verdict.
Assign one or more flags:
- `not_indexed`: verdict FAIL, or coverage contains "not indexed", "Discovered - currently not indexed", "Crawled - currently not indexed", or "URL is unknown to Google".
- `index_warning`: alternate canonical, duplicate, redirect, or soft 404.
- `stale_12mo`: most recent date is 365+ days old.
- `aging`: 305 to 365 days old.
Drop URLs with no flags.

## Step B: Classify (one action per URL)
- `request_indexing`: `not_indexed` where the URL otherwise looks healthy. Fix is mechanical: open GSC, inspect the URL, Request Indexing; check robots.txt and the page robots meta. Cite the specific `coverage_state`.
- `fix_canonical`: `index_warning` mentioning alternate, duplicate, or a canonical mismatch. Align the page canonical with its actual location, or redirect/de-dupe intentionally.
- `refresh`: `stale_12mo` (or `aging` on commercial pages). Update dates, replace pre-2024 stats, re-align to the current SERP, update internal links to newer posts, add an "Updated YYYY-MM-DD" notice, then resubmit to GSC.
- `audit_then_decide`: ambiguous combined flags (e.g. `not_indexed` + `stale_12mo`) or an unrecognised coverage state. Tell the user to inspect manually in GSC, check canonical and googlebot rendering, and refresh only if content has decayed.

Skip first: if the URL is in `content-queue.json` with status queued, in_progress, or needs_review, ignore it (System 2 has it).

## Priority
- `1`: not-indexed money pages (from `services.md`), or any URL with multiple critical flags
- `2`: not-indexed blog posts, `stale_12mo` on money pages
- `3`: `index_warning`, `stale_12mo` on blog posts, `aging` on commercial pages
- `4`: `aging` on blog posts

## Output
Write `state/refresh-queue.json` (overwrite each run; preserve any item with status `in_progress` or `completed` only if the URL is still flagged): `schema_version` 2, `generated_at`, `site`, `totals` (total_actions, by_action), `items[]` (id = short hash of url, url, action, primary_flag, coverage_state, age_days, is_money_page, recommendation, priority, status `queued`, queued_at, completed_at null). Sort by priority asc, then age_days desc.

Also write `reports/<YYYY-MM-DD>-refresh-recommender.md`: summary (URLs evaluated, actions queued, by_action), a table per action (request indexing / refresh content / fix canonical / audit then decide), and a notes paragraph for next run.

Print: `Refresh queue ready. <N> actions: <breakdown>. Top action: <verb> on <highest-priority URL>.`

## Hard rules
- Recommendations are concrete and URL-specific, not "improve indexing": for example "Open GSC, inspect this URL, click Request Indexing. Check it returns 200 and has no noindex meta."
- Cite `coverage_state` verbatim. Do not invent.
- Skip URLs System 2 already handles.
- Write only to `state/` and `reports/`. Do not modify `prompts/`, `context/`, or `../_shared/`.
- No em dashes.

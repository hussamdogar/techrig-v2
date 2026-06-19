# Onsite Audit (System 3, run inside seo/)

An onsite SEO health auditor. Run Lighthouse and on-page audits on a small set of priority URLs and produce a focused, actionable report: performance, accessibility, best practices, SEO, plus on-page issues like broken canonicals, missing meta, schema problems, security headers.

This is NOT a content audit and NOT a backlink or authority audit. No keyword rankings, decay, content quality, or link profile here. Strictly onsite technical health.

## Spine (read first)
The shared persona, standards, and `project_config.md` load via the root CLAUDE.md. If invoked bare, read `../_shared/persona.md`, `../_shared/standards.md`, and `../project_config.md` first. Never invent scores; null where DataForSEO returns null.

## Read next
1. `context/audit-urls.txt`: the URL list (one per line, skip `#` lines). The SEO build seeds this with the homepage and the money-page URLs; the user can add extras.
2. `context/site-config.md`: what kind of site this is, and the primary URL
3. `context/services.md`: which pages are money pages (commercial pages get tighter thresholds)

Audit targets: audit every live URL in `audit-urls.txt`. If that file is missing or contains only the homepage, fall back to auditing the homepage plus the live money-page URLs from `services.md`, so money pages are always covered. Skip and report any URL that is not live yet (a new-build money page is only auditable after Dev ships the site).

## Workflow
1. Lighthouse: for each URL call `mcp__dfs-mcp__on_page_lighthouse` (task-based: POST then poll, or the live variant). Capture the four scores (performance, accessibility, best_practices, seo), Core Web Vitals (LCP ms, CLS, TBT ms or INP), and the top 5 failing audits with estimated savings. Lighthouse has no Semrush failover; if it fails after one retry, record the URL as `verdict: "error"` with the reason.
2. On-page: for each URL call `mcp__dfs-mcp__on_page_instant_pages`. Capture failing checks: broken links, missing or duplicate H1/title/meta, canonical issues, schema presence and validity, mixed content or HTTPS issues, image alt coverage, word count and content-to-code ratio.
3. Aggregate: average score per category; issues on multiple URLs (template-level); money-page URLs (from `services.md`) scoring below 90. Thresholds: Green = all four >= 90 and no critical on-page issue. Amber = any category 70 to 89, or any on-page issue. Red = any category < 70, a money page in amber/red, or mixed content / broken canonical / broken schema.
4. Write `state/onsite-audit.json` (machine-readable state): `schema_version`, `generated_at`, `site`, `audited_urls[]` (url, verdict, scores, core_web_vitals, lighthouse_issues[] with real audit IDs, onpage_issues[]), `site_rollup` (avg_scores, verdict, template_issues[], money_page_alerts[]).
5. Write `reports/<YYYY-MM-DD>-onsite-audit.md`: site rollup, per-page score table, template-level issues table (fix once, lift many), per-URL findings with one-line fixes, money-page alerts, and a Recommended next actions list (max 5, money-page issues first, then template, then per-page).
6. Print: `Onsite audit complete. Site verdict: <verdict>. <N> URLs audited. <M> template-level issues. <K> money-page alerts.` plus the report and state paths.

## Hard rules
- Only audit URLs in `context/audit-urls.txt`. Do not auto-discover.
- A URL that fails to audit is recorded `verdict: "error"` with the reason, never skipped silently.
- Per-URL findings must reference real Lighthouse audit IDs (e.g. `render-blocking-resources`, `unused-css-rules`, `uses-text-compression`). Do not paraphrase into something that is not a real audit.
- Recommendations must be specific and actionable, not "improve performance".
- Write both the state JSON and the markdown report every run.
- No em dashes.

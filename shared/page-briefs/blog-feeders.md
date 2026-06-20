# Brief: blog feeders (REFRESH / KEEP / MERGE) + interlink rules

The blog is TOFU support, not a money silo. This brief sets the rules; individual posts are handled by the Operations Track (`content-writer`) after launch. For the revamp, the job is triage + interlinking, not writing 40 new posts.

## Triage rules
- **KEEP + interlink:** posts that already rank or earn impressions. Confirmed winners: `/what-is-load-to-truck-ratio/` (pos 8.9), `/how-to-find-a-dispatcher-for-a-box-truck/`, `/freight-broker-vs-dispatcher/`, `/how-to-get-dot-and-mc-number.../` (14.4k impressions, upgrade as a TOFU feeder).
- **REFRESH:** compliance/dispatch education posts that match a money page (what-is-csa, what-is-ifta, what-is-eld, what-is-factoring, do-you-need-a-cdl-for-a-box-truck, etc.). Bring to standards, then link UP to the matching money page.
- **MERGE / PRUNE:** hype-title listicles that violate `standards.md` banned words (revolutionize, unleashing, mastering, ultimate-guide, etc.). Salvage any useful content into a money page or guide and 301; prune the rest. Also the reefer compliance sub-silo (~30 URLs) and merged thin sub-pages, per `keyword-map.md` and `migration-plan.md`.

## Interlink rules (the point of the blog)
Every kept/refreshed post links UP to its matching money page on a 1 to 3 word contextual anchor:
- load-to-truck-ratio, freight-broker-vs-dispatcher, find-a-dispatcher → `/services/` or `/box-truck-dispatch/`.
- how-to-get-dot-and-mc-number → `/dot-registration/` + `/mc-registration/`.
- what-is-ifta → `/ifta-registration/`; what-is-eld → `/eld-services/`; what-is-csa → `/driver-qualification-files/` or `/fmcsa-clearinghouse-registration/`; what-is-factoring → `/services/` (factoring partners).
- do-you-need-a-cdl-for-a-box-truck → `/how-to-start-a-box-truck-business/` + `/box-truck-dispatch/`.

## New TOFU posts the client asked for (queue for Operations Track, not this build)
From `experience-notes.md` content ideas (all proof-rich, on-pivot):
1. Surviving the FMCSA MOTUS transition (PIN/data-linkage/Pay.gov; manual OP-1/MCS-150). Links to `/dot-registration/`, `/mcs-150-biennial-update/`.
2. The Amazon-approved box-truck blueprint (entity setup, 1-year authority-age requirement). Links to `/mc-registration/`, `/how-to-start-a-box-truck-business/`.
3. The MOTUS PIN trap and the FMCSA callback. Links to `/dot-registration/`, `/mcs-150-biennial-update/`.
4. The new-carrier safety-audit checklist (DQ files, Clearinghouse, consortium before hauling). Links to `/driver-qualification-files/`, `/fmcsa-clearinghouse-registration/`, `/drug-and-alcohol-consortium/`.

## Standards for any blog work
- `Article`/`BlogPosting` schema, author = Person alias (Adam Smith / Robert Hooke) for expert posts, real dates.
- No banned words in titles or body; no em dashes; no fabricated metrics.
- Each post = one matching money page it feeds; one clear next step.

## Dev / Design notes
- Preserve URLs of kept posts; 301 merged/pruned URLs per `migration-plan.md`.
- Unique OG image per kept post (Operations Track can batch).

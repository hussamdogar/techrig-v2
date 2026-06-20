# Page design spec: /blog/[post] (blog feeders template: article reading experience)

Design-only spec. Consumes `shared/page-briefs/blog-feeders.md`. SEO owns copy, headings, titles, the one matching money page each post feeds, the contextual anchor wording and destinations, author assignment, and which posts are kept, refreshed, merged, or pruned; this defines the look, layout, hierarchy, components, imagery, motion, and conversion path of the reading experience. Built on `design-system.md`. This is the template for every kept and refreshed blog post (TOFU education), not one specific post; individual posts are written by the Operations Track. Author identity follows the two canonical aliases in `shared/page-briefs/about-us.md` and `schema-specs.md` (Adam Smith, Robert Hooke), since no separate `author.md` exists in this workspace. No em dashes.

## Page role
The blog is TOFU support, not a money silo. A post's one job: be a clean, credible, fast read that answers an education-stage question, then hand the reader UP to the single money page it feeds on a quiet contextual link. The design optimizes for reading comfort and scannability, and treats the upward interlink as the conversion mechanic, not a hard sell. The same template serves every kept/refreshed post; the only per-post variables are the title, body, author alias, the one matching money page, and the OG.

## Section order and layout

1. Header (global): per `global-footer.md`. On article pages the persistent header primary CTA is the site-wide setup action; the post body itself does not introduce its own competing Signal CTA (the post converts through the contextual interlink and the end-of-post next step, not a banner).

2. Article header (Paper surface, single readable column, not the asymmetric hero used on money pages)
   - A small Plex Mono category/eyebrow label above the title (for example "Compliance" or "Dispatch"), uppercase, tracked, Slate, the system's mono label treatment. This sets topic at a glance and ties the post to its silo.
   - H1: the post title (Archivo, exact SEO wording, no banned words, since the merge/prune rule exists precisely to kill hype-title listicles).
   - The author byline row, the post's E-E-A-T signal: an illustrated line-style avatar or a mono initial monogram (photos need client approval, so the monogram is the default), then "By [Adam Smith | Robert Hooke], Co-Founder" with the name linking to that founder's anchor on `/about-us/` (the canonical Person entity reused as the article `author`). Beside or below it, the published and updated dates in the mono treatment (real dates, the system's "official record" cue). Brand-voice posts may use the Tech Rig wordmark lockup as the byline instead of a Person, per the post's schema assignment.
   - Optional one-line standfirst/dek as a styled Plex Sans Body L paragraph (never an H-tag) summarizing the post.
   - A hairline (1px Slate at 16%) closes the header and opens the body.

3. Article body (the core of the template): a single centered column on a strict reading measure of around 68ch (the system body max), Plex Sans at 1rem and line-height 1.6, Ink on Paper at roughly 15:1. Built for scannability and Grade-8 readability:
   - H2 and H3 section headings (Archivo) structure the post into skimmable beats; headings name document sections only, never slogans.
   - Generous section rhythm and short paragraphs; bulleted and numbered lists for steps; 01/02/03-style numbering only where the content is a genuine sequence (for example the new-carrier safety-audit order), never as decoration.
   - Inline contextual links are Steel with underline on hover and focus, set as 1 to 3 word anchors woven into the prose (never "click here", "learn more", or "our services"). These carry the interlink mechanic described below.
   - Pull-quotes or key lines, when used, are styled paragraphs with a left Steel rule, not headings and not amber.
   - Data points, dates, and any reference numbers in the mono treatment; running prose never set in mono.
   - Definitions ("what is IFTA", "what is an ELD") rendered as clean inline emphasis or a short Slate-toned definition list, since many feeders are definitional posts.
   - Where a process is explained, the system's single-line process diagram may illustrate it (for example a small filing-sequence line diagram on a MOTUS or safety-audit post), doing real explanatory work, kept lightweight.

4. The upward interlink to the matching money page (the point of the blog), handled two ways and both contextual, never a hard banner ad:
   - Inline: at least one 1 to 3 word contextual anchor in the body pointing UP to the post's single matching money page, per the brief's pairing (for example load-to-truck-ratio and find-a-dispatcher anchor to `/services/` or `/box-truck-dispatch/`; how-to-get-dot-and-mc-number to `/dot-registration/` and `/mc-registration/`; what-is-ifta to `/ifta-registration/`; what-is-eld to `/eld-services/`; what-is-csa to `/driver-qualification-files/` or `/fmcsa-clearinghouse-registration/`; what-is-factoring to `/services/`; do-you-need-a-cdl-for-a-box-truck to `/how-to-start-a-box-truck-business/` and `/box-truck-dispatch/`). Each post feeds one primary money page and offers one clear next step, so the template foregrounds a single destination rather than scattering links.
   - End-of-post next-step block: a quiet styled handoff after the body (Cloud panel or a hairline-bounded block, not a full-bleed Ink band, this is TOFU not a money page) naming the single logical next step to that matching money page on a contextual anchor. This is the post's strongest conversion moment and it stays low-pressure and on-topic.

5. Author/credibility footer (small): a one-line "Written by [alias], Co-Founder" tie-back linking to `/about-us/`, reinforcing E-E-A-T and the reused Person entity. No ratings, no invented bios beyond the canonical alias bios.

6. Related reading (optional, lightweight): a short list of links to a few sibling posts or the matching money page, plain text links, used only when genuinely relevant; never an auto "you may also like" carousel and never heavy cards.

7. Mega-footer (global, see `global-footer.md`).

## Per-post variables vs fixed template
- Fixed: the single-column readable measure, the article-header pattern (mono eyebrow, Archivo H1, alias byline, mono dates), the body type and rhythm, the Steel inline-link treatment, the end-of-post next-step block, the author footer, the global chrome, motion and accessibility rules.
- Per post: the title and body, the assigned author alias (Adam Smith or Robert Hooke, or the brand byline for non-expert posts), the one matching money page and its contextual anchors, any process diagram the topic warrants, and the OG image. Kept-post URLs are preserved; merged or pruned URLs are 301'd per `migration-plan.md` (a content/SEO action, not a design surface).

## Hierarchy and the visual path
Eye path: mono eyebrow and Archivo H1 (topic and promise), the alias byline and dates (credibility), then a clean uninterrupted reading column; the eye meets Steel contextual anchors as it reads, and lands on the single end-of-post next step. There is no amber CTA inside the post body, so reading is the dominant action and the upward interlink is the natural, low-friction conversion; Signal stays rationed to the persistent header. The single matching money page is the one destination given visual emphasis (inline anchor plus the end block).

## Imagery and illustration
No photography. The byline uses an illustrated line avatar or a mono monogram (default, pending photo approval). Illustration is reserved for posts where a system single-line process diagram earns its place (filing sequences, the safety-audit order, the MOTUS flow); these do explanatory work and stay 2px-stroke inline SVG. No decorative hero image, no stock, no icon-in-rounded-square triplets, no AI-fingerprint header art. Lightweight by mandate to protect the CWV baseline; large in-body assets are avoided in favor of type and the occasional line diagram.

## Motion
Minimal. Body text does not animate. Allowed: accordion chevron if a post uses an FAQ block, hover/focus micro-feedback on links, the sticky header behavior on scroll. Banned here as everywhere: scroll-triggered fade-up on every paragraph or section, parallax, auto-playing carousels, anything that moves while the user reads (especially hostile in a long read). `prefers-reduced-motion: reduce` drops all transitions to instant.

## CRO treatment
- The conversion mechanic is the contextual upward interlink, not a sales banner: a credible read plus one clearly relevant next step to the matching money page outperforms an intrusive CTA for TOFU intent.
- One matching money page per post and one clear next step (inline anchor plus the end block); the template resists scattering competing destinations.
- Credibility is the byline and the alias Person entity tied to `/about-us/`, plus accurate dates and on-topic process diagrams; never ratings, never invented testimonials, never fabricated metrics in a post.
- Reading comfort is itself conversion: a strict measure, Grade-8 copy, strong scannability, and fast load keep the reader to the point where the interlink lands.
- Mobile: the single column already suits mobile; the persistent header keeps the site-wide CTA and Call reachable, the body stays on a comfortable measure with adequate tap spacing on inline links.

## OG image
Unique branded OG per post from the system template: Ink or Paper field, mono wordmark, the post title in Archivo, a category tag in Plex Mono ("Compliance" or "Dispatch"), one relevant line icon, a Signal rule, `og:type` article. One template, a per-post variant by title and category; never a placeholder. The Operations Track can batch these for kept posts.

## What Dev must preserve
- Article (or BlogPosting) schema with `author` set to the assigned Person alias `@id` (`#adam-smith` or `#robert-hooke`) for expert posts or the Organization `@id` for brand posts, `publisher` the Organization, and real `datePublished`/`dateModified`; the visible byline and dates must match the schema. Real founder names never appear in copy or markup, aliases only.
- Kept-post URLs preserved; merged/pruned URLs 301'd per `migration-plan.md`.
- SEO copy, the heading structure, titles (no banned hype words), and every contextual anchor and destination exactly. Standfirst, dek, and pull-quotes are styled paragraphs, never H-tags.
- Each post's single matching money page and its 1 to 3 word contextual anchor preserved; inline anchors never use "click here", "learn more", or "our services".
- The readable measure (around 68ch), Plex Sans body, mono for dates and reference numbers, and no running prose in mono.
- No amber CTA inside the post body (Signal stays rationed to the header); the end-of-post next step is a quiet contextual handoff, not a full-bleed money-page band.
- No fabricated metrics, no ratings, no invented testimonials anywhere in a post; documented and accurate only.
- AA contrast, visible keyboard focus on every link, reduced motion honored, hit targets at least 44px, and a lightweight page (type and optional line diagrams, no heavy header media). Decorative glyphs via inline SVG or CSS, never typed into headings.

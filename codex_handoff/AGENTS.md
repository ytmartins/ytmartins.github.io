# Instructions for agents working on yurimartins.dev

## Authority hierarchy

1. User's explicitly approved **V6.1** is locked design and content.
2. `docs/PRODUCT_SPEC.md` defines the functional/business contract.
3. `docs/QA_ACCEPTANCE.md` defines the quality gates.
4. `reference_v6_1/` defines exact baseline behaviors/visuals/assets.
5. Repo/deployment code is a technical constraint, not a source of fresh design direction.

## Hard rules

- **Do not redesign.** No layout system changes, new palettes, typography reinterpretations, illustrations, icons, portraits, marketing blocks or unsolicited copy changes.
- Preserve the original navigator-in-code brand icon. Do not replace the green center with a generic right-pointing arrow, play symbol or redrawn polygon.
- Preserve approved headline exactly: `Complex challenges. Spatial thinking. Business value.`
- Preserve approved bio exactly unless fixing a verified spelling/accessibility issue after owner approval.
- Don't claim the user is employed by Esri or endorsed by Esri; describe experience with Esri ArcGIS only. Do not imply independent consultancy or an immediate availability status.
- Don't imply AI inference or a real geospatial production analysis: scenario is *synthetic* and motion is explanatory.
- Keep `hello@yurimartins.dev` out of active contact flows until verified as deliverable.
- Labs is selective applied research / business-context exploration, not a course, paywall, tutorial product, or automatically open-source library.
- No secrets, customer names, internal screenshots, confidential schemas, prompts, accelerators or other client IP.
- **Final production domain is fixed:** `https://yurimartins.dev/`. `ytmartins.github.io` is repo/hosting, not the canonical public URL. Prepare canonical/SEO URLs and a domain-specific GitHub Pages release checklist, including `www` → apex and HTTPS. Never auto-merge, deploy or modify DNS/custom domain before separate user approval. Work in branch/draft PR.
- Prefer dependency-light HTML, CSS, JS. Reject complexity that does not serve a verified need.

## Change discipline

Before each substantive edit, state **why** it is required and whether it is user-requested, bug fix, accessibility correction or deployment necessity. If the change alters visuals or meaning, show the smallest proposed diff for approval. Every change should be reversible and testable.

## Execution report

Include: baseline comparison, changed files, test commands/results, preview links/screenshots, caveats, PR number/link if created, release blockers, and exact steps to go live at `https://yurimartins.dev/` without disturbing email DNS.

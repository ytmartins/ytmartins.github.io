# CODEX EXECUTION REQUEST — yurimartins.dev V6.1 → production PR

You are implementing the **already approved** V6.1 personal portfolio in the existing repository `ytmartins/ytmartins.github.io`. **The finished public website MUST be `https://yurimartins.dev/`**, not `ytmartins.github.io` (which is only the technical repo/hosting address).

**All paths in this request are relative to the extracted handoff folder (for example `./codex_handoff/`), not necessarily the Git repository root.**

**This is a controlled migration and quality hardening task, not a redesign.** Treat `reference_v6_1/` as authoritative: its HTML/CSS/JS as behavior & text truth, its images as asset truth, and its screenshots as visual truth. Preserve the full brand mark, portrait, headline, biography, composition, Labs page, five-stage story, stage timing, and buttons.

## First — inspect and report before editing

1. Read `AGENTS.md`, `docs/PRODUCT_SPEC.md`, `docs/QA_ACCEPTANCE.md`, `docs/REPOSITORY_RELEASE.md` and inspect reference source/assets/screenshots.
2. Inspect git status, current default branch, existing build/deploy workflow, GitHub Pages settings as accessible, and old dependencies. Do not assume current build process is authoritative.
3. Present a **short plan and a delta inventory** listing which existing files will be preserved, replaced or removed. Flag blockers rather than improvising scope changes.
4. Make changes on a **new branch** from the actual default branch. Never commit directly to `master`/`main`.

## Then — implement only the approved scope

- Produce a simple production-ready static website with `/` and `/labs` (or equivalent clean GitHub Pages-compatible path), favoring plain HTML/CSS/JS already in the baseline. Do not introduce React/Next/Tailwind/three.js or a new animation library without a demonstrated requirement and owner approval.
- Integrate the **original approved icon** from `reference_v6_1/assets/navigator-code-original.webp` and its favicon, plus the supplied true portrait. No recreations, re-styling or substituted generated faces/logos.
- Preserve exact published copy and professional framing from V6.1. Do not invent employers, client work, metrics, credentials or Esri partnership. Do not activate `hello@yurimartins.dev` unless reception is confirmed. CTA goes to verified LinkedIn URL.
- Preserve five story states: **Discover → Connect → Reveal → Focus → Understand**, including visible changes in the synthetic spatial illustration, play/pause/replay/step selection, auto-stop, reduced-motion behavior, and meaningful legibility.
- Preserve Labs as a distinct page with its three clearly identified conceptual research directions and synthetic map layer toggles. Work/Insights remain future, not shipped as empty routes.
- Implement only the **minimum necessary production fixes**: accessibility, performance, semantic HTML, SEO metadata, security on external links, correct relative URLs, responsive behavior, maintainability and deployment preparation.
- Handle the old workflow's `main` vs `master` mismatch. Select and justify one *safe* GitHub Pages deployment strategy; do not enable deployment yet. Prepare HTML canonical/OG URLs for `https://yurimartins.dev/`; ensure Home and Labs paths function at this apex domain. Prepare a provider-aware GitHub Pages custom-domain release checklist, with `www` → apex redirect, HTTPS and domain verification, while preserving MX/TXT mail records.

## Verify and deliver

Run tests in `docs/QA_ACCEPTANCE.md`; provide screenshots at **320, 390, 768, 1440 and 1920 px**, an interaction report and, where tooling exists, Lighthouse/axe or equivalent results with actual observations. Explicitly identify anything untested.

Create a **draft PR** with: summary, changed files, any justified changes vs approved baseline, before/after screenshots, QA evidence, known limitations, and a **ready-to-execute release plan for `https://yurimartins.dev/`**, including the GitHub Pages source/CNAME nuance, DNS plan, HTTPS and rollback. **Stop before merge, GitHub Pages configuration, custom-domain DNS, or production publishing.** Ask the user before any public changes. **After explicit approval and release execution, the final acceptance condition is an operational HTTPS site at `yurimartins.dev`, not just a successful GitHub build.**

**Quality bar:** Visual fidelity and professional credibility are acceptance criteria, not optional polish. If an enhancement conflicts with an approved design decision, preserve the design and ask for approval.

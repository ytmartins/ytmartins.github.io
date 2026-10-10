# Repository & release handoff — factual audit + safe path

## Known repository facts (GitHub read-only check, 2026-10-09)

- Repo: `https://github.com/ytmartins/ytmartins.github.io`.
- Default branch: **`master`** (not `main`). GitHub Pages reported enabled at repository level, but **its current publishing source/settings were not independently established**.
- Existing root: `index.html`, `main.css`, `package.json`, `package-lock.json`, PostCSS, `src/`, `public/`, `.github/workflows/build.yml`.
- Existing package name (read-only): `kagerou-dark` — old template; do not treat this as a requirement for the approved prototype.
- Existing workflow triggers on push/PR to `main`, builds on Node 16/17/18; therefore **branch mismatch** with `master`, plus obsolete toolchain, requires review.
- Approved V6.1 reference is dependency-free static HTML/CSS/JS with local WebP/PNG assets. Existing repo contents may have changed by the time Codex runs; re-check everything.

## Migration choice to evaluate (not an automatic order)

**Preferred for simplicity:** serve the approved static files via GitHub Pages using a verified source configuration, avoiding a new framework/toolchain. Preserve existing repo history through a feature branch and PR. If the repo is configured to use GitHub Actions as the Pages source, implement a minimal, supported Pages artifact workflow; if branch root publication is simpler and already configured, document that choice.

Do not keep a broken legacy workflow simply because it exists. Do not prematurely introduce a build framework merely to deploy two HTML pages. Remove obsolete template code/dependencies *only after* identifying any reusable license or publishing requirement.

## Suggested controlled steps

1. Inspect repo and Pages settings, safeguard current published version, create working branch from actual default.
2. Copy production source from `reference_v6_1/` into site build/source directory with working asset paths. Keep originals in handoff for visual comparison.
3. Remove stale page-specific template and unused build artifacts carefully. Ensure copyright/license obligations are honored.
4. Check route to Labs using GitHub Pages-compatible URL; maintain working site root.
5. Introduce only required lint/smoke/a11y tests or scripts, avoiding runtime dependencies. Fix accessibility/performance bugs with minimal visual delta.
6. Prepare safe deployment plan and draft PR, with actual results of all acceptance checks.
7. **Stop before merge or publish**, but include a complete, ready-to-execute release checklist targeting **`https://yurimartins.dev` as the sole canonical public URL**. Production domain configuration is an acceptance condition of the subsequently approved release, not a future product decision.

## Domain-specific publishing contract — REQUIRED target, gated execution

**Final public website:** `https://yurimartins.dev/` (apex, canonical). `https://www.yurimartins.dev/` should redirect to the apex once configured. `https://ytmartins.github.io/` is the underlying GitHub Pages technical address, **not** the public-facing website or canonical in SEO or branding.

The owner already purchased `yurimartins.dev`. Registrar/DNS host, current DNS records, domain verification state and GitHub Pages publishing source/settings are **not yet verified**. The Codex implementation MUST prepare this exact production release; it MUST NOT change live settings, DNS or merge without separate user approval.

**Preflight work for the PR (execute without changing live DNS):**
1. Confirm repository's actual Pages publishing source (branch-root vs GitHub Actions), which controls handling of the custom domain. If branch-based, setting the domain in Pages creates/updates a root `CNAME` file. If Actions-based, `CNAME` is ignored and is not required. Do not add or remove it blindly.
2. Put production-safe URLs into HTML/metadata: canonical Home `https://yurimartins.dev/`; canonical Labs at the path actually implemented (`https://yurimartins.dev/labs.html` or `/labs/`). Confirm OpenGraph and sitemap URLs, if any, reflect the same paths. Use relative web asset paths that work at the apex domain and through Labs. Avoid base URLs and redirects tied to `.github.io`.
3. Provide a DNS change table for the actual DNS provider after inspecting existing records. As one official GitHub Pages-supported option for the apex, four A records at `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Another supported option is ALIAS/ANAME if provider supports it. For the optional-but-recommended `www` redirect, set CNAME `www` → `ytmartins.github.io` (no repository name). Verify exact values against current official documentation at release time.
4. Check current MX/TXT/SPF/DKIM/DMARC records before any modification; keep existing email-routing records untouched. Domain routing for the website must not disrupt a future or existing `hello@yurimartins.dev` mail setup.
5. Include ownership verification (GitHub recommends it before connecting DNS), HTTPS/certificate readiness, fallback/rollback and time for DNS propagation; no wildcard DNS.

**After separate user authorization to deploy:**
1. Save a rollback commit/deployment reference; approve and merge the PR in the selected workflow.
2. Configure GitHub Pages Settings → Pages → Custom domain: `yurimartins.dev` **before** switching DNS; follow GitHub's current instructions and verify ownership when possible.
3. Make the approved DNS changes at the correct DNS host, preserving existing email records. Verify apex and `www` DNS responses and intended redirect.
4. Wait for GitHub Pages TLS provisioning and **Enforce HTTPS** when offered; DNS and certificates may take time to become active.
5. Test `https://yurimartins.dev/` and the real Labs route externally: HTTP→HTTPS, canonical/redirect chain, no mixed content, no asset 404, correct social metadata, mobile and motion behavior.
6. Mark release complete ONLY after the canonical public domain works reliably. If blocked, report the exact domain blocker instead of considering `.github.io` an acceptable finished delivery.

Official GitHub Pages domain guidance: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site


Official references:
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages

## PR notes template

**Title:** `Portfolio V6.1 — production migration (visual baseline locked)`

**Body should include:**
- User-facing value and surfaces touched (Home, Labs)
- Baseline and delta inventory
- Screenshot links with device widths
- Functional and motion QA results
- Accessibility and performance actual results or not run
- Explicit outstanding blockers (if any)
- Release plan and rollback
- Confirmation: no client/confidential data, no vendor affiliation claim, no unverified contact

**Do not merge without owner approval.**

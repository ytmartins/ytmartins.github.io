# yurimartins.dev

Approved V6.1 personal site: Home (`/`) and Labs (`/labs.html`). Plain HTML/CSS/JS,
local approved assets, no runtime dependencies, analytics, backend or active email.

## Local development

Node 24 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm run build
pnpm test
pnpm preview
```

Preview: http://127.0.0.1:4173. Tests own their HTTP server; stop preview first.
This Windows workspace uses `.cache/browsers`; set PLAYWRIGHT_BROWSERS_PATH to
that absolute directory before installing to reuse that cache. QA detects it.

`node scripts/performance.mjs` runs Lighthouse mobile on both pages (stop other
preview/QA servers first). Generated reports/screenshots are ignored under
`docs/qa/generated`; selected review evidence is tracked under `docs/qa`.

- [Migration inventory](docs/MIGRATION.md)
- [Acceptance evidence](docs/qa/REPORT.md)
- [Gated release to https://yurimartins.dev/](docs/RELEASE.md)
- [Untouched approved handoff](codex_handoff/README_START_HERE.md)

Only `dist/` is publishable. The build copies an allowlist of two pages, CSS, JS
and eight assets; docs, screenshots, reference material and tooling stay out.

Validation targets `master` and never deploys. Prepared Pages publication is
manual and master-only. **Current Pages still publishes master root: merging
before switching to Actions can publish immediately.** Follow the ordered release
checklist and obtain explicit owner approval before any merge/settings/DNS write.

Historical Kagerou/Ravenbright attribution: Ariq N / Ravenbright, Apache-2.0.
Prior template/dependencies were removed after audit; LICENSE.md/history remain.
Supplied portrait and brand/illustration assets retain their existing ownership;
the historical template license does not grant rights to personal identity assets.

## Opening motion revision

The owner-requested watercolor opening is documented in [the current storyboard](docs/HERO_STORYBOARD.md) and [reference analysis](docs/WATERCOLOR_MOTION.md). Run `npm run test:story` for the narrative and pigment motion checks. No live AI or client analysis is performed.

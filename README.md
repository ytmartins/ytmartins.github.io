# yurimartins.dev

Personal portfolio with a Home page and a bilingual Resume. Plain HTML/CSS/JS,
local approved assets, no runtime dependencies, analytics, backend or active email.

## Local development

Node 24 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
python -m pip install -r scripts/resume-requirements.txt
pnpm run build
pnpm test
pnpm preview
```

Preview: http://127.0.0.1:4173. Tests start a separate local HTTP server on a free port.
This Windows workspace uses `.cache/browsers`; set PLAYWRIGHT_BROWSERS_PATH to
that absolute directory before installing to reuse that cache. QA detects it.

`node scripts/performance.mjs` runs Lighthouse mobile on both pages (stop other
preview/QA servers first). Generated reports/screenshots are ignored under
`docs/qa/generated`; selected review evidence is tracked under `docs/qa`.

- [Migration inventory](docs/MIGRATION.md)
- [Acceptance evidence](docs/qa/REPORT.md)
- [Gated release to https://yurimartins.dev/](docs/RELEASE.md)
- [Untouched approved handoff](codex_handoff/README_START_HERE.md)

Only `dist/` is publishable. Edit the Portuguese and English resume in
`resume/index.html`. The build prints and validates both PDFs, then assembles
the page and downloads in `dist/resume/`. The build stops if the generated PDFs
fail validation. For a specific Python executable, set `RESUME_PYTHON`.

Validation targets `master`. Deployment uses the manually dispatched Pages workflow on `master`.

Historical Kagerou/Ravenbright attribution: Ariq N / Ravenbright, Apache-2.0.
Prior template/dependencies were removed after audit; LICENSE.md/history remain.
Supplied portrait and brand/illustration assets retain their existing ownership;
the historical template license does not grant rights to personal identity assets.

## Orbital homepage

The opening animates a single sphere, with nearby particles reacting to the pointer or touch. Scrolling connects the sphere to the four areas of expertise. Reduced motion shows static illustrations and immediate copy. Run `pnpm test` for the production build checks.

The [watercolor storyboard](docs/HERO_STORYBOARD.md) records the earlier case study.

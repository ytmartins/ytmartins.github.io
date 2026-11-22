# Development

Use Node.js 24, pnpm 11.25.0, and Python 3.12.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
python -m pip install -r scripts/resume-requirements.txt
pnpm run build
pnpm test
pnpm preview
```

The preview opens at `http://127.0.0.1:4173`. On Windows, use `PLAYWRIGHT_BROWSERS_PATH` to reuse an existing browser cache and `RESUME_PYTHON` to select the Python executable for PDF validation.

Edit the homepage in [index.html](../index.html) and both résumé languages in [resume/index.html](../resume/index.html). The build writes the static site to `dist/` and the résumé PDFs to `dist/resume/`. It stops if PDF validation fails. The [Labs prototype](../labs.html) stays in the source for future work. The published site serves Home and Resume.

Run `node scripts/performance.mjs` after a build to generate Lighthouse reports for Home and Resume in `docs/qa/generated/`. Stop other preview and performance servers first.

## Deployment

[Static validation](../.github/workflows/validate.yml) builds and tests pull requests targeting `master` and pushes to that branch. After approval, run [Approved manual Pages release](../.github/workflows/pages.yml) from `master` to publish `dist/` to GitHub Pages.

## Project history

The [earlier repository snapshot](https://github.com/ytmartins/ytmartins.github.io/tree/4d69f2cec9873e24aed88ed2ab05fda89b44bb03) contains the original handoff, the earlier homepage experiments, and historical QA and migration records.

## Credits and license

The earlier Kagerou template is credited to Ariq N / Ravenbright under [Apache-2.0](../LICENSE.md). Portrait, brand, and illustration assets retain their respective ownership. The résumé font attribution is in [Source Sans 3’s license](../resume/source-sans-3-license.txt).

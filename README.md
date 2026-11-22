# yurimartins.dev

[Live portfolio](https://yurimartins.dev/) · [Bilingual résumé](https://yurimartins.dev/resume/)

Yuri Martins's personal portfolio pairs an interactive homepage with a résumé in Portuguese and English. The build generates and validates a downloadable PDF for each language.

## Site features

- The homepage's orbital animation responds to pointer and touch input. Scrolling connects the animation to four areas of expertise. The site shows static illustrations when reduced motion is enabled.
- The résumé lets readers switch languages and download the corresponding PDF. Its source is [resume/index.html](resume/index.html).
- The site uses plain HTML, CSS, and JavaScript with local assets. A contact button on the homepage copies the email address.

## Local development

Use Node.js 24, pnpm 11.25.0, and Python 3.12.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
python -m pip install -r scripts/resume-requirements.txt
pnpm run build
pnpm test
pnpm preview
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173) to preview the build. Tests start their own local server on a free port. To reuse a browser cache on Windows, set `PLAYWRIGHT_BROWSERS_PATH` to its absolute path before running the Playwright install. Set `RESUME_PYTHON` to choose a specific Python executable for the résumé build.

The build writes the site to `dist/` and places the résumé and its PDFs in `dist/resume/`. It stops if PDF validation fails. Run `node scripts/performance.mjs` for mobile Lighthouse checks on both pages after stopping other preview or QA servers. Generated QA reports and screenshots are stored in `docs/qa/generated/`.

## Validation and deployment

[Static validation](.github/workflows/validate.yml) builds and tests pull requests targeting `master` and pushes to `master`. To publish an approved build, manually run [Approved manual Pages release](.github/workflows/pages.yml) from `master`. The workflow publishes `dist/` to GitHub Pages.

## Project records

- [Acceptance and QA evidence](docs/qa/REPORT.md)
- [Watercolor storyboard for the earlier homepage](docs/HERO_STORYBOARD.md)
- [Migration inventory](docs/MIGRATION.md) and [original release plan](docs/RELEASE.md)
- [Original project handoff](codex_handoff/README_START_HERE.md)

## Credits

The earlier Kagerou template is credited to Ariq N / Ravenbright under [Apache-2.0](LICENSE.md). Portrait, brand, and illustration assets retain their respective ownership.

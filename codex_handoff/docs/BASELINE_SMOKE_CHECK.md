# V6.1 approved baseline — read-only smoke recheck

**Method:** headless Chromium with Playwright using the original approved **standalone V6.1** HTML files with embedded scripts and image data. Baseline package individual HTML/CSS/JS/asset files have been SHA/content compared to the approved V6.1 source ZIP: matches. This is **not** a production site test.

Observed checks:

- Home widths 320, 360, 390, 768, 1024, 1280, 1440 and 1920 CSS px: no horizontal document overflow, no page errors, brand image loaded, intended typography computed.
- Labs at 390 and 1440 CSS px: no horizontal document overflow.
- Motion step selection, Replay and Pause: functional.
- Synthetic Labs map layer toggle: functional.
- Mobile navigation hamburger: functional.

**Known test limitation:** the current sandbox browser blocks `http://127.0.0.1` with `ERR_BLOCKED_BY_ADMINISTRATOR`; as a fallback, the previously generated approved standalone HTML was tested via `page.set_content`. **Codex must rerun the tests using an actual local HTTP server** in its repository environment, including image path checks, interactions, keyboard/a11y and production build/deployment checks. Do not interpret these smoke checks as full validation of the migration.

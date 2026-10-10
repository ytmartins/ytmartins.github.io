# V6.1 Preview & QA

**Source baseline:** approved V4 text-only prototype. The V6 static illustration informs the finishing treatment, but existing animation behavior is preserved.

- 8 tested widths on Home: 320, 360, 390, 768, 1024, 1280, 1440, and 1920 px.
- No horizontal document overflow in tested viewports; no JavaScript page errors.
- Labs tested at 390 and 1440 px without horizontal document overflow.
- Interactions exercised: stage selection, replay, pause, Labs layer toggle, mobile navigation.
- Original icon geometry retained as transparent raster from approved original; original photo, map imagery, JS story timing and spatial-stage code remain unchanged.
- Desktop (1440 px) computed header name 23.76 px; menu 15 px; hero body 17 px. At 390 px mobile, hero body 16 px and header name 19.5 px. On the narrowest 320 px screen, the name scales to 16 px to keep the CTA and menu visible.
- `prefers-reduced-motion: reduce` renders the final illustration state with the stage controls still usable. Full automated WCAG and real device performance audits remain pending before production.
- No production deploy or GitHub changes.

## Screenshots
- `preview_home_1440.png` / `preview_home_390.png` / `preview_home_1920.png`
- `preview_labs_1440.png` / `preview_labs_390.png`

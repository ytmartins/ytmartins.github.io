# Owner-requested Home simplification

The five browser comments authorize these changes to V6.1: remove the footer paragraph, Replay and Play/Pause controls, scenario disclaimer, and hero topic list. The earlier request also limits the Home footer to “Based in Brazil · Globally connected”; footer links and copyright are removed. Labs content is unchanged.

Without a pause control, the story opens at Understand with ambient motion paused. All five keyboard-operable stage selectors remain available. Automatic progression is removed to avoid unattended movement without a stop control. The synthetic utility data label remains visible.

Validation: build and full Playwright suite; screenshots at 320, 390, 768, 1440 and 1920 pixels, overflow checks across eight widths, axe, keyboard, no-JS, static/manual story states and Labs toggles. The baseline comparison applies only the requested DOM removals to an in-memory copy of V6.1; source reference files remain unchanged. Existing broader audit limitations remain in docs/qa/REPORT.md.

Release checklist for https://yurimartins.dev/: obtain approval for this revision, merge the reviewed head after CI passes, dispatch the manual Pages workflow on master, verify HTTPS Home and Labs, canonical URLs, removed elements, five stage selectors, and mobile navigation. No DNS or email changes are required.

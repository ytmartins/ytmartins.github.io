# Hide Labs until content is ready

Owner-requested change: remove Labs navigation and the Home Labs promotional section, and exclude labs.html from the production artifact. Keep the source and existing assets in the repository for later work. Direct /labs.html will return 404 after release; no placeholder page is added.

Files: index.html, scripts/build.mjs, scripts/qa.mjs. Build removes the known stale dist/labs.html artifact before copying the explicit allowlist. Tests cover Home only while Labs is unpublished, including its absence from Home and a 404 for the excluded page. Baseline comparison applies the approved removals; the credential is temporarily excluded only when checking unchanged pixels. Original reference source is untouched.

Release checklist for https://yurimartins.dev/: obtain approval, confirm CI, merge reviewed head, manually dispatch Pages on master, verify HTTPS Home, canonical, mobile menu, footer credential and /labs.html 404. No DNS/email/config changes. Not published.
`nValidation: build passed; 82 Home/browser checks passed with zero failures, including excluded Labs 404, eight widths, visual comparison, axe, keyboard, no-JS and manual story selection. Existing broader QA caveats remain in docs/qa/REPORT.md.

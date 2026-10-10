# YM-CR-001 — IBM learning credential

Adds one compact entry below About social links, using the title, issuer, foundational learning classification and 2021 date supported by the owner's Credly screenshot. Public brand name remains Yuri Martins. No logo, description or advanced certification claims.

Files: index.html (entry), styles.css (existing tokens, 14px text and 44px verification link), scripts/qa.mjs (exclude the additive entry only during unchanged V6.1 comparison), docs/BACKLOG.md (future synthetic Lab note). Production baseline includes merged PR #2.

Validation: build passed; 176 existing browser checks passed, zero failures. Additional browser checks passed at 320, 390 and 1440: exactly one entry, exact Credly URL, keyboard focus with visible outline and no horizontal overflow. Before/after About captures are in this folder. After captures intentionally show keyboard focus. Credly URL returned HTTP 200 without redirect on 2026-10-10. Existing broader accessibility/performance caveats remain in ../REPORT.md.

The baseline comparison removes only the added credential temporarily from the rendered test page, preserving exact checks for existing content and pixels. Reference source files are untouched. The About grows vertically to accommodate the new entry. Assets, biography, social links, navigation, story and Labs remain unchanged.

Release: await approval, confirm CI, merge the reviewed head, dispatch the manual Pages workflow on master, then verify HTTPS Home and Labs, canonical URLs, credential link and mobile navigation on https://yurimartins.dev/. No DNS, email or deployment configuration changes. Not published.

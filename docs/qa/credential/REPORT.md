# YM-CR-001 — IBM learning credential in Home footer

Adds one compact entry beside “Based in Brazil · Globally connected” in the Home footer on desktop and below it on mobile. The owner's latest request replaces the earlier About placement; About is identical to the published baseline. Exact title, IBM issuer, foundational learning classification and 2021 are supported by the supplied Credly screenshot. No logo, description or advanced certification claims.

Files: index.html (footer entry), styles.css (existing tokens, 14px text and 44px verification link), scripts/qa.mjs (temporarily exclude only the additive entry during unchanged V6.1 comparison), docs/BACKLOG.md (future synthetic Lab note). Production baseline includes PR #2.

Validation: build passed; full browser suite passed 176 checks with zero failures. Additional browser checks at 320, 390 and 1440 verify one entry, exact Credly URL, keyboard focus with visible outline and no horizontal overflow. Before/after footer captures are in this folder; after captures show keyboard focus. Credly previously returned HTTP 200 without redirect on 2026-10-10. Existing broader accessibility/performance caveats remain in ../REPORT.md.

The footer grows vertically to accommodate the entry. Reference sources, About, hero, biography, assets, social links, story and Labs remain unchanged.

Release: await approval, confirm CI, merge reviewed head, dispatch manual Pages workflow on master, verify HTTPS Home/Labs, canonicals, footer credential link and mobile navigation on https://yurimartins.dev/. No DNS/email/config changes. Not published.


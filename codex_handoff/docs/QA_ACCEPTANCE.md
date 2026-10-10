# ACCEPTANCE & QA — Codex must report evidence

Perform the checks below against the production-intended output **on the PR branch**. Mark PASS, FAIL or NOT RUN with evidence; never claim a test passed without running it. Include before/after screenshots relative to `reference_v6_1/screenshots/`.

| ID | Check | Acceptance evidence |
|---|---|---|
| A01 | Brand fidelity | Approved original `< navigator >` image, full mark geometry and palette; favicon present; no generic arrow/play symbol. Compare at 32px and desktop header. |
| A02 | Text fidelity | Exact H1, hero intro, name/title, Esri wording, expertise statuses, method labels and social URLs from baseline. No invented metrics. |
| A03 | Visual fidelity | Home/Labs at 1440x900 desktop and 390x844 mobile substantially preserve baseline composition, spacings, hierarchy, icons, hero textures; report intentional deviations. |
| A04 | Responsive widths | No unintended horizontal overflow at 320, 360, 390, 768, 1024, 1280, 1440 and 1920 CSS px. Verify desktop nav and mobile hamburger. |
| A05 | Navigation/links | All internal links on both pages work, external @ytmartins links point to expected profiles, `rel=noopener noreferrer` for target=_blank. `hello@...` not activated before verification. |
| A06 | Story steps | Initial path Discover→Connect→Reveal→Focus→Understand; each stage visibly distinct, accessible, descriptive. Five steps in correct order. |
| A07 | Motion controls | Click stage, Pause/Play, Replay; auto-stop after one sequence, behavior after switching browser tabs; no timers leaking. |
| A08 | Reduced motion | With `prefers-reduced-motion: reduce`, no autoplay/ambient motion; stable comprehensible scene; stage controls remain available. |
| A09 | Labs demo | Assets/Demand/Constraints independently toggle and contextual interpretation updates. Synthetic disclaimer remains visible. |
| A10 | Keyboard & screen reader | Tab order, skip link, focus indicators, menu Escape/expanded state, stage selection labels/accessible state, layer toggle `aria-pressed`, meaningful alt for portrait. |
| A11 | Usability zoom/contrast | Validate 200% zoom and text contrast at least 4.5:1 normal, 3:1 large; reflow/pointer targets; explain exceptions found, don't silently recolor. |
| A12 | Browser runtime | No uncaught JS errors, missing network assets, console errors attributable to site, or dead links in supported browsers. |
| A13 | Performance | Test using an actual tool when available (Lighthouse lab mobile/performance); aim Core Web Vitals LCP <=2.5s, CLS <=0.1, INP <=200ms where measurable. Report real observations, do not guarantee scores. |
| A14 | Deployment safety | Build/Pages mechanism consistent with actual default branch (`master` observed), correct output paths; PR never auto-deploys or changes domain/DNS. Production destination is explicitly `https://yurimartins.dev/`. |
| A15 | Security/editorial | No secrets, client data, invented AI outputs, unsupported Esri affiliation claims, third-party copied assets or unconfirmed email contact. |
| A16 | Auditability | PR includes scope/diff summary, tests & screenshot evidence, known issues and pre-deployment release checklist. |
| A17 | Custom domain readiness (PR) | Canonical + OpenGraph links target `https://yurimartins.dev/` and its real Labs route; Pages/CNAME choice documented for publishing source, domain verification, DNS/provider change plan, apex + www redirect, HTTPS, MX/TXT preservation, rollback. **No live DNS required for PR PASS.** |
| A18 | Custom domain acceptance (post-approval release) | Externally confirm live `https://yurimartins.dev/`, working Labs, valid HTTPS, correct canonical, working assets, appropriate `www` redirect, no email DNS damage. Mark PENDING until owner-approved publication has occurred and checks have actually passed. |

## Browser matrix

- Chromium, modern desktop and mobile viewports. Also sanity-check Firefox/WebKit when tooling exists.
- Test on a local HTTP server, not just `file://` or screenshot-only rendering.
- Screenshots minimum: Home 1440, 390, Labs 1440, 390; plus Home 320, 768, 1920 for responsive audit.
- Stage screenshots: initial and final **Understand** state; dynamic scenes should communicate different relationships.
- Inspect screen-reader semantics around the story panel and controls; a passing visual test is not proof of accessibility.

## Release gate

**STOP after the draft PR.** Await explicit owner approval before merge, GitHub Pages publication, domain settings, DNS, email routing or any switch that could make the site publicly accessible. **Do not replace the required production destination with GitHub Pages default URL.** A17 is a pre-release gate; A18 is a distinct post-approval live-domain gate.

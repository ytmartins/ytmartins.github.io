# V6.1 pre-release QA record

Tested locally on 2026-10-09 client date, Windows, Node 24.19.0, Playwright 1.62.1,
Chromium 151, Firefox 153 and WebKit 26.5. HTTP server, not file URLs/set_content.

**183 automated checks passed, zero failures. This is a draft review result, not
an assertion that every release gate is complete.** Raw [results](results.json)
and [Lighthouse summary](performance-summary.json) accompany this report.

## Commands actually run

```text
pnpm install
PLAYWRIGHT_BROWSERS_PATH=<workspace>/.cache/browsers playwright install chromium firefox webkit
node scripts/build.mjs
node --check app.js
node scripts/qa.mjs
node scripts/performance.mjs
node scripts/audit-remote.cjs
```

The bundled pnpm executable was used because npm/gh were unavailable. Installation
and browser execution required the host network/browser permission. All final
QA used the production-intended dist files. Final Lighthouse ran alone after QA.
Handoff SHA-256 verification: 19/19 entries match; production assets 7/7 identical.

## Acceptance matrix

| ID | Status | Actual evidence / limits |
| --- | --- | --- |
| A01 | PASS | Original brand/portrait/favicon hashes; inspected full desktop/mobile screenshots; brand displayed 48×32 desktop, 36×27 mobile (30×22 smallest breakpoint) |
| A02 | PASS | Main innerText matches untouched baseline at five widths on each page; exact headings, bio, statuses, methodology and social URL inspection |
| A03 | PASS with caveat | Ten baseline/output PNG pairs byte-identical in same browser/platform; frozen supplied screenshots inspected. Windows font fallback causes cross-platform line-break/page-height differences; owner visual review remains required |
| A04 | PASS | Both pages no document overflow at 320,360,390,768,1024,1280,1440,1920; mobile toggle tested |
| A05 | PASS | Internal HTTP/anchor checks; external profile destinations and noopener/noreferrer; no mailto |
| A06 | PASS | Clock-controlled Discover→Connect→Reveal→Focus→Understand in order; five manual selections/current states and stage screenshots |
| A07 | PASS | Replay, pause, play, auto-stop/no loop, visibilitychange timer suspension/resumption; paused ambient animation class inspected. Hidden-tab check dispatches controlled visibility event; physical background-tab scheduling not separately measured |
| A08 | PASS | Initial reduced motion final Understand; dynamic preference change stops; manual steps hold without autoplay; baseline CSS reduced-motion rules retained |
| A09 | PASS | All eight independent Assets/Demand/Constraints combinations and contextual feedback; visible synthetic disclaimer |
| A10 | PASS automated / NOT RUN human AT | axe WCAG2/2.1 A/AA zero violations at 390/1440 both pages; keyboard skip focus, menu Enter/Escape/focus return, meaningful portrait alt and accessible stage/layer states. No actual NVDA/VoiceOver reading session performed |
| A11 | NOT RUN complete manual gate | 200% desktop-equivalent reflow (720 CSS px for 1440 desktop) passed. Native browser zoom UI not tested. Palette ratios below verified mathematically; axe cannot resolve image/pseudo-element contrast and returns incomplete nodes (53/52 Home,22/21 Labs). Full rendered contrast/pointer-target review remains pending; no recoloring performed |
| A12 | PASS local | No captured site page/console/network errors across Chromium viewport sweeps; Firefox/WebKit both pages mobile smoke pass. Remote profiles checked as destinations, not authenticated profile content |
| A13 | FAIL LCP target / PASS CLS | Lighthouse mobile final: Home 90, Labs 92 performance; LCP 3.7s/3.4s exceeds 2.5s aim; CLS 0/0; TBT 30ms/0ms. Accessibility/best-practices/SEO 100 each. Field INP NOT RUN; TBT is not INP. Local uncompressed HTTP lab does not predict production CDN performance |
| A14 | PASS preparation | Actual master-root legacy Pages audited. CI master-only validation; manual release workflow master/input gate. No deployment/settings changes; switch source before any authorized merge |
| A15 | PASS scoped inspection | Only approved copy/assets; synthetic scenario, no AI/network backend, no client data, no secrets/trackers/mail flow or unsupported vendor claim in shipped files. Not a full repository-history secrets audit |
| A16 | PASS draft evidence | Migration inventory, screenshots, raw tests, caveats and gated release plan supplied with PR |
| A17 | PASS code/plan; provider preflight pending | Correct apex/labs canonicals/OG and relative assets. Actual Pages source and public DNS audited; Actions/CNAME nuance, ownership/TLS/www/mail/rollback documented. Full provider zone/account/verification state awaits release-time access |
| A18 | PENDING | No authorized publication. Live HTTPS/apex/Home/Labs/www/mail acceptance has not run |

## Performance observations

Lighthouse 13.5.0 mobile defaults, cold local HTTP, simulated throttling. Initial
run measured 91/91 and LCP 3.5s/3.5s. After preload and accessible-brand correction,
final isolated run measured 90/92 and LCP 3.7s/3.4s; do **not** claim preload
achieved the LCP aim. CLS stayed zero. Browser/cache/CPU variability applies.

Remaining suggestions include image delivery (original 254KB brand at small display
size), unused shared CSS on Labs, render blocking and local cache/compression.
No original images were altered or fonts/layout changed to chase a score. Before
release, either improve LCP with fidelity checks or explicitly accept the lab
exception. No field Core Web Vitals/INP or production TLS result exists yet.

## Contrast / accessibility limits

Computed WCAG relative-luminance checks for primary/secondary/quiet/accent colors
over the flat approved #09121b, #101c27 and #132926 surfaces range from **6.14:1**
(quiet on #132926) to **17.51:1** (primary on #09121b), above 4.5:1. These figures
do not prove text-over-image/gradient/SVG contrast. Decorative faded scene flags
are aria-hidden and do not carry the story's only explanation; visible textual
callout/timeline remains. Review those decorative labels and embedded map labels
before declaring complete WCAG conformance. Automated 100 accessibility is not
human screen-reader certification.

## Screenshots / comparison

Untouched approved captures: `../../codex_handoff/reference_v6_1/screenshots/`
(from repository root, use `codex_handoff/reference_v6_1/screenshots/`).
Same-platform baseline re-renders and additional evidence are regenerated by QA
under generated/ and uploaded by validation as qa-evidence; excluded from dist.

| Surface | Captures |
| --- | --- |
| Home | [320](screenshots/home-320.png), [390](screenshots/home-390.png), [768](screenshots/home-768.png), [1440](screenshots/home-1440.png), [1920](screenshots/home-1920.png) |
| Labs | [390](screenshots/labs-390.png), [1440](screenshots/labs-1440.png) |
| Story | [Discover](screenshots/stage-0.png), [Understand](screenshots/stage-4.png); intermediate stages generated by tests |

No normal-layout visual deviation introduced. No-JS navigation/summary differs
intentionally to make content and routes available without JavaScript.

## Required owner decisions before release

- Review the cross-platform font/rendering caveat against approved PNGs.
- Complete manual contrast/native zoom/assistive-technology checks.
- Resolve or explicitly accept the mobile lab LCP exception.
- Confirm provider/zone/ownership and separately authorize the ordered release.

See [release plan](../RELEASE.md). Do not merge while legacy Pages still publishes
master root, and do not change that source without explicit release approval.

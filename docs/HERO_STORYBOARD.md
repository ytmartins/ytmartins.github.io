# Opening motion — current storyboard

See [reference analysis and design rationale](WATERCOLOR_MOTION.md) for the inspection of Felt and the recovered yurimartins.dev philosophy. Earlier geometric revisions are superseded by the original watercolor composition.

| State | Entrance | Hold |
| --- | --- | --- |
| Discover | Pigment reveals a living territory beneath a business question | 3 s |
| Connect | Existing assets and people/demand become shared context | 3.5 s |
| Reveal | Apparent proximity is contrasted with the actual route over the northern bridge | 4 s |
| Focus | A near-bank connected cluster is identified for investigation | 3.5 s |
| Insight | A clearer place to begin; validate capacity and access, prototype the next step | 6 s |

The same watercolor and coordinate system persist throughout. The result represents an investigation candidate, not measured capacity, permission to develop or quantified financial gains. AI-native reasoning is explicitly illustrative; no live model, agent or spatial service executes.

Asset: [territory-watercolor-v1.webp](../assets/territory-watercolor-v1.webp), 1536 × 1024, approximately 679 KiB, with alpha transparency. Created through the built-in imagegen tool; [exact generation prompt](WATERCOLOR_IMAGE_PROMPT.txt). WebP conversion preserves the artwork and alpha. No Felt asset is bundled.

Autoplay loops over 20 seconds. Pause preserves stage time and freezes the pigment animation; Replay restarts both. Manual selection holds a complete readable state. Reduced motion and no-JavaScript open on the complete final composition. Playback pauses offscreen and when the document is hidden.

Validation: build, general QA and story QA. Screenshots and results live in docs/qa/generated and docs/qa/story. Story QA includes desktop/mobile layouts, accessibility, exact stage progression and looping, fixed geometry, static/no-JS fallback, live preference changes, visibility pause/resume, and actual pigment animation freeze/replay checks. Desktop and mobile renders are visually inspected.

Commands: npm run build; npm test; npm run test:story. Test scripts own their HTTP server; stop preview before running them.

## H3 and agent demonstration — 2026-10-10
The five stages remain; Insight now lasts 10 seconds, for a 24-second loop.
- 0–2 s: watercolor opportunity becomes a 12-cell H3 ranking.
- 2–3.4 s: illustrative agent asks “Why is this the best location?”
- 3.4–7 s: answer relates demand, existing access and lower connection cost; #1 is emphasized.
- 7–10 s: camera pulls back toward the whole territory and next validation step.

The agent is an animated demonstration, explicitly requested by the user, with no API, inference or backend. The button reframes the winning cell. Zoom controls pause playback. Mobile places the answer below the painting. Reduced motion and no-JS show a complete static conclusion.

h3-js is an authoring dependency only. Run node scripts/generate-opportunity.mjs to regenerate the embedded SVG and docs/H3_SCENARIO.json. Registration is arbitrary over a fictional painting, not a claim about real parcels. Cell IDs and boundaries are real H3 resolution 10, using official H3 APIs: https://h3geo.org/docs/api/indexing/ and https://h3geo.org/docs/api/regions/.

Ranking metric is estimated annual contribution, not ROI: synthetic revenue minus operating cost minus annualized connection cost (thousand BRL/year). Demand and connection-distance assumptions are deterministic illustrative proxies, not a real routing or forecasting model. Top cell 8aa8100c065ffff: 258 − 130 − 25 = 103k BRL/year. Validate capacity, demand and local constraints.

## Potential — sixth stage
The loop now lasts 34 seconds. Potential adds a ten-second conclusion after Insight:
1. The camera pulls back from the best-ranked location to the whole city.
2. H3 cells reveal progressively from the original opportunity. Established cells use solid green; potential cells use pale dashed borders; excluded far-bank cells use dotted amber.
3. Discrete roof badges identify 14 eligible synthetic premises on painted buildings.
4. The illustrative agent asks “What is our total growth potential?” and reports R$ 484k/year in uncaptured estimated contribution across those premises.
5. The final action is “Validate demand. Prioritize the next expansion.”

All amounts use the previous cell formula (synthetic revenue − operating cost − annualized connection cost). Only positive-contribution cells containing individually registered premises and outside established strongholds enter the total; each cell contributes once, each premise counts once. The top Insight cell is included with the same contribution. Far-bank excluded cells and established customers are omitted. This is a selected fictional premise inventory, not a comprehensive market census or a measured financial forecast.

The complete generated inventory, membership and assumptions are in H3_SCENARIO.json. Run node scripts/generate-opportunity.mjs after editing artwork registration or premises. Reduced-motion and no-JS fallbacks now show Potential. User-requested minimal timeline has six stage selectors.
Validation: scripts/potential-qa.mjs checks totals, unique H3 membership, matching previous-cell assumptions, all six stages, mobile layout, accessibility, automatic progression, document-hidden pause, reduced motion and no-JS output.

## Customer volume and USD revision
Supersedes the BRL amounts and previous 14-premise inventory above. Both stages now use synthetic USD-denominated assumptions, without FX conversion. Insight: US$103k/year; Potential: US$766k/year across 19 potential customers.
The full 900×600 frame contains 707 real H3 cells. Neutral cells carry no opportunity color. Green fill intensity equals eligible prospective premises in that cell divided by the maximum cell count, rather than profitability rank. Current customers are gray/white filled roof badges; prospective customers use green outlined roofs. Pixel-registered roof coordinates were revised against the source watercolor; every rendered badge includes its actual containing H3 ID. The same records drive SVG intensity, premise counts and aggregate contribution. The recommended Focus/Insight polygon and #1 badge remain visible in the final city view.
Validation: 69 checks including exact badge-to-H3 membership, no duplicate premises, counts per cell, full-frame coverage, matched Insight contribution assumptions, USD labels, responsive layouts, accessibility, reduced motion, hidden-document pause and no-JS fallback.

## Pending direction — closing action (user approved concept; implementation pending)
- Promote the final agent action to the primary green button.
- User wording intent: “Validate demanda. Prioritaze the next expansion 🚀”. Suggested English spelling for implementation: “Validate demand. Prioritize the next expansion.”
- Use the green navigation arrow from the Yuri Martins brand as the animated launch symbol, rather than adding an unrelated rocket illustration. Keep the brand header intact; animate a separate instance inside the closing button.
- A short, single launch motion accompanies the final reveal or intentional activation, suggesting moving from spatial understanding to action. Avoid an endless loop; provide a static reduced-motion alternative.
- The action should open an illustrative qualification flow: complementary customer information and lead qualification feed spatial prioritization; commercial negotiation remains with the team. Do not imply live backend/agent integration.
- Before implementing, correct current-customer rooftop registration: the infrastructure source is not a customer; remove its customer badge and any street-only badge. Recompute affected counts and totals.
- This entry records the direction only; the user requested evaluation and retention, not implementation in this turn.

## Implemented closing action
The green primary button reads “Validate demand. Prioritize the next expansion.” A separate navigation-arrow instance makes one short launch on automatic Potential reveal; the header brand stays intact. Reduced motion keeps it static.
Click opens a labeled interactive demonstration: confirmed interest / within 30 days yields priority 1 for the connected cluster; unconfirmed interest/timing asks for qualification before scheduling. The outcome combines a fixed spatial hypothesis with user-supplied readiness. It is not live agent reasoning or a lead-management backend. Negotiation stays with the team. The panel closes back to city potential.
Removed customer markers at source coordinates 208.59,350.98 and road location 292.97,383.79. Both were current-customer records; prospective customer counts and USD contribution remain unchanged. Validation: 89 checks, including opening, changed readiness, changed recommendation, closing, responsive overflow, totals and accessibility.

## Human decision finale — implemented
Supersedes the intermediate lead-readiness panel. Potential now invites an explicit human decision: “Approve the recommended project”, labeled “Interactive demo · You decide”. A subtle icon hover/glow attracts attention without moving the hit target. Autoplay never approves.
On click, capture the button arrow position, return to the original Focus world coordinates, animate the brand navigation arrow on a curved flight while the camera reframes, then create a filtered pigment splash at the exact top-ranked H3 center (488.29,277.58). Reveal “Project approved”, retain #1, and show next steps: validate capacity and qualify leads. This is a demonstration, not a backend approval or a financial commitment. Result stays paused; “Explore the opportunity again” returns to Potential. Stage changes cancel in-flight work. Reduced motion skips flight and splash; hidden/offscreen states pause active Web Animations.
Bridge detour now follows the industrial access, main avenue, northern bridge axis and curved far-bank street instead of cutting diagonally across blocks.
Validation: 95 checks including actual timed flight, reduced-motion approval, responsive result layouts, repeat, cancellation mid-flight, accessibility and existing city totals.

## Navigator actor and decision time — implemented
Potential lasts 20 seconds (44-second automatic loop). Pointer hover and keyboard focus within the separate decision card preserve the remaining stage time; leaving resumes. The decision card reads “You decide.”, “Approve”, “#1 Recommended Project”. The interactive-demo microcopy was removed from the CTA while contextual agent-demo/synthetic labeling remains.
A 48px brand navigator floats inside a stable hit target. Click flight begins with a compression, swells along a sampled cubic Bezier, rotates to match the curve tangent with continuous angle unwrapping, and shrinks into the top-ranked project. The pigment splash begins at 1940ms against a 2000ms flight, during contact rather than after disappearance. Reduced motion preserves direct approval. The agent summary and human decision card are separate; mobile stacks them beneath the map.
Validation: 97 checks, including 25-second hover/focus holds without stage advance, resumed loop, actual motion, cancellation, repeat, reduced motion, mobile layout and accessibility.

## Conversation invitation after approval
Final copy: “Next: let’s talk about your business question.” A primary “Talk about your business ↗” link opens Yuri Martins’s existing LinkedIn profile in a new tab, with noopener/noreferrer and an accessible destination label. “Explore the opportunity again” remains the secondary repeat action. No message is sent automatically.

## Direct flight, optical softness and live connection
Removed zoom controls and their JavaScript listeners. Navigator flight now lasts 1250ms along a shallow curve whose control points follow the origin-to-project vector; camera movement is 1200ms. Pigment impact starts at 1210ms. Brief subpixel optical blur (0.4px automatic camera, 0.55px approval camera) returns to zero at rest; no persistent blur or oversized compositing layer is retained.
On human approval, route flow runs four 1100ms pulses, then a 2500ms steady rhythm. This operation effect can run while narrative playback is intentionally paused at the result, but pauses when hidden/offscreen and remains disabled for reduced motion. Existing 20-second decision window, hover/focus hold, and LinkedIn invitation remain.
Validation: 103 checks including no zoom controls, live connection animation after approval, clear raster filter at rest, real timed flight, repeat, cancellation, accessibility and mobile layout.

## Branded launch with pigment trail
Navigator uses a rounded concave silhouette inspired by the supplied green brand arrow, oriented 45 degrees upward in the CTA. Size is 58px; flight rotates the right-facing native shape to the exact curve tangent. A short translucent green tail grows behind the navigator during acceleration and fades into contact. The arrow remains a brand mark, without literal rocket windows or flames.
Decision card enters with an 800ms fade, slight blur recovery and 12px rise after the agent result. Its visual backing and copy float gently while the hit area stays fixed; hover/focus brings them to rest. Arrival is allowed to complete even if cursor presence pauses the narrative; offscreen/hidden and reduced motion still pause or disable effects.
Splash and the first route pulse use the same 1210ms delay on the shared Web Animations timeline. Subsequent route pulses continue after approval. Full real-motion approval, cancellation and repeat passed; 103 checks total.

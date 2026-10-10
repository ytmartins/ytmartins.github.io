# PRODUCT SPEC V1.0 — V6.1 production migration

**Product:** yurimartins.dev — personal professional website  
**Status:** approved visual concept, production implementation pending  
**Canonical production URL:** `https://yurimartins.dev/` (**required release destination**, not optional or provisional). **Hosting/source:** GitHub Pages driven from the existing `ytmartins/ytmartins.github.io` repository. `https://ytmartins.github.io/` is a technical GitHub Pages address, **not** the public portfolio identity. Domain is owned; DNS and Pages changes require separate release authorization.  
**Owner:** Yuri Martins  
**Language:** public UI English-first

## 1 — Problem and JTBD

**Business problem:** A prospective global recruiter, hiring manager, technical leader or peer needs to understand this professional's distinct value in seconds, with credible technical/domain depth and no exaggerated capabilities. A conventional GIS tool catalog is insufficient; a generic AI marketing site is not credible.

**Job to be done:** *When an international technology/utility decision-maker encounters the profile, help them understand the user's established Enterprise GIS and Utilities architecture competence, the direction toward AI-native building, and the value of spatial intelligence, then continue through a trustworthy professional contact channel.*

**Primary outcome:** high-quality professional conversations/opportunities and credible international positioning, **not** content monetization, consulting bookings, blog traffic or vanity social counts.

## 2 — Product principles

- **Less interface, more identity, meaningful motion.** Movement must explain relationships and context, not simply decorate.
- **Established domain → emerging capability.** Mature strength in Enterprise GIS/Utilities/Solution Architecture; AI-native capabilities framed as actively explored/built, not falsely certified or deployed.
- **Business before stack.** Spatial context, evidence, operational decisions and enterprise outcomes are primary.
- **Public proof, private craft.** Labs shares selective conceptual research with synthetic/open/licensed data. No mandate to publish source code or proprietary methods.
- **Performance and access are non-negotiable.** Site should remain usable when motion is off, JS is unavailable, or connectivity is limited.

## 3 — Approved visual/content lock

The **actual executable V6.1** is in `reference_v6_1/`. Use desktop/mobile screenshots for visual review. It supersedes earlier V4, V5 or illustrative V6 mockups. No new visual proposals.

### Brand

- Deep navy surfaces, off-white content, restrained lime accent; approved layout, spacing, texture and contrast.
- Original `< navigator >` icon is the specific supplied raster `assets/navigator-code-original.webp`. **Do not recreate/rotate/replace the shape.** Do not turn it into a play triangle or ordinary arrow. Preserve lettermark `yurimartins.dev` styling and legible menu.
- Original user-provided photo: `assets/portrait.webp` with face/proportions unchanged.

### Home (`/`)

Keep the same overall density and flow as V6.1: readable header, hero text with visual spatial story, concise personal identity/expertise strip, My Approach, Labs teaser, footer/contact. Use existing source, not this summary, for exact markup.

**H1 — exact:** `Complex challenges. Spatial thinking. Business value.`

**Hero intro — exact:**

> I design enterprise geospatial solutions for utilities and critical infrastructure — connecting business context, spatial reasoning and emerging AI-native capabilities to make complex decisions easier to understand.

**Hero focus keywords — exact:** `ENTERPRISE GIS / UTILITIES / GEOAI / AI-NATIVE ENGINEERING` (spacings visual as in baseline).

**Profile/about:**
- Name: Yuri Martins.
- Title: Geospatial Solutions Architect.
- Preserve approved Esri ArcGIS experience statement from V6.1; *experience with the technology*, not direct Esri employment or partner endorsement.
- Four existing expertise labels and statuses (`CORE`, `DOMAIN`, `VALUE`, `EXPLORING`) exactly as baseline; don't exaggerate AI-Native expertise.
- Real professional links in baseline: `https://www.linkedin.com/in/ytmartins/`, `https://github.com/ytmartins`, `https://www.youtube.com/@ytmartins`.
- Primary `Let's connect` CTA goes to LinkedIn. No active unverified email link; no contact form or independent consulting sales pitch.

**My Approach:** Preserve three approved principles: `Solve real problems`, `Bridge technology and people`, `Build for what's next` with the exact approved descriptions, layout and icons.

**Labs teaser:** Preserve intro to the Labs page; it is not a Work or Insights feed.

### Labs (`/labs` clean route or `labs.html` if the simplest static deployment)

- Accessible via header + teaser and back to Home.
- Keep **three** *conceptual* directions: `Spatial Context Engine`, `Infrastructure Decision Studio`, `AI-Native GIS Workflows`.
- Keep illustrative map with three interactive toggles: `Assets`, `Demand`, `Constraints`, and narrative feedback. All based on synthetic/non-operational assets.
- Do not publish mock cases as completed client implementations; don't invent client attributions, metrics, use of live ArcGIS or agent execution.
- Future plans may include `/work` and `/insights`, but no empty pages or nav links today.

## 4 — Motion is a product requirement

Existing implementation in `reference_v6_1/app.js` and HTML/CSS is the starting point and functional truth. There are **five** scenario stages (do not merge with professional `My Approach` methodology):

1. `Discover` — separate assets, terrain, demand, risk.
2. `Connect` — geospatial reference + infrastructure/context linkage.
3. `Reveal` — proximity, connectivity, patterns/constraints become apparent.
4. `Focus` — priority zone is highlighted for human investigation.
5. `Understand` — an evidence-based question/next step, **not an automatic real decision**.

Required behaviors: initial playback (if user allows motion), one pass only; stage tabs/buttons clickable; Pause/Play, Replay; auto-stop at last step; don't waste CPU while tab hidden; honor reduced motion. Current timing (~950ms initial and ~1780ms per stage) is the visual reference unless tested change approved. Motion must not obscure text, block controls or overheat phones. The ending must be understandable without animation.

**Professional method** remains separate: `Solve real problems → Bridge technology and people → Build for what's next`. Do not replace it with the animated stages.

## 5 — Interaction and navigation

- Header: Home, About, Approach, Labs, Contact only; each link resolves.
- Accessible mobile navigation (expanded state, keyboard escape, adequate targets); visible focus, skip link, proper headings and landmarks.
- Distinguish active navigation in Home vs Labs.
- Correct relative paths both on `ytmartins.github.io` and the apex custom domain. If implementing `/labs` route requires redirects/rewrite unsupported by Pages, prefer `labs.html` rather than deploying broken links.
- No dummy links, unconfirmed email CTA, login forms, or analytics trackers by default.

## 6 — Nonfunctional requirements

- Static-first, no server, no secrets, no unnecessary external runtime dependency. Use approved generated illustration assets and human photo; compress without visibly degrading originals.
- Baseline screens: `reference_v6_1/screenshots/preview_home_1440.png`, `preview_home_390.png`, `preview_labs_1440.png`, `preview_labs_390.png`. Other screenshot covers 1920 px.
- Accessibility: semantic markup, textual fallback for motion story, readable contrast, reduced-motion honor, usable at 200% zoom and keyboard-only.
- Performance: sensible image dimensions/decoding, restrained animations (transform/opacity preferably), local assets, avoid layout shifts.
- SEO: meaningful title/descriptions and absolute canonical URLs targeting `https://yurimartins.dev/` and the production Labs path. Implement metadata with the production target; verify every canonical and social preview URL during release. Do not use `ytmartins.github.io` as the canonical public brand.
- Data/privacy: no client-specific GIS data, protected files, unpublished partner endorsements, cookies or tracking by default.

## 7 — Explicitly out of scope

- Redesign/rebrand/new photos/icons/headlines.
- AI API, agent backend, AI inference in browser, live ArcGIS services, production spatial analytics.
- Work/Insights/Blog pages, unapproved case studies, technical tutorials, course/shop/community.
- Sending email, Cloudflare routing setup, **executing** domain/DNS changes, **executing** deployment or auto-merging. **Preparing** the code, verified DNS instructions and GitHub Pages configuration for `yurimartins.dev` is IN scope.

## 8 — Definition of done

A tested **draft PR**, visually faithful to V6.1, with traceable changes, **explicit production URL `https://yurimartins.dev/`**, GitHub Pages custom-domain release plan, final route/canonical checks, and a documented approval gate. After owner authorizes release, publishing is complete only when the site and Labs work on the real HTTPS domain. Passing pre-release QA does not itself authorize merge or DNS edits. See `docs/QA_ACCEPTANCE.md`.

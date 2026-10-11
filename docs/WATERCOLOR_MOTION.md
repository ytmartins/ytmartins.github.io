# Watercolour motion — reference analysis and design rationale

## What was actually inspected

Reference: https://felt.com/, inspected in a live browser on 2026-10-10, including the agricultural opening, the industrial AI question scene and the fieldworker illustration. The industrial scene was observed during transition (sparse ink/vegetation first) and after its painted territory and question appeared. These are visual observations, not claims about Felt's private implementation or exact timings.

The reference combines a detailed raster watercolour illustration with sparse, crisp interface overlays. Pigment is uneven, architectural linework imperfect, trees individually painted, ground and water textured. Painted edges dissolve into the surrounding paper rather than terminating in a map frame. Scene transitions expose partial drawing and then denser pigment; information arrives on top of a place already understood visually. In the AI scene, a question sits near the industrial territory and a small subset of warehouses becomes its visible answer. The attraction comes from material, staging and the relationship between question and place.

The previous local version missed this: extruded geometric houses remained a diagram, an outlined network dominated attention, the rectangular stage controls and legend made the piece feel like GIS software, and the ending asked visitors to interpret a technical constraint rather than experience clarity.

## Philosophy recovered from the repository

Source: `codex_handoff/docs/PRODUCT_SPEC.md`, sections 1–2, plus the unchanged Home copy and My Approach.

- Less interface, more identity, meaningful motion.
- Business before stack.
- Established domain → emerging capability.
- Solve real problems; bridge technology and people; build for what's next.
- The objective is credible professional conversations. Domain expertise is established; AI-native engineering is an emerging building direction. Synthetic motion must not pretend to execute live agents or production analysis.

The owner's new request authorizes a new illustration/motion treatment. Preserve the original identity, main headline, introductory copy and CTAs. Do not modify the immutable handoff reference or deploy.

## Reconstruction decisions

Create an original transparent watercolour territory, not a copy of Felt's assets or branded composition. Use a local optimized raster for the material and SVG/CSS/JavaScript for the progressive reveal and anchored annotations. Keep a single image and coordinate frame throughout: no crossfading between different generated geographies. Reveal pigment through soft irregular masks, delay overlays behind the paint, and use a small number of annotations integrated with the illustration.

A business question anchors the scene: “Where can we grow with less friction?” The spatial insight must account for connections, not simply proximity. A visually close location across the river lacks direct access; a connected near-bank cluster can be investigated using existing infrastructure and access. The candidate remains subject to capacity and local constraint validation. No financial estimates, real capacity claims or fabricated customer outcomes.

AI-native is represented conceptually through question → contextual evidence → comparison → next action. The on-page label must state that this is an illustrative reasoning sequence; there is no live inference, agent execution or deterministic optimizer implied.

## Storyboard shown before implementation

| Stage | Visual development | Duration |
| --- | --- | --- |
| Discover | Ink and pigment reveal the territory; a business question appears | 3 s |
| Connect | Dispersed information settles onto the same territory | 3.5 s |
| Reveal | Apparent proximity gives way to actual access and infrastructure connections | 4 s |
| Focus | Comparison concentrates attention on a connected candidate | 3.5 s |
| Insight | Territory settles with a short conclusion and a validation/prototype next step | 6 s |

Motion remains stoppable, replayable, manually selectable, suspended offscreen/hidden, and completely understandable without motion or JavaScript.

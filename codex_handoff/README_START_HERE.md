# yurimartins.dev — Approved V6.1 → Codex handoff

**Status:** design & narrative approved, ready to implement in a dedicated GitHub branch. **Canonical production domain is `https://yurimartins.dev/`. Not permission to deploy yet.**

## What this is

A small, production-oriented Spec-Driven Development (SDD) handoff. It is *not* a request for design exploration, a new framework, a blog, consulting website, or an AI application. The core objective is a fast, readable, accessible, maintainable personal site that communicates a credible international professional position.

## Required reading, in order

1. `CODEX_START.md` — the execution instruction; paste into Codex.
2. `AGENTS.md` — permanent do/don't boundaries for this task.
3. `docs/PRODUCT_SPEC.md` — scope, exact content and design lock.
4. `docs/QA_ACCEPTANCE.md` — verifiable completion gates.
5. `docs/REPOSITORY_RELEASE.md` — repository situation and pre-release handoff.
6. `docs/BASELINE_SMOKE_CHECK.md` — limited read-only prototype smoke recheck.
7. `reference_v6_1/index.html`, `labs.html`, `styles.css`, `app.js`, `assets/*` — **approved working baseline**.
8. `reference_v6_1/screenshots/*` — approved visual references.

## Integration approach

The **public domain is `yurimartins.dev`**, which is the required URL at the end of the release. The existing GitHub repository is `ytmartins/ytmartins.github.io` (default branch observed: `master`), serving as source/hosting rather than the public portfolio name. The current deployed/source tree predates this portfolio and uses a Kagerou/Vite/PostCSS template. Do not copy its old content, layouts, or scripts into the approved interface. Audit it before removing anything.

When working in Codex, **make this handoff accessible inside the repository workspace** (e.g. unpack as `codex_handoff/` on a disposable working branch), then paste `CODEX_START.md` as the task. The zip cannot be assumed to be visible to Codex merely because it exists in another chat.

The handoff's reference assets/screen captures are production *inputs*; keep only necessary web assets in the final site. Screenshots and reference documents may stay in `docs/` if suitable, but do not publish bulky reference screenshots as web assets by default.

## Non-goals

No automatic merge. No deployment yet. No DNS / Cloudflare / domain modifications before a separate approval. **Domain-targeted configuration planning for `https://yurimartins.dev/` is required.** No email account activation. No new pages for Work or Insights. No client data. No outside consulting offer. No content fabrication. No rebranding.

## Approval protocol

Deliver a **draft Pull Request** with a comparison to V6.1, a test record and a release checklist specifically for **`https://yurimartins.dev/`**. Stop there and request approval before merge or publication. Once authorized, verify HTTPS + canonical Home + Labs directly on the domain before calling production ready.

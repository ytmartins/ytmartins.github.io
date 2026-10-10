# Controlled V6.1 migration

Audit: 2026-10-09 (America/Sao_Paulo). Base master:
`c5338b14064ae4d257a44c2672703e4e90e8c5ed`. Branch: `codex/portfolio-v6-1`.
Remote default branch and admin/push access verified.

| Treatment | Files | Reason |
| --- | --- | --- |
| Preserve | LICENSE.md, CODE_OF_CONDUCT.md, history | Obligations and recovery |
| Preserve verbatim | codex_handoff/** | Authoritative inputs, excluded from artifact |
| Replace | index.html, README.md, package.json, lockfile | Old Kagerou page/build unrelated to approved site |
| Remove | main.css, postcss.config.js, src/**, public/**, old build workflow | Audited old styles, banners, photo/social icons and clipboard/particles/share/lazy-loading scripts; none required by V6.1 |
| Add from V6.1 | labs.html, styles.css, app.js, seven assets/* | Approved interface and original assets |
| Add | Build/HTTP/QA/performance scripts, workflows, evidence/release docs | Static artifact and verifiable gated release |

No old content/layout/scripts/external fonts carried forward. Original brand PNG
stays in reference only; production uses original WebP. All seven production
images are byte-identical to handoff inputs. LICENSE.md and history retain the
historical Apache-2.0 template attribution; no remaining template runtime code.

## Justified differences from V6.1

- Canonical/OG target apex and labs.html. Relative Home links use ./.
- Page-current semantics, focusable main skip target, semantic groups for named
  story/expertise, brand accessible name containing visible yurimartins.dev text.
- Menu labels reset on close/Escape. Pause stops ambient story animations;
  hidden documents pause CSS animation and preserve timer state.
- No-JS exposes navigation and an existing-text story summary; hides inactive
  interactive controls. Normal JS-enabled composition unchanged.
- Preload existing LCP background assets. No recompression, typography/palette
  change, new runtime library, altered motion timing or published copy change.

Frozen approved PNGs inspected. Windows system-font fallback differs from their
capture environment (line breaks/page heights vary). Ten same-environment
baseline/output pairs are pixel-identical. This verifies migration fidelity in
this environment, not cross-platform pixel identity. No font substituted.

## Publishing audit

Read-only Pages API: built, build_type legacy, source master /, cname null,
HTTPS enforced, technical URL https://ytmartins.github.io/. No settings changed.
No CNAME existed. Old CI targeted main on Node 16/17/18; no Actions Pages deploy.

Selected strategy: manual Actions uploading only dist, avoiding publication of
handoff/docs. Switching from branch source is separately gated BEFORE merge.
No CNAME added: Actions ignores it; custom domain belongs in Pages settings.

# Release: https://yurimartins.dev/

**Not authorized. Stop at draft PR.** No merge, deployment, Pages source/domain
switch, verification write, DNS change or email activation performed.

Canonical Home: https://yurimartins.dev/.
Canonical Labs: https://yurimartins.dev/labs.html.
Source/hosting: ytmartins/ytmartins.github.io, default master.

## Observed preflight

Pages currently publishes master / using legacy branch builder, no custom domain,
HTTPS enforced on technical host. **A merge can immediately publish the new root
unless the source is switched to Actions first, after explicit authorization.**

Public DNS snapshot (read-only, 2026-10-09 client date):

| Name/type | Observed |
| --- | --- |
| apex NS | lunar.dns-parking.com, solar.dns-parking.com |
| apex A | 2.57.91.91 |
| apex AAAA, MX, TXT, CAA | No data returned |
| www CNAME | yurimartins.dev |
| www resolved A | 2.57.91.91 |
| _dmarc TXT | Name not found |

Nameservers suggest Hostinger DNS; registrar/account/provider UI and GitHub
ownership verification state are **unconfirmed**. Public DNS cannot enumerate
unknown DKIM selectors/all TXT records. Inspect/export authoritative zone before
writing; do not infer mail records absent from this snapshot. Do not activate hello@.

## Proposed DNS diff — approval and provider-zone review required

| Name/type | Before | Proposed target |
| --- | --- | --- |
| @ A | 2.57.91.91 | Replace website A with 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| www CNAME | yurimartins.dev | ytmartins.github.io (no repository path) |
| GitHub verification TXT | Inspect zone | Exact GitHub-provided account verification name/value |
| MX/SPF/DKIM/DMARC/other TXT | Export panel first | Preserve exactly; no mail changes |
| AAAA/CAA | No public data observed | Inspect panel; leave unless verified conflict needs separate review |

ALIAS/ANAME to ytmartins.github.io is an alternative only if provider-supported;
do not combine blindly with A plan. Inspect conflicting parking/redirect/A/AAAA/
CNAME entries. No wildcards. If panel offers proxy/CDN, use DNS-only for initial
certificate validation. No Cloudflare setup is part of this PR.

## Ordered release after separate owner approval

1. Resolve QA exceptions in qa/REPORT.md or obtain explicit owner acceptance.
   Recheck official docs/settings/zone. Save DNS export, Pages settings/current
   deployment reference and rollback base c5338b14064ae4d257a44c2672703e4e90e8c5ed.
2. Obtain approval covering merge, source/domain settings and exact DNS diff.
   Configure a github-pages environment reviewer if available. Manual workflow
   confirmation is a guard, not owner authorization.
3. **Before merge**, switch Settings → Pages → Source to GitHub Actions.
   Do not dispatch. This prevents legacy root publication on merge.
4. Merge reviewed PR into master. Validation runs without deployment. Inspect
   final QA and the allowlisted dist artifact.
5. Verify yurimartins.dev in GitHub owner account using exact provided TXT;
   retain it. Set repository Pages custom domain yurimartins.dev **before DNS
   points the website to GitHub**.
6. Dispatch Approved manual Pages release on master with confirmation input
   yurimartins.dev. Check artifact and deployment status.
7. Apply reviewed website-only DNS diff at confirmed provider. Preserve mail
   records. Confirm authoritative/public apex A and www CNAME; allow propagation
   (GitHub documents up to 24 hours).
8. Wait for TLS provisioning; enable Enforce HTTPS when available. Correct www
   DNS plus apex custom domain yields GitHub's www → apex redirect.
9. Externally verify both canonical URLs, valid TLS, HTTP → HTTPS, www → apex,
   working assets, canonical/OG, mobile/keyboard/story/Labs controls. Compare
   mail DNS with saved zone export.
10. Mark A18 PASS/production ready only after direct domain checks. Successful
    build or technical github.io URL is insufficient.

Actions ignores CNAME and does not create one. If later approved branch-based
publication is chosen, Pages writes CNAME to source branch; preserve it through
builds and re-audit what branch-root publication exposes.

## Rollback

Before DNS changes cancel release and retain existing site/DNS. After publication
redeploy the last approved artifact, or revert full migration on master and
restore saved legacy Pages source. Old site needs complete base commit/template
toolchain, not just index. Restore saved website DNS if necessary, preserving
mail/verification records. Keep ownership protection while DNS points to GitHub;
do not unbind domain first leaving dangling GitHub DNS. Allow propagation/TLS
delays and verify both routes again.

## Official sources consulted

- [Custom domain and DNS/CNAME/HTTPS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Domain ownership verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

Provider identity/full zone/verification token and post-release TLS remain
release-time checks; no provider panel inspection is claimed.

# Deploying tokened.uk

The site is a static build. Cloudflare Pages is connected through its own
dashboard, so there is no deploy workflow in this repository — `.github/workflows/ci.yml`
only runs lint, tests and the build.

## Where it runs

Cloudflare Pages project **`tokened`**, connected to this repository through the
Cloudflare dashboard. Production is `main` → https://tokened.uk, also reachable
at https://tokened.pages.dev. Other branches get preview deployments.

Settings, for reference or to rebuild the project:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | **None** — a Vite preset overrides the build command and skips the prerender step |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(empty)* |
| Environment variables | none |

The Node version comes from `.node-version` (currently 22); set `NODE_VERSION=22`
as a build variable only if a build ever reports an older Node.

### Pages reports through a check, not through Deployments

Cloudflare Pages posts a **check run** named `Cloudflare Pages` on each commit.
It creates **no** GitHub Deployment records and **no** commit statuses, so
`GET /repos/:owner/:repo/deployments` and `GET /repos/:owner/:repo/commits/:sha/status`
both come back empty on a repository that is deploying perfectly well. Use the
check-runs API (or the Checks tab) to see deploy state — an empty Deployments
list is not evidence that nothing is deployed.

### URLs have a trailing slash

Every route is prerendered as `<path>/index.html`, which Pages serves at
`<path>/`, 308-redirecting `<path>` to it. `absoluteUrl()` in `src/lib/site.ts`
is the single place that builds the URLs the site declares about itself —
canonical, hreflang, `og:url`, sitemap and feeds — and it emits that
trailing-slash form deliberately. Do not "tidy" the slashes away: Google ignores
hreflang targets that redirect, and a sitemap of redirecting URLs is reported as
"page with redirect" rather than indexed.

### Cloudflare features that inject scripts

The CSP in `public/_headers` allows no third-party origins. Cloudflare **Web
Analytics** auto-injection adds `static.cloudflareinsights.com/beacon.min.js`,
which the policy blocks — the beacon never runs, and every page load logs a CSP
violation. Leave it switched off for this zone rather than widening the policy;
the same applies to Rocket Loader, Email Obfuscation and any other feature that
rewrites HTML.

## What the build produces

`npm run build` runs four steps: typecheck, the client build, an SSR build of
`src/entry-server.tsx`, and `scripts/prerender.mjs`. The result in `dist/` is:

- `index.html`, `blog/`, `zh/` — prerendered HTML for every route in both languages
- `404.html` — served by Pages for unmatched paths, with a real 404 status
- `sitemap.xml`, `feed.xml`, `zh/feed.xml`, `robots.txt`
- `sw.js` and `site.webmanifest`
- `_headers` and `_redirects`, which Pages reads automatically

`_redirects` deliberately has **no SPA catch-all**: every route is a real file, so
an unknown path falls through to `404.html` instead of returning the landing page
under a misleading 200.

## After a deploy, check

1. `/` and `/zh/` render English and Chinese respectively.
2. `curl -I https://tokened.uk/nope` returns **404**, not 200.
3. `curl -I https://tokened.uk/assets/<any hashed file>` returns
   `Cache-Control: public, max-age=31536000, immutable`.
4. The browser console is free of Content-Security-Policy violations — the policy
   in `_headers` allows no third-party origins, so anything added later that loads
   from one will be blocked until the policy is updated.
5. `https://tokened.uk/sitemap.xml` lists both language trees, and every `<loc>`
   returns 200 rather than a redirect.

## The gateway is separate

`workers/gateway` is a Cloudflare Worker, not part of the Pages build. It is
deployed on its own with `npm run gateway:deploy` and is not currently wired to
`api.tokened.uk`; see `workers/gateway/README.md`.

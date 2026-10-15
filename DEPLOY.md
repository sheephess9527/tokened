# Deploying tokened.uk

The site is a static build. Cloudflare Pages is connected through its own
dashboard, so there is no deploy workflow in this repository — `.github/workflows/ci.yml`
only runs lint, tests and the build.

## One-time: connect Cloudflare Pages

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**,
pick `sheephess9527/tokened`, then set:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave empty)* |

No environment variables are required — token counting runs in the visitor's
browser and the contact links are `mailto:`. The Node version comes from
`.node-version` (currently 22); set `NODE_VERSION=22` as a build variable only
if a build ever reports an older Node.

Then **Custom domains** → add `tokened.uk` (and `www.tokened.uk` if wanted).

Every other branch gets a preview deployment automatically, which is the easiest
way to review a change before it reaches `main`.

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

## After the first deploy, check

1. `/` and `/zh` render English and Chinese respectively.
2. `curl -I https://tokened.uk/nope` returns **404**, not 200.
3. `curl -I https://tokened.uk/assets/<any hashed file>` returns
   `Cache-Control: public, max-age=31536000, immutable`.
4. The browser console is free of Content-Security-Policy violations — the policy
   in `_headers` allows no third-party origins, so anything added later that loads
   from one will be blocked until the policy is updated.
5. `https://tokened.uk/sitemap.xml` lists both language trees.

## The gateway is separate

`workers/gateway` is a Cloudflare Worker, not part of the Pages build. It is
deployed on its own with `npm run gateway:deploy` and is not currently wired to
`api.tokened.uk`; see `workers/gateway/README.md`.

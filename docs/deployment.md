# Deployment

The site is published to GitHub Pages at
**<https://haverhill.alchemicalartisans.com>** by
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml), on every push
to `main` and on demand from the Actions tab.

Nothing is scraped during a deploy. `meetings.json` and the converted documents
are committed, so the build is offline and never touches the city's servers —
which is also why refreshing the data is a local step (`npm run calendar:update`)
followed by an ordinary commit. See [operations.md](./operations.md).

## What the workflow does

1. `npm ci`, with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`. The `prepare` script
   installs Playwright's browsers, which are a few hundred megabytes and are
   never used here; the workflow runs no tests.
2. `npm run build`, producing `build/` — every route prerendered to static HTML
   by `@sveltejs/adapter-static`.
3. `actions/upload-pages-artifact` on `build/`, then `actions/deploy-pages`.

The two jobs are split because `deploy-pages` needs the `github-pages`
environment and the `pages: write` / `id-token: write` permissions, and because
that split is what lets the deployment URL show up on the run.

Concurrency is `group: pages` with `cancel-in-progress: false`. One deploy at a
time, and a queued run waits rather than cancelling one mid-publish.

## One-time setup on GitHub

- **Settings → Pages → Build and deployment → Source: GitHub Actions.** Without
  this the workflow's deploy step fails; Pages defaults to serving a branch.
- **DNS:** a `CNAME` record for `haverhill` in the `alchemicalartisans.com` zone
  pointing at `alchemical-artisans.github.io`.
- **Settings → Pages → Enforce HTTPS**, once the certificate has been issued.
  GitHub provisions it automatically after DNS resolves, which can take an hour.

## The custom domain

[`static/CNAME`](../static/CNAME) holds `haverhill.alchemicalartisans.com`. It
lives in `static/` deliberately: GitHub's Pages settings also store a custom
domain, but a deploy from Actions publishes whatever is in the artifact, so a
`CNAME` file that is not in the build gets dropped on the next deploy. Keeping it
in the repository makes the domain part of the build rather than a setting that
can be silently lost.

[`static/.nojekyll`](../static/.nojekyll) is empty and exists to stop GitHub
running Jekyll over the output, which would discard `_app/` — every JavaScript
and CSS asset the site has — because Jekyll ignores directories starting with an
underscore.

## Base path

The custom domain serves from the root, so `paths.base` is empty everywhere:
dev, preview, the test suites, and the deployed site alike.

The knob still exists in [`vite.config.ts`](../vite.config.ts), reading
`BASE_PATH` from the environment. Without a custom domain, GitHub Pages serves a
project site from `https://<owner>.github.io/<repo>`, and a build has to know it
lives under that subdirectory:

```sh
BASE_PATH=/civics npm run build
```

That is the build to produce if the custom domain is ever dropped; add
`BASE_PATH: /${{ github.event.repository.name }}` to the workflow's build step
to make it the deployed one.

Every internal link is built by `Router` in
[`src/lib/router.ts`](../src/lib/router.ts), which applies the base exactly once.
See [calendar-page.md](./calendar-page.md#internal-links) for why the site does
not use SvelteKit's `resolve()`.

## 404s

The adapter is configured with `fallback: "404.html"`, so the build emits an
app shell at that path. GitHub Pages serves `404.html` for anything it cannot
find, which means an unknown or stale URL lands on this site's own not-found
page instead of GitHub's — a dead end that would take the reader off the site
entirely.

## Verifying a change locally

```sh
npm run build && npm run preview     # what the deploy publishes, served at :4173
BASE_PATH=/civics npm run build      # the subdirectory build, if you need it
```

Prerendering is strict: a link to a route that does not exist fails the build
rather than shipping a broken page. That is a feature — it caught the base path
being applied twice the first time this site was configured for a subdirectory.

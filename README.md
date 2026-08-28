# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.17.0 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" playwright tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:static" storybook paraglide="languageTags:en+demo:no" --install npm civics
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying

Pushing to `main` publishes the site to
<https://haverhill.alchemicalartisans.com> through GitHub Pages. Nothing is
scraped during a deploy — the data is committed, so the build is offline. See
[docs/deployment.md](./docs/deployment.md).

## Meeting calendar

`/calendar` renders agendas and minutes scraped from the
[City of Haverhill](https://www.haverhillma.gov/government/agendas-and-minutes/).
Every entry opens as a readable page on this site, with the PDF's text converted
to HTML and a link to the original at the top. The site root forwards there,
without a cacheable redirect status, until there is a landing page worth having
— see [docs/calendar-page.md](./docs/calendar-page.md#the-site-root).

The site is fully prerendered, so both the data (`src/lib/data/meetings.json`)
and the document pages (`src/lib/data/documents/`) are committed to the repo and
baked in at build time — the browser never calls the city's servers.

```sh
npm run calendar:update    # fetch only documents added since the last build
npm run calendar:rebuild   # re-scrape everything from scratch
```

Neither script touches the document pages. Those are written by hand, one HTML
fragment per document under `src/lib/data/documents/`, and a document with no
page is linked straight to the city's PDF from the calendar — see
[docs/document-pages.md](./docs/document-pages.md).

Prefer `calendar:update` for routine refreshes: the document listing is a single
request, but resolving a date costs one request per document, so `update` only
fetches genuinely new entries and leaves existing records — including manual
corrections — untouched.

The city's data is messier than it looks, and the scraper compensates in ways
worth understanding before changing any of it. **See [docs/](./docs/)**:

| Document                                   | What it covers                                      |
| ------------------------------------------ | --------------------------------------------------- |
| [Overview](./docs/README.md)               | How the pieces fit together                         |
| [Scraping](./docs/scraping.md)             | How documents are pulled off the city's site        |
| [Dates](./docs/dates.md)                   | How a meeting date is determined, and why it's hard |
| [Data format](./docs/data-format.md)       | The `meetings.json` schema                          |
| [Document pages](./docs/document-pages.md) | Writing a page for a meeting document               |
| [Calendar page](./docs/calendar-page.md)   | How the page renders and prerenders                 |
| [Operations](./docs/operations.md)         | Refreshing data and troubleshooting                 |
| [Deployment](./docs/deployment.md)         | Publishing the site to GitHub Pages                 |

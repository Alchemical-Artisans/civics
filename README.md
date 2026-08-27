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

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Meeting calendar

`/calendar` renders agendas and minutes scraped from the
[City of Haverhill](https://www.haverhillma.gov/government/agendas-and-minutes/).
Every entry opens as a readable page on this site, with the PDF's text converted
to HTML and a link to the original at the top.

The site is fully prerendered, so both the data (`src/lib/data/meetings.json`)
and the converted documents (`src/lib/data/documents/`) are committed to the repo
and baked in at build time — the browser never calls the city's servers.

```sh
npm run calendar:update    # fetch only documents added since the last build
npm run calendar:rebuild   # re-scrape everything from scratch
```

Both scripts convert any document that does not yet have HTML, and both need
[poppler](https://poppler.freedesktop.org/) installed:

```sh
sudo apt install poppler-utils   # Debian/Ubuntu
brew install poppler             # macOS
```

Every document is cached in `.cache/documents/` (gitignored, around 2.2 GB) so
that re-running the conversion does not re-fetch the corpus, and so anything the
run flags for review can be opened locally. Delete it any time.

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
| [PDF conversion](./docs/pdf-conversion.md) | Turning the city's PDFs into readable HTML          |
| [Calendar page](./docs/calendar-page.md)   | How the page renders and prerenders                 |
| [Operations](./docs/operations.md)         | Refreshing data and troubleshooting                 |

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
The site is fully prerendered, so the data is committed to the repo at
`src/lib/data/meetings.json` and baked in at build time — the browser never calls
the city's servers.

```sh
npm run calendar:update    # fetch only documents added since the last build
npm run calendar:rebuild   # re-scrape everything from scratch
```

Prefer `calendar:update` for routine refreshes. The document listing is a single
request, but resolving a date costs one request per document, so the update
script diffs the listing against what is already stored and only fetches genuinely
new entries. It leaves existing records untouched, including any manual
corrections. Pass `--prune` to also drop entries that have disappeared upstream.

### Notes on the source data

The city's listing is messier than it looks, and the scraper compensates:

- **Dates come from each document's media page**, not its title. Titles use at
  least five date formats and ~9% carry no date at all.
- **Meeting times are rendered as raw UTC**, so an evening meeting entered as
  7:00 PM shows as `12:00 AM` the _next_ day while Haverhill is on EST. Those
  records are rolled back one day; see `parseMeetingDate` for the evidence.
- **Clock times are unreliable** and deliberately not displayed.
- **Some documents share a media page or a PDF**, so records are keyed on the
  page/file pair and duplicates are collapsed for display.
- Where a document's own title or filename contradicts its published meeting
  date, the record is flagged and the count is shown in the page footer.

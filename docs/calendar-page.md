# The calendar page

Route: `/calendar`. Files:
[`+page.ts`](../src/routes/calendar/+page.ts) (build-time data),
[`+page.svelte`](../src/routes/calendar/+page.svelte) (UI), and
[`src/lib/calendar.ts`](../src/lib/calendar.ts) (pure helpers).

## Prerendering

The whole site is prerendered. `src/routes/+layout.ts` contains:

```ts
export const prerender = true;
```

That is required by `@sveltejs/adapter-static`, which refuses to build if any
route is dynamic. The practical consequence for this page: **`+page.ts` runs at
build time, not on request**, so the meeting data is baked into the output.

## Loading and trimming

`+page.ts` imports `meetings.json` directly. Vite inlines it, so there is no
runtime fetch. It then does three things.

**Drops undated records.** A record with no `date` cannot be placed on a
calendar. The count is passed through as `undated` and disclosed in the footer
rather than silently hidden.

**Collapses duplicate PDFs.** Five PDFs are published under two media pages
each, which would otherwise render the same document twice on the same day.
Records are grouped by `fileUrl`, keeping one — and preferring the copy _not_
flagged `needsReview`, since where the two disagree the unflagged one is the
better-evidenced date.

**Trims fields.** Only the six fields the UI needs are kept. Scraper bookkeeping
(`rawMeetingDate`, `dateSource`, `category`, …) is dropped so it never ships to
the browser.

The result: 280 records become 274 rendered entries, with `undated`,
`duplicates`, and `flagged` counts passed alongside for the footer.

## Payload

The dataset ships as a route-level JS chunk of roughly 150KB — about 16KB
gzipped — loaded only when someone visits `/calendar`. The prerendered HTML
itself is ~28KB, containing the current month's markup.

That is comfortably small enough to keep all months client-side, which is what
makes month navigation and filtering instant with no further requests.

## Date handling

All date logic is in `src/lib/calendar.ts`, kept separate from the component so
it can be unit-tested without rendering anything. 13 tests cover it in
[`calendar.spec.ts`](../src/lib/calendar.spec.ts).

**Everything is UTC.** Dates are `YYYY-MM-DD` strings, and `Date` objects are
built with `Date.UTC(...)`. Using the local-time constructor would shift days for
readers west of UTC and put meetings in the wrong cell — a real bug for a site
whose entire purpose is telling people which day something happened.

`buildMonthGrid()` returns Sunday-aligned weeks padded with neighbouring days,
trimming any trailing week that falls entirely outside the month.

## State

Svelte 5 runes, in a small amount of state:

| State                         | Purpose                                                      |
| ----------------------------- | ------------------------------------------------------------ |
| `chosen`                      | the month the reader navigated to, or `null` for the default |
| `activeBoards`                | a `SvelteSet` of board filters; empty means all              |
| `showAgendas` / `showMinutes` | document-kind toggles                                        |
| `today`                       | today's date, filled in after mount                          |

Two details are deliberate:

**The default month is the newest month containing meetings, not today.**
Because the page is prerendered, "today" at build time and "today" in the
reader's browser are different dates. Deriving the default from the data keeps
the server and client render identical.

**`today` is set in `onMount`.** It starts empty, so the prerendered HTML has no
"today" highlight, and it fills in on the client. Computing it during render
would produce a hydration mismatch.

Everything downstream — `visible`, `byDate`, `weeks`, `monthCount` — is
`$derived`, so filtering and navigation need no manual invalidation.

## Layout

Two presentations of the same data, switched on viewport width:

- **Wide (`md` and up):** a real `<table>` month grid. A table is used rather
  than a CSS grid because the content genuinely is tabular — weekday column
  headers carry meaning — which gives screen readers useful structure for free.
- **Narrow:** the grid is hidden and a date-grouped agenda list is shown, since
  seven columns of cells are unusable on a phone.

Agendas are blue, minutes green, in both views.

## Outbound links

Each entry links to its PDF (`fileUrl`), falling back to the document's page on
the city site when no PDF is listed. Links open in a new tab:

```html
target="_blank" rel="external noopener noreferrer"
```

`external` tells the SvelteKit router not to intercept the navigation;
`noopener noreferrer` is standard hygiene for third-party links.

Because opening a new window unannounced is a WCAG 3.2.5 failure, each link
carries visually-hidden text saying so. The grid's hidden text begins with a
comma — `, agenda, opens in a new tab` — because Svelte trims leading whitespace
inside an element, which otherwise ran the board name into the following word for
screen readers.

## Honesty in the footer

The footer states how many documents are indexed, how many were dropped for
having no date, how many duplicates were collapsed, and how many carry a date
that contradicts their own title or filename.

This is intentional. The underlying data has real quality problems (see
[dates.md](./dates.md)); a civic information site should say so plainly rather
than present uncertain data as authoritative.

## Tests

[`page.svelte.e2e.ts`](../src/routes/calendar/page.svelte.e2e.ts) runs against
the production build and covers: the month heading renders, entries link to real
PDF URLs, links open in a new tab, month navigation works, board filtering
narrows results, and unchecking agendas hides them.

The new-tab test asserts link attributes rather than clicking through, so the
suite never fetches anything from the city's CDN.

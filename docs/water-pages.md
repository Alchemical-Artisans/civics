# The water half

`/water` is a third section, alongside the calendar and the budget, about
Haverhill's drought emergency: what the city's own figures say about water
use, what Chapter 250 currently restricts, and how a household compares to
the city's own conservation target.

## Why it works differently from the rest of the site

Everything else on this site traces to a specific, versioned document the
scrapers in `scripts/` pull off a specific page and commit to `meetings.json`
or `budget.json`. Nothing scrapes `haverhillma.gov`'s general informational
pages — there is no listing to read, no antiforgery handshake, nothing that
changes on a schedule a script could diff. So `/water` is the one section
whose figures are read off a live page by hand rather than committed by a
scraper, and cited by URL and access date instead of by a `source` on a
record.

That is a narrow, deliberate exception, not a precedent for the rest of the
site: every number and every category name on the page has to trace to one of
the sources listed in its own footer, and nothing is invented — including in
the calculator. See `src/lib/water.ts`, which carries the citation for every
figure as a doc comment, the same role a page-number comment plays in
`src/routes/budget/fy2027/*/tables.ts`.

## What's on the page

- **The drought stage** — `DroughtScale.svelte`, a four-stage ordinal scale
  (Watch, Warning, Emergency, Critical) transcribed from the legend of the
  city's own Kenoza Lake chart, marking the stage the current-level line sits
  in. This is the front page's own water card too — see below.

  Each stage carries the percentage its legend states, and that percentage
  is a specific, checkable claim: Kenoza Lake's deficit against its own
  average reservoir _capacity_ for the day of year, per Water Use
  Restriction Ordinance § 250-25.1 — not the "average level" line the chart
  plots in feet, a related but different figure. That reading was first
  written into `water.ts` as an inference from the chart's shape (the bands
  parallel the average-level line); it's since been checked against the
  city's own drought-emergency declaration, which quotes the ordinance's
  20%-35% Emergency threshold verbatim, an exact match to the chart's
  "Emergency" row. Only Emergency has that independent citation — Watch,
  Warning and Critical still rest on the chart's legend alone, and the
  comment on `DROUGHT_ZONES` says so rather than implying all four are
  equally confirmed.

- **Why now** — `src/lib/rainfall.ts`: the Water
  Department's own explanation for the drought is reduced rainfall, and this
  is the one figure on the page that isn't Haverhill's or even Haverhill
  Water's own -- it's NOAA's, statewide Massachusetts January-August
  precipitation back to 1895, read off NOAA's public Climate at a Glance API
  directly (`mass.gov`, which would carry the state's own regional figures,
  blocks every automated fetch tried against it, PDFs included -- see below).
  The page states the figures in prose: 2026's January-August total, its
  departure from the 1901-2000 average, and where it ranks in the 132-year
  record. Fifteen years of it were drawn as a diverging bar -- wet blue above
  a normal line, dry orange below -- and that chart is gone, at the site
  owner's direction: `/drought` charts Haverhill's own gauges, which is better
  evidence for a Haverhill page than a statewide figure, and the statewide
  number is worth stating without being worth a chart. `rainfall.ts` and its
  tests stay, being what the prose reads.
- **Who uses the water** — the city's own residential/non-residential split
  (68%/32%), applied to its stated average daily production and drawn with
  `BudgetStack`.
- **What's restricted, and what isn't** — every currently prohibited, exempt,
  and time-restricted outdoor use under Chapter 250, transcribed verbatim
  from the city's Water Supply/Drought Information page and rendered with
  `BudgetTable`. This is what answers "what about golf courses, or car
  washes, or new construction" honestly: not a volume of water each uses,
  which the city does not publish, but whether that use is allowed at all
  right now.
- **How your household compares** — `WaterCalculator.svelte`, the first
  interactive input anywhere on this site. A resident enters gallons used,
  household size, and the number of days that covers; the calculator reports
  gallons per person per day against the city's Water Management Act permit
  target of 65, and shows the city's own "How Much Do You Use?" table of
  per-activity gallons, with and without conservation, so a reader can see
  where their own gap is likely to be without this site inventing a formula
  for it.

There is no chart here re-plotting the Kenoza Lake level over time. The only
version of that curve the city publishes is the chart shown to the City
Council on September 15, 2026
(`static/excerpts/city-council-2026-09-15/drought-emergency-update/`), and
this page links to it and states the one point off it that matters — the
current level and zone.

**That is no longer a rule about the whole site.** This section used to say
the curve would never be re-plotted, on the grounds that reading it back off
an image would be inventing data points the city never published as numbers.
`/drought` now does read it back, and the distinction that changed the answer
is between transcription and invention: reading a published measurement off a
published picture is the same act as transcribing a scanned agenda by eye,
which is how most of the write-ups on this site were made, while the series
under `data/lake-level/placeholder/` was generated and is fabricated. The
reading is still weaker than a figure the city printed, which is why
`src/lib/kenoza-levels.ts` carries its method and its precision, the page
says so in its own prose, and the lines are drawn dotted. See
[drought-pages.md](drought-pages.md).

## Reuse, and the one generalization it needed

`BudgetStack` and `BudgetColumns` both drew every figure as dollars,
unconditionally, because every chart on the site so far had been one. Both
now take an optional `format` prop (`(n: number) => string`), defaulting to
the existing dollar formatter so every budget call site is unchanged; `/water`
passes its own (million gallons a day for the usage split, bare gallons for
the calculator). `BudgetTable` needed no change at all — it already prints
cells as the strings its data holds, with no assumption that they are money.

The front page's water card reuses `DroughtScale` and `CURRENT_DROUGHT_ZONE`
directly from this page, the same reasoning the budget card's chart reuse
follows: the card and the page cannot state a different stage because they
read the same component off the same data. An earlier version of the card
drew the residential/non-residential split instead — dropped because that
split is true in a wet year as much as a dry one, and a card meant to
illustrate the drought needs a fact that actually moves with it.

`DroughtScale.svelte`'s four colors (`src/lib/drought-colours.ts`) are a
one-hue ordinal ramp built on the site's existing orange
(`chart-colours.ts` slot 2) and validated with the dataviz skill's
`validate_palette.js --ordinal`, rather than the city chart's own four-hue
legend (yellow through purple) — a stage scale's color should say "worse,"
which one hue going darker does and four unrelated hues don't.

## Where a figure could go stale

Every source page is a live one, so a figure here can drift from what
`haverhillma.gov` currently says in a way `meetings.json` cannot: there is no
scraper to flag the difference. If the drought status changes materially, the
figures in `src/lib/water.ts` need re-reading by hand against the sources
listed there, the same as the page's own footer — there is no `water:update`
script to run.

`rainfall.ts` ages the same way, off NOAA rather than the city: each new
month NOAA publishes moves the current year's own figures, though the bar
chart's other fourteen years and the 1901-2000 average do not change. NOAA's
API is stable and re-queryable by hand
(`ncei.noaa.gov/access/monitoring/climate-at-a-glance/statewide/time-series/19/pcp/<span>/<end-month>/1895-<year>.json`,
span 8 ending on month 8 for the January-August figure this page currently
shows) — there is no script here either, the same reasoning as `water.ts`.

import type { Step } from "$lib/BudgetTimeline.svelte"

/**
 * Page 13, the budget calendar, as the book prints it.
 *
 * The book draws it as a timeline running down a vertical axis with the entries
 * alternating either side of it; the site draws the same timeline lying on its
 * side, at the foot of the book's front page. `date` and `step` are the book's
 * own words and punctuation, ranges and all.
 *
 * `on` and `through` are those dates as the machine reads them, which is what
 * places an entry along the axis and decides whether it has happened yet.
 * `through` is only for the three entries the book gives as a range; the rest
 * are a single day. The book writes the year on some entries and not others --
 * "2/23-3/13" -- and every one of them is 2026.
 *
 * `summary` is the one thing here the book does not say. Twelve boxes across a
 * page cannot hold twelve sentences, so each carries a few words and the
 * sentence itself is a mouseover away, unshortened. Each summary is built out
 * of its own entry's nouns -- "capital requests", "final recommendations" --
 * so it names what the step is rather than characterising it, and a reader who
 * wants the step reads the step.
 */
export const CALENDAR: Step[] = [
  {
    date: "1/9/26",
    summary: "Directives to departments",
    on: "2026-01-09",
    step: "Mayor distributed budget directives to departments.",
  },
  {
    date: "1/15/26",
    summary: "Finance projections",
    on: "2026-01-15",
    step: "Finance prepared revenue projections, high-level budget estimates, identified budget pressures, compiled capital requests, and assessed debt capacity.",
  },
  {
    date: "2/5/26",
    summary: "Forecasts evaluated",
    on: "2026-02-05",
    step: "The budget team evaluated revenue and appropriation forecasts, offering insights into high-priority requirements.",
  },
  {
    date: "2/6/26",
    summary: "Department requests due",
    on: "2026-02-06",
    step: "Department budget requests, narratives and KPIs due.",
  },
  {
    date: "2/23-3/13",
    summary: "Department reviews",
    on: "2026-02-23",
    through: "2026-03-13",
    step: "Mayor, CFO and Deputy Auditor met with each department to review requests, priorities and KPIs.",
  },
  {
    date: "4/2/26",
    summary: "Capital requests ranked",
    on: "2026-04-02",
    step: "The budget team met with departments to discuss, rank, and prioritize all capital requests by utilizing standardized ranking criteria.",
  },
  {
    date: "4/3/26",
    summary: "Preliminary budget",
    on: "2026-04-03",
    step: "Mayor and CFO formulated Mayor's preliminary budget.",
  },
  {
    date: "4/9/26",
    summary: "Budget team feedback",
    on: "2026-04-09",
    step: "Presented Mayor's preliminary budget to budget team for feedback.",
  },
  {
    date: "4/10/26",
    summary: "Final revisions",
    on: "2026-04-10",
    step: "Mayor and CFO finalized and implemented the last revisions to the budget.",
  },
  {
    date: "4/13-4/17",
    summary: "Final review",
    on: "2026-04-13",
    through: "2026-04-17",
    step: "Mayor, Chief of Staff, CFO and Deputy Auditor met with departments to review final recommendations.",
  },
  {
    date: "5/27-6/8",
    summary: "Public hearings",
    on: "2026-05-27",
    through: "2026-06-08",
    step: "Department public budget hearings -City Hall Council Chambers 6pm.",
  },
  {
    date: "6/16/26",
    summary: "Budget adopted",
    on: "2026-06-16",
    step: "Budget Adoption by City Council.",
  },
]

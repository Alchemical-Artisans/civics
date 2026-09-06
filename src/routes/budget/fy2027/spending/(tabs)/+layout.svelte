<script lang="ts">
  // A script here for the chart down the left of the page, common to every
  // topic beneath it, and for the nav bar between them. See `+layout.ts` and
  // docs/budget-pages.md.
  import { page } from "$app/state"
  import BudgetColumns from "$lib/BudgetColumns.svelte"
  import { Router } from "$lib/router"
  import { SPENDING, SPENDING_TOTAL } from "../tables"

  let { data, children } = $props()

  /**
   * The reading splits into six topics now, in the book's own order where
   * it has one -- the goals (15-16), capital planning (28-45), the year's
   * requests (72), its challenges (73) -- each its own route directory
   * under this one, rather than a panel a script showed and hid.
   *
   * "Council Orders" was a seventh, ours rather than the book's: the four
   * orders of the Council's agenda of 2 June 2026, quoted in the agenda's
   * own words. It went once none of the four had anything left to quote --
   * 13.1 and 13.2's totals moved to the spending bar and the Departments
   * tab, 13.3 to `revenue`, and 13.4 to `reserves` (see each of those for
   * why) -- leaving a tab of two paragraphs explaining where four orders
   * went and nothing of the Council's own words. `council-orders.ts`
   * itself is untouched, still the source every one of those pages reads
   * its own order from; only the tab that once quoted all four directly is
   * gone.
   *
   * "2027 Budget in Brief" (76-78) used to be one of them, "Budget in
   * Brief" -- pages 76 and 77's forty-four departments and page 78's
   * fourteen categories, as two stacked-bar charts -- until the bar in the
   * left column of this page started drawing the same department table
   * itself: a reader already saw every department's 2027 figure there, on
   * every one of these routes and on the front page besides, so a second
   * chart repeating the same breakdown, one route over, said nothing the
   * shared bar had not already said. The category rollup went with it --
   * `DEPARTMENTS` and `APPROPRIATIONS` themselves are untouched, in
   * tables.ts, still read for the figures the shared bar and
   * `SPENDING_TOTAL` need, but neither is drawn as a table or a chart of
   * its own any more.
   *
   * "Departments" is what replaced it, once the bar itself turned out to
   * have the readability problem the chart it replaced did not: forty-two
   * segments on one scale puts Senior Center's $14,500 at a fraction of a
   * pixel wide, a shape nobody reads and only a keyboard, patiently, can
   * even reach. `departments/+page.svelte` draws `SPENDING` again as a
   * plain table -- same rows, same order, largest first -- so every figure
   * the bar carries is also somewhere a reader can just read it, no hover
   * or focus required. One table rather than two charts, because there is
   * only one bar to explain now. It sits second, right after the goals,
   * rather than back in Budget in Brief's old slot next to Challenges: it
   * is a table of the same figure the bar draws for every route on this
   * page, not a topic in the book's own order, so there is no page range
   * to slot it into by.
   *
   * **A tab whose own heading would only repeat its label carries none.**
   * "Capital Planning" and "Departments" print nothing that is not already
   * this tab's name in the nav above them, the same reason "Requests" has
   * carried no heading of its own since before either existed. `references`
   * is the same rule reaching one component deeper: `BookReferences` prints
   * its own "References" heading everywhere else it is used (`debt` and
   * `reserves`, each titled something other than "References"), so its
   * `heading` prop defaults to showing it and this tab alone passes
   * `heading={false}`.
   *
   * "Goals & Recommendations" carries more than page 15-16's own goals now:
   * "Preliminary Budget Goals for Fiscal 2027" and "Final Recommendations"
   * are page 73's, the lead-in and the close of "Other Budget Reductions to
   * Create a Balanced Budget" -- moved here because both are goals or their
   * resolution rather than a challenge, whatever page the book happened to
   * print them on. The book bracketed its challenges with them only because
   * a straight run of pages had nowhere else to put either; a reader
   * looking for what the year set out to do and what it landed on wants
   * both in one place, not one of them buried inside the account of what
   * went wrong in between.
   *
   * Requests and Challenges were one tab, "Requests & Challenges" -- pages
   * 72 and 73 are two different accounts (what departments asked to add,
   * and what had to come out to balance the budget instead), not two halves
   * of one, and a label naming both was a hint they wanted to be read
   * separately.
   *
   * References is last, and is the one topic that is not the book's: what
   * every other topic on this page was built out of, and the parts of the
   * book they sit beside. It used to sit outside the tabs entirely, under
   * whichever one was open, on the theory that a reader never has to go
   * looking for it -- true, but it meant every other topic's worth of
   * references arrived whether the reader had asked a question yet or not.
   * Its own tab is exactly as reachable and answers only when opened.
   */
  const TABS = [
    { slug: "goals-recommendations", label: "Goals & Recommendations" },
    { slug: "departments", label: "Departments" },
    { slug: "capital-planning", label: "Capital Planning" },
    { slug: "requests", label: "Requests" },
    { slug: "challenges", label: "Challenges" },
    { slug: "references", label: "References" },
  ]

  /**
   * Matched on `page.route.id`, never on the URL against a `Router`-built
   * href -- with `paths.relative` on, that comparison cannot match during
   * prerendering and starts matching only after hydration, so the served
   * markup and the hydrated markup would silently disagree. `SiteHeader`'s
   * own menu is matched the same way, for the same reason.
   *
   * A segment match on `route.id` --
   * `/budget/fy2027/spending/(tabs)/goals-recommendations`, since a route
   * group is invisible in the URL but not in the id it is
   * matched on -- rather than a suffix match on the whole thing, and a
   * segment rather than a plain substring so "capital-planning" cannot match
   * some future topic whose slug merely contains it. Capital Planning's own
   * item pages sit a level deeper still, `.../capital-planning/<item>`, and
   * want the same tab marked current as the table their own link came from,
   * which is what running the check against every segment rather than only
   * the last one is for.
   */
  const current = (slug: string) => (page.route.id ?? "").split("/").includes(slug)

  /**
   * The same bar the front page draws, one column of it: what the city
   * spends, largest category first. No `href` -- unlike the front page's, this
   * column is already on the page it would link to, and a bar that links to
   * itself is the same page offered twice.
   */
  const spending = [{ label: "Spending", parts: SPENDING, total: SPENDING_TOTAL }]
</script>

<!--
  Laid out as `debt` and `reserves` are along the left: a chart fixed in its
  own column and the rest of the page beside it. The rest is six routes now
  rather than one long scroll or a script-driven set of panels -- this page
  has no single chart or policy the whole reading answers to the way debt and
  reserves each have one, and a plain nav of links needs no script at all to
  work, on or off.
-->
<div class="lg:grid lg:h-[calc(100vh-181px)] lg:grid-cols-[max-content_minmax(0,1fr)] lg:gap-x-10">
  <!-- The same bar the front page draws for "Spending", one column of it --
       see the script for why it carries no link back to this page. -->
  <div class="lg:h-full">
    <BudgetColumns rows={spending} />
  </div>

  <div class="lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
    <nav
      aria-label="Spending"
      class="not-prose mb-4 flex flex-wrap gap-x-4 gap-y-1 border-b border-slate-200"
    >
      {#each TABS as tab (tab.slug)}
        <a
          href={Router.spendingTab(data.book.id, tab.slug)}
          aria-current={current(tab.slug) ? "page" : undefined}
          class="-mb-px border-b-2 px-1 py-2 text-sm font-medium {current(tab.slug)
            ? 'border-slate-900 text-slate-900'
            : 'border-transparent text-slate-500 hover:text-slate-700'}"
        >
          {tab.label}
        </a>
      {/each}
    </nav>

    <div class="lg:relative lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
      <div class="max-w-3xl">
        {@render children()}
      </div>
    </div>
  </div>
</div>

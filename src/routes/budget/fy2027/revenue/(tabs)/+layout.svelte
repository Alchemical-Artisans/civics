<script lang="ts">
  // A script here for the chart down the left of the page, common to every
  // topic beneath it, and for the nav bar between them -- the same split
  // `spending` made first. See `+layout.ts` and docs/budget-pages.md.
  import { page } from "$app/state"
  import BudgetColumns from "$lib/BudgetColumns.svelte"
  import { Router } from "$lib/router"
  import { REVENUE_DETAIL, REVENUE_TOTAL } from "../tables"

  let { data, children } = $props()

  /**
   * Eight topics, in the book's own order where it has one: the narrative
   * that opens "2027 Revenue Estimates" (48), state aid, the tax levy and
   * Prop 2½, and local receipts -- four sub-topics of one page-48 document,
   * split the way `spending` split "Requests" from "Challenges" once a
   * single tab label stopped saying what was under it -- then "2027 Revenue
   * Summary" (64) with the 10-year forecast that follows it on page 67, and
   * "Budget in Brief" (78-79).
   *
   * "Revenue Sources" is ours, the same reason "Departments" is on
   * `spending`: fifty-four segments on one bar is too many to read or land a
   * mouse on -- Constable License Fee's own line has nothing to chart at all
   * this year, and the smallest that does, Farm Animal Excise's $1,500, is a
   * sliver of Tax Levy's $146,107,374. `sources/+page.svelte` draws
   * `REVENUE_DETAIL` again as a plain table, largest first, so every source
   * the bar carries is also somewhere a reader can just read it. It sits
   * second, right after the page's own opening narrative, the same slot
   * "Departments" took on `spending`.
   *
   * References is last, the same as `spending`'s: what this page was built
   * out of and the two other buckets it sits beside, answering only when
   * opened rather than trailing every other topic whether asked for or not.
   */
  const TABS = [
    { slug: "revenue-projection", label: "2027 Revenue Projection" },
    { slug: "sources", label: "Revenue Sources" },
    { slug: "state-aid", label: "State Aid" },
    { slug: "tax-levy", label: "Tax Levy" },
    { slug: "local-receipts", label: "Local Receipts" },
    { slug: "summary", label: "Summary" },
    { slug: "budget-in-brief", label: "Budget in Brief" },
    { slug: "references", label: "References" },
  ]

  /**
   * Matched on `page.route.id`, never on the URL against a `Router`-built
   * href -- the same reason `spending`'s own nav is, and `SiteHeader`'s menu
   * before that: with `paths.relative` on, that comparison cannot match
   * during prerendering and starts matching only after hydration, so the
   * served markup and the hydrated markup would silently disagree.
   */
  const current = (slug: string) => (page.route.id ?? "").split("/").includes(slug)

  /**
   * The same bar the front page draws, one column of it: where the city's
   * money comes from, largest source first. No `href` -- this column is
   * already on the page it would link to.
   */
  const revenue = [{ label: "Revenue", parts: REVENUE_DETAIL, total: REVENUE_TOTAL }]
</script>

<!--
  Laid out as `spending`, `debt` and `reserves` are along the left: a chart
  fixed in its own column and the rest of the page beside it.
-->
<div class="lg:grid lg:h-[calc(100vh-181px)] lg:grid-cols-[max-content_minmax(0,1fr)] lg:gap-x-10">
  <!-- The same bar the front page draws for "Revenue", one column of it --
       see the script for why it carries no link back to this page. -->
  <div class="lg:h-full">
    <BudgetColumns rows={revenue} />
  </div>

  <div class="lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
    <nav
      aria-label="Revenue"
      class="not-prose mb-4 flex flex-wrap gap-x-4 gap-y-1 border-b border-slate-200"
    >
      {#each TABS as tab (tab.slug)}
        <a
          href={Router.revenueTab(data.book.id, tab.slug)}
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

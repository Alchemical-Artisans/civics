<script lang="ts">
  // A script here for the chart down the left of the page, common to every
  // topic beneath it, and for the nav bar between them. See `+layout.ts` and
  // docs/budget-pages.md.
  import { page } from "$app/state"
  import BookReferences from "$lib/BookReferences.svelte"
  import BudgetColumns from "$lib/BudgetColumns.svelte"
  import { Router } from "$lib/router"
  import { SPENDING, SPENDING_TOTAL } from "../tables"

  let { data, children } = $props()

  /**
   * The five topics the reading splits into, in the book's own order -- the
   * goals (15-16), capital planning (28-45), the year's requests and
   * challenges (72-73), "2027 Budget in Brief" (76-78), and the Council's own
   * orders, which are ours rather than the book's. Each is its own route
   * directory under this one now, rather than a panel a script showed and
   * hid, so a reader can link straight into "Council Orders" the way every
   * other write-up on the site is linked.
   */
  const TABS = [
    { slug: "goals", label: "Goals" },
    { slug: "capital-planning", label: "Capital Planning" },
    { slug: "requests-challenges", label: "Requests & Challenges" },
    { slug: "budget-in-brief", label: "Budget in Brief" },
    { slug: "council-orders", label: "Council Orders" },
  ]

  /**
   * Matched on `page.route.id`, never on the URL against a `Router`-built
   * href -- with `paths.relative` on, that comparison cannot match during
   * prerendering and starts matching only after hydration, so the served
   * markup and the hydrated markup would silently disagree. `SiteHeader`'s
   * own menu is matched the same way, for the same reason.
   *
   * The last segment rather than a suffix match on the whole id: `route.id`
   * carries this directory's `(tabs)` group exactly as it sits on disk --
   * `/budget/fy2027/spending/(tabs)/goals` -- since a route group is invisible
   * in the URL but not in the id it is matched on.
   */
  const current = (slug: string) => (page.route.id ?? "").split("/").pop() === slug

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
  own column and the rest of the page beside it. The rest is five routes now
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

        <!-- Outside every topic, so it stays under whichever one is open
             rather than needing a copy in each. -->
        <BookReferences items={data.references} book={data.book} />
      </div>
    </div>
  </div>
</div>

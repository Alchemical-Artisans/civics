<script lang="ts">
  import BudgetColumns from "$lib/BudgetColumns.svelte"
  import { APPROPRIATIONS, DEPARTMENTS } from "../../tables"
  import { amount, cell, column } from "$lib/budget-table"
  import { ORDERS } from "../../../council-orders"

  // Trial: order 13.1 alone, moved here from Council Orders to see how a
  // department the book leaves out reads beside the ones it carries. Read
  // out of `council-orders.ts` rather than retyped, so this and the version
  // still on Council Orders cannot drift apart while only one of them moves.
  const water = ORDERS.find((order) => order.item === "13.1")!

  /**
   * Pages 76 and 77, every department on one line, as one stacked bar for
   * 2027 rather than a grid running to four hundred-odd cells across the six
   * years the book prints. The book gives five more columns per department
   * than this one keeps -- five other years, two average/annual percent
   * changes, the 2027 department request kept apart from what was actually
   * recommended, and that request's and the recommendation's own percent and
   * dollar change -- dropped along with the rest of the site's history,
   * since this page is about 2027's own budget rather than how it got here.
   */
  const departments = [
    {
      label: "2027",
      total: amount(cell(DEPARTMENTS, "Grand Total", "2027 Recommended"))!,
      parts: column(DEPARTMENTS, "2027 Recommended", { exclude: ["Grand Total"] }),
    },
  ]

  /**
   * Page 78, the same budget rolled up by function: fourteen categories for
   * 2027, the general fund's own account of itself rather than one line per
   * department.
   */
  const appropriations = [
    {
      label: "2027",
      total: amount(cell(APPROPRIATIONS, "Grand Total", "2027 Proposed"))!,
      parts: column(APPROPRIATIONS, "2027 Proposed", { exclude: ["Grand Total"] }),
    },
  ]
</script>

<!-- Pages 76 to 78, "2027 Budget in Brief": every department on one line, and
the same budget rolled up by function. The book splits the first across two
pages purely for room -- same columns, same header, alphabetical throughout
-- so the two halves are one chart here, as they were one table before it.
The revenue that balances against these is on the revenue page, where its
own chart is. -->
<h2>Departments</h2>

<div class="not-prose mb-6 h-96">
  <BudgetColumns rows={departments} minHeight={320} />
</div>

<!-- Trial: the Water Department, one order off the Council's agenda of 2
June 2026 rather than a line in this table -- the book carries no department
of this name at all, so the chart above has nothing to draw it into. -->
<p><strong>{water.item}</strong> {water.text}</p>

{#if water.parts}
  <ul>
    {#each water.parts as part (part)}
      <li>{part}</li>
    {/each}
  </ul>
{/if}

<h2>Appropriations</h2>

<div class="not-prose mb-6 h-72">
  <BudgetColumns rows={appropriations} minHeight={256} />
</div>

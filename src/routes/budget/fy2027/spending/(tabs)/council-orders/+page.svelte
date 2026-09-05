<script lang="ts">
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import { ORDERS } from "../../../council-orders"

  // 13.1 and 13.2, the Water and Wastewater Department orders, are not
  // quoted here: both totals ($14,805,633 and $15,967,043) are already
  // segments of the spending bar and rows on the Departments tab, once the
  // bar's own switch to department granularity put them there. 13.1 went
  // first, as a trial, when "Budget in Brief" (since cut) still needed
  // somewhere to hold it; 13.2 follows it off this page for the same
  // reason rather than a different one -- quoting either order's own text
  // here would be a fact this page already states once, stated again.
  // The `ENTERPRISE` table that used to sit beside 13.2, naming both
  // departments in one place, went for the same reason: it duplicated the
  // same two rows the Departments tab already lists.
  //
  // 13.3 left too, but for revenue rather than spending: it raises and
  // appropriates the general fund, which reads oddly on a page titled
  // "What the Council appropriated" once it is the revenue side of that
  // figure being discussed. It sits on `revenue` now, for as long as that
  // page's own layout stands -- see the note there.
  //
  // All three stay in `ORDERS`; only this page's own selection of it
  // changed, since the data is still every order the agenda carries.
  const remaining = ORDERS.filter(
    (order) => order.item !== "13.1" && order.item !== "13.2" && order.item !== "13.3",
  )
</script>

<!-- Ours, not the book's: the book is the Mayor's proposal, and what follows is
what the City Council did with it, from its agenda of 2 June 2026. The
orders are quoted as the agenda words them, spacing and all. -->
<h2>What the Council appropriated</h2>

<p>
  The book is the Mayor's proposal for the <GlossaryTerm term="General Fund"
    >general fund</GlossaryTerm
  >. These are the orders the City Council voted on it. Three of the four are not quoted here: the
  Water and Wastewater Department orders, whose totals are already on the spending bar and the
  Departments tab, and the <GlossaryTerm term="General Fund">general fund</GlossaryTerm>'s own
  order, which is the revenue side of that same figure and sits on Revenue instead.
</p>

<p>
  The water and wastewater departments are appropriated in orders of their own because they are
  <GlossaryTerm term="Enterprise Funds">enterprise funds</GlossaryTerm>, paid for out of what
  households are billed rather than out of the tax <GlossaryTerm term="Levy">levy</GlossaryTerm>,
  and they appear nowhere in the book at all. Each order also appropriates an amount inside the <GlossaryTerm
    term="General Fund">general fund</GlossaryTerm
  >, funded from that <GlossaryTerm term="Department">department</GlossaryTerm>'s receipts, which is
  why the front page counts those transfers once.
</p>

{#each remaining as order (order.item)}
  <p><strong>{order.item}</strong> {order.text}</p>

  {#if order.parts}
    <ul>
      {#each order.parts as part (part)}
        <li>{part}</li>
      {/each}
    </ul>
  {/if}
{/each}

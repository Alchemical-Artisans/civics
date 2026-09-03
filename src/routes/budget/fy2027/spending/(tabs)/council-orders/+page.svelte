<script lang="ts">
  import BudgetTable from "$lib/BudgetTable.svelte"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import { APPROPRIATED, ENTERPRISE, GENERAL_FUND, ORDERS } from "../../../council-orders"
</script>

<!-- Ours, not the book's: the book is the Mayor's proposal, and what follows is
what the City Council did with it, from its agenda of 2 June 2026. The
orders are quoted as the agenda words them, spacing and all. -->
<h2>What the Council appropriated</h2>

<p>
  The book is the Mayor's proposal for the <GlossaryTerm term="General Fund"
    >general fund</GlossaryTerm
  >. These are the orders the City Council voted on it, and the two departments the book does not
  carry.
</p>

{#each ORDERS as order (order.item)}
  <p><strong>{order.item}</strong> {order.text}</p>

  {#if order.parts}
    <ul>
      {#each order.parts as part (part)}
        <li>{part}</li>
      {/each}
    </ul>
  {/if}

  {#if order.item === "13.1"}
    <BudgetTable table={ENTERPRISE} />
  {/if}

  {#if order.item === "13.3"}
    <BudgetTable table={GENERAL_FUND} />
  {/if}
{/each}

<p>
  <strong>{APPROPRIATED}</strong> is what the Council raised and appropriated for the <GlossaryTerm
    term="General Fund">general fund</GlossaryTerm
  >. The book prints $285,272,159 for the same year. The difference, $10,521,435, is the state
  assessments and the <GlossaryTerm term="Overlay">overlay</GlossaryTerm>: the Commonwealth's
  charges for charter school tuition, school choice, the MBTA and the rest, and the assessors'
  reserve for the property tax abatements the year will <GlossaryTerm term="Grant"
    >grant</GlossaryTerm
  >. Both are raised on the <GlossaryTerm term="Tax Rate Recapitulation Sheet"
    >tax rate recapitulation sheet</GlossaryTerm
  > rather than appropriated, so they are spent without the Council voting them, and the front page's
  spending chart carries them with everything else the city spends.
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

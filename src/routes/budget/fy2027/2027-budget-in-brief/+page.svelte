<script lang="ts">
  // The one kind of write-up that carries a `<script>`: its tables are data,
  // because the book's front page charts the same figures and they must come
  // from one place. Everything else on the page is still plain markup.
  import BudgetTable from "$lib/BudgetTable.svelte"
  import { APPROPRIATIONS, DEPARTMENTS, REVENUE } from "./tables"
</script>

<!--
  Every department on one line, split across pages 76 and 77 purely for room --
  same columns, same header, alphabetical throughout -- so the two halves are
  joined here. Page 78 carries the same budget rolled up by function, with the
  revenue behind it, and is kept as its own table below.
-->
<BudgetTable table={DEPARTMENTS} />

<h2>Appropriations</h2>

<BudgetTable table={APPROPRIATIONS} />

<BudgetTable table={REVENUE} />

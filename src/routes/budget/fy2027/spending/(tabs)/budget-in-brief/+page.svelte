<script lang="ts">
  import BudgetTable from "$lib/BudgetTable.svelte"
  import { APPROPRIATIONS, DEPARTMENTS } from "../../tables"
</script>

<!-- Pages 76 to 78, "2027 Budget in Brief": every department on one line, and
the same budget rolled up by function. The book splits the first across two
pages purely for room -- same columns, same header, alphabetical throughout
-- so the two halves are one table here. The revenue that balances against
these is on the revenue page, where its own chart is. -->
<h2>2027 Budget in Brief</h2>

<BudgetTable table={DEPARTMENTS} />

<h3>Appropriations</h3>

<BudgetTable table={APPROPRIATIONS} />

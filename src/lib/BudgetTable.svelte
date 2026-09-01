<!--
  A budget book's table, rendered from the transcription's own data.

  The cells are printed exactly as they are stored, because they are stored
  exactly as the book prints them -- nothing here formats a number, so nothing
  here can render one differently from the page it came off.

  The markup is what these tables were written as by hand before they moved into
  data: a `scope="col"` header row, then a `scope="row"` heading and plain cells
  per line. The budget layout's stylesheet finds them the same way.
-->
<script lang="ts">
  import type { BudgetTableData } from "$lib/budget-table"

  let { table }: { table: BudgetTableData } = $props()
</script>

<table>
  {#if table.caption}<caption>{table.caption}</caption>{/if}
  <!-- Some of these tables are a label and a figure per line with nothing over
       the columns -- the reserve dials, the debt-by-function list. Their column
       names exist so a chart can ask for one by name, and printing them would
       be putting a header on a table the book does not give one. -->
  {#if !table.unheaded}
    <thead>
      <tr>
        {#each table.columns as heading (heading)}
          <th scope="col">{heading}</th>
        {/each}
      </tr>
    </thead>
  {/if}
  <tbody>
    {#each table.rows as row (row.label)}
      <tr>
        <th scope="row">
          {#if row.emphasis}<em>{row.label}</em>{:else}{row.label}{/if}
        </th>
        {#each row.cells as cell, i (i)}
          <td>{cell}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

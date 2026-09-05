<script lang="ts">
  import { SPENDING, SPENDING_TOTAL } from "../../tables"

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  /** Largest first, the same order the bar in the left column draws them in. */
  const rows = [...SPENDING].sort((a, b) => b.amount - a.amount)
</script>

<!-- Ours, not the book's: the bar in the left column already draws every one
of these as a segment, named and priced on hover or focus like every chart on
the site -- but Senior Center's $14,500 is a fraction of a percent of School
Department's $136,998,618, too short a segment for a mouse to land on, and a
reader who wants the figure without hunting for the segment that carries it
wants a table instead. Same forty-two rows as `SPENDING`, same order, no book
page behind either -- the book gives departments and enterprise funds no
table of their own together, only apart, on pages 76-77 and the Council's
agenda. -->
<h2>Departments</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Amount</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as row (row.label)}
      <tr>
        <th scope="row">{row.label}</th>
        <td>{money.format(row.amount)}</td>
      </tr>
    {/each}
    <tr>
      <th scope="row">Total</th>
      <td>{money.format(SPENDING_TOTAL)}</td>
    </tr>
  </tbody>
</table>

<script lang="ts">
  import { REVENUE_DETAIL, REVENUE_TOTAL } from "../../tables"

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  /** Largest first, the same order the bar in the left column draws them in. */
  const rows = [...REVENUE_DETAIL].sort((a, b) => b.amount - a.amount)
</script>

<!-- Ours, not the book's: the bar in the left column already draws every one
of these as a segment, named and priced on hover or focus like every chart on
the site -- but Farm Animal Excise's $1,500 is a sliver of Tax Levy's
$146,107,374, too short a segment for a mouse to land on, and a reader who
wants the figure without hunting for the segment that carries it wants a
table instead. Same fifty-four rows as `REVENUE_DETAIL`, same order, no book
page behind all of them together -- the book gives each source its own table,
a few pages apart, in `revenue/tables.ts`.

No heading -- "Revenue Sources" is already this tab's own name in the nav
above it, the same reason `spending`'s "Departments" carries none: neither
has a book heading of its own to keep, unlike "State Aid" or "Tax Levy",
which keep theirs because the book's own words there say more than the tab
label repeats. -->
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
      <td>{money.format(REVENUE_TOTAL)}</td>
    </tr>
  </tbody>
</table>

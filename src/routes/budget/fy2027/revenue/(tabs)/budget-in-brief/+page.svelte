<script lang="ts">
  // A script here because this tab's own table is data: the front page's
  // revenue pie used to read it directly, and now `REVENUE_DETAIL` does --
  // see `revenue/tables.ts`.
  import BudgetTable from "$lib/BudgetTable.svelte"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import { REVENUE } from "../../tables"
  import { APPROPRIATED, GENERAL_FUND, ORDERS } from "../../../council-orders"

  // Order 13.3, moved here from Council Orders: it raises and appropriates
  // the general fund, which is a revenue-side fact more than a spending
  // one, so it reads oddly on a page titled "What the Council
  // appropriated". Read out of `council-orders.ts` rather than retyped, so
  // this and the agenda transcription it comes from cannot drift apart. It
  // sits on this tab because it reconciles against the same $285,272,159
  // this tab's own "2027 Budget in Brief" table states.
  const order = ORDERS.find((o) => o.item === "13.3")!
</script>

<!-- Page 78, "2027 Budget in Brief": revenue by source, which is where the pie
     on the book's front page comes from. What it balances against is the pair
     of tables on the appropriations page. -->
<h2>2027 Budget in Brief</h2>

<BudgetTable table={REVENUE} />

<!-- Page 79: what the levy above comes to for one household, which is where
     the revenue side ends. -->
<h2>$245 Estimated Tax Bill Increase</h2>

<p>Average Single Family Home Tax Bill &mdash; Home Value $561,903</p>

<!-- A funnel chart. Its labels and values are the only text on the page. -->
<table>
  <tbody>
    <tr><th scope="row">Employee Benefits</th><td>$90</td></tr>
    <tr><th scope="row">Public Safety</th><td>$67</td></tr>
    <tr><th scope="row">Haverhill Public School</th><td>$32</td></tr>
    <tr><th scope="row">Regional Schools</th><td>$26</td></tr>
    <tr><th scope="row">State Assessments</th><td>$24</td></tr>
    <tr><th scope="row">Human Services</th><td>$5</td></tr>
    <tr><th scope="row">General Government</th><td>$1</td></tr>
  </tbody>
</table>

<p>
  This is an estimate based on 2026 valuations. This amount may increase or decrease based on
  <strong>2027 valuations</strong> to be certified by the Department of Revenue in September 2026.
</p>

<!-- Ours, not the book's, and appended rather than folded into a section
above: order 13.3 of the Council's agenda of 2 June 2026, raising and
appropriating the general fund on the revenue side the way the enterprise
orders do on the spending side (the spending bar and the Departments tab).
This used to be one of four orders quoted on a "Council Orders" tab, since
retired once all four had moved to the figure each belongs beside. Where
13.3 belongs among the book's own sections above is a question for this
page's own revamp -- for now it stands on its own at the foot. -->
<h2>What the Council Raised</h2>

<p><strong>{order.item}</strong> {order.text}</p>

<BudgetTable table={GENERAL_FUND} />

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

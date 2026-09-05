<script lang="ts">
  import BudgetTable from "$lib/BudgetTable.svelte"
  import { STATE_AID } from "../../tables"
</script>

<h2>Historical State Aid &amp; State Assessments</h2>

<BudgetTable table={STATE_AID} />

<table>
  <caption>Net Cherry Sheets Revenue &amp; Assessment % Change</caption>
  <tbody>
    <tr><th scope="row">2024 % Change</th><td>10.5%</td></tr>
    <tr><th scope="row">2025 % Change</th><td>5.8%</td></tr>
    <tr><th scope="row">2026 % Change</th><td>6.2%</td></tr>
    <tr><th scope="row">Sum of 2027 % Change</th><td>1.8%</td></tr>
  </tbody>
</table>

<h2>Historical Comparison of State Aid</h2>

<!-- Two bar charts, the only text on the page being their labels and values. -->
<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Cherry Sheet Assessments</th>
      <th scope="col">Cherry Sheet Receipts</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">2024 % Change</th><td>5.8%</td><td>10.0%</td></tr>
    <tr><th scope="row">2025 % Change</th><td>5.9%</td><td>5.8%</td></tr>
    <tr><th scope="row">2026 % Change</th><td>3.0%</td><td>5.9%</td></tr>
    <tr><th scope="row">2027 % Change</th><td>6.8%</td><td>2.2%</td></tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Chapter 70</th>
      <th scope="col">Unrestricted General Government Aid</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Sum of 2024 % Change</th><td>11.8%</td><td>3.2%</td></tr>
    <tr><th scope="row">Sum of 2025 % Change</th><td>6.5%</td><td>3.0%</td></tr>
    <tr><th scope="row">Sum of 2026 % Change</th><td>7.1%</td><td>1.1%</td></tr>
    <tr><th scope="row">Sum of 2027 % Change</th><td>2.3%</td><td>0.8%</td></tr>
  </tbody>
</table>

<h2>Declining State Aid</h2>

<p>
  In a recent article published by the Massachusetts Municipal Association, titled <strong>
    "A Perfect Storm: Cities and Towns Face Historic Fiscal Pressures,"
  </strong> MMA claims that nationwide, cities and towns receive about 31 percent of their revenue via
  state aid; in Massachusetts, it's 26 percent.
</p>

<p>
  Virtually all municipalities in Massachusetts have seen similar dropoffs in unrestricted state
  support. Since 2002, when adjusted for inflation, UGGA has fallen 25 percent overall. A decade
  after the true trough of the great recession, UGGA support has stalled at a relatively low level
  &mdash; despite many years of strong state revenue growth and healthy economic conditions.
</p>

<p>
  Between 2010 and 2022 (the most recent year available), real, inflation-adjusted spending on
  current operations in Massachusetts municipalities grew at just 0.6 percent per year, which is
  slower than the U.S. average for local spending growth. It's also vastly slower than the growth in
  real spending through the state budget, which has risen at roughly 2.8 percent per year.
</p>

<p>
  <a
    href="https://www.mma.org/wp-content/uploads/2025/10/MMA-APerfectStorm-HistoricFiscalPressures-report-10.9.25.pdf"
    target="_blank"
    rel="external noopener noreferrer"
  >
    mma.org/wp-content/uploads/2025/10/MMA-APerfectStorm-HistoricFiscalPressures-report-10.9.25.pdf
  </a>
</p>

<!--
  The page reproduces Figure 2 of that report, "State Aid as Share of Local
  Revenue by State", a bar per state with only the axes labelled. There are no
  figures on it to transcribe.
-->

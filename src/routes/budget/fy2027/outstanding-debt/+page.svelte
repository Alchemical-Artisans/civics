<script lang="ts">
  // A script here because this table is a bar on the book's front page as well;
  // see docs/budget-pages.md.
  import BudgetTable from "$lib/BudgetTable.svelte"
  import BookElsewhere from "$lib/BookElsewhere.svelte"
  import { LONG_TERM_DEBT } from "./tables"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"

  let { data } = $props()
</script>

<!-- The page's own heading, which the contents page renames. -->
<h2>Long Term Debt</h2>

<p><em>The city will evaluate debt limits per state statute and the city's debt policies.</em></p>

<p>
  <strong>City Debt Policy #1:</strong> In accordance with MGL c.58 s.10c, debt shall not exceed 5%
  of the city's equalized <GlossaryTerm term="Valuation">valuation</GlossaryTerm>.
</p>

<p>
  <strong>Results:</strong> The city's total outstanding debt at the conclusion of 2027 will be 1.5%
  of the city's equalized <GlossaryTerm term="Valuation">valuation</GlossaryTerm>. This translates
  into $175,745,444 in outstanding bonds.
</p>

<BudgetTable table={LONG_TERM_DEBT} />

<h2>Annual Debt Payments</h2>

<p>
  <strong>City Debt Policy #2a:</strong> Annual <GlossaryTerm term="General Fund"
    >general fund</GlossaryTerm
  >
  <GlossaryTerm term="Debt Service">debt service</GlossaryTerm> payments shall not exceed 4% of net <GlossaryTerm
    term="General Fund">general fund</GlossaryTerm
  > operating revenue.
</p>

<p>
  <strong>Results:</strong>
  <GlossaryTerm term="Debt Service">Debt service</GlossaryTerm> has remained well below the city's 4%
  benchmark, with 2027 debt payments expected to continue at 3.1% of <GlossaryTerm
    term="General Fund">general fund</GlossaryTerm
  > revenue. Going forward, the city's current debt payments will decline by 2&ndash;3% annually until
  2044, when the first Consentino School construction bond retires.
</p>

<p>
  <em>
    The city recently issued $20,470,000 in tax-exempt general obligation debt with a true interest
    cost (TIC) of 3.34%, supported by the city's AA bond rating, which was recently reaffirmed by
    S&amp;P Global. The debt financed the replacement turf field at the stadium, improvements to the
    drainage on Locke Street, upgrades to two water booster pumping stations, and engineering costs
    for constructing a new drinking water source. This new debt is included in the debt payment
    listed below and in the total outstanding debt shown on the previous page.
  </em>
</p>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2023</th>
      <th scope="col">2024</th>
      <th scope="col">2025</th>
      <th scope="col">2026</th>
      <th scope="col">2027</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">General Fund Revenue</th>
      <td>$231,786,682</td>
      <td>$248,636,640</td>
      <td>$262,190,091</td>
      <td>$277,121,624</td>
      <td>$285,272,159</td>
    </tr>
    <tr>
      <th scope="row">Annual Debt Payments</th>
      <td>$5,819,489</td>
      <td>$4,437,422</td>
      <td>$4,354,994</td>
      <td>$8,500,192</td>
      <td>$8,834,819</td>
    </tr>
    <tr>
      <th scope="row">Debt Payments as % of Revenue</th>
      <td>2.5%</td>
      <td>1.8%</td>
      <td>1.7%</td>
      <td>3.1%</td>
      <td>3.1%</td>
    </tr>
  </tbody>
</table>

<h2>Bond Rating</h2>

<p>The city's bond rating was reaffirmed with "AA"</p>

<blockquote>
  <p>
    "Haverhill's creditworthiness is characterized by the city's stable local economy, along with
    robust budgeting practices and long-term planning that we believe are generally stronger than
    those of similarly rated state peers and will continue to support balanced operations despite
    pressures from unfunded retirement liabilities. Although available reserves are below those of
    similarly rated peers, the city has maintained them at consistent levels over the past few
    years. Nevertheless, we believe Haverhill's reserves and large pension and other postemployment
    benefit (OPEB) liabilities remain an upward limiting factor for the rating."
  </p>
</blockquote>

<p>The rating further reflects our view of Haverhill's:</p>

<blockquote>
  <p>
    <em>
      "Stable local economy, characterized by income indicators that are above the national level
      but below those of Essex County, although we expect the city's economic growth will continue.
      The local economy will likely continue to expand, along with the tax base. In addition to
      local economic opportunities, residents have access to the broader Boston metropolitan
      statistical area."
    </em>
  </p>
  <p>
    <em>
      "Comprehensive budgeting practices and planning that include conservative budgeting
      assumptions, monthly budget-to-actuals reporting, a five-year capital improvement plan, and
      long-range revenue and expenditure forecasting, as well as a formal reserve and debt
      management policy."
    </em>
  </p>
</blockquote>

<p>S&amp;P Global Ratings April 1, 2026</p>

<h2>Retiring Debt</h2>

<p><strong>City Debt Policy #2b:</strong> 65% of all debt shall retire at the end of 10 years.</p>

<p>
  <strong>Results:</strong> The city is not currently on track to achieve this financial benchmark. At
  the end of 10 years, the city will have retired 59% of its current outstanding debt. However, because
  borrowing costs have declined significantly over the past several years, extending debt over longer
  periods has become less costly. In addition, while this approach differs from the philosophy of rapidly
  declining debt, aligning the repayment period with the useful life of the asset is considered a prudent
  fiscal practice.
</p>

<!--
  "Retiring Debt by Major Function", an area chart running 2026 to 2037 across
  five bands -- City, City / Sewer, School, Sewer, Water. Only the axes carry
  numbers, so there are no figures on it to transcribe.
-->

<h2>Debt Comparison to State Average</h2>

<p>
  <em>
    Haverhill's debt per capita has historically remained below the state average. It increased in
    2026 with the addition of the Consentino debt. As of now, the state's 2026 average has not been
    reported in the DLS databank; therefore, the chart below uses an estimate.
  </em>
</p>

<table>
  <caption>Debt per capita</caption>
  <thead>
    <tr>
      <th scope="col">Year</th>
      <th scope="col">Haverhill</th>
      <th scope="col">State Average</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">2016</th><td>$1,454</td><td>$1,875</td></tr>
    <tr><th scope="row">2017</th><td>$1,318</td><td>$1,875</td></tr>
    <tr><th scope="row">2018</th><td>$1,414</td><td>$1,906</td></tr>
    <tr><th scope="row">2019</th><td>$1,701</td><td>$1,982</td></tr>
    <tr><th scope="row">2020</th><td>$1,390</td><td>$2,120</td></tr>
    <tr><th scope="row">2021</th><td>$1,385</td><td>$2,215</td></tr>
    <tr><th scope="row">2022</th><td>$1,326</td><td>$2,336</td></tr>
    <tr><th scope="row">2023</th><td>$1,238</td><td>$2,526</td></tr>
    <tr><th scope="row">2024</th><td>$1,849</td><td>$2,626</td></tr>
    <tr><th scope="row">2025</th><td>$1,851</td><td>$2,698</td></tr>
    <tr><th scope="row">2026</th><td>$2,562</td><td>$2,698</td></tr>
  </tbody>
</table>

<BookElsewhere items={data.elsewhere} book={data.book} />

<script lang="ts">
  // A script here because the table at the foot of this page is data: the front
  // page's revenue pie reads the same figures, and they must come from one
  // place. See docs/budget-pages.md.
  import BudgetTable from "$lib/BudgetTable.svelte"
  import { OTHER_AVAILABLE, REVENUE } from "./tables"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import { APPROPRIATED, GENERAL_FUND, ORDERS } from "../council-orders"

  // Order 13.3, moved here from Council Orders: it raises and appropriates
  // the general fund, which is a revenue-side fact more than a spending
  // one, so it reads oddly on a page titled "What the Council
  // appropriated". Read out of `council-orders.ts` rather than retyped, so
  // this and the agenda transcription it comes from cannot drift apart.
  const order = ORDERS.find((o) => o.item === "13.3")!
</script>

<!-- The page's own printed heading. The page is called "Revenue", which is
     what the chart that opens it is headed. -->
<h2>2027 Revenue Projection</h2>

<p>
  <em>
    The city's practice, which is in accordance with the Massachusetts Department of Revenue (DOR)
    and the Government Finance Officers Association (GFOA), is to estimate revenue conservatively.
    This practice accomplishes three critical objectives as follows:
  </em>
</p>

<ul>
  <li>
    It safeguards the budget against not meeting overly optimistic revenue estimates, which, if not
    achieved, would result in mid-year budget cuts and/or layoffs.
  </li>
  <li>
    It generates <GlossaryTerm term="Free Cash">free cash</GlossaryTerm>, which the city has
    historically used as a source of reserves, to <GlossaryTerm term="Fund">fund</GlossaryTerm> capital,
    to <GlossaryTerm term="Fund">fund</GlossaryTerm> snow and ice removal expenses, to <GlossaryTerm
      term="Fund">fund</GlossaryTerm
    > unforeseen emergency uses such as natural disasters (floods, storms, large snow events), and to
    partially subsidize the <GlossaryTerm term="Operating Budget">operating budget</GlossaryTerm>.
  </li>
  <li>
    It helps build a sustainable budget that has more resilience during periods of economic
    downturn.
  </li>
</ul>

<h2>Decline in 2027 Revenue</h2>

<p>
  Through March 2026, the city experienced a steady decline in local revenue, including license and
  permit fees, departmental income, and investment returns, resulting in a <strong
    >3.13% reduction</strong
  >
  in local receipts compared to the previous year.
</p>

<p>
  Additionally, the city expects to see a drop of over $1 million in investment revenue in 2027 due
  to previously invested ARPA and Consentino borrowing proceeds. Permit fees have declined
  significantly because the major construction projects currently in progress were issued in earlier
  fiscal years. State aid has also fallen short of projections, with only a 2.3% increase in Chapter
  70 funding, <strong>a $4.5 million reduction from early estimates,</strong> and a disappointing 0.76%
  rise in Unrestricted General Government Aid, coupled with a 6.76% increase in state assessments (charges
  to the city).
</p>

<p>
  These lower-than-anticipated revenue estimates have intensified pressure on property taxes,
  necessitating the use of an additional $1.1 million from the city's tax <GlossaryTerm term="Levy"
    >levy</GlossaryTerm
  > reserve. This action will diminish the excess reserve to just $1.48 million. Budget forecasts indicate
  that this reserve may be nearly exhausted by 2028, assuming continued departmental increases of 2.5%,
  estimated employee benefits rising by 4.5%, and revenue increasing by 3.2%.
</p>

<h2>Historical State Aid &amp; State Assessments</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2023 Final Conference Committee</th>
      <th scope="col">2024 FINAL Conference Committee</th>
      <th scope="col">2024 % Change</th>
      <th scope="col">2025 FINAL Conference Committee</th>
      <th scope="col">2025 % Change</th>
      <th scope="col">2026 FINAL Conference Committee</th>
      <th scope="col">2026 % Change</th>
      <th scope="col">2027 Governor's Budget</th>
      <th scope="col">2027 House Budget</th>
      <th scope="col">2027 % Change</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Chapter 70</th><td>$73,906,310</td><td>$82,633,811</td><td>11.8%</td><td
        >$87,968,052</td
      ><td>6.5%</td><td>$94,219,635</td><td>7.1%</td><td>$96,427,042</td><td>$96,427,042</td><td
        >2.3%</td
      ></tr
    >
    <tr
      ><th scope="row">Charter Tuition Reimbursement</th><td>$1,611,461</td><td>$1,377,211</td><td
        >-14.5%</td
      ><td>$1,345,511</td><td>-2.3%</td><td>$787,542</td><td>-41.5%</td><td>$1,170,508</td><td
        >$942,297</td
      ><td>19.7%</td></tr
    >
    <tr
      ><th scope="row">Veterans Benefits</th><td>$411,550</td><td>$381,368</td><td>-7.3%</td><td
        >$356,397</td
      ><td>-6.5%</td><td>$457,435</td><td>28.3%</td><td>$409,676</td><td>$407,089</td><td>-11.0%</td
      ></tr
    >
    <tr
      ><th scope="row">Elderly &amp; Veterans Exemptions</th><td>$201,319</td><td>$189,452</td><td
        >-5.9%</td
      ><td>$193,696</td><td>2.2%</td><td>$333,805</td><td>72.3%</td><td>$347,433</td><td
        >$347,433</td
      ><td>4.1%</td></tr
    >
    <tr
      ><th scope="row">State Owned Land</th><td>$1,445</td><td>$1,714</td><td>18.6%</td><td
        >$1,754</td
      ><td>2.3%</td><td>$1,754</td><td>0.0%</td><td>$1,799</td><td>$1,794</td><td>2.3%</td></tr
    >
    <tr
      ><th scope="row">Unrestricted General Government Aid</th><td>$11,385,053</td><td
        >$11,749,375</td
      ><td>3.2%</td><td>$12,101,856</td><td>3.0%</td><td>$12,234,976</td><td>1.1%</td><td
        >$12,540,132</td
      ><td>$12,327,448</td><td>0.8%</td></tr
    >
    <tr
      ><th scope="row">Sub-Total Cherry Sheet Receipts</th><td>$87,517,138</td><td>$96,332,931</td
      ><td>10.1%</td><td>$101,967,266</td><td>5.8%</td><td>$108,035,147</td><td>6.0%</td><td
        >$110,896,590</td
      ><td>$110,453,103</td><td>2.2%</td></tr
    >
    <tr
      ><th scope="row"><em>OFFSET ITEMS: School Choice &amp; Library</em></th><td>$246,346</td><td
        >$247,461</td
      ><td>0.5%</td><td>$253,042</td><td>2.3%</td><td>$231,585</td><td>-8.5%</td><td>$236,856</td
      ><td>$229,856</td><td>-0.7%</td></tr
    >
    <tr
      ><th scope="row">Total Cherry Sheet Receipts</th><td>$87,763,484</td><td>$96,580,392</td><td
        >10.0%</td
      ><td>$102,220,308</td><td>5.8%</td><td>$108,266,732</td><td>5.9%</td><td>$111,133,446</td><td
        >$110,682,959</td
      ><td>2.2%</td></tr
    >
    <tr
      ><th scope="row">Assessments - SPECIAL EDUCATION</th><td>$(77,160)</td><td>$(48,662)</td><td
        >-36.9%</td
      ><td>$(43,634)</td><td>-10.3%</td><td>$(38,054)</td><td>-12.8%</td><td>$(38,077)</td><td
        >$(38,531)</td
      ><td>1.3%</td></tr
    >
    <tr
      ><th scope="row">Assessments - SCHOOL CHOICE SENDING</th><td>$(1,010,851)</td><td
        >$(986,813)</td
      ><td>-2.4%</td><td>$(1,081,431)</td><td>9.6%</td><td>$(1,237,105)</td><td>14.4%</td><td
        >$(1,761,487)</td
      ><td>$(1,398,390)</td><td>13.0%</td></tr
    >
    <tr
      ><th scope="row">Assessments - CHARTER SCHOOL</th><td>$(6,113,639)</td><td>$(6,651,955)</td
      ><td>8.8%</td><td>$(7,027,626)</td><td>5.6%</td><td>$(7,119,904)</td><td>1.3%</td><td
        >$(7,645,932)</td
      ><td>$(7,576,328)</td><td>6.4%</td></tr
    >
    <tr
      ><th scope="row">Assessments - AIR POLLUTION DISTRICTS</th><td>$(19,010)</td><td>$(19,743)</td
      ><td>3.9%</td><td>$(20,202)</td><td>2.3%</td><td>$(21,072)</td><td>4.3%</td><td>$(19,979)</td
      ><td>$(19,979)</td><td>-5.2%</td></tr
    >
    <tr
      ><th scope="row">Assessments - RMV NON-RENEWAL</th><td>$(126,140)</td><td>$(100,280)</td><td
        >-20.5%</td
      ><td>$(124,500)</td><td>24.2%</td><td>$(124,500)</td><td>0.0%</td><td>$(130,180)</td><td
        >$(130,180)</td
      ><td>4.6%</td></tr
    >
    <tr
      ><th scope="row">Assessments - MBTA</th><td>$(850,089)</td><td>$(871,341)</td><td>2.5%</td><td
        >$(893,125)</td
      ><td>2.5%</td><td>$(919,762)</td><td>3.0%</td><td>$(942,755)</td><td>$(942,755)</td><td
        >2.5%</td
      ></tr
    >
    <tr
      ><th scope="row">Assessments - MOSQUITO CONTROL</th><td>$(144,859)</td><td>$(148,317)</td><td
        >2.4%</td
      ><td>$(153,875)</td><td>3.7%</td><td>$(160,649)</td><td>4.4%</td><td>$(165,272)</td><td
        >$(165,272)</td
      ><td>2.9%</td></tr
    >
    <tr
      ><th scope="row">Total Cherry Sheet Assessments</th><td>$(8,341,748)</td><td>$(8,827,111)</td
      ><td>5.8%</td><td>$(9,344,393)</td><td>5.9%</td><td>$(9,621,046)</td><td>3.0%</td><td
        >$(10,703,682)</td
      ><td>$(10,271,435)</td><td>6.8%</td></tr
    >
    <tr
      ><th scope="row">TOTAL ESTIMATED CHERRY SHEET LESS OFFSETS &amp; ASSESSMENTS</th><td
        >$79,421,736</td
      ><td>$87,753,281</td><td>10.5%</td><td>$92,875,915</td><td>5.8%</td><td>$98,645,686</td><td
        >6.2%</td
      ><td>$100,429,764</td><td>$100,411,524</td><td>1.8%</td></tr
    >
  </tbody>
</table>

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

<h2>What is the Tax Levy &amp; Prop 2&frac12;</h2>

<p>
  The property tax <GlossaryTerm term="Levy">levy</GlossaryTerm> is the revenue a community can raise
  through real and personal property taxes. In Massachusetts, municipal <GlossaryTerm
    term="Revenues">revenues</GlossaryTerm
  > support local spending for schools, public safety, and other public services, which are raised through
  the property tax <GlossaryTerm term="Levy">levy</GlossaryTerm>, state aid, local receipts, and
  other sources. The property tax <GlossaryTerm term="Levy">levy</GlossaryTerm> is the largest source
  of revenue for most cities and towns.
</p>

<p>
  Proposition 2 &frac12; places constraints on the amount of <GlossaryTerm term="Levy"
    >levy</GlossaryTerm
  > a city or town can raise and on how much the <GlossaryTerm term="Levy">levy</GlossaryTerm> can be
  increased from year to year. A community cannot <GlossaryTerm term="Levy">levy</GlossaryTerm> more than
  2.5 percent of the total full and fair cash value of all taxable real and personal property in the community.
  This is known as the <GlossaryTerm term="Levy Ceiling">levy ceiling</GlossaryTerm>. A community's <GlossaryTerm
    term="Levy">levy</GlossaryTerm
  > is also constrained in that it can only increase by a certain amount from year to year. This is known
  as the <GlossaryTerm term="Levy Limit">levy limit</GlossaryTerm>. The levy limit will always be
  below, or at most, equal to the <GlossaryTerm term="Levy Ceiling">levy ceiling</GlossaryTerm>. The
  levy limit may not exceed the <GlossaryTerm term="Levy Ceiling">levy ceiling</GlossaryTerm>.
</p>

<h3>Increases in the levy limit may result from the following:</h3>

<ul>
  <li>
    Each year, a community's <GlossaryTerm term="Levy Limit">levy limit</GlossaryTerm> automatically increases
    by 2.5 percent over the previous year's <GlossaryTerm term="Levy Limit">levy limit</GlossaryTerm
    >. This does not require any action from local officials; the Department of Revenue calculates
    this increase automatically.
  </li>
  <li>
    A community can increase its <GlossaryTerm term="Levy Limit">levy limit</GlossaryTerm> each year to
    reflect <GlossaryTerm term="New Growth">new growth</GlossaryTerm> in the tax base. Assessors must
    submit information on growth in the tax base for approval by the Department of Revenue as part of
    the <GlossaryTerm term="Tax Rate">tax rate</GlossaryTerm>-setting process.
  </li>
  <li>
    A community can increase its <GlossaryTerm term="Levy Limit">levy limit</GlossaryTerm> by successfully
    voting an <GlossaryTerm term="Override">override</GlossaryTerm>. The amount of the <GlossaryTerm
      term="Override">override</GlossaryTerm
    > becomes part of the <GlossaryTerm term="Levy Limit">levy limit</GlossaryTerm> base.
  </li>
</ul>

<p>
  <em>
    Debt exclusions and capital outlay exclusions enable a community to permanently or temporarily
    increase its <GlossaryTerm term="Levy Limit">levy limit</GlossaryTerm> or <GlossaryTerm
      term="Levy Ceiling">levy ceiling</GlossaryTerm
    >. A 2/3 vote of the city council is needed to place an exclusion question on the ballot for
    community vote. A majority vote is then needed for the exclusion to pass.
  </em>
</p>

<h2>Challenges of Prop 2 &frac12; with High Inflation</h2>

<p>
  The 2.5 percent cap on annual property tax increases doesn't include any kind of adjustment for
  inflation. A 2.5 percent increase in tax receipts is a lot more manageable in a low-inflation
  environment, when costs are growing 1-2 percent per year, as they did through the 2010s. When
  costs grow over 3 percent per year, as they have since COVID, cities and towns are effectively
  obligated to cut real spending every year.
</p>

<p>
  Proposition 2&frac12; was intended to limit local spending, but real spending growth of 0.6
  percent per year suggests the constraints may be too restrictive. This austere growth in spending
  has made it extremely difficult for cities and towns to attract staff, repair roads, and generally
  <GlossaryTerm term="Fund">fund</GlossaryTerm> the essential services their residents demand.
</p>

<h2>Prop 2 &frac12; Calculation</h2>

<ul>
  <li>
    The calculation for the Prop. 2&frac12; <GlossaryTerm term="Levy Limit">Levy Limit</GlossaryTerm
    > begins by taking the previous <GlossaryTerm term="Fiscal Year">fiscal year</GlossaryTerm>'s <GlossaryTerm
      term="Levy Limit">levy limit</GlossaryTerm
    > and applying a 2.5% increase. This amount serves as the Levy Base for the current
    <GlossaryTerm term="Fiscal Year">fiscal year</GlossaryTerm>.
  </li>
  <li>
    Next, "<GlossaryTerm term="New Growth">New Growth</GlossaryTerm>" is incorporated into the <GlossaryTerm
      term="Levy">levy</GlossaryTerm
    > base. "<GlossaryTerm term="New Growth">New Growth</GlossaryTerm>" refers to the increase in
    property tax revenue due to new construction, subdivisions, renovations, or previously exempt
    properties returning to the tax rolls. This allows municipalities to raise their <GlossaryTerm
      term="Levy Limit">levy limit</GlossaryTerm
    >
    beyond the standard 2.5%. It represents the additional tax capacity resulting from physical growth,
    separate from market-value increases from revaluations.
  </li>
  <li>
    Lastly, Debt Exclusions are added, and the total of the <GlossaryTerm term="Levy"
      >levy</GlossaryTerm
    > base, <GlossaryTerm term="New Growth">New Growth</GlossaryTerm>, and Debt Exclusion(s)
    establishes the Total Available Levy Limit that a city or town can tax up to in any given <GlossaryTerm
      term="Fiscal Year">fiscal year</GlossaryTerm
    >.
  </li>
</ul>

<table>
  <caption>Illustration of Levy Limit Calculation and Usage</caption>
  <thead>
    <tr>
      <th scope="col">Tax Levy Calculation</th>
      <th scope="col">2026</th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">1. Prior Year Levy Limit</th><td>$132,973,124</td><td>$138,288,883</td><td
        >$142,946,105</td
      ><td>$147,743,758</td><td>$152,685,832</td><td>$157,776,427</td></tr
    >
    <tr
      ><th scope="row">2. 2 1/2% Increase</th><td>$3,324,328</td><td>$3,457,222</td><td
        >$3,573,653</td
      ><td>$3,693,594</td><td>$3,817,146</td><td>$3,944,411</td></tr
    >
    <tr
      ><th scope="row">3. Plus New Growth</th><td>$1,991,431</td><td>$1,200,000</td><td
        >$1,224,000</td
      ><td>$1,248,480</td><td>$1,273,450</td><td>$1,298,919</td></tr
    >
    <tr
      ><th scope="row">4. Sub-Total Levy Limit</th><td>$138,288,883</td><td>$142,946,105</td><td
        >$147,743,758</td
      ><td>$152,685,832</td><td>$157,776,427</td><td>$163,019,757</td></tr
    >
    <tr
      ><th scope="row">5. Plus Issued Debt Exclusion</th><td>$4,640,402</td><td>$4,644,131</td><td
        >$4,635,006</td
      ><td>$4,644,411</td><td>$4,645,206</td><td>$4,642,494</td></tr
    >
    <tr
      ><th scope="row">5a. Plus Future Authorized Debt Exclusion Consentino Est Add'l $10M</th><td
        >&ndash;</td
      ><td>&ndash;</td><td>$400,000</td><td>$400,000</td><td>$400,000</td><td>$400,000</td></tr
    >
    <tr
      ><th scope="row">6. Total Available Levy</th><td>$142,929,285</td><td>$147,590,236</td><td
        >$152,778,764</td
      ><td>$157,730,243</td><td>$162,821,634</td><td>$168,062,250</td></tr
    >
    <tr
      ><th scope="row">7. Levy Amount Used</th><td>$140,340,389</td><td>$146,107,374</td><td
        >$150,928,917</td
      ><td>$155,909,572</td><td>$160,898,678</td><td>$166,047,436</td></tr
    >
    <tr
      ><th scope="row">8. Excess Levy Capacity</th><td>$2,588,896</td><td>$1,482,862</td><td
        >$1,849,847</td
      ><td>$1,820,671</td><td>$1,922,956</td><td>$2,014,815</td></tr
    >
    <tr
      ><th scope="row"><em>Excess Levy as % of Available Levy</em></th><td>1.8%</td><td>1.0%</td><td
        >1.2%</td
      ><td>1.2%</td><td>1.2%</td><td>1.2%</td></tr
    >
    <tr
      ><th scope="row"><em>Annual Levy Use Increase</em></th><td>5.2%</td><td>4.1%</td><td>3.3%</td
      ><td>3.3%</td><td>3.2%</td><td>3.2%</td></tr
    >
  </tbody>
</table>

<h2>Local Revenue Receipts</h2>

<p>
  Local revenue receipts are funds generated at the local level, aside from property taxes. Some of
  the most common types of local receipts include excise taxes, regulatory fees (such as fines,
  licenses, and permits), user fees (for services such as water, sewer, and garbage), departmental
  <GlossaryTerm term="Revenues">revenues</GlossaryTerm>, and investment income. Typically, local
  receipts are deposited into the community's
  <GlossaryTerm term="General Fund">general fund</GlossaryTerm> unless they are designated for specific
  departmental uses in accordance with state regulations.
</p>

<p>
  Certain local receipts are mandated by law (for example, motor vehicle excise taxes, hunting
  licenses, and firearms permits), while others can be negotiated (such as investment income and
  payments in lieu of taxes). Additionally, some revenue sources are established through the
  adoption of local ordinances or bylaws. With user fees, a community can set charges that either
  partially or fully <GlossaryTerm term="Fund">fund</GlossaryTerm> a particular service, and periodically
  reassess them to ensure an adequate revenue stream to support those services.
</p>

<h2>Local Excise Taxes</h2>

<p>
  Motor vehicle excise tax represents the city's largest single source of local revenue. Up until
  February 2026, this category experienced a substantial year-over-year decline of over 22%.
  However, in March, there was a notable recovery as the majority of the city's motor vehicle excise
  tax was collected. Initially, revenue estimates suggested that this category would remain flat in
  2027; however, following the results from March's collections, we felt confident enough to
  increase this estimate by 6.5%.
</p>

<p>In addition to motor vehicle excise, the city has also implemented:</p>

<ul>
  <li>A 3% cannabis excise tax</li>
  <li>A 0.75% meals tax</li>
  <li>A 6% room tax</li>
</ul>

<p>
  Furthermore, per state regulations, there is a 1% boat excise tax, of which 50% of the annual
  revenue is allocated to the Waterways <GlossaryTerm term="Revolving Fund"
    >Revolving Fund</GlossaryTerm
  >. This fund can be utilized for harbor and waterway maintenance, infrastructure improvements, and
  enhancing boating safety.
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Excise</th>
      <th scope="col">2023 Actual</th>
      <th scope="col">2024 Actual</th>
      <th scope="col">2024 % Change</th>
      <th scope="col">2025 Actual</th>
      <th scope="col">2025 % Change</th>
      <th scope="col">2026 Projected</th>
      <th scope="col">2027 Proposed</th>
      <th scope="col">2027 % Change</th>
      <th scope="col">2027 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Boat Excise</th><td>$9,246</td><td>$9,938</td><td>7.5%</td><td>$6,991</td><td
        >-29.7%</td
      ><td>$8,497</td><td>$6,900</td><td>-18.8%</td><td>$(1,597)</td></tr
    >
    <tr
      ><th scope="row">Cannabis Excise</th><td>$1,143,086</td><td>$1,180,917</td><td>3.3%</td><td
        >$1,155,574</td
      ><td>-2.1%</td><td>$1,133,040</td><td>$1,133,040</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Farm Animal Excise</th><td>$1,953</td><td>$2,358</td><td>20.8%</td><td
        >$1,506</td
      ><td>-36.1%</td><td></td><td>$1,500</td><td>0.0%</td><td>$1,500</td></tr
    >
    <tr
      ><th scope="row">Hotel Room Tax</th><td>$345,181</td><td>$311,751</td><td>-9.7%</td><td
        >$316,502</td
      ><td>1.5%</td><td>$309,979</td><td>$310,000</td><td>0.0%</td><td>$21</td></tr
    >
    <tr
      ><th scope="row">Meals Tax</th><td>$1,279,635</td><td>$1,292,616</td><td>1.0%</td><td
        >$1,312,554</td
      ><td>1.5%</td><td>$1,259,948</td><td>$1,300,000</td><td>3.2%</td><td>$40,052</td></tr
    >
    <tr
      ><th scope="row">Motor Vehicle Excise</th><td>$7,700,291</td><td>$8,459,321</td><td>9.9%</td
      ><td>$9,308,339</td><td>10.0%</td><td>$8,477,111</td><td>$9,025,789</td><td>6.5%</td><td
        >$548,678</td
      ></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$10,479,391</td><td>$11,256,901</td><td>7.4%</td><td
        >$12,101,467</td
      ><td>7.5%</td><td>$11,188,575</td><td>$11,777,229</td><td>5.3%</td><td>$588,654</td></tr
    >
  </tbody>
</table>

<h2>Other Local Receipts</h2>

<p>
  A Payment in Lieu of Taxes (PILOT) is a contribution made by tax-exempt organizations or
  government entities to local governments to compensate for the loss of property tax revenue. These
  payments are generally voluntary or based on negotiated agreements, designed to help
  municipalities <GlossaryTerm term="Fund">fund</GlossaryTerm> essential public services, including fire
  safety and infrastructure.
</p>

<h3>Waste Disposal Fee as a PILOT Agreement</h3>

<p>
  One example of a PILOT agreement is the Waste Disposal Fee that the city has with Covanta.
  Currently, the city receives a rate of $4.69 per ton of trash processed at the waste disposal
  facility. With an average monthly tonnage of 53,000, this results in approximately $250,000 in
  monthly revenue for the city.
</p>

<p>Additional PILOT Agreements</p>

<ul>
  <li>Bradford Solar</li>
  <li>NRG DG Haverhill</li>
  <li>Nautilus Solar</li>
  <li>Fondi Road Solar</li>
  <li>BWC Camp Brook</li>
  <li>Kearsarge Haverhill</li>
</ul>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2023 Actual</th>
      <th scope="col">2024 Actual</th>
      <th scope="col">2024 % Change</th>
      <th scope="col">2025 Actual</th>
      <th scope="col">2025 % Change</th>
      <th scope="col">2026 Projected</th>
      <th scope="col">2027 Proposed</th>
      <th scope="col">2027 % Change</th>
      <th scope="col">2027 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Penalties and Interest on Excise</th><td>$92,246</td><td>$105,194</td><td
        >14.0%</td
      ><td>$116,886</td><td>11.1%</td><td>$105,194</td><td>$105,000</td><td>-0.2%</td><td>$(194)</td
      ></tr
    >
    <tr
      ><th scope="row">Penalties and Interest on Taxes</th><td>$517,218</td><td>$695,267</td><td
        >34.4%</td
      ><td>$626,663</td><td>-9.9%</td><td>$637,167</td><td>$637,000</td><td>0.0%</td><td>$(167)</td
      ></tr
    >
    <tr
      ><th scope="row">Payment in Lieu of Taxes</th><td>$16,348</td><td>$16,348</td><td>0.0%</td><td
        >$35,798</td
      ><td>119.0%</td><td>$35,798</td><td>$281,555</td><td>686.5%</td><td>$245,757</td></tr
    >
    <tr
      ><th scope="row">Waste Disposal Facility Payment</th><td>$2,746,258</td><td>$3,163,498</td><td
        >15.2%</td
      ><td>$3,083,604</td><td>-2.5%</td><td>$2,978,566</td><td>$3,023,244</td><td>1.5%</td><td
        >$44,678</td
      ></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$3,372,070</td><td>$3,980,307</td><td>18.0%</td><td
        >$3,862,951</td
      ><td>-2.9%</td><td>$3,756,725</td><td>$4,046,799</td><td>7.7%</td><td>$290,074</td></tr
    >
  </tbody>
</table>

<h2>Fees</h2>

<p>
  User fees are charges designed to partially or fully finance specific services and can be
  periodically evaluated to maintain a sufficient revenue stream for that service. A fee represents
  the cost levied on individuals who utilize or gain benefits from the service. Such fees may be
  implemented when a local government delivers a particular service (like a police detail), grants a
  permit or license, or provides a benefit, such as a recreational program.
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Fees</th>
      <th scope="col">2023 Actual</th>
      <th scope="col">2024 Actual</th>
      <th scope="col">2024 % Change</th>
      <th scope="col">2025 Actual</th>
      <th scope="col">2025 % Change</th>
      <th scope="col">2026 Projected</th>
      <th scope="col">2027 Proposed</th>
      <th scope="col">2027 % Change</th>
      <th scope="col">2027 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Abandoned Property Fee</th><td>$22,750</td><td>$24,500</td><td>7.7%</td><td
        >$19,275</td
      ><td>-21.3%</td><td>$10,000</td><td>$10,000</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Ambulance Fee</th><td>$150,000</td><td>$155,250</td><td>3.5%</td><td
        >$160,684</td
      ><td>3.5%</td><td>$135,770</td><td>$140,000</td><td>3.1%</td><td>$4,230</td></tr
    >
    <tr
      ><th scope="row">Clerk Fees</th><td>$68,883</td><td>$77,035</td><td>11.8%</td><td>$60,178</td
      ><td>-21.9%</td><td>$50,000</td><td>$55,000</td><td>10.0%</td><td>$5,000</td></tr
    >
    <tr
      ><th scope="row">Fire</th><td>$73,465</td><td>$63,440</td><td>-13.6%</td><td>$56,308</td><td
        >-11.2%</td
      ><td>$46,000</td><td>$50,000</td><td>8.7%</td><td>$4,000</td></tr
    >
    <tr
      ><th scope="row">Fire Detail Admin. Fee</th><td>$7,396</td><td>$6,900</td><td>-6.7%</td><td
        >$11,734</td
      ><td>70.1%</td><td>$8,000</td><td>$10,000</td><td>25.0%</td><td>$2,000</td></tr
    >
    <tr
      ><th scope="row">Planning &amp; Appeals</th><td>$40,981</td><td>$11,585</td><td>-71.7%</td><td
        >$14,600</td
      ><td>26.0%</td><td>$14,000</td><td>$14,000</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Police Detail Administration Fee</th><td>$95,017</td><td>$106,098</td><td
        >11.7%</td
      ><td>$129,193</td><td>21.8%</td><td>$109,000</td><td>$115,000</td><td>5.5%</td><td>$6,000</td
      ></tr
    >
    <tr
      ><th scope="row">Police Misc Fees</th><td>$3,720</td><td>$6,435</td><td>73.0%</td><td
        >$4,215</td
      ><td>-34.5%</td><td>$4,200</td><td>$4,200</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Tax Collection Fees</th><td>$665,771</td><td>$666,186</td><td>0.1%</td><td
        >$695,926</td
      ><td>4.5%</td><td>$585,000</td><td>$600,000</td><td>2.6%</td><td>$15,000</td></tr
    >
    <tr
      ><th scope="row">Waterway Fee</th><td>$870</td><td>$774</td><td>-11.0%</td><td>$735</td><td
        >-5.0%</td
      ><td>$700</td><td>$700</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$1,128,853</td><td>$1,118,203</td><td>-0.9%</td><td
        >$1,152,848</td
      ><td>3.1%</td><td>$962,670</td><td>$998,900</td><td>3.8%</td><td>$36,230</td></tr
    >
  </tbody>
</table>

<h2>Department Revenue</h2>

<p>
  <GlossaryTerm term="Department">Department</GlossaryTerm> revenue consists of funds received by local
  departments&mdash;such as police, public works, and town clerk&mdash;that do not come from property
  taxes, local aid, or specific state grants.
</p>

<p>
  This year, the estimate for cable fees has been lowered for the segment of the franchise fee
  allocated to capital. This reduction will be deposited to the newly established Cable Public
  Access revolving <GlossaryTerm term="Fund">fund</GlossaryTerm>, which was adopted by the City
  Council in 2026.
</p>

<p>
  Medicaid reimbursement (also known as School-Based Medicaid Programs or School-Based Services
  (SBS) claiming) allows local governments to receive federal funds to offset costs for providing
  health-related services&mdash;such as nursing, therapy, and mental health care&mdash;to
  Medicaid-eligible students.
</p>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2023 Actual</th>
      <th scope="col">2024 Actual</th>
      <th scope="col">2024 % Change</th>
      <th scope="col">2025 Actual</th>
      <th scope="col">2025 % Change</th>
      <th scope="col">2026 Projected</th>
      <th scope="col">2027 Proposed</th>
      <th scope="col">2027 % Change</th>
      <th scope="col">2027 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Cable Fee</th><td>$336,306</td><td>$442,891</td><td>31.7%</td><td
        >$530,751</td
      ><td>19.8%</td><td>$303,253</td><td>$200,000</td><td>-34.0%</td><td>$(103,253)</td></tr
    >
    <tr
      ><th scope="row">Compost Revenues</th><td>$23,544</td><td>$23,319</td><td>-1.0%</td><td
        >$20,028</td
      ><td>-14.1%</td><td>$20,000</td><td>$20,000</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Health Services</th><td>$22,549</td><td>$15,385</td><td>-31.8%</td><td
        >$11,620</td
      ><td>-24.5%</td><td>$10,000</td><td>$10,000</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Recycling Revenue</th><td>$26,814</td><td>$53,266</td><td>98.6%</td><td
        >$34,773</td
      ><td>-34.7%</td><td>$30,000</td><td>$30,000</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Refuse Charges</th><td>$123,448</td><td>$144,727</td><td>17.2%</td><td
        >$165,328</td
      ><td>14.2%</td><td>$160,000</td><td>$160,000</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Sale of Trash Bags/Carts</th><td>$139,473</td><td>$137,608</td><td>-1.3%</td
      ><td>$137,002</td><td>-0.4%</td><td>$135,000</td><td>$135,000</td><td>0.0%</td><td>&ndash;</td
      ></tr
    >
    <tr
      ><th scope="row">Lease &amp; Rentals</th><td>$191,513</td><td>$225,058</td><td>17.5%</td><td
        >$199,510</td
      ><td>-11.4%</td><td>$198,450</td><td>$198,450</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">School Medicaid</th><td>$789,022</td><td>$796,530</td><td>1.0%</td><td
        >$1,014,469</td
      ><td>27.4%</td><td>$950,000</td><td>$1,000,000</td><td>5.3%</td><td>$50,000</td></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$1,652,669</td><td>$1,838,782</td><td>11.3%</td><td
        >$2,113,480</td
      ><td>14.9%</td><td>$1,806,703</td><td>$1,753,450</td><td>-2.9%</td><td>$(53,253)</td></tr
    >
  </tbody>
</table>

<h2>License &amp; Permits</h2>

<p>
  Licenses and permits serve as local receipts, reflecting fees imposed for the privilege of
  engaging in specific activities, such as construction, health services, and alcohol sales.
</p>

<p>
  The city has experienced a significant year-over-year decline in licenses and permits, with a drop
  of over 27% as of March 2026, primarily due to a reduction in building permits. This decline is
  attributed to several large projects that were permitted in previous fiscal years. While the city
  remains active in issuing permits, the revenue decrease is largely a result of the scale of these
  ongoing projects.
</p>

<table>
  <thead>
    <tr>
      <th scope="col">License &amp; Permits</th>
      <th scope="col">2023 Actual</th>
      <th scope="col">2024 Actual</th>
      <th scope="col">2024 % Change</th>
      <th scope="col">2025 Actual</th>
      <th scope="col">2025 % Change</th>
      <th scope="col">2026 Projected</th>
      <th scope="col">2027 Proposed</th>
      <th scope="col">2027 % Change</th>
      <th scope="col">2027 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Building Permits</th><td>$2,902,224</td><td>$1,606,758</td><td>-44.6%</td><td
        >$1,784,220</td
      ><td>11.0%</td><td>$1,527,301</td><td>$1,327,000</td><td>-13.1%</td><td>$(200,301)</td></tr
    >
    <tr
      ><th scope="row">Clerk-All Other Licenses</th><td>$315,965</td><td>$308,745</td><td>-2.3%</td
      ><td>$279,885</td><td>-9.3%</td><td>$120,000</td><td>$250,000</td><td>108.3%</td><td
        >$130,000</td
      ></tr
    >
    <tr
      ><th scope="row">Constable License Fee</th><td>$1,285</td><td>$900</td><td>-30.0%</td><td
        >$821</td
      ><td>-8.8%</td><td>$680</td><td></td><td>-100.0%</td><td>$(680)</td></tr
    >
    <tr
      ><th scope="row">Fire</th><td>$107,070</td><td>$109,565</td><td>2.3%</td><td>$108,353</td><td
        >-1.1%</td
      ><td>$80,000</td><td>$90,000</td><td>12.5%</td><td>$10,000</td></tr
    >
    <tr
      ><th scope="row">Gas</th><td>$62,481</td><td>$72,741</td><td>16.4%</td><td>$59,910</td><td
        >-17.6%</td
      ><td>$50,000</td><td>$50,000</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Health Licenses</th><td>$254,985</td><td>$253,685</td><td>-0.5%</td><td
        >$202,056</td
      ><td>-20.4%</td><td>$150,000</td><td>$175,000</td><td>16.7%</td><td>$25,000</td></tr
    >
    <tr
      ><th scope="row">Liquor License</th><td>$95,529</td><td>$96,740</td><td>1.3%</td><td
        >$100,931</td
      ><td>4.3%</td><td>$80,931</td><td>$90,000</td><td>11.2%</td><td>$9,069</td></tr
    >
    <tr
      ><th scope="row">Marriage</th><td>$18,050</td><td>$24,071</td><td>33.4%</td><td>$47,005</td
      ><td>95.3%</td><td>$40,000</td><td>$42,000</td><td>5.0%</td><td>$2,000</td></tr
    >
    <tr
      ><th scope="row">Plumbing</th><td>$116,270</td><td>$191,580</td><td>64.8%</td><td>$83,140</td
      ><td>-56.6%</td><td>$75,000</td><td>$95,000</td><td>26.7%</td><td>$20,000</td></tr
    >
    <tr
      ><th scope="row">Sealer Weights &amp; Measures</th><td>$22,005</td><td>$29,417</td><td
        >33.7%</td
      ><td>$16,300</td><td>-44.6%</td><td>$16,000</td><td>$16,000</td><td>0.0%</td><td>&ndash;</td
      ></tr
    >
    <tr
      ><th scope="row">Wire Inspector</th><td>$202,515</td><td>$348,283</td><td>72.0%</td><td
        >$205,774</td
      ><td>-40.9%</td><td>$150,000</td><td>$165,000</td><td>10.0%</td><td>$15,000</td></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$4,098,379</td><td>$3,042,484</td><td>-25.8%</td><td
        >$2,888,395</td
      ><td>-5.1%</td><td>$2,289,912</td><td>$2,300,000</td><td>0.4%</td><td>$10,088</td></tr
    >
  </tbody>
</table>

<h2>Fines &amp; Investments</h2>

<p>
  Parking meter revenue estimates have been increased due to an uptick in collections between March
  2025 and 2026.
</p>

<p>
  Investment income has been reduced as ARPA and borrowing proceeds will no longer be available for
  investment in 2027.
</p>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2023 Actual</th>
      <th scope="col">2024 Actual</th>
      <th scope="col">2024 % Change</th>
      <th scope="col">2025 Actual</th>
      <th scope="col">2025 % Change</th>
      <th scope="col">2026 Projected</th>
      <th scope="col">2027 Proposed</th>
      <th scope="col">2027 % Change</th>
      <th scope="col">2027 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Court Fines</th><td>$29,824</td><td>$133,075</td><td>346.2%</td><td
        >$183,522</td
      ><td>37.9%</td><td>$130,000</td><td>$144,000</td><td>10.8%</td><td>$14,000</td></tr
    >
    <tr
      ><th scope="row">Non Criminal Fines</th><td>$3,860</td><td>$5,130</td><td>32.9%</td><td
        >$6,550</td
      ><td>27.7%</td><td>$6,550</td><td>$5,000</td><td>-23.7%</td><td>$(1,550)</td></tr
    >
    <tr
      ><th scope="row">Parking Fines</th><td>$248,148</td><td>$241,899</td><td>-2.5%</td><td
        >$263,531</td
      ><td>8.9%</td><td>$270,825</td><td>$227,000</td><td>-16.2%</td><td>$(43,825)</td></tr
    >
    <tr
      ><th scope="row">Parking Meters</th><td>$561,447</td><td>$319,171</td><td>-43.2%</td><td
        >$196,126</td
      ><td>-38.6%</td><td>$196,125</td><td>$230,000</td><td>17.3%</td><td>$33,875</td></tr
    >
    <tr
      ><th scope="row">Towing Fines</th><td>$23,750</td><td>$26,175</td><td>10.2%</td><td
        >$24,775</td
      ><td>-5.3%</td><td>$24,775</td><td>$19,000</td><td>-23.3%</td><td>$(5,775)</td></tr
    >
    <tr
      ><th scope="row">Investment Income</th><td>$1,606,088</td><td>$3,222,599</td><td>100.6%</td
      ><td>$3,120,502</td><td>-3.2%</td><td>$1,976,991</td><td>$1,000,000</td><td>-49.4%</td><td
        >$(976,991)</td
      ></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$2,473,117</td><td>$3,948,049</td><td>59.6%</td><td
        >$3,795,006</td
      ><td>-3.9%</td><td>$2,605,266</td><td>$1,625,000</td><td>-37.6%</td><td>$(980,266)</td></tr
    >
  </tbody>
</table>

<h2>Other Available Revenue</h2>

<p>
  This revenue group comprises <GlossaryTerm term="Free Cash">free cash</GlossaryTerm> used to support
  the <GlossaryTerm term="Operating Budget">operating budget</GlossaryTerm>, indirect receipts from <GlossaryTerm
    term="Enterprise Funds">Enterprise funds</GlossaryTerm
  > for administrative overhead reimbursement, and funding from the Hospital Trust fund, which subsidizes
  the Public Health department.
</p>

<p>
  Since 2025, the city has made a concerted effort to reduce the annual allocation from <GlossaryTerm
    term="Free Cash">free cash</GlossaryTerm
  >, aligning with the current administration's goal. By decreasing reliance on <GlossaryTerm
    term="Free Cash">free cash</GlossaryTerm
  > (one-time funds) for recurring expenses, this strategy aims to foster a structurally sustainable <GlossaryTerm
    term="Operating Budget">operating budget</GlossaryTerm
  >.
</p>

<p>
  In Massachusetts, <GlossaryTerm term="Free Cash">Free Cash</GlossaryTerm> is a certified, unrestricted
  revenue source that represents unspent funds from the previous <GlossaryTerm term="Fiscal Year"
    >fiscal year</GlossaryTerm
  >'s operations. It is calculated by the Department of Revenue's (DOR) Division of Local Services
  and is generated when actual <GlossaryTerm term="Revenues">revenues</GlossaryTerm> exceed budget estimates,
  and <GlossaryTerm term="Expenditures">expenditures</GlossaryTerm> are lower than appropriations.
</p>

<BudgetTable table={OTHER_AVAILABLE} />

<!-- Page 64, "2027 Revenue Summary": the same year's revenue rolled up, after
     the estimates that build it. Its own printed headings, unchanged. -->
<h2>Summary of General Fund Revenue &mdash; 2.9% Increase</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2022 Actual</th>
      <th scope="col">2023 Actual</th>
      <th scope="col">2024 Actual</th>
      <th scope="col">25 Actual</th>
      <th scope="col">22 to 25 Average Annual %</th>
      <th scope="col">2026 Adopted Budget</th>
      <th scope="col">2027 Projected</th>
      <th scope="col">2027 % Change</th>
      <th scope="col">2027 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">7. Levy Amount Used</th><td>$115,387,595</td><td>$119,052,946</td><td
        >$123,093,875</td
      ><td>$133,336,191</td><td>15.6%</td><td>$140,340,389</td><td>$146,107,374</td><td>4.1%</td><td
        >$5,766,985</td
      ></tr
    >
    <tr
      ><th scope="row">FEES</th><td>$1,120,263</td><td>$1,128,853</td><td>$1,118,203</td><td
        >$1,157,268</td
      ><td>3.3%</td><td>$962,670</td><td>$998,900</td><td>3.8%</td><td>$36,230</td></tr
    >
    <tr
      ><th scope="row">FINES &amp; FORFEITS</th><td>$738,716</td><td>$867,029</td><td>$725,450</td
      ><td>$674,504</td><td>-8.7%</td><td>$628,275</td><td>$625,000</td><td>-0.5%</td><td
        >$(3,275)</td
      ></tr
    >
    <tr
      ><th scope="row">INVESTMENTS</th><td>$282,915</td><td>$1,606,088</td><td>$3,222,599</td><td
        >$3,120,502</td
      ><td>1003.0%</td><td>$1,976,991</td><td>$1,000,000</td><td>-49.4%</td><td>$(976,991)</td></tr
    >
    <tr
      ><th scope="row">LICENSE &amp; PERMITS</th><td>$3,678,439</td><td>$4,098,379</td><td
        >$3,042,484</td
      ><td>$2,888,395</td><td>-21.5%</td><td>$2,289,912</td><td>$2,300,000</td><td>0.4%</td><td
        >$10,088</td
      ></tr
    >
    <tr
      ><th scope="row">MEDICAID REIMBURSEMENT</th><td>$1,069,782</td><td>$789,022</td><td
        >$796,530</td
      ><td>$1,014,469</td><td>-5.2%</td><td>$950,000</td><td>$1,000,000</td><td>5.3%</td><td
        >$50,000</td
      ></tr
    >
    <tr
      ><th scope="row">MISC REV</th><td>$1,782,442</td><td>$212,916</td><td>$97,122</td><td
        >$257,755</td
      ><td>-85.5%</td><td></td><td></td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">Motor Vehicle Excise</th><td>$7,620,870</td><td>$7,700,291</td><td
        >$8,459,321</td
      ><td>$9,308,339</td><td>22.1%</td><td>$8,477,111</td><td>$9,025,789</td><td>6.5%</td><td
        >$548,678</td
      ></tr
    >
    <tr
      ><th scope="row">OTHER AVAILABLE REVENUE</th><td>$6,539,817</td><td>$7,717,830</td><td
        >$7,065,921</td
      ><td>$6,290,257</td><td>-3.8%</td><td>$6,233,062</td><td>$6,210,304</td><td>-0.4%</td><td
        >$(22,758)</td
      ></tr
    >
    <tr
      ><th scope="row">OTHER DEPT REVENUE</th><td>$707,963</td><td>$672,134</td><td>$817,194</td><td
        >$899,501</td
      ><td>27.1%</td><td>$658,253</td><td>$555,000</td><td>-15.7%</td><td>$(103,253)</td></tr
    >
    <tr
      ><th scope="row">OTHER EXCISE</th><td>$2,507,796</td><td>$2,779,100</td><td>$2,797,580</td><td
        >$2,793,127</td
      ><td>11.4%</td><td>$2,711,464</td><td>$2,751,440</td><td>1.5%</td><td>$39,976</td></tr
    >
    <tr
      ><th scope="row">PENALTIES &amp; INTEREST</th><td>$473,484</td><td>$609,464</td><td
        >$800,461</td
      ><td>$743,548</td><td>57.0%</td><td>$742,361</td><td>$742,000</td><td>0.0%</td><td>$(361)</td
      ></tr
    >
    <tr
      ><th scope="row">PILOT/WASTE DISPOSAL FEE</th><td>$2,603,112</td><td>$2,762,606</td><td
        >$3,179,846</td
      ><td>$3,119,403</td><td>19.8%</td><td>$3,014,364</td><td>$3,304,799</td><td>9.6%</td><td
        >$290,435</td
      ></tr
    >
    <tr
      ><th scope="row">RENTALS</th><td>$152,470</td><td>$191,513</td><td>$225,058</td><td
        >$199,510</td
      ><td>30.9%</td><td>$198,450</td><td>$198,450</td><td>0.0%</td><td>&ndash;</td></tr
    >
    <tr
      ><th scope="row">STATE AID (CHERRY SHEET)</th><td>$77,470,801</td><td>$87,517,136</td><td
        >$96,332,931</td
      ><td>$102,119,697</td><td>31.8%</td><td>$108,035,147</td><td>$110,453,103</td><td>2.2%</td><td
        >$2,417,956</td
      ></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$222,136,464</td><td>$237,705,306</td><td
        >$251,774,575</td
      ><td>$267,922,466</td><td>20.6%</td><td>$277,218,449</td><td>$285,272,159</td><td>2.9%</td><td
        >$8,053,710</td
      ></tr
    >
  </tbody>
</table>

<h2>2027 General Fund Revenue Estimate &mdash; $285,272,159</h2>

<!-- A pie chart; its slice labels are the only text on the page. -->
<table>
  <tbody>
    <tr><th scope="row">Tax Levy</th><td>$146,107,374</td><td>52%</td></tr>
    <tr><th scope="row">State Aid</th><td>$110,453,103</td><td>39%</td></tr>
    <tr><th scope="row">All Other Local Receipts</th><td>$13,475,589</td><td>5%</td></tr>
    <tr><th scope="row">Motor Vehicle Excise</th><td>$9,025,789</td><td>3%</td></tr>
    <tr><th scope="row">All Other Excise</th><td>$2,751,440</td><td>1%</td></tr>
  </tbody>
</table>

<h2>Revenue Forecast</h2>

<blockquote>
  <p>
    "It is important to recognize that forecasting is more an art than an exact science. A simple,
    commonsense approach may be just as useful and accurate as an intricate, econometric model."
  </p>
  <p>"Accuracy declines rapidly as you move beyond five years."</p>
</blockquote>

<p>
  Massachusetts Department of Revenue, Division of Local Services, <GlossaryTerm
    term="Annual Budget">Annual Budget</GlossaryTerm
  > Best Practices, Revenue &amp; Expenditure Forecasting
</p>

<!-- Page 67, "10-Year Revenue Forecast": where the same revenue is going, after
     the summary of where it is. Its own printed heading, unchanged. -->
<!--
  The book prints this as two tables of five years each, on facing pages, under
  the heading "10-Year Revenue Projection". They are one forecast and the rows
  are identical, so the ten years are joined here. Row 13 and row 16 are
  missing from the book's own numbering.
-->
<h2>10-Year Revenue Projection</h2>

<table>
  <thead>
    <tr>
      <th scope="col">Revenue</th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
      <th scope="col">2032</th>
      <th scope="col">2033</th>
      <th scope="col">2034</th>
      <th scope="col">2035</th>
      <th scope="col">2036</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">1. TAX LEVY</th><td>$146,107,374</td><td>$150,928,917</td><td
        >$155,909,572</td
      ><td>$160,898,678</td><td>$166,047,436</td><td>$171,360,954</td><td>$176,844,504</td><td
        >$182,503,528</td
      ><td>$188,343,641</td><td>$194,370,638</td></tr
    >
    <tr
      ><th scope="row">2. MOTORVEHICLE EXCISE</th><td>$9,025,789</td><td>$9,116,047</td><td
        >$9,298,367</td
      ><td>$9,577,319</td><td>$9,960,411</td><td>$10,358,828</td><td>$10,773,181</td><td
        >$11,204,108</td
      ><td>$11,652,272</td><td>$12,118,363</td></tr
    >
    <tr
      ><th scope="row">3. OTHER EXCISE</th><td>$2,751,440</td><td>$2,820,226</td><td>$2,904,833</td
      ><td>$3,006,502</td><td>$3,126,762</td><td>$3,251,832</td><td>$3,381,906</td><td
        >$3,517,182</td
      ><td>$3,657,869</td><td>$3,804,184</td></tr
    >
    <tr
      ><th scope="row">4. PENALTIES &amp; INTEREST</th><td>$742,000</td><td>$764,260</td><td
        >$787,188</td
      ><td>$810,803</td><td>$835,128</td><td>$860,181</td><td>$885,987</td><td>$912,566</td><td
        >$939,943</td
      ><td>$968,142</td></tr
    >
    <tr
      ><th scope="row">5. PILOT &amp; WASTE DISPOSAL FEE</th><td>$3,304,799</td><td>$3,387,419</td
      ><td>$3,489,042</td><td>$3,593,713</td><td>$3,701,525</td><td>$3,812,570</td><td
        >$3,926,948</td
      ><td>$4,044,756</td><td>$4,166,099</td><td>$4,291,082</td></tr
    >
    <tr
      ><th scope="row">6. FEES</th><td>$998,900</td><td>$1,018,878</td><td>$1,039,256</td><td
        >$1,060,041</td
      ><td>$1,081,241</td><td>$1,102,866</td><td>$1,124,924</td><td>$1,147,422</td><td
        >$1,170,371</td
      ><td>$1,193,778</td></tr
    >
    <tr
      ><th scope="row">7. RENTALS</th><td>$198,450</td><td>$204,404</td><td>$210,536</td><td
        >$216,852</td
      ><td>$223,357</td><td>$230,058</td><td>$236,960</td><td>$244,068</td><td>$251,391</td><td
        >$258,932</td
      ></tr
    >
    <tr
      ><th scope="row">8. OTHER DEPT. REVENUE</th><td>$555,000</td><td>$568,875</td><td>$583,097</td
      ><td>$597,674</td><td>$612,616</td><td>$627,932</td><td>$643,630</td><td>$659,721</td><td
        >$676,214</td
      ><td>$693,119</td></tr
    >
    <tr
      ><th scope="row">9. MEDICAID REIMBURSEMENT</th><td>$1,000,000</td><td>$1,025,000</td><td
        >$1,050,625</td
      ><td>$1,082,144</td><td>$1,114,608</td><td>$1,148,046</td><td>$1,182,488</td><td
        >$1,217,962</td
      ><td>$1,254,501</td><td>$1,292,136</td></tr
    >
    <tr
      ><th scope="row">10. LICENSE &amp; PERMITS</th><td>$2,300,000</td><td>$2,346,000</td><td
        >$2,404,650</td
      ><td>$2,484,003</td><td>$2,570,944</td><td>$2,660,927</td><td>$2,727,450</td><td
        >$2,795,636</td
      ><td>$2,865,527</td><td>$2,937,165</td></tr
    >
    <tr
      ><th scope="row">11. FINES &amp; FORFEITS</th><td>$625,000</td><td>$643,750</td><td
        >$663,063</td
      ><td>$682,954</td><td>$703,443</td><td>$724,546</td><td>$746,283</td><td>$768,671</td><td
        >$791,731</td
      ><td>$815,483</td></tr
    >
    <tr
      ><th scope="row">12. INVESTMENTS</th><td>$1,000,000</td><td>$1,030,000</td><td>$1,060,900</td
      ><td>$1,098,032</td><td>$1,136,463</td><td>$1,176,239</td><td>$1,217,407</td><td
        >$1,260,016</td
      ><td>$1,304,117</td><td>$1,349,761</td></tr
    >
    <tr
      ><th scope="row">14. STATE AID (CHERRY SHEET) W/O CH. 70</th><td>$14,026,061</td><td
        >$14,376,713</td
      ><td>$14,736,130</td><td>$15,163,478</td><td>$15,603,219</td><td>$16,055,712</td><td
        >$16,521,328</td
      ><td>$17,000,447</td><td>$17,493,459</td><td>$18,000,770</td></tr
    >
    <tr
      ><th scope="row">15. CH 70 STATE AID</th><td>$96,427,042</td><td>$98,355,583</td><td
        >$100,322,694</td
      ><td>$102,329,148</td><td>$104,375,731</td><td>$106,463,246</td><td>$108,592,511</td><td
        >$110,764,361</td
      ><td>$112,979,648</td><td>$115,239,241</td></tr
    >
    <tr
      ><th scope="row">17. OTHER AVAILABLE REVENUE SOURCES</th><td>$6,210,304</td><td>$5,775,583</td
      ><td>$5,371,292</td><td>$4,995,301</td><td>$4,645,630</td><td>$4,320,436</td><td
        >$4,018,006</td
      ><td>$3,736,745</td><td>$3,475,173</td><td>$3,231,911</td></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$285,272,159</td><td>$292,361,654</td><td
        >$299,831,244</td
      ><td>$307,596,643</td><td>$315,738,514</td><td>$324,154,374</td><td>$332,823,510</td><td
        >$341,777,191</td
      ><td>$351,021,957</td><td>$360,564,705</td></tr
    >
    <tr
      ><th scope="row"><em>Annual % Increase</em></th><td>2.9%</td><td>2.5%</td><td>2.6%</td><td
        >2.6%</td
      ><td>2.6%</td><td>2.7%</td><td>2.7%</td><td>2.7%</td><td>2.7%</td><td>2.7%</td></tr
    >
  </tbody>
</table>

<h3>The 10-Year Revenue Estimate includes the following</h3>

<ul>
  <li>Increases the annual tax <GlossaryTerm term="Levy">levy</GlossaryTerm> by 3.3%</li>
  <li>Allocates 100% of Ch. 70 to the School</li>
  <li>Projects local receipts based on recent trends</li>
  <li>Reduce the amount of <GlossaryTerm term="Free Cash">free cash</GlossaryTerm> used to 20%</li>
</ul>

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

<script lang="ts">
  import { Router } from "$lib/router"
  import { GENERAL_FUND, ORDERS } from "../../../../budget/fy2027/council-orders"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "fy2027-general-fund-appropriation"
  const ORDER = ORDERS[2]
</script>

<!-- The order's words and its funding table come from `council-orders.ts`,
     which the budget pages read too, so the two cannot drift apart. The
     agenda prints the table amount first, source second, in the order
     below; `GENERAL_FUND` keeps the same rows in another order for the
     revenue page, so the agenda's order is restated here by label. -->
<p>13.3. {ORDER.text}</p>

<table>
  <tbody>
    {#each ["Free Cash", "Water Receipts", "Wastewater Receipts", "Transfer from Other Available Funds", "Taxation and Other Receipts"] as label (label)}
      {@const row = GENERAL_FUND.rows.find((r) => r.label === label)}
      <tr>
        <td><strong>{row?.cells[0]}</strong></td>
        <td><strong>{label}</strong></td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>Minutes</h2>

<p>
  <strong
    >Asst. City Clerk Leonard Flynn stated related communications from Mayor Barrett to continue to <a
      href={Router.meeting("city-council-2026-06-16")}>June 16<sup>th</sup></a
    >.</strong
  >
</p>

<p>
  MOTION BY COUNCILOR SULLIVAN, SECOND BY COUNCILOR LEPAGE<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<hr />

<h2>The order&rsquo;s attachment</h2>

<p>
  Introduced by Mayor Melinda E. Barrett<br />
  an Order Concerning Appropriations for the <strong>Fiscal Year Beginning July 1, 2026</strong>
</p>

<p>City Council<br /><strong>City of Haverhill</strong><br />Submitted May 21, 2026</p>

<table>
  <caption
    ><strong
      >Ordered that the following sums, designated as appropriations, are hereby appropriated in the
      General Fund of the City of Haverhill.</strong
    ></caption
  >
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Salaries Appropriation</th>
      <th scope="col">Expenses Appropriation</th>
      <th scope="col">Capital Appropriation</th>
      <th scope="col">Department Totals</th>
      <th scope="col">State and Other Assessments</th>
      <th scope="col">Grand Totals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="rowgroup" colspan="7">General Government</th>
    </tr>
    <tr>
      <td>City Council</td>
      <td>236,676</td>
      <td>6,600</td>
      <td></td>
      <td>243,276</td>
      <td></td>
      <td>243,276</td>
    </tr>
    <tr>
      <td>Mayor&rsquo;s Office</td>
      <td>446,004</td>
      <td>206,750</td>
      <td></td>
      <td>652,754</td>
      <td></td>
      <td>652,754</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office</td>
      <td>406,751</td>
      <td>148,100</td>
      <td></td>
      <td>554,851</td>
      <td></td>
      <td>554,851</td>
    </tr>
    <tr>
      <td>Treasurer/Collector</td>
      <td>428,727</td>
      <td>250,300</td>
      <td></td>
      <td>679,027</td>
      <td></td>
      <td>679,027</td>
    </tr>
    <tr>
      <td>Constituent Services</td>
      <td>104,272</td>
      <td>8,900</td>
      <td></td>
      <td>113,172</td>
      <td></td>
      <td>113,172</td>
    </tr>
    <tr>
      <td>Assessing</td>
      <td>310,083</td>
      <td>171,079</td>
      <td></td>
      <td>481,162</td>
      <td></td>
      <td>481,162</td>
    </tr>
    <tr>
      <td>Purchasing</td>
      <td>102,632</td>
      <td>15,050</td>
      <td></td>
      <td>117,682</td>
      <td></td>
      <td>117,682</td>
    </tr>
    <tr>
      <td>Law Department</td>
      <td>47,754</td>
      <td>425,000</td>
      <td></td>
      <td>472,754</td>
      <td></td>
      <td>472,754</td>
    </tr>
    <tr>
      <td>Economic Development</td>
      <td>366,920</td>
      <td>52,370</td>
      <td></td>
      <td>419,290</td>
      <td></td>
      <td>419,290</td>
    </tr>
    <tr>
      <td>Building Maintenance</td>
      <td>26,000</td>
      <td>373,500</td>
      <td></td>
      <td>399,500</td>
      <td></td>
      <td>399,500</td>
    </tr>
    <tr>
      <td>Human Recourses</td>
      <td>331,555</td>
      <td>130,300</td>
      <td></td>
      <td>461,855</td>
      <td></td>
      <td>461,855</td>
    </tr>
    <tr>
      <td>Municipal Information Systems</td>
      <td>211,100</td>
      <td>691,809</td>
      <td></td>
      <td>902,909</td>
      <td></td>
      <td>902,909</td>
    </tr>
    <tr>
      <td>City Clerk</td>
      <td>612,582</td>
      <td>154,380</td>
      <td></td>
      <td>766,962</td>
      <td></td>
      <td>766,962</td>
    </tr>
    <tr>
      <td></td>
      <td>3,631,056</td>
      <td>2,634,138</td>
      <td>0</td>
      <td>6,265,194</td>
      <td>0</td>
      <td>6,265,194</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" colspan="7">Public Safety</th>
    </tr>
    <tr>
      <td>Police Department</td>
      <td>15,215,388</td>
      <td>2,171,608</td>
      <td>115,000</td>
      <td>17,501,996</td>
      <td></td>
      <td>17,501,996</td>
    </tr>
    <tr>
      <td>Fire Department</td>
      <td>14,883,477</td>
      <td>1,006,973</td>
      <td>29,522</td>
      <td>15,919,972</td>
      <td></td>
      <td>15,919,972</td>
    </tr>
    <tr>
      <td></td>
      <td>30,098,865</td>
      <td>3,178,581</td>
      <td>144,522</td>
      <td>33,421,968</td>
      <td>0</td>
      <td>33,421,968</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" colspan="7">Education</th>
    </tr>
    <tr>
      <td>Whittier Regional School</td>
      <td></td>
      <td>9,469,211</td>
      <td></td>
      <td>9,469,211</td>
      <td></td>
      <td>9,469,211</td>
    </tr>
    <tr>
      <td>North Shore/Essex Regional School</td>
      <td></td>
      <td>690,625</td>
      <td></td>
      <td>690,625</td>
      <td></td>
      <td>690,625</td>
    </tr>
    <tr>
      <td>School Other Funding</td>
      <td></td>
      <td></td>
      <td></td>
      <td>0</td>
      <td></td>
      <td>0</td>
    </tr>
    <tr>
      <td>School Department</td>
      <td></td>
      <td>136,998,618</td>
      <td></td>
      <td>136,998,618</td>
      <td></td>
      <td>136,998,618</td>
    </tr>
    <tr>
      <td></td>
      <td>0</td>
      <td>147,158,454</td>
      <td>0</td>
      <td>147,158,454</td>
      <td>0</td>
      <td>147,158,454</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" colspan="7">Public Works</th>
    </tr>
    <tr>
      <td>Administration</td>
      <td>297,318</td>
      <td>37,165</td>
      <td></td>
      <td>334,483</td>
      <td></td>
      <td>334,483</td>
    </tr>
    <tr>
      <td>Highways</td>
      <td>1,127,200</td>
      <td>712,800</td>
      <td>100,000</td>
      <td>1,940,000</td>
      <td></td>
      <td>1,940,000</td>
    </tr>
    <tr>
      <td>Solid Waste/Recycling</td>
      <td>218,924</td>
      <td>5,899,227</td>
      <td></td>
      <td>6,118,151</td>
      <td></td>
      <td>6,118,151</td>
    </tr>
    <tr>
      <td>Parking</td>
      <td>51,726</td>
      <td>396,670</td>
      <td></td>
      <td>448,396</td>
      <td></td>
      <td>448,396</td>
    </tr>
    <tr>
      <td>Street Marking Division</td>
      <td></td>
      <td>200,000</td>
      <td></td>
      <td>200,000</td>
      <td></td>
      <td>200,000</td>
    </tr>
    <tr>
      <td>Fleet Maintenance</td>
      <td>281,158</td>
      <td>76,260</td>
      <td></td>
      <td>357,418</td>
      <td></td>
      <td>357,418</td>
    </tr>
    <tr>
      <td>Parks Department</td>
      <td>587,791</td>
      <td>285,871</td>
      <td></td>
      <td>873,662</td>
      <td></td>
      <td>873,662</td>
    </tr>
    <tr>
      <td>Street Lighting</td>
      <td></td>
      <td>753,608</td>
      <td></td>
      <td>753,608</td>
      <td></td>
      <td>753,608</td>
    </tr>
    <tr>
      <td>Snow &amp; Ice Removal</td>
      <td>229,330</td>
      <td>980,670</td>
      <td></td>
      <td>1,210,000</td>
      <td></td>
      <td>1,210,000</td>
    </tr>
    <tr>
      <td></td>
      <td>2,793,447</td>
      <td>9,342,271</td>
      <td>100,000</td>
      <td>12,235,718</td>
      <td>0</td>
      <td>12,235,718</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" colspan="7">Human Services</th>
    </tr>
    <tr>
      <td>Citizens Center</td>
      <td>317,822</td>
      <td>168,610</td>
      <td></td>
      <td>486,432</td>
      <td></td>
      <td>486,432</td>
    </tr>
    <tr>
      <td>Veterans Service</td>
      <td>131,645</td>
      <td>533,250</td>
      <td></td>
      <td>664,895</td>
      <td></td>
      <td>664,895</td>
    </tr>
    <tr>
      <td>Senior Services</td>
      <td>12,100</td>
      <td>2,400</td>
      <td></td>
      <td>14,500</td>
      <td></td>
      <td>14,500</td>
    </tr>
    <tr>
      <td>Public Health</td>
      <td>254,291</td>
      <td>7,000</td>
      <td></td>
      <td>261,291</td>
      <td></td>
      <td>261,291</td>
    </tr>
    <tr>
      <td>Stadium Commission</td>
      <td></td>
      <td>61,600</td>
      <td></td>
      <td>61,600</td>
      <td></td>
      <td>61,600</td>
    </tr>
    <tr>
      <td>Recreation</td>
      <td>233,997</td>
      <td>86,400</td>
      <td></td>
      <td>320,397</td>
      <td></td>
      <td>320,397</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services</td>
      <td>1,271,710</td>
      <td>45,450</td>
      <td></td>
      <td>1,317,160</td>
      <td></td>
      <td>1,317,160</td>
    </tr>
    <tr>
      <td>Public Library</td>
      <td>1,711,916</td>
      <td>298,134</td>
      <td></td>
      <td>2,010,050</td>
      <td></td>
      <td>2,010,050</td>
    </tr>
    <tr>
      <td></td>
      <td>3,933,481</td>
      <td>1,202,844</td>
      <td>0</td>
      <td>5,136,325</td>
      <td>0</td>
      <td>5,136,325</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Debt Service</th>
      <td></td>
      <td>8,834,819</td>
      <td></td>
      <td>8,834,819</td>
      <td></td>
      <td>8,834,819</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" colspan="7">Employee Benefits</th>
    </tr>
    <tr>
      <td>Retirement Fund</td>
      <td></td>
      <td>23,838,461</td>
      <td></td>
      <td>23,838,461</td>
      <td></td>
      <td>23,838,461</td>
    </tr>
    <tr>
      <td>Unemployment Compensation</td>
      <td></td>
      <td>280,000</td>
      <td></td>
      <td>280,000</td>
      <td></td>
      <td>280,000</td>
    </tr>
    <tr>
      <td>Group Insurance</td>
      <td></td>
      <td>31,583,332</td>
      <td></td>
      <td>31,583,332</td>
      <td></td>
      <td>31,583,332</td>
    </tr>
    <tr>
      <td>Payroll Taxes (FICA/Medicare)</td>
      <td></td>
      <td>2,207,955</td>
      <td></td>
      <td>2,207,955</td>
      <td></td>
      <td>2,207,955</td>
    </tr>
    <tr>
      <td>Workers Compensation</td>
      <td></td>
      <td>890,000</td>
      <td></td>
      <td>890,000</td>
      <td></td>
      <td>890,000</td>
    </tr>
    <tr>
      <td>Indemnification of Retirees</td>
      <td></td>
      <td>85,000</td>
      <td></td>
      <td>85,000</td>
      <td></td>
      <td>85,000</td>
    </tr>
    <tr>
      <td>Sick Leave Bank</td>
      <td></td>
      <td>182,934</td>
      <td></td>
      <td>182,934</td>
      <td></td>
      <td>182,934</td>
    </tr>
    <tr>
      <td>Vacation Accrual</td>
      <td></td>
      <td>50,000</td>
      <td></td>
      <td>50,000</td>
      <td></td>
      <td>50,000</td>
    </tr>
    <tr>
      <td>Injured on Duty Clams</td>
      <td></td>
      <td>210,000</td>
      <td></td>
      <td>210,000</td>
      <td></td>
      <td>210,000</td>
    </tr>
    <tr>
      <td></td>
      <td>0</td>
      <td>59,327,682</td>
      <td>0</td>
      <td>59,327,682</td>
      <td>0</td>
      <td>59,327,682</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" colspan="7">Other</th>
    </tr>
    <tr>
      <td>Capital Projects</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>0</td>
    </tr>
    <tr>
      <td>General Liability Insurance</td>
      <td></td>
      <td>1,381,899</td>
      <td></td>
      <td>1,381,899</td>
      <td></td>
      <td>1,381,899</td>
    </tr>
    <tr>
      <td>Salary Reserve</td>
      <td></td>
      <td>388,666</td>
      <td></td>
      <td>388,666</td>
      <td></td>
      <td>388,666</td>
    </tr>
    <tr>
      <td>Stabilization Fund</td>
      <td></td>
      <td></td>
      <td></td>
      <td>0</td>
      <td></td>
      <td>0</td>
    </tr>
    <tr>
      <td>Budget Reserve</td>
      <td></td>
      <td>600,000</td>
      <td></td>
      <td>600,000</td>
      <td></td>
      <td>600,000</td>
    </tr>
    <tr>
      <td>Other Deficits (Snow &amp; Ice)</td>
      <td></td>
      <td></td>
      <td></td>
      <td>0</td>
      <td></td>
      <td>0</td>
    </tr>
    <tr>
      <td>State Assessments (Cherry Sheets)</td>
      <td></td>
      <td></td>
      <td></td>
      <td>0</td>
      <td>10,271,435</td>
      <td>10,271,435</td>
    </tr>
    <tr>
      <td>Reserve for Abatements and Exemptions</td>
      <td></td>
      <td></td>
      <td></td>
      <td>0</td>
      <td>249,999</td>
      <td>249,999</td>
    </tr>
    <tr>
      <td></td>
      <td>0</td>
      <td>2,370,565</td>
      <td>0</td>
      <td>2,370,565</td>
      <td>10,521,434</td>
      <td>12,891,999</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Total General Fund</th>
      <td>40,456,849</td>
      <td>234,049,354</td>
      <td>244,522</td>
      <td>274,750,725</td>
      <td>10,521,434</td>
      <td>285,272,159</td>
    </tr>
  </tbody>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      The order, May 22, 2026, and its attachment<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

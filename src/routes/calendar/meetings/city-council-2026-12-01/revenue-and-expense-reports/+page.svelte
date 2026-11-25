<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-12-01"
  const ITEM = "revenue-and-expense-reports"
</script>

<p>
  8.1. Angel A. Perkins, <em>City Auditor and Chief Financial Officer</em>, submits the revenue and
  expense reports for the month of October 2026
</p>

<hr />

<!-- The Auditor's covering letter, then the two reports transcribed in full.
     Both carry a "Trendline" column of sparklines and a column of status marks
     beside each percentage, and the packet adds two bar and line charts; there
     is nothing in any of them to copy, so none is here. This month's
     "Collections as a Percent of Budget" prints no "$ Surplus / (Deficit)"
     column, which September's did, and the year-to-year table adds a last
     row, "Total Local Receipts not including Investments". -->

<h2>Letter from the City Auditor</h2>

<p>November 17, 2026</p>

<p>To The Honorable City Council</p>

<p>Attached are the revenue and expense reports through October 2026.</p>

<p>
  The general fund revenue shows a year-over-year increase of 2.75%, which is down from 5.43% in
  October of 2025. As anticipated, investment income has decreased due to reduced invested ARPA
  funds and borrowing proceeds. Investment earnings recognized through last October were $1.6
  million compared to just $740,428 through this October. This decline in investment earnings was
  incorporated into the 2027 operating budget, so it is not negatively affecting budget performance.
  Overall, the general fund revenue is slightly above its year-to-date collection benchmark of 36%,
  currently standing at 37.4%.
</p>

<p>
  The general fund operating budget is progressing as planned; however, in 2027, the city has
  significantly reduced its operating reserves due to budget constraints. As we navigate these
  challenging financial conditions, it is essential for all departments to manage budgets
  accurately, given the limited capacity to accommodate unexpected expenses.
</p>

<p>
  <strong>
    As discussed in the recent department head meeting, the Mayor has extended the budget freeze on
    all discretionary purchases until further notice.
  </strong>
</p>

<p>
  The city&rsquo;s free cash has been submitted to the Massachusetts Department of Revenue for
  certification. As in previous years, a portion of this free cash will be allocated to
  high-priority capital projects, placeholders for snow and ice removal, and the 2028 operating
  budget. The 2028 budget process will begin earlier this year and is intended to conclude in early
  June.
</p>

<p>Sincerely,</p>

<p>
  Angel A. Perkins, CPFO, CGA, CFE<br />
  Chief Financial Officer &amp; City Auditor
</p>

<h2>Expense Report as of 10/31/2026</h2>

<p>Year to Date Benchmark 34.62%</p>

<table>
  <caption>General Fund</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget</th>
      <th scope="col">Expended as of 10/31/26</th>
      <th scope="col">Unexpended</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Council Salaries</td>
      <td>$236,676</td>
      <td>$80,588</td>
      <td>$156,088</td>
      <td>34.05%</td>
    </tr>
    <tr>
      <td>Council Expenses</td>
      <td>$6,600</td>
      <td>$477</td>
      <td>$6,123</td>
      <td>7.23%</td>
    </tr>
    <tr>
      <td>Mayor Salaries</td>
      <td>$446,004</td>
      <td>$129,941</td>
      <td>$316,063</td>
      <td>29.13%</td>
    </tr>
    <tr>
      <td>Mayor Expenses</td>
      <td>$206,750</td>
      <td>$45,747</td>
      <td>$161,003</td>
      <td>22.13%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Salaries</td>
      <td>$406,751</td>
      <td>$142,031</td>
      <td>$264,720</td>
      <td>34.92%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Expenses</td>
      <td>$148,100</td>
      <td>$1,819</td>
      <td>$146,281</td>
      <td>1.23%</td>
    </tr>
    <tr>
      <td>Assessors Salaries</td>
      <td>$310,083</td>
      <td>$108,630</td>
      <td>$201,453</td>
      <td>35.03%</td>
    </tr>
    <tr>
      <td>Assessors Expenses</td>
      <td>$171,079</td>
      <td>$53,316</td>
      <td>$117,763</td>
      <td>31.16%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Salaries</td>
      <td>$428,727</td>
      <td>$141,770</td>
      <td>$286,957</td>
      <td>33.07%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Expenses</td>
      <td>$250,300</td>
      <td>$52,362</td>
      <td>$197,938</td>
      <td>20.92%</td>
    </tr>
    <tr>
      <td>Constituent Services Salaries</td>
      <td>$105,672</td>
      <td>$35,378</td>
      <td>$70,294</td>
      <td>33.48%</td>
    </tr>
    <tr>
      <td>Constituent Services Expenses</td>
      <td>$7,500</td>
      <td>$-</td>
      <td>$7,500</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>Purchasing Salaries</td>
      <td>$102,632</td>
      <td>$36,994</td>
      <td>$65,638</td>
      <td>36.05%</td>
    </tr>
    <tr>
      <td>Purchasing Expenses</td>
      <td>$15,050</td>
      <td>$4,993</td>
      <td>$10,057</td>
      <td>33.18%</td>
    </tr>
    <tr>
      <td>Law Department Salaries</td>
      <td>$47,754</td>
      <td>$16,805</td>
      <td>$30,949</td>
      <td>35.19%</td>
    </tr>
    <tr>
      <td>Law Department Legal</td>
      <td>$425,000</td>
      <td>$124,587</td>
      <td>$300,413</td>
      <td>29.31%</td>
    </tr>
    <tr>
      <td>Human Resources Salaries</td>
      <td>$331,555</td>
      <td>$116,938</td>
      <td>$214,617</td>
      <td>35.27%</td>
    </tr>
    <tr>
      <td>Human Resources Expenses</td>
      <td>$130,300</td>
      <td>$55,520</td>
      <td>$74,780</td>
      <td>42.61%</td>
    </tr>
    <tr>
      <td>MIS Salaries</td>
      <td>$211,100</td>
      <td>$75,228</td>
      <td>$135,872</td>
      <td>35.64%</td>
    </tr>
    <tr>
      <td>MIS Expenses</td>
      <td>$641,809</td>
      <td>$273,818</td>
      <td>$367,991</td>
      <td>42.66%</td>
    </tr>
    <tr>
      <td>MIS Capital</td>
      <td>$50,000</td>
      <td>$12,044</td>
      <td>$37,956</td>
      <td>24.09%</td>
    </tr>
    <tr>
      <td>City Clerk Salaries</td>
      <td>$612,582</td>
      <td>$231,812</td>
      <td>$380,770</td>
      <td>37.84%</td>
    </tr>
    <tr>
      <td>City Clerk Expenses</td>
      <td>$154,380</td>
      <td>$55,242</td>
      <td>$99,138</td>
      <td>35.78%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL GENERAL GOVERNMENT</th>
      <td>$5,446,404</td>
      <td>$1,796,040</td>
      <td>$3,650,364</td>
      <td>33.0%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Building Maint. Salaries</td>
      <td>$26,000</td>
      <td>$9,000</td>
      <td>$17,000</td>
      <td>34.62%</td>
    </tr>
    <tr>
      <td>Building Maint. Expenses</td>
      <td>$373,500</td>
      <td>$90,631</td>
      <td>$282,869</td>
      <td>24.27%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Salaries</td>
      <td>$1,271,710</td>
      <td>$415,945</td>
      <td>$855,765</td>
      <td>32.71%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Expenses</td>
      <td>$45,450</td>
      <td>$11,037</td>
      <td>$34,413</td>
      <td>24.28%</td>
    </tr>
    <tr>
      <td>Public Health Salaries</td>
      <td>$254,291</td>
      <td>$103,507</td>
      <td>$150,784</td>
      <td>40.70%</td>
    </tr>
    <tr>
      <td>Public Health Expenses</td>
      <td>$7,000</td>
      <td>$678</td>
      <td>$6,322</td>
      <td>9.69%</td>
    </tr>
    <tr>
      <td>Economic Development Salaries</td>
      <td>$366,920</td>
      <td>$80,094</td>
      <td>$286,826</td>
      <td>21.83%</td>
    </tr>
    <tr>
      <td>Economic Development Expenses</td>
      <td>$52,370</td>
      <td>$30,424</td>
      <td>$21,946</td>
      <td>58.09%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL COMMUNITY &amp; ECONOMIC DEVELOPMENT</th>
      <td>$2,397,241</td>
      <td>$741,316</td>
      <td>$1,655,925</td>
      <td>30.9%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Police Salaries</td>
      <td>$15,215,388</td>
      <td>$4,925,707</td>
      <td>$10,289,681</td>
      <td>32.37%</td>
    </tr>
    <tr>
      <td>Police Expenses</td>
      <td>$1,876,608</td>
      <td>$663,005</td>
      <td>$1,213,603</td>
      <td>35.33%</td>
    </tr>
    <tr>
      <td>Police Capital</td>
      <td>$410,000</td>
      <td>$344,800</td>
      <td>$65,200</td>
      <td>84.10%</td>
    </tr>
    <tr>
      <td>Fire Salaries</td>
      <td>$14,883,477</td>
      <td>$4,787,167</td>
      <td>$10,096,310</td>
      <td>32.16%</td>
    </tr>
    <tr>
      <td>Fire Expenses</td>
      <td>$1,006,973</td>
      <td>$217,062</td>
      <td>$789,911</td>
      <td>21.56%</td>
    </tr>
    <tr>
      <td>Fire Capital</td>
      <td>$29,522</td>
      <td>$26,164</td>
      <td>$3,358</td>
      <td>88.63%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC SAFETY</th>
      <td>$33,421,968</td>
      <td>$10,963,905</td>
      <td>$22,458,063</td>
      <td>32.8%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Whittier Regional School Assessment</td>
      <td>$9,469,211</td>
      <td>$4,734,606</td>
      <td>$4,734,605</td>
      <td>50.00%</td>
    </tr>
    <tr>
      <td>North Shore Essex Tech. Assessment</td>
      <td>$690,625</td>
      <td>$-</td>
      <td>$690,625</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>School Department</td>
      <td>$136,998,618</td>
      <td>$28,450,178</td>
      <td>$108,548,440</td>
      <td>20.77%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EDUCATION</th>
      <td>$147,158,454</td>
      <td>$33,184,784</td>
      <td>$113,973,670</td>
      <td>22.6%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Public Works Administration Salaries</td>
      <td>$297,318</td>
      <td>$81,497</td>
      <td>$215,821</td>
      <td>27.41%</td>
    </tr>
    <tr>
      <td>Public Works Administration Expenses</td>
      <td>$37,165</td>
      <td>$4,684</td>
      <td>$32,481</td>
      <td>12.60%</td>
    </tr>
    <tr>
      <td>Public Works Highways Salaries</td>
      <td>$1,127,200</td>
      <td>$281,501</td>
      <td>$845,699</td>
      <td>24.97%</td>
    </tr>
    <tr>
      <td>Public Works Highways Expenses</td>
      <td>$712,800</td>
      <td>$300,538</td>
      <td>$412,262</td>
      <td>42.16%</td>
    </tr>
    <tr>
      <td>Public Works Highways Capital</td>
      <td>$100,000</td>
      <td>$-</td>
      <td>$100,000</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>Public Works Solid Waste/Recycling Salaries</td>
      <td>$219,899</td>
      <td>$78,714</td>
      <td>$141,185</td>
      <td>35.80%</td>
    </tr>
    <tr>
      <td>Public Works Solid Waste/Recycling Expenses</td>
      <td>$5,898,252</td>
      <td>$806,214</td>
      <td>$5,092,038</td>
      <td>13.67%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Salaries</td>
      <td>$51,726</td>
      <td>$23,983</td>
      <td>$27,743</td>
      <td>46.37%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Expenses</td>
      <td>$396,670</td>
      <td>$108,798</td>
      <td>$287,872</td>
      <td>27.43%</td>
    </tr>
    <tr>
      <td>Public Works Street Marking Expenses</td>
      <td>$200,000</td>
      <td>$15,937</td>
      <td>$184,063</td>
      <td>7.97%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Salaries</td>
      <td>$281,158</td>
      <td>$61,771</td>
      <td>$219,387</td>
      <td>21.97%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Expenses</td>
      <td>$76,260</td>
      <td>$7,996</td>
      <td>$68,264</td>
      <td>10.49%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Salaries</td>
      <td>$587,791</td>
      <td>$215,087</td>
      <td>$372,704</td>
      <td>36.59%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Expenses</td>
      <td>$285,871</td>
      <td>$70,116</td>
      <td>$215,755</td>
      <td>24.53%</td>
    </tr>
    <tr>
      <td>Public Works Street Lighting Expenses</td>
      <td>$753,608</td>
      <td>$190,445</td>
      <td>$563,163</td>
      <td>25.27%</td>
    </tr>
    <tr>
      <td>Public Works Snow &amp; Ice Removal Salaries</td>
      <td>$229,330</td>
      <td>$2,659</td>
      <td>$226,671</td>
      <td>1.16%</td>
    </tr>
    <tr>
      <td>Public Works Snow &amp; Ice Removal Expenses</td>
      <td>$980,670</td>
      <td>$821</td>
      <td>$979,849</td>
      <td>0.08%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC WORKS</th>
      <td>$12,235,718</td>
      <td>$2,250,761</td>
      <td>$9,984,957</td>
      <td>18.4%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Citizens Center Salaries</td>
      <td>$317,822</td>
      <td>$121,691</td>
      <td>$196,131</td>
      <td>38.29%</td>
    </tr>
    <tr>
      <td>Citizens Center Expenses</td>
      <td>$168,610</td>
      <td>$25,839</td>
      <td>$142,771</td>
      <td>15.32%</td>
    </tr>
    <tr>
      <td>Veterans Services Salaries</td>
      <td>$131,645</td>
      <td>$44,651</td>
      <td>$86,994</td>
      <td>33.92%</td>
    </tr>
    <tr>
      <td>Veterans Services Expenses</td>
      <td>$533,250</td>
      <td>$147,717</td>
      <td>$385,533</td>
      <td>27.70%</td>
    </tr>
    <tr>
      <td>Senior Services Salaries</td>
      <td>$12,100</td>
      <td>$3,462</td>
      <td>$8,638</td>
      <td>28.61%</td>
    </tr>
    <tr>
      <td>Senior Services Expenses</td>
      <td>$2,400</td>
      <td>$-</td>
      <td>$2,400</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>Stadium Commission</td>
      <td>$61,600</td>
      <td>$14,596</td>
      <td>$47,004</td>
      <td>23.69%</td>
    </tr>
    <tr>
      <td>Recreation Salaries</td>
      <td>$235,397</td>
      <td>$177,099</td>
      <td>$58,298</td>
      <td>75.23%</td>
    </tr>
    <tr>
      <td>Recreation Expenses</td>
      <td>$85,000</td>
      <td>$8,641</td>
      <td>$76,359</td>
      <td>10.17%</td>
    </tr>
    <tr>
      <td>Public Library Salaries</td>
      <td>$1,711,916</td>
      <td>$562,642</td>
      <td>$1,149,274</td>
      <td>32.87%</td>
    </tr>
    <tr>
      <td>Public Library Expenses</td>
      <td>$298,134</td>
      <td>$122,865</td>
      <td>$175,269</td>
      <td>41.21%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL HUMAN SERVICES</th>
      <td>$3,557,874</td>
      <td>$1,229,203</td>
      <td>$2,328,671</td>
      <td>34.5%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Debt Service</td>
      <td>$8,834,819</td>
      <td>$1,385,351</td>
      <td>$7,449,468</td>
      <td>15.68%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL DEBT SERVICE</th>
      <td>$8,834,819</td>
      <td>$1,385,351</td>
      <td>$7,449,468</td>
      <td>15.7%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Retirement Fund</td>
      <td>$23,838,461</td>
      <td>$23,838,461</td>
      <td>$-</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <td>Unemployment Compensation</td>
      <td>$280,000</td>
      <td>$163,545</td>
      <td>$116,455</td>
      <td>58.41%</td>
    </tr>
    <tr>
      <td>Group Insurance</td>
      <td>$31,583,332</td>
      <td>$7,548,284</td>
      <td>$24,035,048</td>
      <td>23.90%</td>
    </tr>
    <tr>
      <td>Payroll Taxes (FICA/Medicare)</td>
      <td>$2,207,955</td>
      <td>$645,544</td>
      <td>$1,562,411</td>
      <td>29.24%</td>
    </tr>
    <tr>
      <td>Workers Compensation</td>
      <td>$890,000</td>
      <td>$361,757</td>
      <td>$528,243</td>
      <td>40.65%</td>
    </tr>
    <tr>
      <td>Injured on Duty Claims</td>
      <td>$210,000</td>
      <td>$153,795</td>
      <td>$56,205</td>
      <td>73.24%</td>
    </tr>
    <tr>
      <td>Sick Leave Bank</td>
      <td>$182,934</td>
      <td>$38,732</td>
      <td>$144,202</td>
      <td>21.17%</td>
    </tr>
    <tr>
      <td>Vacational Buyback</td>
      <td>$50,000</td>
      <td></td>
      <td>$50,000</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>Retiree Medical Claims</td>
      <td>$85,000</td>
      <td>$3,234</td>
      <td>$81,766</td>
      <td>3.80%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EMPLOYEE BENEFITS</th>
      <td>$59,327,682</td>
      <td>$32,753,352</td>
      <td>$26,574,330</td>
      <td>55.2%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>General Liability Insurance</td>
      <td>$1,381,899</td>
      <td>$860,722</td>
      <td>$521,177</td>
      <td>62.29%</td>
    </tr>
    <tr>
      <td>Salary Reserve</td>
      <td>$388,666</td>
      <td>$159,472</td>
      <td>$229,194</td>
      <td>41.03%</td>
    </tr>
    <tr>
      <td>Budget Reserve</td>
      <td>$600,000</td>
      <td>$19,334</td>
      <td>$580,666</td>
      <td>3.22%</td>
    </tr>
    <tr>
      <td>State Assessments (Cherry Sheets)</td>
      <td>$10,271,435</td>
      <td>$3,440,908</td>
      <td>$6,830,527</td>
      <td>33.50%</td>
    </tr>
    <tr>
      <td>Reserve for Abatement &amp; Exemption (Overlay)</td>
      <td>$250,000</td>
      <td>$-</td>
      <td>$250,000</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL OTHER CITY EXPENSES</th>
      <td>$12,892,000</td>
      <td>$4,480,436</td>
      <td>$8,411,564</td>
      <td>34.8%</td>
    </tr>
  </tbody>
  <tbody> </tbody>
  <tfoot>
    <tr>
      <th scope="row">TOTAL GENERAL FUND</th>
      <td>$285,272,160</td>
      <td>$88,785,148</td>
      <td>$196,487,012</td>
      <td>31.1%</td>
    </tr>
  </tfoot>
</table>

<table>
  <caption>Water and wastewater enterprise funds</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget</th>
      <th scope="col">Expended as of 10/31/26</th>
      <th scope="col">Unexpended</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Water Department Salaries</td>
      <td>$4,021,835</td>
      <td>$1,192,582</td>
      <td>$2,829,253</td>
      <td>29.65%</td>
    </tr>
    <tr>
      <td>Water Department Expenses</td>
      <td>$10,313,361</td>
      <td>$4,975,564</td>
      <td>$5,337,797</td>
      <td>48.24%</td>
    </tr>
    <tr>
      <td>Water Department Capital</td>
      <td>$451,000</td>
      <td>$51,747</td>
      <td>$399,253</td>
      <td>11.47%</td>
    </tr>
    <tr>
      <td>Water Department Indirect</td>
      <td>$254,221</td>
      <td></td>
      <td>$254,221</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WATER DEPARTMENT</th>
      <td>$15,040,417</td>
      <td>$6,219,893</td>
      <td>$8,820,524</td>
      <td>41.4%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Wastewater Salaries</td>
      <td>$3,189,677</td>
      <td>$1,057,963</td>
      <td>$2,131,714</td>
      <td>33.17%</td>
    </tr>
    <tr>
      <td>Wastewater Expenses</td>
      <td>$12,411,268</td>
      <td>$3,709,288</td>
      <td>$8,701,980</td>
      <td>29.89%</td>
    </tr>
    <tr>
      <td>Wastewater Capital</td>
      <td>$1,102,000</td>
      <td>$195,990</td>
      <td>$906,010</td>
      <td>17.78%</td>
    </tr>
    <tr>
      <td>Wastewater Indirect</td>
      <td>$718,418</td>
      <td>$-</td>
      <td>$718,418</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WASTEWATER DEPARTMENT</th>
      <td>$17,421,363</td>
      <td>$4,963,241</td>
      <td>$12,458,122</td>
      <td>28.5%</td>
    </tr>
  </tbody>
</table>

<table>
  <caption>Expended through 31 October, this year against the two before it</caption>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">FY &rsquo;25 through 10/31/24</th>
      <th scope="col">FY &rsquo;26 through 10/31/25</th>
      <th scope="col">FY &rsquo;27 through 10/31/26</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>TOTAL GENERAL GOVERNMENT</td>
      <td>$1,958,970</td>
      <td>$1,668,307</td>
      <td>$1,796,040</td>
    </tr>
    <tr>
      <td>TOTAL COMMUNITY &amp; ECONOMIC DEVELO</td>
      <td>$696,250</td>
      <td>$701,081</td>
      <td>$741,316</td>
    </tr>
    <tr>
      <td>TOTAL PUBLIC SAFETY</td>
      <td>$9,397,171</td>
      <td>$10,117,219</td>
      <td>$10,963,905</td>
    </tr>
    <tr>
      <td>TOTAL EDUCATION</td>
      <td>$29,188,694</td>
      <td>$32,538,438</td>
      <td>$33,184,784</td>
    </tr>
    <tr>
      <td>TOTAL PUBLIC WORKS</td>
      <td>$2,977,890</td>
      <td>$2,677,169</td>
      <td>$2,250,761</td>
    </tr>
    <tr>
      <td>TOTAL HUMAN SERVICES</td>
      <td>$1,163,282</td>
      <td>$1,199,412</td>
      <td>$1,229,203</td>
    </tr>
    <tr>
      <td>TOTAL DEBT SERVICE</td>
      <td>$1,931,251</td>
      <td>$1,191,133</td>
      <td>$1,385,351</td>
    </tr>
    <tr>
      <td>TOTAL EMPLOYEE BENEFITS</td>
      <td>$27,680,260</td>
      <td>$29,267,765</td>
      <td>$32,753,352</td>
    </tr>
    <tr>
      <td>TOTAL OTHER CITY EXPENSES</td>
      <td>$4,018,773</td>
      <td>$4,183,703</td>
      <td>$4,480,436</td>
    </tr>
    <tr>
      <th scope="row">TOTAL CITY EXPENDITURES</th>
      <td>$79,012,541</td>
      <td>$83,544,227</td>
      <td>$88,785,148</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>TOTAL WATER DEPARTMENT</td>
      <td>$5,048,050</td>
      <td>$5,370,302</td>
      <td>$6,219,893</td>
    </tr>
    <tr>
      <td>TOTAL WASTEWATER DEPARTMENT</td>
      <td>$4,612,614</td>
      <td>$4,694,947</td>
      <td>$4,963,241</td>
    </tr>
  </tbody>
</table>

<h2>Revenue Report, Period Ending 10/31/26</h2>

<table>
  <caption>Year to Year Comparison</caption>
  <thead>
    <tr>
      <th scope="col">Revenue Source</th>
      <th scope="col">10/31/2024</th>
      <th scope="col">10/31/2025</th>
      <th scope="col">10/31/2026</th>
      <th scope="col">FY 26 to 27 % Change</th>
      <th scope="col">FY 26 to 27 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Real Estate &amp; Pers Property</td>
      <td>$57,124,119</td>
      <td>$60,986,351</td>
      <td>$63,838,740</td>
      <td>4.68%</td>
      <td>$2,852,389</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$1,326,300</td>
      <td>$1,127,662</td>
      <td>$1,175,968</td>
      <td>4.28%</td>
      <td>$48,306</td>
    </tr>
    <tr>
      <td>Meals Excise</td>
      <td>$342,160</td>
      <td>$332,983</td>
      <td>$364,134</td>
      <td>9.36%</td>
      <td>$31,151</td>
    </tr>
    <tr>
      <td>Hotel / Room Excise</td>
      <td>$94,694</td>
      <td>$100,600</td>
      <td>$93,964</td>
      <td>-6.60%</td>
      <td>$(6,636)</td>
    </tr>
    <tr>
      <td>Boat &amp; Other Excise</td>
      <td>$3,614</td>
      <td>$3,723</td>
      <td>$2,347</td>
      <td>-36.96%</td>
      <td>$(1,376)</td>
    </tr>
    <tr>
      <td>Cannabis Excise</td>
      <td>$308,446</td>
      <td>$340,227</td>
      <td>$319,752</td>
      <td>-6.02%</td>
      <td>$(20,475)</td>
    </tr>
    <tr>
      <td>Waste Disposal Facility Program</td>
      <td>$771,076</td>
      <td>$987,171</td>
      <td>$1,179,621</td>
      <td>19.50%</td>
      <td>$192,450</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$243,793</td>
      <td>$26,459</td>
      <td>$26,473</td>
      <td>0.05%</td>
      <td>$14</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$212,585</td>
      <td>$264,673</td>
      <td>$311,861</td>
      <td>17.83%</td>
      <td>$47,188</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$330,701</td>
      <td>$360,306</td>
      <td>$385,414</td>
      <td>6.97%</td>
      <td>$25,108</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$95,135</td>
      <td>$43,606</td>
      <td>$59,306</td>
      <td>36.00%</td>
      <td>$15,700</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$392,240</td>
      <td>$135,224</td>
      <td>$179,926</td>
      <td>33.06%</td>
      <td>$44,702</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$1,225,971</td>
      <td>$941,761</td>
      <td>$918,979</td>
      <td>-2.42%</td>
      <td>$(22,782)</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$186,675</td>
      <td>$242,407</td>
      <td>$147,145</td>
      <td>-39.30%</td>
      <td>$(95,262)</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$988,766</td>
      <td>$1,607,009</td>
      <td>$740,428</td>
      <td>-53.93%</td>
      <td>$(866,581)</td>
    </tr>
    <tr>
      <td>Medicaid Reimbursement</td>
      <td>$261,977</td>
      <td>$280,506</td>
      <td></td>
      <td>-100.00%</td>
      <td>$(280,506)</td>
    </tr>
    <tr>
      <td>*Misc Revenue</td>
      <td>$73,376</td>
      <td>$7,886</td>
      <td>$9,215</td>
      <td>16.85%</td>
      <td>$1,329</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$33,952,572</td>
      <td>$35,460,915</td>
      <td>$36,903,637</td>
      <td>4.07%</td>
      <td>$1,442,722</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$4,849,599</td>
      <td>$4,724,841</td>
      <td>$4,643,161</td>
      <td>-1.73%</td>
      <td>$(81,680)</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$3,952,893</td>
      <td>$4,448,993</td>
      <td>$4,215,029</td>
      <td>-5.26%</td>
      <td>$(233,964)</td>
    </tr>
    <tr>
      <td>Other GF Rev - Trnsf From Sp Rev &amp; Free Cash</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>$-</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total Revenue</th>
      <td>$106,736,692</td>
      <td>$112,423,303</td>
      <td>$115,515,100</td>
      <td>2.75%</td>
      <td>$3,091,797</td>
    </tr>
    <tr>
      <th scope="row">Total Revenue without Enterprise Funds</th>
      <td>$97,934,200</td>
      <td>$103,249,469</td>
      <td>$106,656,910</td>
      <td>3.30%</td>
      <td>$3,407,441</td>
    </tr>
    <tr>
      <th scope="row">Total Local Receipts</th>
      <td>$6,857,509</td>
      <td>$6,802,203</td>
      <td>$5,914,533</td>
      <td>-13.05%</td>
      <td>$(887,670)</td>
    </tr>
    <tr>
      <th scope="row">Total Local Receipts not including Investments</th>
      <td>$5,868,743</td>
      <td>$5,195,194</td>
      <td>$5,174,105</td>
      <td>-0.41%</td>
      <td>$(21,089)</td>
    </tr>
  </tfoot>
</table>

<table>
  <caption>Collections as a Percent of Budget</caption>
  <thead>
    <tr>
      <th scope="col">Revenue Source</th>
      <th scope="col">FY 27 Estimated Revenue</th>
      <th scope="col">FY 27 Actual Revenue Collections</th>
      <th scope="col">YTD Benchmark</th>
      <th scope="col">Actual Revenue Benchmark</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Real Estate &amp; Pers Property</td>
      <td>$146,107,374</td>
      <td>$63,838,740</td>
      <td>42%</td>
      <td>43.7%</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$9,025,789</td>
      <td>$1,175,968</td>
      <td>10%</td>
      <td>13.0%</td>
    </tr>
    <tr>
      <td>Meals Excise</td>
      <td>$1,300,000</td>
      <td>$364,134</td>
      <td>25%</td>
      <td>28.0%</td>
    </tr>
    <tr>
      <td>Hotel / Room Excise</td>
      <td>$310,000</td>
      <td>$93,964</td>
      <td>25%</td>
      <td>30.3%</td>
    </tr>
    <tr>
      <td>Boat &amp; Other Excise</td>
      <td>$8,400</td>
      <td>$2,347</td>
      <td>27%</td>
      <td>27.9%</td>
    </tr>
    <tr>
      <td>Cannabis Excise</td>
      <td>$1,133,040</td>
      <td>$319,752</td>
      <td>25%</td>
      <td>28.2%</td>
    </tr>
    <tr>
      <td>Waste Disposal Facility Program</td>
      <td>$3,023,244</td>
      <td>$1,179,621</td>
      <td>33%</td>
      <td>39.0%</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$281,555</td>
      <td>$26,473</td>
      <td>33%</td>
      <td>9.4%</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$742,000</td>
      <td>$311,861</td>
      <td>33%</td>
      <td>42.0%</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$998,900</td>
      <td>$385,414</td>
      <td>33%</td>
      <td>38.6%</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$198,450</td>
      <td>$59,306</td>
      <td>33%</td>
      <td>29.9%</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$555,000</td>
      <td>$179,926</td>
      <td>33%</td>
      <td>32.4%</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$2,300,000</td>
      <td>$918,979</td>
      <td>33%</td>
      <td>40.0%</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$625,000</td>
      <td>$147,145</td>
      <td>33%</td>
      <td>23.5%</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$1,000,000</td>
      <td>$740,428</td>
      <td>33%</td>
      <td>74.0%</td>
    </tr>
    <tr>
      <td>Medicaid Reimbursement</td>
      <td>$1,000,000</td>
      <td>$-</td>
      <td>33%</td>
      <td>0.0%</td>
    </tr>
    <tr>
      <td>*Misc Revenue</td>
      <td></td>
      <td>$9,215</td>
      <td>0%</td>
      <td>100.0%</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$110,453,103</td>
      <td>$36,903,637</td>
      <td>33%</td>
      <td>33.4%</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$17,421,363</td>
      <td>$4,643,161</td>
      <td>33%</td>
      <td>26.7%</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$15,040,417</td>
      <td>$4,215,029</td>
      <td>33%</td>
      <td>28.0%</td>
    </tr>
    <tr>
      <td>Other GF Rev - Trnsf From Sp Rev &amp; Free Cash</td>
      <td>$6,210,304</td>
      <td>$-</td>
      <td>0%</td>
      <td>0.0%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$317,733,939</td>
      <td>$115,515,100</td>
      <td>36%</td>
      <td>36.4%</td>
    </tr>
    <tr>
      <th scope="row"><em>Estimated General Fund Revenue</em></th>
      <td>$285,272,159</td>
      <td>$106,656,910</td>
      <td>36%</td>
      <td>37.4%</td>
    </tr>
    <tr>
      <th scope="row"><em>Estimated Local Receipts</em></th>
      <td>$22,501,378</td>
      <td>$5,914,533</td>
      <td>23%</td>
      <td>26.3%</td>
    </tr>
  </tfoot>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-letter`)} target="_blank" rel="noopener">
      Letter from Angel A. Perkins, Chief Financial Officer &amp; City Auditor, November 17, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/expense-report`)} target="_blank" rel="noopener">
      Expense Report as of 10/31/2026<span class="sr-only"
        >, PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/revenue-report`)} target="_blank" rel="noopener">
      Revenue Report, Period Ending 10/31/26<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("city-council-2026-10-27", ITEM)}>
      The reports for September 2026
    </a>
  </li>
</ul>

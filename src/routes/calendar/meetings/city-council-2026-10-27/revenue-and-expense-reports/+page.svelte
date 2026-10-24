<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "revenue-and-expense-reports"
</script>

<p>
  Angel A. Perkins, <em>City Auditor and Chief Financial Officer</em>, submits the revenue and
  expense reports for the month of September 2026
</p>

<hr />

<!-- The Auditor's covering letter, then the two reports transcribed in full.
     Both carry a "Trendline" column of sparklines and a column of Harvey balls
     beside each percentage; there is nothing in either to copy, so neither
     column is here. -->

<h2>Letter from the City Auditor</h2>

<p>October 16, 2026</p>

<p>To The Honorable City Council</p>

<p>Attached are the revenue and expense reports through September 2026.</p>

<p>
  The general fund revenue shows a year-over-year increase of 2.13%, which is down from 6.67% in
  September of last year. As anticipated, investment income has decreased due to reduced invested
  ARPA funds and borrowing proceeds. Investment earnings recognized through last September were $1.1
  million compared to just $225,857 through this September. This decline in investment earnings was
  incorporated into the 2027 operating budget, so it is not negatively affecting budget performance.
  Overall, the general fund revenue is just slightly below its year-to-date collection benchmark of
  24%, currently standing at 23.8%.
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

<h2>Expense Report as of 9/30/2026</h2>

<p>Year to Date Benchmark 25.00%</p>

<table>
  <caption>General Fund</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget</th>
      <th scope="col">Expended as of 9/30/26</th>
      <th scope="col">Unexpended as of 9/30/26</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Council Salaries</td>
      <td>$236,676</td>
      <td>$59,764</td>
      <td>$176,912</td>
      <td>25.25%</td>
    </tr>
    <tr>
      <td>Council Expenses</td>
      <td>$6,600</td>
      <td>$314</td>
      <td>$6,286</td>
      <td>4.76%</td>
    </tr>
    <tr>
      <td>Mayor Salaries</td>
      <td>$446,004</td>
      <td>$95,440</td>
      <td>$350,564</td>
      <td>21.40%</td>
    </tr>
    <tr>
      <td>Mayor Expenses</td>
      <td>$206,750</td>
      <td>$12,779</td>
      <td>$193,971</td>
      <td>6.18%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Salaries</td>
      <td>$406,751</td>
      <td>$103,339</td>
      <td>$303,412</td>
      <td>25.41%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Expenses</td>
      <td>$148,100</td>
      <td>$1,592</td>
      <td>$146,508</td>
      <td>1.07%</td>
    </tr>
    <tr>
      <td>Assessors Salaries</td>
      <td>$310,083</td>
      <td>$78,407</td>
      <td>$231,676</td>
      <td>25.29%</td>
    </tr>
    <tr>
      <td>Assessors Expenses</td>
      <td>$171,079</td>
      <td>$41,772</td>
      <td>$129,307</td>
      <td>24.42%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Salaries</td>
      <td>$428,727</td>
      <td>$101,830</td>
      <td>$326,897</td>
      <td>23.75%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Expenses</td>
      <td>$250,300</td>
      <td>$39,199</td>
      <td>$211,101</td>
      <td>15.66%</td>
    </tr>
    <tr>
      <td>Constituent Services Salaries</td>
      <td>$105,672</td>
      <td>$25,013</td>
      <td>$80,659</td>
      <td>23.67%</td>
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
      <td>$26,718</td>
      <td>$75,914</td>
      <td>26.03%</td>
    </tr>
    <tr>
      <td>Purchasing Expenses</td>
      <td>$15,050</td>
      <td>$3,053</td>
      <td>$11,997</td>
      <td>20.29%</td>
    </tr>
    <tr>
      <td>Law Department Salaries</td>
      <td>$47,754</td>
      <td>$12,604</td>
      <td>$35,150</td>
      <td>26.39%</td>
    </tr>
    <tr>
      <td>Law Department Legal</td>
      <td>$425,000</td>
      <td>$81,478</td>
      <td>$343,522</td>
      <td>19.17%</td>
    </tr>
    <tr>
      <td>Human Resources Salaries</td>
      <td>$331,555</td>
      <td>$84,921</td>
      <td>$246,634</td>
      <td>25.61%</td>
    </tr>
    <tr>
      <td>Human Resources Expenses</td>
      <td>$130,300</td>
      <td>$49,506</td>
      <td>$80,794</td>
      <td>37.99%</td>
    </tr>
    <tr>
      <td>MIS Salaries</td>
      <td>$211,100</td>
      <td>$51,291</td>
      <td>$159,809</td>
      <td>24.30%</td>
    </tr>
    <tr>
      <td>MIS Expenses</td>
      <td>$641,809</td>
      <td>$249,445</td>
      <td>$392,364</td>
      <td>38.87%</td>
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
      <td>$176,926</td>
      <td>$435,656</td>
      <td>28.88%</td>
    </tr>
    <tr>
      <td>City Clerk Expenses</td>
      <td>$154,380</td>
      <td>$42,934</td>
      <td>$111,446</td>
      <td>27.81%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL GENERAL GOVERNMENT</th>
      <td>$5,446,404</td>
      <td>$1,350,369</td>
      <td>$4,096,035</td>
      <td>24.8%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Building Maint. Salaries</td>
      <td>$26,000</td>
      <td>$6,500</td>
      <td>$19,500</td>
      <td>25.00%</td>
    </tr>
    <tr>
      <td>Building Maint. Expenses</td>
      <td>$373,500</td>
      <td>$63,391</td>
      <td>$310,109</td>
      <td>16.97%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Salaries</td>
      <td>$1,271,710</td>
      <td>$307,324</td>
      <td>$964,386</td>
      <td>24.17%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Expenses</td>
      <td>$45,450</td>
      <td>$8,924</td>
      <td>$36,526</td>
      <td>19.63%</td>
    </tr>
    <tr>
      <td>Public Health Salaries</td>
      <td>$254,291</td>
      <td>$74,755</td>
      <td>$179,536</td>
      <td>29.40%</td>
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
      <td>$54,342</td>
      <td>$312,578</td>
      <td>14.81%</td>
    </tr>
    <tr>
      <td>Economic Development Expenses</td>
      <td>$52,370</td>
      <td>$29,775</td>
      <td>$22,595</td>
      <td>56.86%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL COMMUNITY &amp; ECONOMIC DEVELOPMENT</th>
      <td>$2,397,241</td>
      <td>$545,689</td>
      <td>$1,851,552</td>
      <td>22.8%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Police Salaries</td>
      <td>$15,215,388</td>
      <td>$3,522,751</td>
      <td>$11,692,637</td>
      <td>23.15%</td>
    </tr>
    <tr>
      <td>Police Expenses</td>
      <td>$1,876,608</td>
      <td>$534,174</td>
      <td>$1,342,434</td>
      <td>28.46%</td>
    </tr>
    <tr>
      <td>Police Capital</td>
      <td>$410,000</td>
      <td>$341,074</td>
      <td>$68,926</td>
      <td>83.19%</td>
    </tr>
    <tr>
      <td>Fire Salaries</td>
      <td>$14,883,477</td>
      <td>$3,514,276</td>
      <td>$11,369,201</td>
      <td>23.61%</td>
    </tr>
    <tr>
      <td>Fire Expenses</td>
      <td>$1,006,973</td>
      <td>$170,084</td>
      <td>$836,889</td>
      <td>16.89%</td>
    </tr>
    <tr>
      <td>Fire Capital</td>
      <td>$29,522</td>
      <td>$-</td>
      <td>$29,522</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC SAFETY</th>
      <td>$33,421,968</td>
      <td>$8,082,359</td>
      <td>$25,339,609</td>
      <td>24.2%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Whittier Regional School Assessment</td>
      <td>$9,469,211</td>
      <td>$2,367,303</td>
      <td>$7,101,908</td>
      <td>25.00%</td>
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
      <td>$14,514,596</td>
      <td>$122,484,022</td>
      <td>10.59%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EDUCATION</th>
      <td>$147,158,454</td>
      <td>$16,881,899</td>
      <td>$130,276,555</td>
      <td>11.5%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Public Works Administration Salaries</td>
      <td>$297,318</td>
      <td>$55,823</td>
      <td>$241,495</td>
      <td>18.78%</td>
    </tr>
    <tr>
      <td>Public Works Administration Expenses</td>
      <td>$37,165</td>
      <td>$3,297</td>
      <td>$33,868</td>
      <td>8.87%</td>
    </tr>
    <tr>
      <td>Public Works Highways Salaries</td>
      <td>$1,127,200</td>
      <td>$339,858</td>
      <td>$787,342</td>
      <td>30.15%</td>
    </tr>
    <tr>
      <td>Public Works Highways Expenses</td>
      <td>$712,800</td>
      <td>$151,651</td>
      <td>$561,149</td>
      <td>21.28%</td>
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
      <td>$56,075</td>
      <td>$163,824</td>
      <td>25.50%</td>
    </tr>
    <tr>
      <td>Public Works Solid Waste/Recycling Expenses</td>
      <td>$5,898,252</td>
      <td>$329,493</td>
      <td>$5,568,759</td>
      <td>5.59%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Salaries</td>
      <td>$51,726</td>
      <td>$18,503</td>
      <td>$33,223</td>
      <td>35.77%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Expenses</td>
      <td>$396,670</td>
      <td>$29,008</td>
      <td>$367,662</td>
      <td>7.31%</td>
    </tr>
    <tr>
      <td>Public Works Street Marking Expenses</td>
      <td>$200,000</td>
      <td>$6,588</td>
      <td>$193,412</td>
      <td>3.29%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Salaries</td>
      <td>$281,158</td>
      <td>$43,177</td>
      <td>$237,981</td>
      <td>15.36%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Expenses</td>
      <td>$76,260</td>
      <td>$5,092</td>
      <td>$71,168</td>
      <td>6.68%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Salaries</td>
      <td>$587,791</td>
      <td>$164,286</td>
      <td>$423,505</td>
      <td>27.95%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Expenses</td>
      <td>$285,871</td>
      <td>$48,119</td>
      <td>$237,752</td>
      <td>16.83%</td>
    </tr>
    <tr>
      <td>Public Works Street Lighting Expenses</td>
      <td>$753,608</td>
      <td>$140,234</td>
      <td>$613,374</td>
      <td>18.61%</td>
    </tr>
    <tr>
      <td>Public Works Snow &amp; Ice Removal Salaries</td>
      <td>$229,330</td>
      <td>$2,498</td>
      <td>$226,832</td>
      <td>1.09%</td>
    </tr>
    <tr>
      <td>Public Works Snow &amp; Ice Removal Expenses</td>
      <td>$980,670</td>
      <td>$-</td>
      <td>$980,670</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC WORKS</th>
      <td>$12,235,718</td>
      <td>$1,393,702</td>
      <td>$10,842,016</td>
      <td>11.4%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Citizens Center Salaries</td>
      <td>$317,822</td>
      <td>$89,137</td>
      <td>$228,685</td>
      <td>28.05%</td>
    </tr>
    <tr>
      <td>Citizens Center Expenses</td>
      <td>$168,610</td>
      <td>$22,881</td>
      <td>$145,729</td>
      <td>13.57%</td>
    </tr>
    <tr>
      <td>Veterans Services Salaries</td>
      <td>$131,645</td>
      <td>$31,660</td>
      <td>$99,985</td>
      <td>24.05%</td>
    </tr>
    <tr>
      <td>Veterans Services Expenses</td>
      <td>$533,250</td>
      <td>$110,275</td>
      <td>$422,975</td>
      <td>20.68%</td>
    </tr>
    <tr>
      <td>Senior Services Salaries</td>
      <td>$12,100</td>
      <td>$2,500</td>
      <td>$9,600</td>
      <td>20.66%</td>
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
      <td>$7,565</td>
      <td>$54,035</td>
      <td>12.28%</td>
    </tr>
    <tr>
      <td>Recreation Salaries</td>
      <td>$235,397</td>
      <td>$156,693</td>
      <td>$78,704</td>
      <td>66.57%</td>
    </tr>
    <tr>
      <td>Recreation Expenses</td>
      <td>$85,000</td>
      <td>$6,703</td>
      <td>$78,297</td>
      <td>7.89%</td>
    </tr>
    <tr>
      <td>Public Library Salaries</td>
      <td>$1,711,916</td>
      <td>$411,187</td>
      <td>$1,300,729</td>
      <td>24.02%</td>
    </tr>
    <tr>
      <td>Public Library Expenses</td>
      <td>$298,134</td>
      <td>$108,101</td>
      <td>$190,033</td>
      <td>36.26%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL HUMAN SERVICES</th>
      <td>$3,557,874</td>
      <td>$946,702</td>
      <td>$2,611,172</td>
      <td>26.6%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Debt Service</td>
      <td>$8,834,819</td>
      <td>$788,357</td>
      <td>$8,046,462</td>
      <td>8.92%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL DEBT SERVICE</th>
      <td>$8,834,819</td>
      <td>$788,357</td>
      <td>$8,046,462</td>
      <td>8.9%</td>
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
      <td>$2,160,751</td>
      <td>$29,422,581</td>
      <td>6.84%</td>
    </tr>
    <tr>
      <td>Payroll Taxes (FICA/Medicare)</td>
      <td>$2,207,955</td>
      <td>$379,644</td>
      <td>$1,828,311</td>
      <td>17.19%</td>
    </tr>
    <tr>
      <td>Workers Compensation</td>
      <td>$890,000</td>
      <td>$260,651</td>
      <td>$629,349</td>
      <td>29.29%</td>
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
      <td>$71</td>
      <td>$182,863</td>
      <td>0.04%</td>
    </tr>
    <tr>
      <td>Vacational Buyback</td>
      <td>$50,000</td>
      <td>$-</td>
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
      <td>$26,960,152</td>
      <td>$32,367,530</td>
      <td>45.4%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>General Liability Insurance</td>
      <td>$1,381,899</td>
      <td>$849,054</td>
      <td>$532,845</td>
      <td>61.44%</td>
    </tr>
    <tr>
      <td>Salary Reserve</td>
      <td>$388,666</td>
      <td>$21,000</td>
      <td>$367,666</td>
      <td>5.40%</td>
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
      <td>$2,580,681</td>
      <td>$7,690,754</td>
      <td>25.12%</td>
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
      <td>$3,470,069</td>
      <td>$9,421,931</td>
      <td>26.9%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">TOTAL GENERAL FUND</th>
      <td>$285,272,160</td>
      <td>$60,419,298</td>
      <td>$224,852,862</td>
      <td>21.2%</td>
    </tr>
  </tfoot>
</table>

<table>
  <caption>Water and wastewater enterprise funds</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget</th>
      <th scope="col">Expended as of 9/30/26</th>
      <th scope="col">Unexpended as of 9/30/26</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Water Department Salaries</td>
      <td>$4,021,835</td>
      <td>$871,781</td>
      <td>$3,150,054</td>
      <td>21.68%</td>
    </tr>
    <tr>
      <td>Water Department Expenses</td>
      <td>$10,313,361</td>
      <td>$4,269,460</td>
      <td>$6,043,901</td>
      <td>41.40%</td>
    </tr>
    <tr>
      <td>Water Department Capital</td>
      <td>$451,000</td>
      <td>$48,628</td>
      <td>$402,372</td>
      <td>10.78%</td>
    </tr>
    <tr>
      <td>Water Department Indirect</td>
      <td>$254,221</td>
      <td>$-</td>
      <td>$254,221</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WATER DEPARTMENT</th>
      <td>$15,040,417</td>
      <td>$5,189,869</td>
      <td>$9,850,548</td>
      <td>34.5%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Wastewater Salaries</td>
      <td>$3,189,677</td>
      <td>$744,091</td>
      <td>$2,445,586</td>
      <td>23.33%</td>
    </tr>
    <tr>
      <td>Wastewater Expenses</td>
      <td>$12,411,268</td>
      <td>$3,305,421</td>
      <td>$9,105,847</td>
      <td>26.63%</td>
    </tr>
    <tr>
      <td>Wastewater Capital</td>
      <td>$1,102,000</td>
      <td>$145,627</td>
      <td>$956,373</td>
      <td>13.21%</td>
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
      <td>$4,195,139</td>
      <td>$13,226,224</td>
      <td>24.1%</td>
    </tr>
  </tbody>
</table>

<table>
  <caption>Expended through 30 September, this year against the two before it</caption>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">FY &rsquo;25 through 9/30/24</th>
      <th scope="col">FY &rsquo;26 through 9/30/25</th>
      <th scope="col">FY &rsquo;27 through 9/30/26</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">TOTAL GENERAL GOVERNMENT</th>
      <td>$1,334,577</td>
      <td>$1,206,567</td>
      <td>$1,350,369</td>
    </tr>
    <tr>
      <th scope="row">TOTAL COMMUNITY &amp; ECONOMIC DEVELO</th>
      <td>$471,875</td>
      <td>$475,622</td>
      <td>$545,689</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC SAFETY</th>
      <td>$6,871,726</td>
      <td>$7,309,341</td>
      <td>$8,082,359</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EDUCATION</th>
      <td>$19,310,363</td>
      <td>$16,066,494</td>
      <td>$16,881,899</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC WORKS</th>
      <td>$1,781,838</td>
      <td>$2,047,493</td>
      <td>$1,393,702</td>
    </tr>
    <tr>
      <th scope="row">TOTAL HUMAN SERVICES</th>
      <td>$885,985</td>
      <td>$903,299</td>
      <td>$946,702</td>
    </tr>
    <tr>
      <th scope="row">TOTAL DEBT SERVICE</th>
      <td>$1,356,911</td>
      <td>$1,077,945</td>
      <td>$788,357</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EMPLOYEE BENEFITS</th>
      <td>$25,629,286</td>
      <td>$25,901,227</td>
      <td>$26,960,152</td>
    </tr>
    <tr>
      <th scope="row">TOTAL OTHER CITY EXPENSES</th>
      <td>$3,241,810</td>
      <td>$3,381,946</td>
      <td>$3,470,069</td>
    </tr>
    <tr>
      <th scope="row">TOTAL CITY EXPENDITURES</th>
      <td>$60,884,371</td>
      <td>$58,369,934</td>
      <td>$60,419,298</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WATER DEPARTMENT</th>
      <td>$4,482,823</td>
      <td>$2,418,851</td>
      <td>$5,189,869</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WASTEWATER DEPARTMENT</th>
      <td>$3,895,447</td>
      <td>$2,548,176</td>
      <td>$4,195,139</td>
    </tr>
  </tbody>
</table>

<h2>Revenue Report, Period Ending 9/30/26</h2>

<table>
  <caption>Year to Year Comparison</caption>
  <thead>
    <tr>
      <th scope="col">Revenue Source</th>
      <th scope="col">9/30/2024</th>
      <th scope="col">9/30/2025</th>
      <th scope="col">9/30/2026</th>
      <th scope="col">FY 26 to 27 % Change</th>
      <th scope="col">FY 26 to 27 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Real Estate &amp; Pers Property</td>
      <td>$32,327,512</td>
      <td>$35,129,482</td>
      <td>$36,383,579</td>
      <td>3.57%</td>
      <td>$1,254,097</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$1,041,067</td>
      <td>$866,700</td>
      <td>$881,124</td>
      <td>1.66%</td>
      <td>$14,424</td>
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
      <td>$100,560</td>
      <td>$93,964</td>
      <td>-6.56%</td>
      <td>$(6,596)</td>
    </tr>
    <tr>
      <td>Boat &amp; Other Excise</td>
      <td>$458</td>
      <td>$1,227</td>
      <td>$479</td>
      <td>-60.93%</td>
      <td>$(748)</td>
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
      <td>$549,491</td>
      <td>$515,941</td>
      <td>$871,376</td>
      <td>68.89%</td>
      <td>$355,435</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$243,793</td>
      <td>$20,558</td>
      <td>$26,473</td>
      <td>28.77%</td>
      <td>$5,915</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$160,725</td>
      <td>$233,395</td>
      <td>$238,446</td>
      <td>2.16%</td>
      <td>$5,051</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$254,590</td>
      <td>$279,728</td>
      <td>$300,520</td>
      <td>7.43%</td>
      <td>$20,792</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$40,041</td>
      <td>$34,148</td>
      <td>$58,214</td>
      <td>70.48%</td>
      <td>$24,066</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$355,447</td>
      <td>$308,293</td>
      <td>$150,620</td>
      <td>-51.14%</td>
      <td>$(157,673)</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$842,059</td>
      <td>$479,619</td>
      <td>$734,695</td>
      <td>53.18%</td>
      <td>$255,076</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$145,596</td>
      <td>$194,038</td>
      <td>$109,849</td>
      <td>-43.39%</td>
      <td>$(84,189)</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$677,055</td>
      <td>$1,113,448</td>
      <td>$225,857</td>
      <td>-79.72%</td>
      <td>$(887,591)</td>
    </tr>
    <tr>
      <td>Medicaid Reimbursement</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>$-</td>
    </tr>
    <tr>
      <td>*Misc Revenue</td>
      <td>$66,985</td>
      <td>$7,865</td>
      <td>$9,015</td>
      <td>14.62%</td>
      <td>$1,150</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$24,847,178</td>
      <td>$26,496,177</td>
      <td>$27,099,031</td>
      <td>2.28%</td>
      <td>$602,854</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$4,427,452</td>
      <td>$4,192,169</td>
      <td>$4,341,881</td>
      <td>3.57%</td>
      <td>$149,712</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$3,639,770</td>
      <td>$4,054,052</td>
      <td>$3,936,819</td>
      <td>-2.89%</td>
      <td>$(117,233)</td>
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
      <td>$70,364,519</td>
      <td>$74,700,610</td>
      <td>$76,145,829</td>
      <td>1.93%</td>
      <td>$1,445,219</td>
    </tr>
    <tr>
      <th scope="row">Total Revenue without Enterprise Funds</th>
      <td>$62,297,297</td>
      <td>$66,454,389</td>
      <td>$67,867,129</td>
      <td>2.13%</td>
      <td>$1,412,740</td>
    </tr>
    <tr>
      <th scope="row">Total Local Receipts</th>
      <td>$5,122,607</td>
      <td>$4,828,730</td>
      <td>$4,384,520</td>
      <td>-9.20%</td>
      <td>$(444,210)</td>
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
      <th scope="col">$ Surplus / (Deficit)</th>
      <th scope="col">YTD Benchmark</th>
      <th scope="col">Actual Revenue Benchmark</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Real Estate &amp; Pers Property</td>
      <td>$146,107,374</td>
      <td>$36,383,579</td>
      <td>$(109,723,795)</td>
      <td>25%</td>
      <td>24.9%</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$9,025,789</td>
      <td>$881,124</td>
      <td>$(8,144,665)</td>
      <td>8%</td>
      <td>9.8%</td>
    </tr>
    <tr>
      <td>Meals Excise</td>
      <td>$1,300,000</td>
      <td>$364,134</td>
      <td>$(935,866)</td>
      <td>25%</td>
      <td>28.0%</td>
    </tr>
    <tr>
      <td>Hotel / Room Excise</td>
      <td>$310,000</td>
      <td>$93,964</td>
      <td>$(216,036)</td>
      <td>25%</td>
      <td>30.3%</td>
    </tr>
    <tr>
      <td>Boat &amp; Other Excise</td>
      <td>$8,400</td>
      <td>$479</td>
      <td>$(7,921)</td>
      <td>8%</td>
      <td>5.7%</td>
    </tr>
    <tr>
      <td>Cannabis Excise</td>
      <td>$1,133,040</td>
      <td>$319,752</td>
      <td>$(813,288)</td>
      <td>25%</td>
      <td>28.2%</td>
    </tr>
    <tr>
      <td>Waste Disposal Facility Program</td>
      <td>$3,023,244</td>
      <td>$871,376</td>
      <td>$(2,151,868)</td>
      <td>25%</td>
      <td>28.8%</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$281,555</td>
      <td>$26,473</td>
      <td>$(255,082)</td>
      <td>25%</td>
      <td>9.4%</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$742,000</td>
      <td>$238,446</td>
      <td>$(503,554)</td>
      <td>25%</td>
      <td>32.1%</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$998,900</td>
      <td>$300,520</td>
      <td>$(698,380)</td>
      <td>25%</td>
      <td>30.1%</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$198,450</td>
      <td>$58,214</td>
      <td>$(140,236)</td>
      <td>25%</td>
      <td>29.3%</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$555,000</td>
      <td>$150,620</td>
      <td>$(404,380)</td>
      <td>25%</td>
      <td>27.1%</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$2,300,000</td>
      <td>$734,695</td>
      <td>$(1,565,305)</td>
      <td>25%</td>
      <td>31.9%</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$625,000</td>
      <td>$109,849</td>
      <td>$(515,151)</td>
      <td>25%</td>
      <td>17.6%</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$1,000,000</td>
      <td>$225,857</td>
      <td>$(774,143)</td>
      <td>25%</td>
      <td>22.6%</td>
    </tr>
    <tr>
      <td>Medicaid Reimbursement</td>
      <td>$1,000,000</td>
      <td>$-</td>
      <td>$(1,000,000)</td>
      <td>25%</td>
      <td>0.0%</td>
    </tr>
    <tr>
      <td>*Misc Revenue</td>
      <td></td>
      <td>$9,015</td>
      <td>$9,015</td>
      <td>0%</td>
      <td>100.0%</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$110,453,103</td>
      <td>$27,099,031</td>
      <td>$(83,354,072)</td>
      <td>25%</td>
      <td>24.5%</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$17,421,363</td>
      <td>$4,341,881</td>
      <td>$(13,079,482)</td>
      <td>25%</td>
      <td>24.9%</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$15,040,417</td>
      <td>$3,936,819</td>
      <td>$(11,103,598)</td>
      <td>25%</td>
      <td>26.2%</td>
    </tr>
    <tr>
      <td>Other GF Rev - Trnsf From Sp Rev &amp; Free Cash</td>
      <td>$6,210,304</td>
      <td>$-</td>
      <td>$(6,210,304)</td>
      <td>0%</td>
      <td>0.0%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$317,733,939</td>
      <td>$76,145,829</td>
      <td>$(241,588,110)</td>
      <td>24%</td>
      <td>24.0%</td>
    </tr>
    <tr>
      <th scope="row"><em>Estimated General Fund Revenue</em></th>
      <td>$285,272,159</td>
      <td>$67,867,129</td>
      <td>$(217,405,030)</td>
      <td>24%</td>
      <td>23.8%</td>
    </tr>
    <tr>
      <th scope="row"><em>Estimated Local Receipts</em></th>
      <td>$22,501,378</td>
      <td>$4,384,520</td>
      <td>$(18,116,858)</td>
      <td>18%</td>
      <td>19.5%</td>
    </tr>
  </tfoot>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-letter`)} target="_blank" rel="noopener">
      Letter from Angel A. Perkins, Chief Financial Officer &amp; City Auditor, October 16, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/expense-report`)} target="_blank" rel="noopener">
      Expense Report as of 9/30/2026<span class="sr-only">
        , PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/revenue-report`)} target="_blank" rel="noopener">
      Revenue Report, Period Ending 9/30/26<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

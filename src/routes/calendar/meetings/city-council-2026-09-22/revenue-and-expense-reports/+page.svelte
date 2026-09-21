<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-22"
  const ITEM = "revenue-and-expense-reports"
</script>

<p>
  Angel A. Perkins, <em>City Auditor and Chief Financial Officer</em>, submits the revenue and
  expense reports for the month of August 2026
</p>

<h2>Expense Report as of 8/31/2026</h2>

<p>Year to Date Benchmark 17.31%</p>

<table>
  <caption>General Fund</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget</th>
      <th scope="col">Expended as of 8/31/26</th>
      <th scope="col">Unexpended as of 8/31/26</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Council Salaries</td>
      <td>$236,676</td>
      <td>$40,305</td>
      <td>$196,371</td>
      <td>17.03%</td>
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
      <td>$67,840</td>
      <td>$378,164</td>
      <td>15.21%</td>
    </tr>
    <tr>
      <td>Mayor Expenses</td>
      <td>$206,750</td>
      <td>$10,499</td>
      <td>$196,251</td>
      <td>5.08%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Salaries</td>
      <td>$406,751</td>
      <td>$71,542</td>
      <td>$335,209</td>
      <td>17.59%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Expenses</td>
      <td>$148,100</td>
      <td>$605</td>
      <td>$147,495</td>
      <td>0.41%</td>
    </tr>
    <tr>
      <td>Assessors Salaries</td>
      <td>$310,083</td>
      <td>$54,237</td>
      <td>$255,846</td>
      <td>17.49%</td>
    </tr>
    <tr>
      <td>Assessors Expenses</td>
      <td>$171,079</td>
      <td>$30,542</td>
      <td>$140,537</td>
      <td>17.85%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Salaries</td>
      <td>$428,727</td>
      <td>$69,559</td>
      <td>$359,168</td>
      <td>16.22%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Expenses</td>
      <td>$250,300</td>
      <td>$31,537</td>
      <td>$218,763</td>
      <td>12.60%</td>
    </tr>
    <tr>
      <td>Constituent Services Salaries</td>
      <td>$105,672</td>
      <td>$16,721</td>
      <td>$88,951</td>
      <td>15.82%</td>
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
      <td>$18,497</td>
      <td>$84,135</td>
      <td>18.02%</td>
    </tr>
    <tr>
      <td>Purchasing Expenses</td>
      <td>$15,050</td>
      <td>$2,837</td>
      <td>$12,213</td>
      <td>18.85%</td>
    </tr>
    <tr>
      <td>Law Department Salaries</td>
      <td>$47,754</td>
      <td>$8,402</td>
      <td>$39,352</td>
      <td>17.60%</td>
    </tr>
    <tr>
      <td>Law Department Legal</td>
      <td>$425,000</td>
      <td>$32,981</td>
      <td>$392,019</td>
      <td>7.76%</td>
    </tr>
    <tr>
      <td>Human Resources Salaries</td>
      <td>$331,555</td>
      <td>$58,594</td>
      <td>$272,961</td>
      <td>17.67%</td>
    </tr>
    <tr>
      <td>Human Resources Expenses</td>
      <td>$130,300</td>
      <td>$33,801</td>
      <td>$96,499</td>
      <td>25.94%</td>
    </tr>
    <tr>
      <td>MIS Salaries</td>
      <td>$211,100</td>
      <td>$34,574</td>
      <td>$176,526</td>
      <td>16.38%</td>
    </tr>
    <tr>
      <td>MIS Expenses</td>
      <td>$641,809</td>
      <td>$211,736</td>
      <td>$430,073</td>
      <td>32.99%</td>
    </tr>
    <tr>
      <td>MIS Capital</td>
      <td>$50,000</td>
      <td>$6,019</td>
      <td>$43,981</td>
      <td>12.04%</td>
    </tr>
    <tr>
      <td>City Clerk Salaries</td>
      <td>$612,582</td>
      <td>$99,539</td>
      <td>$513,043</td>
      <td>16.25%</td>
    </tr>
    <tr>
      <td>City Clerk Expenses</td>
      <td>$154,380</td>
      <td>$33,802</td>
      <td>$120,578</td>
      <td>21.90%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL GENERAL GOVERNMENT</th>
      <td>$5,446,404</td>
      <td>$934,482</td>
      <td>$4,511,922</td>
      <td>17.2%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Building Maint. Salaries</td>
      <td>$26,000</td>
      <td>$4,500</td>
      <td>$21,500</td>
      <td>17.31%</td>
    </tr>
    <tr>
      <td>Building Maint. Expenses</td>
      <td>$373,500</td>
      <td>$44,706</td>
      <td>$328,794</td>
      <td>11.97%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Salaries</td>
      <td>$1,271,710</td>
      <td>$219,802</td>
      <td>$1,051,908</td>
      <td>17.28%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Expenses</td>
      <td>$45,450</td>
      <td>$6,432</td>
      <td>$39,018</td>
      <td>14.15%</td>
    </tr>
    <tr>
      <td>Public Health Salaries</td>
      <td>$254,291</td>
      <td>$51,753</td>
      <td>$202,538</td>
      <td>20.35%</td>
    </tr>
    <tr>
      <td>Public Health Expenses</td>
      <td>$7,000</td>
      <td>$155</td>
      <td>$6,845</td>
      <td>2.22%</td>
    </tr>
    <tr>
      <td>Economic Development Salaries</td>
      <td>$366,920</td>
      <td>$37,665</td>
      <td>$329,255</td>
      <td>10.27%</td>
    </tr>
    <tr>
      <td>Economic Development Expenses</td>
      <td>$52,370</td>
      <td>$1,518</td>
      <td>$50,852</td>
      <td>2.90%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL COMMUNITY &amp; ECONOMIC DEVELOPMENT</th>
      <td>$2,397,241</td>
      <td>$366,532</td>
      <td>$2,030,709</td>
      <td>15.3%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Police Salaries</td>
      <td>$15,215,388</td>
      <td>$2,408,131</td>
      <td>$12,807,257</td>
      <td>15.83%</td>
    </tr>
    <tr>
      <td>Police Expenses</td>
      <td>$1,876,608</td>
      <td>$322,451</td>
      <td>$1,554,157</td>
      <td>17.18%</td>
    </tr>
    <tr>
      <td>Police Capital</td>
      <td>$410,000</td>
      <td>$-</td>
      <td>$410,000</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>Fire Salaries</td>
      <td>$14,883,477</td>
      <td>$2,459,966</td>
      <td>$12,423,511</td>
      <td>16.53%</td>
    </tr>
    <tr>
      <td>Fire Expenses</td>
      <td>$1,006,973</td>
      <td>$103,758</td>
      <td>$903,215</td>
      <td>10.30%</td>
    </tr>
    <tr>
      <td>Fire Capital</td>
      <td>$29,522</td>
      <td>$26,164</td>
      <td>$3,358</td>
      <td>88.62%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC SAFETY</th>
      <td>$33,421,968</td>
      <td>$5,320,469</td>
      <td>$28,101,499</td>
      <td>15.9%</td>
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
      <td>$4,661,356</td>
      <td>$132,337,262</td>
      <td>3.40%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EDUCATION</th>
      <td>$147,158,454</td>
      <td>$7,028,659</td>
      <td>$140,129,795</td>
      <td>4.8%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Public Works Administration Salaries</td>
      <td>$297,318</td>
      <td>$37,209</td>
      <td>$260,109</td>
      <td>12.51%</td>
    </tr>
    <tr>
      <td>Public Works Administration Expenses</td>
      <td>$37,165</td>
      <td>$1,444</td>
      <td>$35,721</td>
      <td>3.89%</td>
    </tr>
    <tr>
      <td>Public Works Highways Salaries</td>
      <td>$1,127,200</td>
      <td>$190,585</td>
      <td>$936,615</td>
      <td>16.91%</td>
    </tr>
    <tr>
      <td>Public Works Highways Expenses</td>
      <td>$712,800</td>
      <td>$94,570</td>
      <td>$618,230</td>
      <td>13.27%</td>
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
      <td>$37,719</td>
      <td>$182,180</td>
      <td>17.15%</td>
    </tr>
    <tr>
      <td>Public Works Solid Waste/Recycling Expenses</td>
      <td>$5,898,252</td>
      <td>$10,657</td>
      <td>$5,887,595</td>
      <td>0.18%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Salaries</td>
      <td>$51,726</td>
      <td>$10,864</td>
      <td>$40,862</td>
      <td>21.00%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Expenses</td>
      <td>$396,670</td>
      <td>$25,213</td>
      <td>$371,457</td>
      <td>6.36%</td>
    </tr>
    <tr>
      <td>Public Works Street Marking Expenses</td>
      <td>$200,000</td>
      <td>$5,853</td>
      <td>$194,147</td>
      <td>2.93%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Salaries</td>
      <td>$281,158</td>
      <td>$25,985</td>
      <td>$255,173</td>
      <td>9.24%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Expenses</td>
      <td>$76,260</td>
      <td>$2,571</td>
      <td>$73,689</td>
      <td>3.37%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Salaries</td>
      <td>$587,791</td>
      <td>$90,142</td>
      <td>$497,649</td>
      <td>15.34%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Expenses</td>
      <td>$285,871</td>
      <td>$35,149</td>
      <td>$250,722</td>
      <td>12.30%</td>
    </tr>
    <tr>
      <td>Public Works Street Lighting Expenses</td>
      <td>$753,608</td>
      <td>$84,945</td>
      <td>$668,663</td>
      <td>11.27%</td>
    </tr>
    <tr>
      <td>Public Works Snow &amp; Ice Removal Salaries</td>
      <td>$229,330</td>
      <td>$1,656</td>
      <td>$227,674</td>
      <td>0.72%</td>
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
      <td>$654,563</td>
      <td>$11,581,155</td>
      <td>5.3%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Citizens Center Salaries</td>
      <td>$317,822</td>
      <td>$62,993</td>
      <td>$254,829</td>
      <td>19.82%</td>
    </tr>
    <tr>
      <td>Citizens Center Expenses</td>
      <td>$168,610</td>
      <td>$17,872</td>
      <td>$150,738</td>
      <td>10.60%</td>
    </tr>
    <tr>
      <td>Veterans Services Salaries</td>
      <td>$131,645</td>
      <td>$22,134</td>
      <td>$109,511</td>
      <td>16.81%</td>
    </tr>
    <tr>
      <td>Veterans Services Expenses</td>
      <td>$533,250</td>
      <td>$69,933</td>
      <td>$463,317</td>
      <td>13.11%</td>
    </tr>
    <tr>
      <td>Senior Services Salaries</td>
      <td>$12,100</td>
      <td>$1,731</td>
      <td>$10,369</td>
      <td>14.30%</td>
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
      <td>$4,601</td>
      <td>$56,999</td>
      <td>7.47%</td>
    </tr>
    <tr>
      <td>Recreation Salaries</td>
      <td>$235,397</td>
      <td>$132,825</td>
      <td>$102,572</td>
      <td>56.43%</td>
    </tr>
    <tr>
      <td>Recreation Expenses</td>
      <td>$85,000</td>
      <td>$3,540</td>
      <td>$81,460</td>
      <td>4.17%</td>
    </tr>
    <tr>
      <td>Public Library Salaries</td>
      <td>$1,711,916</td>
      <td>$277,087</td>
      <td>$1,434,829</td>
      <td>16.19%</td>
    </tr>
    <tr>
      <td>Public Library Expenses</td>
      <td>$298,134</td>
      <td>$92,982</td>
      <td>$205,152</td>
      <td>31.19%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL HUMAN SERVICES</th>
      <td>$3,557,874</td>
      <td>$685,697</td>
      <td>$2,872,177</td>
      <td>19.3%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Debt Service</td>
      <td>$8,834,819</td>
      <td>$208,640</td>
      <td>$8,626,179</td>
      <td>2.36%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL DEBT SERVICE</th>
      <td>$8,834,819</td>
      <td>$208,640</td>
      <td>$8,626,179</td>
      <td>2.4%</td>
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
      <td>$4,366</td>
      <td>$275,634</td>
      <td>1.56%</td>
    </tr>
    <tr>
      <td>Group Insurance</td>
      <td>$31,583,332</td>
      <td>$965,880</td>
      <td>$30,617,452</td>
      <td>3.06%</td>
    </tr>
    <tr>
      <td>Payroll Taxes (FICA/Medicare)</td>
      <td>$2,207,955</td>
      <td>$191,943</td>
      <td>$2,016,012</td>
      <td>8.69%</td>
    </tr>
    <tr>
      <td>Workers Compensation</td>
      <td>$890,000</td>
      <td>$150,972</td>
      <td>$739,028</td>
      <td>16.96%</td>
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
      <td></td>
      <td>$182,934</td>
      <td>0.00%</td>
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
      <td>$2,355</td>
      <td>$82,645</td>
      <td>2.77%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EMPLOYEE BENEFITS</th>
      <td>$59,327,682</td>
      <td>$25,307,772</td>
      <td>$34,019,910</td>
      <td>42.7%</td>
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
      <td></td>
      <td>$388,666</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>Budget Reserve</td>
      <td>$600,000</td>
      <td>$14,745</td>
      <td>$585,255</td>
      <td>2.46%</td>
    </tr>
    <tr>
      <td>State Assessments (Cherry Sheets)</td>
      <td>$10,271,435</td>
      <td>$1,720,154</td>
      <td>$8,551,281</td>
      <td>16.75%</td>
    </tr>
    <tr>
      <td>Reserve for Abatement &amp; Exemption (Overlay)</td>
      <td>$250,000</td>
      <td></td>
      <td>$250,000</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL OTHER CITY EXPENSES</th>
      <td>$12,892,000</td>
      <td>$2,583,954</td>
      <td>$10,308,046</td>
      <td>20.0%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">TOTAL GENERAL FUND</th>
      <td>$285,272,160</td>
      <td>$43,090,767</td>
      <td>$242,181,393</td>
      <td>15.1%</td>
    </tr>
  </tfoot>
</table>

<table>
  <caption>Water and wastewater enterprise funds</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget</th>
      <th scope="col">Expended as of 8/31/26</th>
      <th scope="col">Unexpended as of 8/31/26</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Water Department Salaries</td>
      <td>$4,021,835</td>
      <td>$614,381</td>
      <td>$3,407,454</td>
      <td>15.28%</td>
    </tr>
    <tr>
      <td>Water Department Expenses</td>
      <td>$10,313,361</td>
      <td>$3,710,204</td>
      <td>$6,603,157</td>
      <td>35.97%</td>
    </tr>
    <tr>
      <td>Water Department Capital</td>
      <td>$451,000</td>
      <td>$-</td>
      <td>$451,000</td>
      <td>0.00%</td>
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
      <td>$4,324,585</td>
      <td>$10,715,832</td>
      <td>28.8%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Wastewater Salaries</td>
      <td>$3,189,677</td>
      <td>$531,053</td>
      <td>$2,658,624</td>
      <td>16.65%</td>
    </tr>
    <tr>
      <td>Wastewater Expenses</td>
      <td>$12,411,268</td>
      <td>$2,409,686</td>
      <td>$10,001,582</td>
      <td>19.42%</td>
    </tr>
    <tr>
      <td>Wastewater Capital</td>
      <td>$1,102,000</td>
      <td>$88,118</td>
      <td>$1,013,882</td>
      <td>8.00%</td>
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
      <td>$3,028,857</td>
      <td>$14,392,506</td>
      <td>17.4%</td>
    </tr>
  </tbody>
</table>

<table>
  <caption>Expended through 31 August, this year against the two before it</caption>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">FY &rsquo;25 through 8/31/24</th>
      <th scope="col">FY &rsquo;26 through 8/31/25</th>
      <th scope="col">FY &rsquo;27 through 8/31/26</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">TOTAL GENERAL GOVERNMENT</th>
      <td>$845,941</td>
      <td>$873,146</td>
      <td>$934,482</td>
    </tr>
    <tr>
      <th scope="row">TOTAL COMMUNITY &amp; ECONOMIC DEVELO</th>
      <td>$316,357</td>
      <td>$320,318</td>
      <td>$366,532</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC SAFETY</th>
      <td>$4,584,182</td>
      <td>$4,859,536</td>
      <td>$5,320,469</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EDUCATION</th>
      <td>$9,982,990</td>
      <td>$7,388,461</td>
      <td>$7,028,659</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC WORKS</th>
      <td>$1,022,396</td>
      <td>$678,773</td>
      <td>$654,563</td>
    </tr>
    <tr>
      <th scope="row">TOTAL HUMAN SERVICES</th>
      <td>$628,957</td>
      <td>$651,053</td>
      <td>$685,697</td>
    </tr>
    <tr>
      <th scope="row">TOTAL DEBT SERVICE</th>
      <td>$238,808</td>
      <td>$-</td>
      <td>$208,640</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EMPLOYEE BENEFITS</th>
      <td>$23,531,291</td>
      <td>$24,424,509</td>
      <td>$25,307,772</td>
    </tr>
    <tr>
      <th scope="row">TOTAL OTHER CITY EXPENSES</th>
      <td>$627,142</td>
      <td>$2,568,051</td>
      <td>$2,583,954</td>
    </tr>
    <tr>
      <th scope="row">TOTAL CITY EXPENDITURES</th>
      <td>$41,778,064</td>
      <td>$41,763,847</td>
      <td>$43,090,767</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WATER DEPARTMENT</th>
      <td>$3,974,765</td>
      <td>$1,784,094</td>
      <td>$4,324,585</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WASTEWATER DEPARTMENT</th>
      <td>$2,969,386</td>
      <td>$1,787,198</td>
      <td>$3,028,857</td>
    </tr>
  </tbody>
</table>

<h2>Revenue Report, Period Ending 8/31/26</h2>

<table>
  <caption>Year to Year Comparison</caption>
  <thead>
    <tr>
      <th scope="col">Revenue Source</th>
      <th scope="col">8/31/2024</th>
      <th scope="col">8/31/2025</th>
      <th scope="col">8/31/2026</th>
      <th scope="col">FY 26 to 27 % Change</th>
      <th scope="col">FY 26 to 27 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Real Estate &amp; Pers Property</td>
      <td>$31,573,093</td>
      <td>$34,356,865</td>
      <td>$35,717,102</td>
      <td>3.96%</td>
      <td>$1,360,237</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$800,471</td>
      <td>$740,037</td>
      <td>$784,752</td>
      <td>6.04%</td>
      <td>$44,715</td>
    </tr>
    <tr>
      <td>Meals Excise</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>$-</td>
    </tr>
    <tr>
      <td>Hotel / Room Excise</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>$-</td>
    </tr>
    <tr>
      <td>Boat &amp; Other Excise</td>
      <td>$399</td>
      <td>$1,134</td>
      <td>$398</td>
      <td>-64.92%</td>
      <td>$(736)</td>
    </tr>
    <tr>
      <td>Cannabis Excise</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>$-</td>
    </tr>
    <tr>
      <td>Waste Disposal Facility Program</td>
      <td>$509,367</td>
      <td>$235,977</td>
      <td>$579,882</td>
      <td>145.74%</td>
      <td>$343,905</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$16,249</td>
      <td></td>
      <td>$26,473</td>
      <td></td>
      <td>$26,473</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$110,082</td>
      <td>$173,377</td>
      <td>$201,063</td>
      <td>15.97%</td>
      <td>$27,686</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$182,813</td>
      <td>$194,969</td>
      <td>$222,691</td>
      <td>14.22%</td>
      <td>$27,722</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$37,333</td>
      <td>$17,916</td>
      <td>$57,147</td>
      <td>218.97%</td>
      <td>$39,231</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$205,167</td>
      <td>$(23,764)</td>
      <td>$111,577</td>
      <td>-569.52%</td>
      <td>$135,341</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$328,366</td>
      <td>$253,122</td>
      <td>$293,051</td>
      <td>15.77%</td>
      <td>$39,929</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$106,002</td>
      <td>$94,099</td>
      <td>$101,091</td>
      <td>7.43%</td>
      <td>$6,992</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$418,536</td>
      <td>$986,429</td>
      <td>$229,214</td>
      <td>-76.76%</td>
      <td>$(757,215)</td>
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
      <td>$6,156</td>
      <td>$1,936</td>
      <td>-68.55%</td>
      <td>$(4,220)</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$16,978,658</td>
      <td>$18,015,321</td>
      <td>$18,410,314</td>
      <td>2.19%</td>
      <td>$394,993</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$2,342,512</td>
      <td>$1,951,510</td>
      <td>$2,217,749</td>
      <td>13.64%</td>
      <td>$266,239</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$1,918,250</td>
      <td>$2,008,654</td>
      <td>$2,182,810</td>
      <td>8.67%</td>
      <td>$174,156</td>
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
      <td>$55,594,283</td>
      <td>$59,011,802</td>
      <td>$61,137,250</td>
      <td>3.60%</td>
      <td>$2,125,448</td>
    </tr>
    <tr>
      <th scope="row">Total Revenue without Enterprise Funds</th>
      <td>$51,333,521</td>
      <td>$55,051,638</td>
      <td>$56,736,691</td>
      <td>3.06%</td>
      <td>$1,685,053</td>
    </tr>
    <tr>
      <th scope="row">Total Local Receipts</th>
      <td>$2,781,770</td>
      <td>$2,679,452</td>
      <td>$2,609,275</td>
      <td>-2.62%</td>
      <td>$(70,177)</td>
    </tr>
    <tr>
      <th scope="row">Total Local Receipts not including Investments</th>
      <td>$2,363,234</td>
      <td>$1,693,023</td>
      <td>$2,380,061</td>
      <td>40.58%</td>
      <td>$687,038</td>
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
      <td>$35,717,102</td>
      <td>$(110,390,272)</td>
      <td>25%</td>
      <td>24.4%</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$9,025,789</td>
      <td>$784,752</td>
      <td>$(8,241,037)</td>
      <td>1%</td>
      <td>8.7%</td>
    </tr>
    <tr>
      <td>Meals Excise</td>
      <td>$1,300,000</td>
      <td>$-</td>
      <td>$(1,300,000)</td>
      <td>0%</td>
      <td>0.0%</td>
    </tr>
    <tr>
      <td>Hotel / Room Excise</td>
      <td>$310,000</td>
      <td>$-</td>
      <td>$(310,000)</td>
      <td>0%</td>
      <td>0.0%</td>
    </tr>
    <tr>
      <td>Boat &amp; Other Excise</td>
      <td>$8,400</td>
      <td>$398</td>
      <td>$(8,002)</td>
      <td>0%</td>
      <td>4.7%</td>
    </tr>
    <tr>
      <td>Cannabis Excise</td>
      <td>$1,133,040</td>
      <td>$-</td>
      <td>$(1,133,040)</td>
      <td>0%</td>
      <td>0.0%</td>
    </tr>
    <tr>
      <td>Waste Disposal Facility Program</td>
      <td>$3,023,244</td>
      <td>$579,882</td>
      <td>$(2,443,362)</td>
      <td>17%</td>
      <td>19.2%</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$281,555</td>
      <td>$26,473</td>
      <td>$(255,082)</td>
      <td>17%</td>
      <td>9.4%</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$742,000</td>
      <td>$201,063</td>
      <td>$(540,937)</td>
      <td>17%</td>
      <td>27.1%</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$998,900</td>
      <td>$222,691</td>
      <td>$(776,209)</td>
      <td>17%</td>
      <td>22.3%</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$198,450</td>
      <td>$57,147</td>
      <td>$(141,303)</td>
      <td>17%</td>
      <td>28.8%</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$555,000</td>
      <td>$111,577</td>
      <td>$(443,423)</td>
      <td>17%</td>
      <td>20.1%</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$2,300,000</td>
      <td>$293,051</td>
      <td>$(2,006,949)</td>
      <td>17%</td>
      <td>12.7%</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$625,000</td>
      <td>$101,091</td>
      <td>$(523,909)</td>
      <td>17%</td>
      <td>16.2%</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$1,000,000</td>
      <td>$229,214</td>
      <td>$(770,786)</td>
      <td>17%</td>
      <td>22.9%</td>
    </tr>
    <tr>
      <td>Medicaid Reimbursement</td>
      <td>$1,000,000</td>
      <td>$-</td>
      <td>$(1,000,000)</td>
      <td>17%</td>
      <td>0.0%</td>
    </tr>
    <tr>
      <td>*Misc Revenue</td>
      <td></td>
      <td>$1,936</td>
      <td>$1,936</td>
      <td>0%</td>
      <td>100.0%</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$110,453,103</td>
      <td>$18,410,314</td>
      <td>$(92,042,789)</td>
      <td>17%</td>
      <td>16.7%</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$17,421,363</td>
      <td>$2,217,749</td>
      <td>$(15,203,614)</td>
      <td>17%</td>
      <td>12.7%</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$15,040,417</td>
      <td>$2,182,810</td>
      <td>$(12,857,607)</td>
      <td>17%</td>
      <td>14.5%</td>
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
      <td>$61,137,250</td>
      <td>$(256,596,689)</td>
      <td>20%</td>
      <td>19.2%</td>
    </tr>
    <tr>
      <th scope="row"><em>Estimated General Fund Revenue</em></th>
      <td>$285,272,159</td>
      <td>$56,736,691</td>
      <td>$(228,535,468)</td>
      <td>20%</td>
      <td>19.9%</td>
    </tr>
    <tr>
      <th scope="row"><em>Estimated Local Receipts</em></th>
      <td>$22,501,378</td>
      <td>$2,609,275</td>
      <td>$(19,892,103)</td>
      <td>8%</td>
      <td>11.6%</td>
    </tr>
  </tfoot>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-letter`)} target="_blank" rel="noopener">
      Letter from Angel A. Perkins, Chief Financial Officer &amp; City Auditor, September 15, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/expense-report`)} target="_blank" rel="noopener">
      Expense Report as of 8/31/2026<span class="sr-only">
        , PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/revenue-report`)} target="_blank" rel="noopener">
      Revenue Report, Period Ending 8/31/26<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "revenue-and-expense-reports"
</script>

<p>
  Angel A. Perkins, <em>City Auditor &amp; Chief Financial Officer</em>, submits the revenue and
  expense reports through April 2026
</p>

<h2>Expense Report as of 4/30/2026</h2>

<p>Year to Date Benchmark 84.62%</p>

<table>
  <caption>General Fund</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget (YTD)</th>
      <th scope="col">Expended (YTD)</th>
      <th scope="col">Unexpended (YTD)</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Council Salaries</td>
      <td>$237,479</td>
      <td>$198,541</td>
      <td>$38,938</td>
      <td>83.60%</td>
    </tr>
    <tr>
      <td>Council Expenses</td>
      <td>$8,100</td>
      <td>$2,971</td>
      <td>$5,129</td>
      <td>36.68%</td>
    </tr>
    <tr>
      <td>Mayor Salaries</td>
      <td>$450,538</td>
      <td>$379,581</td>
      <td>$70,957</td>
      <td>84.25%</td>
    </tr>
    <tr>
      <td>Mayor Expenses</td>
      <td>$210,250</td>
      <td>$141,285</td>
      <td>$68,965</td>
      <td>67.20%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Salaries</td>
      <td>$377,209</td>
      <td>$313,329</td>
      <td>$63,880</td>
      <td>83.07%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Expenses</td>
      <td>$139,381</td>
      <td>$22,674</td>
      <td>$116,707</td>
      <td>16.27%</td>
    </tr>
    <tr>
      <td>Assessors Salaries</td>
      <td>$306,053</td>
      <td>$258,118</td>
      <td>$47,935</td>
      <td>84.34%</td>
    </tr>
    <tr>
      <td>Assessors Expenses</td>
      <td>$179,215</td>
      <td>$135,229</td>
      <td>$43,986</td>
      <td>75.46%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Salaries</td>
      <td>$469,208</td>
      <td>$328,272</td>
      <td>$140,936</td>
      <td>69.96%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Expenses</td>
      <td>$251,300</td>
      <td>$181,061</td>
      <td>$70,239</td>
      <td>72.05%</td>
    </tr>
    <tr>
      <td>Constituent Services Salaries</td>
      <td>$109,442</td>
      <td>$85,466</td>
      <td>$23,976</td>
      <td>78.09%</td>
    </tr>
    <tr>
      <td>Constituent Services Expenses</td>
      <td>$15,500</td>
      <td>$-</td>
      <td>$15,500</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>Purchasing Salaries</td>
      <td>$103,107</td>
      <td>$87,058</td>
      <td>$16,049</td>
      <td>84.43%</td>
    </tr>
    <tr>
      <td>Purchasing Expenses</td>
      <td>$12,050</td>
      <td>$8,390</td>
      <td>$3,660</td>
      <td>69.63%</td>
    </tr>
    <tr>
      <td>Law Department Salaries</td>
      <td>$47,768</td>
      <td>$39,795</td>
      <td>$7,973</td>
      <td>83.31%</td>
    </tr>
    <tr>
      <td>Law Department Legal</td>
      <td>$536,000</td>
      <td>$272,090</td>
      <td>$263,910</td>
      <td>50.76%</td>
    </tr>
    <tr>
      <td>Human Resources Salaries</td>
      <td>$330,354</td>
      <td>$278,067</td>
      <td>$52,287</td>
      <td>84.17%</td>
    </tr>
    <tr>
      <td>Human Resources Expenses</td>
      <td>$147,550</td>
      <td>$115,813</td>
      <td>$31,737</td>
      <td>78.49%</td>
    </tr>
    <tr>
      <td>MIS Salaries</td>
      <td>$160,000</td>
      <td>$135,738</td>
      <td>$24,262</td>
      <td>84.84%</td>
    </tr>
    <tr>
      <td>MIS Expenses</td>
      <td>$638,134</td>
      <td>$506,665</td>
      <td>$131,469</td>
      <td>79.40%</td>
    </tr>
    <tr>
      <td>MIS Capital</td>
      <td>$50,000</td>
      <td>$45,216</td>
      <td>$4,784</td>
      <td>90.43%</td>
    </tr>
    <tr>
      <td>City Clerk Salaries</td>
      <td>$594,766</td>
      <td>$453,581</td>
      <td>$141,185</td>
      <td>76.26%</td>
    </tr>
    <tr>
      <td>City Clerk Expenses</td>
      <td>$171,380</td>
      <td>$125,455</td>
      <td>$45,925</td>
      <td>73.20%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL GENERAL GOVERNMENT</th>
      <td>$5,544,784</td>
      <td>$4,114,395</td>
      <td>$1,430,389</td>
      <td>74.2%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Building Maint. Salaries</td>
      <td>$79,127</td>
      <td>$62,081</td>
      <td>$17,046</td>
      <td>78.46%</td>
    </tr>
    <tr>
      <td>Building Maint. Expenses</td>
      <td>$298,500</td>
      <td>$241,232</td>
      <td>$57,268</td>
      <td>80.81%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Salaries</td>
      <td>$1,205,528</td>
      <td>$998,240</td>
      <td>$207,288</td>
      <td>82.81%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Expenses</td>
      <td>$46,950</td>
      <td>$31,263</td>
      <td>$15,687</td>
      <td>66.59%</td>
    </tr>
    <tr>
      <td>Public Health Salaries</td>
      <td>$247,498</td>
      <td>$221,450</td>
      <td>$26,048</td>
      <td>89.48%</td>
    </tr>
    <tr>
      <td>Public Health Expenses</td>
      <td>$9,000</td>
      <td>$982</td>
      <td>$8,018</td>
      <td>10.91%</td>
    </tr>
    <tr>
      <td>Economic Development Salaries</td>
      <td>$291,516</td>
      <td>$216,937</td>
      <td>$74,579</td>
      <td>74.42%</td>
    </tr>
    <tr>
      <td>Economic Development Expenses</td>
      <td>$56,162</td>
      <td>$38,854</td>
      <td>$17,308</td>
      <td>69.18%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL COMMUNITY &amp; ECONOMIC DEVELOPMENT</th>
      <td>$2,234,281</td>
      <td>$1,811,039</td>
      <td>$423,242</td>
      <td>81.1%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Police Salaries</td>
      <td>$14,403,074</td>
      <td>$12,116,668</td>
      <td>$2,286,406</td>
      <td>84.13%</td>
    </tr>
    <tr>
      <td>Police Expenses</td>
      <td>$1,809,961</td>
      <td>$1,295,141</td>
      <td>$514,820</td>
      <td>71.56%</td>
    </tr>
    <tr>
      <td>Police Capital</td>
      <td>$353,000</td>
      <td>$351,158</td>
      <td>$1,842</td>
      <td>99.48%</td>
    </tr>
    <tr>
      <td>Fire Salaries</td>
      <td>$14,187,950</td>
      <td>$12,070,184</td>
      <td>$2,117,766</td>
      <td>85.07%</td>
    </tr>
    <tr>
      <td>Fire Expenses</td>
      <td>$1,029,809</td>
      <td>$700,717</td>
      <td>$329,092</td>
      <td>68.04%</td>
    </tr>
    <tr>
      <td>Fire Capital</td>
      <td>$3,500</td>
      <td></td>
      <td>$3,500</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC SAFETY</th>
      <td>$31,787,294</td>
      <td>$26,533,868</td>
      <td>$5,253,426</td>
      <td>83.47%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Whittier Regional School Assessment</td>
      <td>$8,704,320</td>
      <td>$8,704,319</td>
      <td>$1</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <td>North Shore Essex Tech. Assessment</td>
      <td>$732,005</td>
      <td>$732,005</td>
      <td>$-</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <td>School Other Funding</td>
      <td>$15,000</td>
      <td></td>
      <td>$15,000</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>School Department</td>
      <td>$133,801,660</td>
      <td>$89,898,704</td>
      <td>$43,902,956</td>
      <td>67.19%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EDUCATION</th>
      <td>$143,252,985</td>
      <td>$99,335,028</td>
      <td>$43,917,957</td>
      <td>69.3%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Public Works Administration Salaries</td>
      <td>$59,607</td>
      <td>$35,901</td>
      <td>$23,706</td>
      <td>60.23%</td>
    </tr>
    <tr>
      <td>Public Works Administration Expenses</td>
      <td>$44,804</td>
      <td>$23,718</td>
      <td>$21,086</td>
      <td>52.94%</td>
    </tr>
    <tr>
      <td>Public Works Highways Salaries</td>
      <td>$1,404,280</td>
      <td>$1,065,225</td>
      <td>$339,055</td>
      <td>75.86%</td>
    </tr>
    <tr>
      <td>Public Works Highways Expenses</td>
      <td>$840,655</td>
      <td>$611,456</td>
      <td>$229,199</td>
      <td>72.74%</td>
    </tr>
    <tr>
      <td>Public Works Highways Capital</td>
      <td>$112,000</td>
      <td>$70,261</td>
      <td>$41,739</td>
      <td>62.73%</td>
    </tr>
    <tr>
      <td>Public Works Solid Waste/Recycling Salaries</td>
      <td>$218,185</td>
      <td>$179,642</td>
      <td>$38,543</td>
      <td>82.33%</td>
    </tr>
    <tr>
      <td>Public Works Solid Waste/Recycling Expenses</td>
      <td>$5,985,808</td>
      <td>$3,944,858</td>
      <td>$2,040,950</td>
      <td>65.90%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Salaries</td>
      <td>$51,726</td>
      <td>$43,861</td>
      <td>$7,865</td>
      <td>84.79%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Expenses</td>
      <td>$369,101</td>
      <td>$257,348</td>
      <td>$111,753</td>
      <td>69.72%</td>
    </tr>
    <tr>
      <td>Public Works Street Marking Expenses</td>
      <td>$116,883</td>
      <td>$106,335</td>
      <td>$10,548</td>
      <td>90.98%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Salaries</td>
      <td>$274,157</td>
      <td>$152,576</td>
      <td>$121,581</td>
      <td>55.65%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Expenses</td>
      <td>$49,080</td>
      <td>$49,225</td>
      <td>$(145)</td>
      <td>100.30%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Salaries</td>
      <td>$584,634</td>
      <td>$394,759</td>
      <td>$189,875</td>
      <td>67.52%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Expenses</td>
      <td>$332,850</td>
      <td>$216,636</td>
      <td>$116,214</td>
      <td>65.09%</td>
    </tr>
    <tr>
      <td>Public Works Street Lighting Expenses</td>
      <td>$725,800</td>
      <td>$552,753</td>
      <td>$173,047</td>
      <td>76.16%</td>
    </tr>
    <tr>
      <td>Public Works Snow &amp; Ice Removal Salaries</td>
      <td>$358,587</td>
      <td>$365,749</td>
      <td>$(7,162)</td>
      <td>102.00%</td>
    </tr>
    <tr>
      <td>Public Works Snow &amp; Ice Removal Expenses</td>
      <td>$1,279,032</td>
      <td>$4,276,636</td>
      <td>$(2,997,604)</td>
      <td>334.37%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC WORKS</th>
      <td>$12,807,189</td>
      <td>$12,346,939</td>
      <td>$460,250</td>
      <td>96.4%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Citizens Center Salaries</td>
      <td>$303,619</td>
      <td>$291,726</td>
      <td>$11,893</td>
      <td>96.08%</td>
    </tr>
    <tr>
      <td>Citizens Center Expenses</td>
      <td>$188,010</td>
      <td>$114,876</td>
      <td>$73,134</td>
      <td>61.10%</td>
    </tr>
    <tr>
      <td>Veterans Services Salaries</td>
      <td>$118,032</td>
      <td>$99,790</td>
      <td>$18,242</td>
      <td>84.54%</td>
    </tr>
    <tr>
      <td>Veterans Services Expenses</td>
      <td>$558,000</td>
      <td>$353,872</td>
      <td>$204,128</td>
      <td>63.42%</td>
    </tr>
    <tr>
      <td>Senior Services Salaries</td>
      <td>$13,500</td>
      <td>$9,671</td>
      <td>$3,829</td>
      <td>71.64%</td>
    </tr>
    <tr>
      <td>Senior Services Expenses</td>
      <td>$2,700</td>
      <td>$-</td>
      <td>$2,700</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>Stadium Commission</td>
      <td>$59,000</td>
      <td>$59,977</td>
      <td>$(977)</td>
      <td>101.66%</td>
    </tr>
    <tr>
      <td>Recreation Salaries</td>
      <td>$193,129</td>
      <td>$207,532</td>
      <td>$(14,403)</td>
      <td>107.46%</td>
    </tr>
    <tr>
      <td>Recreation Expenses</td>
      <td>$85,000</td>
      <td>$26,736</td>
      <td>$58,264</td>
      <td>31.45%</td>
    </tr>
    <tr>
      <td>Public Library Salaries</td>
      <td>$1,665,862</td>
      <td>$1,375,227</td>
      <td>$290,635</td>
      <td>82.55%</td>
    </tr>
    <tr>
      <td>Public Library Expenses</td>
      <td>$293,585</td>
      <td>$251,473</td>
      <td>$42,112</td>
      <td>85.66%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL HUMAN SERVICES</th>
      <td>$3,480,437</td>
      <td>$2,790,880</td>
      <td>$689,557</td>
      <td>80.2%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Debt Service</td>
      <td>$9,491,008</td>
      <td>$6,690,063</td>
      <td>$2,800,945</td>
      <td>70.49%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL DEBT SERVICE</th>
      <td>$9,491,008</td>
      <td>$6,690,063</td>
      <td>$2,800,945</td>
      <td>70.5%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Retirement Fund</td>
      <td>$22,967,281</td>
      <td>$22,967,281</td>
      <td>$-</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <td>Unemployment Compensation</td>
      <td>$230,000</td>
      <td>$104,577</td>
      <td>$125,423</td>
      <td>45.47%</td>
    </tr>
    <tr>
      <td>Group Insurance</td>
      <td>$29,765,000</td>
      <td>$22,959,265</td>
      <td>$6,805,735</td>
      <td>77.14%</td>
    </tr>
    <tr>
      <td>Payroll Taxes (FICA/Medicare)</td>
      <td>$2,103,796</td>
      <td>$1,735,547</td>
      <td>$368,249</td>
      <td>82.50%</td>
    </tr>
    <tr>
      <td>Workers Compensation</td>
      <td>$915,000</td>
      <td>$757,513</td>
      <td>$157,487</td>
      <td>82.79%</td>
    </tr>
    <tr>
      <td>Injured on Duty Claims</td>
      <td>$230,967</td>
      <td>$278,414</td>
      <td>$(47,447)</td>
      <td>120.54%</td>
    </tr>
    <tr>
      <td>Sick Leave Bank</td>
      <td>$436,639</td>
      <td>$476,639</td>
      <td>$(40,000)</td>
      <td>109.16%</td>
    </tr>
    <tr>
      <td>Vacational Buyback</td>
      <td>$59,315</td>
      <td>$59,315</td>
      <td>$-</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <td>Retiree Medical Claims</td>
      <td>$121,000</td>
      <td>$44,623</td>
      <td>$76,377</td>
      <td>36.88%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EMPLOYEE BENEFITS</th>
      <td>$56,828,998</td>
      <td>$49,383,174</td>
      <td>$7,445,824</td>
      <td>86.9%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>General Liability Insurance</td>
      <td>$1,325,682</td>
      <td>$1,325,682</td>
      <td>$-</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <td>Salary Reserve</td>
      <td>$189,072</td>
      <td>$189,072</td>
      <td>$-</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <td>Budget Reserve</td>
      <td>$405,671</td>
      <td>$141,891</td>
      <td>$263,780</td>
      <td>34.98%</td>
    </tr>
    <tr>
      <td>State Assessments (Cherry Sheets)</td>
      <td>$9,524,223</td>
      <td>$8,275,777</td>
      <td>$1,248,446</td>
      <td>86.89%</td>
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
      <td>$11,694,648</td>
      <td>$9,932,422</td>
      <td>$1,762,226</td>
      <td>84.9%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">TOTAL GENERAL FUND</th>
      <td>$277,121,624</td>
      <td>$212,937,808</td>
      <td>$64,183,816</td>
      <td>76.8%</td>
    </tr>
  </tbody>
</table>

<table>
  <caption>Water and wastewater enterprise funds</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget (YTD)</th>
      <th scope="col">Expended (YTD)</th>
      <th scope="col">Unexpended (YTD)</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Water Department Salaries</td>
      <td>$3,780,009</td>
      <td>$3,052,667</td>
      <td>$727,342</td>
      <td>80.76%</td>
    </tr>
    <tr>
      <td>Water Department Expenses</td>
      <td>$9,318,378</td>
      <td>$7,514,963</td>
      <td>$1,803,415</td>
      <td>80.65%</td>
    </tr>
    <tr>
      <td>Water Department Capital</td>
      <td>$300,000</td>
      <td>$242,886</td>
      <td>$57,114</td>
      <td>80.96%</td>
    </tr>
    <tr>
      <td>Water Department Indirect</td>
      <td>$248,494</td>
      <td>$248,494</td>
      <td>$-</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WATER DEPARTMENT</th>
      <td>$13,646,881</td>
      <td>$11,059,010</td>
      <td>$2,587,871</td>
      <td>81.0%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Wastewater Salaries</td>
      <td>$3,089,104</td>
      <td>$2,225,097</td>
      <td>$864,007</td>
      <td>72.03%</td>
    </tr>
    <tr>
      <td>Wastewater Expenses</td>
      <td>$11,894,907</td>
      <td>$8,642,265</td>
      <td>$3,252,642</td>
      <td>72.66%</td>
    </tr>
    <tr>
      <td>Wastewater Capital</td>
      <td>$1,127,000</td>
      <td>$90,861</td>
      <td>$1,036,139</td>
      <td>8.06%</td>
    </tr>
    <tr>
      <td>Wastewater Indirect</td>
      <td>$698,442</td>
      <td>$698,442</td>
      <td>$-</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WASTEWATER DEPARTMENT</th>
      <td>$16,809,453</td>
      <td>$11,656,665</td>
      <td>$5,152,788</td>
      <td>69.3%</td>
    </tr>
  </tbody>
</table>

<table>
  <caption>Expended through 30 April, this year against the two before it</caption>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">FY &rsquo;24 through 4/30/24</th>
      <th scope="col">FY &rsquo;25 through 4/30/25</th>
      <th scope="col">FY &rsquo;26 through 4/30/26</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">TOTAL GENERAL GOVERNMENT</th>
      <td>$3,963,989</td>
      <td>$4,447,810</td>
      <td>$4,114,395</td>
    </tr>
    <tr>
      <th scope="row">TOTAL COMMUNITY &amp; ECONOMIC DEVELOPMENT</th>
      <td>$1,645,399</td>
      <td>$1,742,438</td>
      <td>$1,811,039</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC SAFETY</th>
      <td>$22,534,123</td>
      <td>$25,135,911</td>
      <td>$26,533,868</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EDUCATION</th>
      <td>$95,549,511</td>
      <td>$127,113,386</td>
      <td>$99,335,028</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC WORKS</th>
      <td>$9,350,790</td>
      <td>$9,227,573</td>
      <td>$12,346,939</td>
    </tr>
    <tr>
      <th scope="row">TOTAL HUMAN SERVICES</th>
      <td>$2,712,591</td>
      <td>$2,767,670</td>
      <td>$2,790,880</td>
    </tr>
    <tr>
      <th scope="row">TOTAL DEBT SERVICE</th>
      <td>$3,796,785</td>
      <td>$4,374,905</td>
      <td>$6,690,063</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EMPLOYEE BENEFITS</th>
      <td>$44,894,502</td>
      <td>$44,281,114</td>
      <td>$49,383,174</td>
    </tr>
    <tr>
      <th scope="row">TOTAL OTHER CITY EXPENSES</th>
      <td>$8,356,642</td>
      <td>$8,765,469</td>
      <td>$9,932,422</td>
    </tr>
    <tr>
      <th scope="row">TOTAL CITY EXPENDITURES</th>
      <td>$192,804,332</td>
      <td>$227,856,276</td>
      <td>$212,937,808</td>
    </tr>
  </tbody>
</table>

<h2>City of Haverhill Revenue Report, Period Ending 4/30/26</h2>

<table>
  <caption>Year to Year Comparison</caption>
  <thead>
    <tr>
      <th scope="col">Revenue Source</th>
      <th scope="col">4/30/2024</th>
      <th scope="col">4/30/2025</th>
      <th scope="col">4/30/2026</th>
      <th scope="col">FY 25 to 26 % Change</th>
      <th scope="col">FY 25 to 26 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Real Estate &amp; Pers Property</td>
      <td>$116,616,164</td>
      <td>$125,715,091</td>
      <td>$130,460,981</td>
      <td>3.78%</td>
      <td>$4,745,890</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$7,182,230</td>
      <td>$7,985,372</td>
      <td>$7,962,482</td>
      <td>-0.29%</td>
      <td>$(22,890)</td>
    </tr>
    <tr>
      <td>Meals Excise</td>
      <td>$953,481</td>
      <td>$988,106</td>
      <td>$984,212</td>
      <td>-0.39%</td>
      <td>$(3,894)</td>
    </tr>
    <tr>
      <td>Hotel / Room Excise</td>
      <td>$259,001</td>
      <td>$255,225</td>
      <td>$257,330</td>
      <td>0.82%</td>
      <td>$2,105</td>
    </tr>
    <tr>
      <td>Boat &amp; Other Excise</td>
      <td>$10,491</td>
      <td>$7,689</td>
      <td>$8,419</td>
      <td>9.49%</td>
      <td>$730</td>
    </tr>
    <tr>
      <td>Cannabis Excise</td>
      <td>$867,603</td>
      <td>$883,629</td>
      <td>$976,577</td>
      <td>10.52%</td>
      <td>$92,948</td>
    </tr>
    <tr>
      <td>Waste Disposal Facility Program</td>
      <td>$2,508,978</td>
      <td>$2,583,599</td>
      <td>$2,373,697</td>
      <td>-8.12%</td>
      <td>$(209,902)</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$21,525</td>
      <td>$35,798</td>
      <td>$37,933</td>
      <td>5.96%</td>
      <td>$2,135</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$693,419</td>
      <td>$549,692</td>
      <td>$493,625</td>
      <td>-10.20%</td>
      <td>$(56,067)</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$773,699</td>
      <td>$776,342</td>
      <td>$964,674</td>
      <td>24.26%</td>
      <td>$188,332</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$137,840</td>
      <td>$150,256</td>
      <td>$158,734</td>
      <td>5.64%</td>
      <td>$8,478</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$644,574</td>
      <td>$632,906</td>
      <td>$269,709</td>
      <td>-57.39%</td>
      <td>$(363,197)</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$2,332,311</td>
      <td>$2,627,417</td>
      <td>$1,791,138</td>
      <td>-31.83%</td>
      <td>$(836,279)</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$653,032</td>
      <td>$537,030</td>
      <td>$501,699</td>
      <td>-6.58%</td>
      <td>$(35,331)</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$2,451,745</td>
      <td>$2,549,124</td>
      <td>$2,115,720</td>
      <td>-17.00%</td>
      <td>$(433,404)</td>
    </tr>
    <tr>
      <td>Medicaid Reimbursement</td>
      <td>$569,135</td>
      <td>$639,454</td>
      <td>$545,513</td>
      <td>-14.69%</td>
      <td>$(93,941)</td>
    </tr>
    <tr>
      <td>*Misc Revenue</td>
      <td>$87,841</td>
      <td>$235,380</td>
      <td>$18,921</td>
      <td>-91.96%</td>
      <td>$(216,459)</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$80,358,800</td>
      <td>$85,185,277</td>
      <td>$90,235,142</td>
      <td>5.93%</td>
      <td>$5,049,865</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$11,883,784</td>
      <td>$13,108,082</td>
      <td>$12,863,386</td>
      <td>-1.87%</td>
      <td>$(244,696)</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$9,755,326</td>
      <td>$11,202,255</td>
      <td>$11,947,277</td>
      <td>6.65%</td>
      <td>$745,022</td>
    </tr>
    <tr>
      <td>Other GF Rev - Trnsf From Sp Rev &amp; Free Cash</td>
      <td>$6,193,120</td>
      <td>$990,257</td>
      <td>$946,936</td>
      <td>-4.37%</td>
      <td>$(43,321)</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Total Revenue</th>
      <td>$244,954,099</td>
      <td>$257,637,981</td>
      <td>$265,914,105</td>
      <td>3.21%</td>
      <td>$8,276,124</td>
    </tr>
    <tr>
      <th scope="row">Total Revenue without Enterprise Funds</th>
      <td>$223,314,989</td>
      <td>$233,327,644</td>
      <td>$241,103,442</td>
      <td>3.33%</td>
      <td>$7,775,798</td>
    </tr>
    <tr>
      <th scope="row">Total Local Receipts</th>
      <td>$20,146,905</td>
      <td>$21,437,019</td>
      <td>$19,460,383</td>
      <td>-9.22%</td>
      <td>$(1,976,636)</td>
    </tr>
    <tr>
      <th scope="row">Total Local Receipts not including Investments</th>
      <td>$17,695,160</td>
      <td>$18,887,895</td>
      <td>$17,344,663</td>
      <td>-8.17%</td>
      <td>$(1,543,232)</td>
    </tr>
  </tbody>
</table>

<table>
  <caption>Collections as a Percent of Budget</caption>
  <thead>
    <tr>
      <th scope="col">Revenue Source</th>
      <th scope="col">FY 26 Estimated Revenue</th>
      <th scope="col">FY 26 Actual Revenue Collections</th>
      <th scope="col">$ Surplus / (Deficit)</th>
      <th scope="col">YTD Benchmark</th>
      <th scope="col">Actual Revenue Benchmark</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Real Estate &amp; Pers Property</td>
      <td>$140,323,000</td>
      <td>$130,460,981</td>
      <td>$(9,862,019)</td>
      <td>75%</td>
      <td>93.0%</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$8,391,880</td>
      <td>$7,962,482</td>
      <td>$(429,398)</td>
      <td>90%</td>
      <td>94.9%</td>
    </tr>
    <tr>
      <td>Meals Excise</td>
      <td>$1,259,948</td>
      <td>$984,212</td>
      <td>$(275,736)</td>
      <td>75%</td>
      <td>78.1%</td>
    </tr>
    <tr>
      <td>Hotel / Room Excise</td>
      <td>$309,000</td>
      <td>$257,330</td>
      <td>$(51,670)</td>
      <td>75%</td>
      <td>83.3%</td>
    </tr>
    <tr>
      <td>Boat &amp; Other Excise</td>
      <td>$9,476</td>
      <td>$8,419</td>
      <td>$(1,057)</td>
      <td>75%</td>
      <td>88.8%</td>
    </tr>
    <tr>
      <td>Cannabis Excise</td>
      <td>$1,133,040</td>
      <td>$976,577</td>
      <td>$(156,463)</td>
      <td>75%</td>
      <td>86.2%</td>
    </tr>
    <tr>
      <td>Waste Disposal Facility Program</td>
      <td>$2,740,175</td>
      <td>$2,373,697</td>
      <td>$(366,478)</td>
      <td>83%</td>
      <td>86.6%</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$274,189</td>
      <td>$37,933</td>
      <td>$(236,256)</td>
      <td>83%</td>
      <td>13.8%</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$742,361</td>
      <td>$493,625</td>
      <td>$(248,736)</td>
      <td>83%</td>
      <td>66.5%</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$962,671</td>
      <td>$964,674</td>
      <td>$2,003</td>
      <td>83%</td>
      <td>100.2%</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$198,450</td>
      <td>$158,734</td>
      <td>$(39,716)</td>
      <td>83%</td>
      <td>80.0%</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$658,253</td>
      <td>$269,709</td>
      <td>$(388,544)</td>
      <td>83%</td>
      <td>41.0%</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$2,522,301</td>
      <td>$1,791,138</td>
      <td>$(731,163)</td>
      <td>83%</td>
      <td>71.0%</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$628,275</td>
      <td>$501,699</td>
      <td>$(126,576)</td>
      <td>83%</td>
      <td>79.9%</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$1,976,990</td>
      <td>$2,115,720</td>
      <td>$138,730</td>
      <td>83%</td>
      <td>107.0%</td>
    </tr>
    <tr>
      <td>Medicaid Reimbursement</td>
      <td>$735,000</td>
      <td>$545,513</td>
      <td>$(189,487)</td>
      <td>83%</td>
      <td>74.2%</td>
    </tr>
    <tr>
      <td>*Misc Revenue</td>
      <td></td>
      <td>$18,921</td>
      <td>$18,921</td>
      <td>83%</td>
      <td>100.0%</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$108,005,748</td>
      <td>$90,235,142</td>
      <td>$(17,770,606)</td>
      <td>83%</td>
      <td>83.5%</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$16,809,453</td>
      <td>$12,863,386</td>
      <td>$(3,946,067)</td>
      <td>83%</td>
      <td>76.5%</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$14,146,881</td>
      <td>$11,947,277</td>
      <td>$(2,199,604)</td>
      <td>83%</td>
      <td>84.5%</td>
    </tr>
    <tr>
      <td>Other GF Rev - Trnsf From Sp Rev &amp; Free Cash</td>
      <td>$6,250,867</td>
      <td>$946,936</td>
      <td>$(5,303,931)</td>
      <td>83%</td>
      <td>15.1%</td>
    </tr>
    <tr>
      <th scope="row">Total</th>
      <td>$308,077,958</td>
      <td>$265,914,105</td>
      <td>$(42,163,853)</td>
      <td>80%</td>
      <td>86.3%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Estimated General Fund Revenue</th>
      <td>$277,121,624</td>
      <td>$241,103,442</td>
      <td>$(36,018,182)</td>
      <td>77%</td>
      <td>87.0%</td>
    </tr>
    <tr>
      <th scope="row">Estimated Local Receipts</th>
      <td>$22,542,009</td>
      <td>$19,460,383</td>
      <td>$(3,081,626)</td>
      <td>85%</td>
      <td>86.3%</td>
    </tr>
  </tbody>
</table>

<p>Prepared by Angel A. Perkins, Chief Financial Officer</p>

<h2>Minutes</h2>

<p>
  Councilor Toohey asked the mayor about unexpended balances with water/wastewater, public health
  and auditing. The Mayor stated to make a call to Bob Ward and Angel.
</p>

<p>
  MOTION BY COUNCILOR SULLIVAN TO PLACE ON FILE, SECOND BY COUNCILOR LEPAGE<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-letter`)} target="_blank" rel="noopener">
      Letter from Angel A. Perkins, City Auditor &amp; Chief Financial Officer, May 19, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/revenue-report`)} target="_blank" rel="noopener">
      Revenue Report, Period Ending 4/30/26<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/expense-report`)} target="_blank" rel="noopener">
      Expense Report as of 4/30/2026<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

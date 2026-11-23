<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-30"
  const ITEM = "revenue-and-expense-reports"
</script>

<p>
  Angel A. Perkins, <em>City Auditor and Chief Financial Officer,</em> submits the revenue and expense
  reports for the month of May 2026
</p>

<h2>Expense Report as of 5/31/2026</h2>

<p>Year to Date Benchmark 92.31%</p>

<table>
  <caption>General Fund</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget</th>
      <th scope="col">Expended as of 5/31/26</th>
      <th scope="col">Unexpended as of 5/31/26</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Council Salaries</td>
      <td>$237,479</td>
      <td>$217,712</td>
      <td>$19,767</td>
      <td>91.68%</td>
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
      <td>$412,935</td>
      <td>$37,603</td>
      <td>91.65%</td>
    </tr>
    <tr>
      <td>Mayor Expenses</td>
      <td>$210,250</td>
      <td>$165,907</td>
      <td>$44,343</td>
      <td>78.91%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Salaries</td>
      <td>$377,209</td>
      <td>$343,863</td>
      <td>$33,346</td>
      <td>91.16%</td>
    </tr>
    <tr>
      <td>Auditor&rsquo;s Office Expenses</td>
      <td>$139,381</td>
      <td>$24,717</td>
      <td>$114,664</td>
      <td>17.73%</td>
    </tr>
    <tr>
      <td>Assessors Salaries</td>
      <td>$306,053</td>
      <td>$280,806</td>
      <td>$25,247</td>
      <td>91.75%</td>
    </tr>
    <tr>
      <td>Assessors Expenses</td>
      <td>$179,215</td>
      <td>$135,647</td>
      <td>$43,568</td>
      <td>75.69%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Salaries</td>
      <td>$469,208</td>
      <td>$354,587</td>
      <td>$114,621</td>
      <td>75.57%</td>
    </tr>
    <tr>
      <td>Treasurer/Collector Expenses</td>
      <td>$251,300</td>
      <td>$198,319</td>
      <td>$52,981</td>
      <td>78.92%</td>
    </tr>
    <tr>
      <td>Constituent Services Salaries</td>
      <td>$109,442</td>
      <td>$89,654</td>
      <td>$19,788</td>
      <td>81.92%</td>
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
      <td>$94,845</td>
      <td>$8,262</td>
      <td>91.99%</td>
    </tr>
    <tr>
      <td>Purchasing Expenses</td>
      <td>$12,050</td>
      <td>$9,865</td>
      <td>$2,185</td>
      <td>81.87%</td>
    </tr>
    <tr>
      <td>Law Department Salaries</td>
      <td>$47,768</td>
      <td>$43,775</td>
      <td>$3,993</td>
      <td>91.64%</td>
    </tr>
    <tr>
      <td>Law Department Legal</td>
      <td>$536,000</td>
      <td>$316,241</td>
      <td>$219,759</td>
      <td>59.00%</td>
    </tr>
    <tr>
      <td>Human Resources Salaries</td>
      <td>$330,354</td>
      <td>$303,372</td>
      <td>$26,982</td>
      <td>91.83%</td>
    </tr>
    <tr>
      <td>Human Resources Expenses</td>
      <td>$147,550</td>
      <td>$116,069</td>
      <td>$31,481</td>
      <td>78.66%</td>
    </tr>
    <tr>
      <td>MIS Salaries</td>
      <td>$160,000</td>
      <td>$157,361</td>
      <td>$2,639</td>
      <td>98.35%</td>
    </tr>
    <tr>
      <td>MIS Expenses</td>
      <td>$638,134</td>
      <td>$517,008</td>
      <td>$121,126</td>
      <td>81.02%</td>
    </tr>
    <tr>
      <td>MIS Capital</td>
      <td>$50,000</td>
      <td>$46,330</td>
      <td>$3,670</td>
      <td>92.66%</td>
    </tr>
    <tr>
      <td>City Clerk Salaries</td>
      <td>$594,766</td>
      <td>$489,757</td>
      <td>$105,009</td>
      <td>82.34%</td>
    </tr>
    <tr>
      <td>City Clerk Expenses</td>
      <td>$171,380</td>
      <td>$125,695</td>
      <td>$45,685</td>
      <td>73.34%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL GENERAL GOVERNMENT</th>
      <td>$5,544,784</td>
      <td>$4,447,436</td>
      <td>$1,097,348</td>
      <td>80.2%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Building Maint. Salaries</td>
      <td>$79,127</td>
      <td>$73,145</td>
      <td>$5,982</td>
      <td>92.44%</td>
    </tr>
    <tr>
      <td>Building Maint. Expenses</td>
      <td>$298,500</td>
      <td>$264,742</td>
      <td>$33,758</td>
      <td>88.69%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Salaries</td>
      <td>$1,205,528</td>
      <td>$1,085,001</td>
      <td>$120,527</td>
      <td>90.00%</td>
    </tr>
    <tr>
      <td>Inspectional &amp; Health Services Expenses</td>
      <td>$46,950</td>
      <td>$35,394</td>
      <td>$11,556</td>
      <td>75.39%</td>
    </tr>
    <tr>
      <td>Public Health Salaries</td>
      <td>$247,498</td>
      <td>$243,756</td>
      <td>$3,742</td>
      <td>98.49%</td>
    </tr>
    <tr>
      <td>Public Health Expenses</td>
      <td>$9,000</td>
      <td>$1,779</td>
      <td>$7,221</td>
      <td>19.77%</td>
    </tr>
    <tr>
      <td>Economic Development Salaries</td>
      <td>$291,516</td>
      <td>$233,279</td>
      <td>$58,237</td>
      <td>80.02%</td>
    </tr>
    <tr>
      <td>Economic Development Expenses</td>
      <td>$56,162</td>
      <td>$39,577</td>
      <td>$16,585</td>
      <td>70.47%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL COMMUNITY &amp; ECONOMIC DEVELOPMENT</th>
      <td>$2,234,281</td>
      <td>$1,976,673</td>
      <td>$257,608</td>
      <td>88.5%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Police Salaries</td>
      <td>$14,403,074</td>
      <td>$12,987,133</td>
      <td>$1,415,941</td>
      <td>90.17%</td>
    </tr>
    <tr>
      <td>Police Expenses</td>
      <td>$1,809,961</td>
      <td>$1,416,819</td>
      <td>$393,142</td>
      <td>78.28%</td>
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
      <td>$12,997,675</td>
      <td>$1,190,275</td>
      <td>91.61%</td>
    </tr>
    <tr>
      <td>Fire Expenses</td>
      <td>$1,029,809</td>
      <td>$807,779</td>
      <td>$222,030</td>
      <td>78.44%</td>
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
      <td>$28,560,564</td>
      <td>$3,226,730</td>
      <td>89.8%</td>
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
      <td>$-</td>
      <td>$15,000</td>
      <td>0.00%</td>
    </tr>
    <tr>
      <td>School Department</td>
      <td>$133,801,660</td>
      <td>$106,600,742</td>
      <td>$27,200,918</td>
      <td>79.67%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EDUCATION</th>
      <td>$143,252,985</td>
      <td>$116,037,066</td>
      <td>$27,215,919</td>
      <td>81.0%</td>
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
      <td>$28,486</td>
      <td>$16,318</td>
      <td>63.58%</td>
    </tr>
    <tr>
      <td>Public Works Highways Salaries</td>
      <td>$1,404,280</td>
      <td>$1,148,707</td>
      <td>$255,573</td>
      <td>81.80%</td>
    </tr>
    <tr>
      <td>Public Works Highways Expenses</td>
      <td>$840,655</td>
      <td>$653,484</td>
      <td>$187,171</td>
      <td>77.74%</td>
    </tr>
    <tr>
      <td>Public Works Highways Capital</td>
      <td>$112,000</td>
      <td>$94,558</td>
      <td>$17,442</td>
      <td>84.43%</td>
    </tr>
    <tr>
      <td>Public Works Solid Waste/Recycling Salaries</td>
      <td>$218,185</td>
      <td>$198,480</td>
      <td>$19,705</td>
      <td>90.97%</td>
    </tr>
    <tr>
      <td>Public Works Solid Waste/Recycling Expenses</td>
      <td>$5,985,808</td>
      <td>$4,395,893</td>
      <td>$1,589,915</td>
      <td>73.44%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Salaries</td>
      <td>$51,726</td>
      <td>$47,794</td>
      <td>$3,932</td>
      <td>92.40%</td>
    </tr>
    <tr>
      <td>Public Works Parking Area Expenses</td>
      <td>$369,101</td>
      <td>$257,502</td>
      <td>$111,599</td>
      <td>69.76%</td>
    </tr>
    <tr>
      <td>Public Works Street Marking Expenses</td>
      <td>$116,883</td>
      <td>$113,723</td>
      <td>$3,160</td>
      <td>97.30%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Salaries</td>
      <td>$274,157</td>
      <td>$161,217</td>
      <td>$112,940</td>
      <td>58.80%</td>
    </tr>
    <tr>
      <td>Public Works Fleet Maint. Expenses</td>
      <td>$49,080</td>
      <td>$50,780</td>
      <td>$(1,700)</td>
      <td>103.46%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Salaries</td>
      <td>$584,634</td>
      <td>$423,562</td>
      <td>$161,072</td>
      <td>72.45%</td>
    </tr>
    <tr>
      <td>Public Works Park Dept. Expenses</td>
      <td>$332,850</td>
      <td>$222,441</td>
      <td>$110,409</td>
      <td>66.83%</td>
    </tr>
    <tr>
      <td>Public Works Street Lighting Expenses</td>
      <td>$725,800</td>
      <td>$625,694</td>
      <td>$100,106</td>
      <td>86.21%</td>
    </tr>
    <tr>
      <td>Public Works Snow &amp; Ice Removal Salaries</td>
      <td>$358,587</td>
      <td>$365,877</td>
      <td>$(7,290)</td>
      <td>102.03%</td>
    </tr>
    <tr>
      <td>Public Works Snow &amp; Ice Removal Expenses</td>
      <td>$3,279,032</td>
      <td>$4,278,105</td>
      <td>$(999,073)</td>
      <td>130.47%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC WORKS</th>
      <td>$14,807,189</td>
      <td>$13,102,204</td>
      <td>$1,704,985</td>
      <td>88.5%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Citizens Center Salaries</td>
      <td>$303,619</td>
      <td>$281,719</td>
      <td>$21,900</td>
      <td>92.79%</td>
    </tr>
    <tr>
      <td>Citizens Center Expenses</td>
      <td>$188,010</td>
      <td>$122,395</td>
      <td>$65,615</td>
      <td>65.10%</td>
    </tr>
    <tr>
      <td>Veterans Services Salaries</td>
      <td>$118,032</td>
      <td>$108,804</td>
      <td>$9,228</td>
      <td>92.18%</td>
    </tr>
    <tr>
      <td>Veterans Services Expenses</td>
      <td>$558,000</td>
      <td>$389,820</td>
      <td>$168,180</td>
      <td>69.86%</td>
    </tr>
    <tr>
      <td>Senior Services Salaries</td>
      <td>$13,500</td>
      <td>$9,231</td>
      <td>$4,269</td>
      <td>68.38%</td>
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
      <td>$66,566</td>
      <td>$(7,566)</td>
      <td>112.82%</td>
    </tr>
    <tr>
      <td>Recreation Salaries</td>
      <td>$193,129</td>
      <td>$171,922</td>
      <td>$21,207</td>
      <td>89.02%</td>
    </tr>
    <tr>
      <td>Recreation Expenses</td>
      <td>$85,000</td>
      <td>$35,112</td>
      <td>$49,888</td>
      <td>41.31%</td>
    </tr>
    <tr>
      <td>Public Library Salaries</td>
      <td>$1,665,862</td>
      <td>$1,500,381</td>
      <td>$165,481</td>
      <td>90.07%</td>
    </tr>
    <tr>
      <td>Public Library Expenses</td>
      <td>$293,585</td>
      <td>$259,937</td>
      <td>$33,648</td>
      <td>88.54%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL HUMAN SERVICES</th>
      <td>$3,480,437</td>
      <td>$2,945,887</td>
      <td>$534,550</td>
      <td>84.6%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Debt Service</td>
      <td>$9,491,008</td>
      <td>$8,341,072</td>
      <td>$1,149,936</td>
      <td>87.88%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL DEBT SERVICE</th>
      <td>$9,491,008</td>
      <td>$8,341,072</td>
      <td>$1,149,936</td>
      <td>87.9%</td>
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
      <td>$115,459</td>
      <td>$114,541</td>
      <td>50.20%</td>
    </tr>
    <tr>
      <td>Group Insurance</td>
      <td>$29,765,000</td>
      <td>$25,633,797</td>
      <td>$4,131,203</td>
      <td>86.12%</td>
    </tr>
    <tr>
      <td>Payroll Taxes (FICA/Medicare)</td>
      <td>$2,103,796</td>
      <td>$1,972,088</td>
      <td>$131,708</td>
      <td>93.74%</td>
    </tr>
    <tr>
      <td>Workers Compensation</td>
      <td>$915,000</td>
      <td>$920,097</td>
      <td>$(5,097)</td>
      <td>100.56%</td>
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
      <td>$49,801</td>
      <td>$71,199</td>
      <td>41.16%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EMPLOYEE BENEFITS</th>
      <td>$56,828,998</td>
      <td>$52,472,891</td>
      <td>$4,356,107</td>
      <td>92.3%</td>
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
      <td>$148,362</td>
      <td>$257,309</td>
      <td>36.57%</td>
    </tr>
    <tr>
      <td>State Assessments (Cherry Sheets)</td>
      <td>$9,524,223</td>
      <td>$9,091,196</td>
      <td>$433,027</td>
      <td>95.45%</td>
    </tr>
    <tr>
      <td>Reserve for Abatement &amp; Exemption (Overlay)</td>
      <td>$250,000</td>
      <td>$250,000</td>
      <td>$250,000</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <th scope="row">TOTAL OTHER CITY EXPENSES</th>
      <td>$11,694,648</td>
      <td>$11,004,312</td>
      <td>$690,336</td>
      <td>94.1%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">TOTAL GENERAL FUND</th>
      <td>$279,121,624</td>
      <td>$238,888,105</td>
      <td>$40,233,519</td>
      <td>85.6%</td>
    </tr>
  </tbody>
</table>

<table>
  <caption>Water and wastewater enterprise funds</caption>
  <thead>
    <tr>
      <th scope="col">City Department</th>
      <th scope="col">Budget</th>
      <th scope="col">Expended as of 5/31/26</th>
      <th scope="col">Unexpended as of 5/31/26</th>
      <th scope="col">% Expended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Water Department Salaries</td>
      <td>$3,780,009</td>
      <td>$3,322,793</td>
      <td>$457,216</td>
      <td>87.90%</td>
    </tr>
    <tr>
      <td>Water Department Expenses</td>
      <td>$9,318,378</td>
      <td>$7,758,490</td>
      <td>$1,559,888</td>
      <td>83.26%</td>
    </tr>
    <tr>
      <td>Water Department Capital</td>
      <td>$300,000</td>
      <td>$261,594</td>
      <td>$38,406</td>
      <td>87.20%</td>
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
      <td>$11,591,371</td>
      <td>$2,055,510</td>
      <td>84.9%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <td>Wastewater Salaries</td>
      <td>$3,089,104</td>
      <td>$2,417,534</td>
      <td>$671,570</td>
      <td>78.26%</td>
    </tr>
    <tr>
      <td>Wastewater Expenses</td>
      <td>$11,894,907</td>
      <td>$9,206,943</td>
      <td>$2,687,964</td>
      <td>77.40%</td>
    </tr>
    <tr>
      <td>Wastewater Capital</td>
      <td>$1,127,000</td>
      <td>$94,544</td>
      <td>$1,032,456</td>
      <td>8.39%</td>
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
      <td>$12,417,463</td>
      <td>$4,391,990</td>
      <td>73.9%</td>
    </tr>
  </tbody>
</table>

<table>
  <caption>Expended through 31 May, this year against the two before it</caption>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">FY &rsquo;24 through 5/31/24</th>
      <th scope="col">FY &rsquo;25 through 5/31/25</th>
      <th scope="col">FY &rsquo;26 through 5/31/26</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">TOTAL GENERAL GOVERNMENT</th>
      <td>$4,344,560</td>
      <td>$4,876,720</td>
      <td>$4,447,436</td>
    </tr>
    <tr>
      <th scope="row">TOTAL COMMUNITY &amp; ECONOMIC DEVELO</th>
      <td>$1,841,331</td>
      <td>$1,930,818</td>
      <td>$1,976,673</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC SAFETY</th>
      <td>$25,062,982</td>
      <td>$27,702,688</td>
      <td>$28,560,564</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EDUCATION</th>
      <td>$105,137,072</td>
      <td>$116,435,671</td>
      <td>$116,037,066</td>
    </tr>
    <tr>
      <th scope="row">TOTAL PUBLIC WORKS</th>
      <td>$10,261,921</td>
      <td>$10,409,730</td>
      <td>$13,102,204</td>
    </tr>
    <tr>
      <th scope="row">TOTAL HUMAN SERVICES</th>
      <td>$3,014,045</td>
      <td>$3,045,325</td>
      <td>$2,945,887</td>
    </tr>
    <tr>
      <th scope="row">TOTAL DEBT SERVICE</th>
      <td>$4,389,504</td>
      <td>$4,180,505</td>
      <td>$8,341,072</td>
    </tr>
    <tr>
      <th scope="row">TOTAL EMPLOYEE BENEFITS</th>
      <td>$46,314,637</td>
      <td>$46,382,629</td>
      <td>$52,472,891</td>
    </tr>
    <tr>
      <th scope="row">TOTAL OTHER CITY EXPENSES</th>
      <td>$9,549,018</td>
      <td>$9,916,345</td>
      <td>$11,004,312</td>
    </tr>
    <tr>
      <th scope="row">TOTAL CITY EXPENDITURES</th>
      <td>$209,915,070</td>
      <td>$224,880,431</td>
      <td>$238,888,105</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">TOTAL WATER DEPARTMENT</th>
      <td>$10,504,262</td>
      <td>$10,528,922</td>
      <td>$11,591,371</td>
    </tr>
    <tr>
      <th scope="row">TOTAL WASTEWATER DEPARTMENT</th>
      <td>$11,902,085</td>
      <td>$12,661,088</td>
      <td>$12,417,463</td>
    </tr>
  </tbody>
</table>

<h2>City of Haverhill Revenue Report, Period Ending 5/31/26</h2>

<table>
  <caption>Year to Year Comparison</caption>
  <thead>
    <tr>
      <th scope="col">Revenue Source</th>
      <th scope="col">5/31/2024</th>
      <th scope="col">5/31/2025</th>
      <th scope="col">5/31/2026</th>
      <th scope="col">FY 25 to 26 % Change</th>
      <th scope="col">FY 25 to 26 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Real Estate &amp; Pers Property</td>
      <td>$121,568,206</td>
      <td>$131,667,574</td>
      <td>$137,866,718</td>
      <td>4.71%</td>
      <td>$6,199,144</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$7,804,979</td>
      <td>$8,747,972</td>
      <td>$8,740,186</td>
      <td>-0.09%</td>
      <td>$(7,786)</td>
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
      <td>$10,825</td>
      <td>$7,719</td>
      <td>$8,746</td>
      <td>13.30%</td>
      <td>$1,027</td>
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
      <td>$2,793,918</td>
      <td>$2,856,415</td>
      <td>$2,600,387</td>
      <td>-8.96%</td>
      <td>$(256,028)</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$156,633</td>
      <td>$35,798</td>
      <td>$42,238</td>
      <td>17.99%</td>
      <td>$6,440</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$759,734</td>
      <td>$660,127</td>
      <td>$535,356</td>
      <td>-18.90%</td>
      <td>$(124,771)</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$946,739</td>
      <td>$1,050,306</td>
      <td>$1,081,740</td>
      <td>2.99%</td>
      <td>$31,434</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$222,376</td>
      <td>$152,964</td>
      <td>$161,467</td>
      <td>5.56%</td>
      <td>$8,503</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$751,093</td>
      <td>$580,614</td>
      <td>$339,813</td>
      <td>-41.47%</td>
      <td>$(240,801)</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$2,608,605</td>
      <td>$2,809,627</td>
      <td>$1,836,778</td>
      <td>-34.63%</td>
      <td>$(972,849)</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$693,894</td>
      <td>$603,454</td>
      <td>$656,767</td>
      <td>8.83%</td>
      <td>$53,313</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$2,744,530</td>
      <td>$2,699,353</td>
      <td>$2,730,557</td>
      <td>1.16%</td>
      <td>$31,204</td>
    </tr>
    <tr>
      <td>Medicaid Reimbursement</td>
      <td>$805,004</td>
      <td>$635,002</td>
      <td>$664,035</td>
      <td>4.57%</td>
      <td>$29,033</td>
    </tr>
    <tr>
      <td>*Misc Revenue</td>
      <td>$87,842</td>
      <td>$235,780</td>
      <td>$18,976</td>
      <td>-91.95%</td>
      <td>$(216,804)</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$80,358,800</td>
      <td>$85,185,277</td>
      <td>$99,247,166</td>
      <td>16.51%</td>
      <td>$14,061,889</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$13,590,800</td>
      <td>$14,871,239</td>
      <td>$14,447,532</td>
      <td>-2.85%</td>
      <td>$(423,707)</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$11,109,509</td>
      <td>$12,858,814</td>
      <td>$13,424,241</td>
      <td>4.40%</td>
      <td>$565,427</td>
    </tr>
    <tr>
      <td>Other GF Rev - Trnsf From Sp Rev &amp; Free Cash</td>
      <td>$872,801</td>
      <td>$6,290,257</td>
      <td>$6,221,936</td>
      <td>-1.09%</td>
      <td>$(68,321)</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Total Revenue</th>
      <td>$249,966,373</td>
      <td>$274,075,252</td>
      <td>$292,842,758</td>
      <td>6.85%</td>
      <td>$18,767,506</td>
    </tr>
    <tr>
      <th scope="row">Total Revenue without Enterprise Funds</th>
      <td>$225,266,064</td>
      <td>$246,345,199</td>
      <td>$264,970,985</td>
      <td>7.56%</td>
      <td>$18,625,786</td>
    </tr>
    <tr>
      <th scope="row">Total Local Receipts</th>
      <td>$22,466,257</td>
      <td>$23,202,091</td>
      <td>$21,635,165</td>
      <td>-6.75%</td>
      <td>$(1,566,926)</td>
    </tr>
    <tr>
      <th scope="row">Total Local Receipts not including Investments</th>
      <td>$19,721,727</td>
      <td>$20,502,738</td>
      <td>$18,904,608</td>
      <td>-7.79%</td>
      <td>$(1,598,130)</td>
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
      <td>$137,866,718</td>
      <td>$(2,456,282)</td>
      <td>98%</td>
      <td>98.2%</td>
    </tr>
    <tr>
      <td>Motor Vehcile Excise</td>
      <td>$8,477,111</td>
      <td>$8,740,186</td>
      <td>$263,075</td>
      <td>100%</td>
      <td>103.1%</td>
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
      <td>$309,979</td>
      <td>$257,330</td>
      <td>$(52,649)</td>
      <td>75%</td>
      <td>83.0%</td>
    </tr>
    <tr>
      <td>Boat &amp; Other Excise</td>
      <td>$8,497</td>
      <td>$8,746</td>
      <td>$249</td>
      <td>75%</td>
      <td>102.9%</td>
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
      <td>$2,600,387</td>
      <td>$(139,788)</td>
      <td>92%</td>
      <td>94.9%</td>
    </tr>
    <tr>
      <td>PILOT</td>
      <td>$274,189</td>
      <td>$42,238</td>
      <td>$(231,951)</td>
      <td>92%</td>
      <td>15.4%</td>
    </tr>
    <tr>
      <td>Penalties &amp; Interest</td>
      <td>$742,361</td>
      <td>$535,356</td>
      <td>$(207,005)</td>
      <td>92%</td>
      <td>72.1%</td>
    </tr>
    <tr>
      <td>Fees</td>
      <td>$962,670</td>
      <td>$1,081,740</td>
      <td>$119,070</td>
      <td>92%</td>
      <td>112.4%</td>
    </tr>
    <tr>
      <td>Rentals</td>
      <td>$198,450</td>
      <td>$161,467</td>
      <td>$(36,983)</td>
      <td>92%</td>
      <td>81.4%</td>
    </tr>
    <tr>
      <td>Departmental Revenue</td>
      <td>$658,253</td>
      <td>$339,813</td>
      <td>$(318,440)</td>
      <td>92%</td>
      <td>51.6%</td>
    </tr>
    <tr>
      <td>License &amp; Permits</td>
      <td>$2,289,912</td>
      <td>$1,836,778</td>
      <td>$(453,134)</td>
      <td>92%</td>
      <td>80.2%</td>
    </tr>
    <tr>
      <td>Fines &amp; Forefits</td>
      <td>$628,275</td>
      <td>$656,767</td>
      <td>$28,492</td>
      <td>92%</td>
      <td>104.5%</td>
    </tr>
    <tr>
      <td>Investments</td>
      <td>$1,976,991</td>
      <td>$2,730,557</td>
      <td>$753,566</td>
      <td>92%</td>
      <td>138.1%</td>
    </tr>
    <tr>
      <td>Medicaid Reimbursement</td>
      <td>$950,000</td>
      <td>$664,035</td>
      <td>$(285,965)</td>
      <td>92%</td>
      <td>69.9%</td>
    </tr>
    <tr>
      <td>*Misc Revenue</td>
      <td></td>
      <td>$18,976</td>
      <td>$18,976</td>
      <td>0%</td>
      <td>100.0%</td>
    </tr>
    <tr>
      <td>Comm of MA Cherry Sheet</td>
      <td>$108,035,147</td>
      <td>$99,247,166</td>
      <td>$(8,787,981)</td>
      <td>92%</td>
      <td>91.9%</td>
    </tr>
    <tr>
      <td>Wastewater Enterprise Fund</td>
      <td>$16,348,592</td>
      <td>$14,447,532</td>
      <td>$(1,901,060)</td>
      <td>92%</td>
      <td>88.4%</td>
    </tr>
    <tr>
      <td>Water Enterprise Fund</td>
      <td>$14,146,881</td>
      <td>$13,424,241</td>
      <td>$(722,640)</td>
      <td>92%</td>
      <td>94.9%</td>
    </tr>
    <tr>
      <td>Other GF Rev - Trnsf From Sp Rev &amp; Free Cash</td>
      <td>$6,250,867</td>
      <td>$6,221,936</td>
      <td>$(28,931)</td>
      <td>92%</td>
      <td>99.5%</td>
    </tr>
    <tr>
      <th scope="row">Total</th>
      <td>$307,714,338</td>
      <td>$292,842,758</td>
      <td>$(14,871,580)</td>
      <td>95%</td>
      <td>95.2%</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Estimated General Fund Revenue</th>
      <td>$277,218,865</td>
      <td>$264,970,985</td>
      <td>$(12,247,880)</td>
      <td>93%</td>
      <td>95.6%</td>
    </tr>
    <tr>
      <th scope="row">Estimated Local Receipts</th>
      <td>$22,609,851</td>
      <td>$21,635,165</td>
      <td>$(974,686)</td>
      <td>93%</td>
      <td>95.7%</td>
    </tr>
  </tbody>
</table>

<p>Prepared by Angel A. Perkins, Chief Financial Officer</p>

<h2>Minutes</h2>

<p>
  MOTION BY COUNCILOR SULLIVAN TO RECEIVE AND PLACE ON FILE, SECOND BY COUNCILOR MCGONAGLE<br />
  PASSED YEAS 11, NAYS 0, ABSENT 0
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-letter`)} target="_blank" rel="noopener">
      Letter from Angel A. Perkins, City Auditor &amp; Chief Financial Officer, June 11, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/expense-report`)} target="_blank" rel="noopener">
      Expense Report as of 5/31/2026<span class="sr-only"
        >, PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/revenue-report`)} target="_blank" rel="noopener">
      Revenue Report, Period Ending 5/31/26<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

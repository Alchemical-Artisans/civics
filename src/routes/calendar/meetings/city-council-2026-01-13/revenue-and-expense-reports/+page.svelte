<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "revenue-and-expense-reports"
</script>

<p>
  Angel Perkins, <em>City Auditor &amp; Chief Financial Officer</em>, submits the revenue and
  expense reports through December 2025
</p>

<h2>Expense Report as of 12/31/2025</h2>

<p>Year to Date Benchmark 50.00%</p>

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
    <tr
      ><td>Council Salaries</td><td>$234,279</td><td>$120,535</td><td>$113,744</td><td>51.45%</td
      ></tr
    >
    <tr><td>Council Expenses</td><td>$8,100</td><td>$1,110</td><td>$6,990</td><td>13.71%</td></tr>
    <tr
      ><td>Mayor Salaries</td><td>$432,688</td><td>$236,001</td><td>$196,687</td><td>54.54%</td></tr
    >
    <tr><td>Mayor Expenses</td><td>$210,250</td><td>$79,767</td><td>$130,483</td><td>37.94%</td></tr
    >
    <tr
      ><td>Auditor&rsquo;s Office Salaries</td><td>$377,209</td><td>$183,981</td><td>$193,228</td
      ><td>48.77%</td></tr
    >
    <tr
      ><td>Auditor&rsquo;s Office Expenses</td><td>$139,381</td><td>$18,909</td><td>$120,472</td><td
        >13.57%</td
      ></tr
    >
    <tr
      ><td>Assessors Salaries</td><td>$297,788</td><td>$160,502</td><td>$137,286</td><td>53.90%</td
      ></tr
    >
    <tr
      ><td>Assessors Expenses</td><td>$179,215</td><td>$16,408</td><td>$162,807</td><td>9.16%</td
      ></tr
    >
    <tr
      ><td>Treasurer/Collector Salaries</td><td>$469,208</td><td>$201,358</td><td>$267,850</td><td
        >42.91%</td
      ></tr
    >
    <tr
      ><td>Treasurer/Collector Expenses</td><td>$251,300</td><td>$89,461</td><td>$161,839</td><td
        >35.60%</td
      ></tr
    >
    <tr
      ><td>Constituent Services Salaries</td><td>$109,442</td><td>$56,529</td><td>$52,913</td><td
        >51.65%</td
      ></tr
    >
    <tr
      ><td>Constituent Services Expenses</td><td>$15,500</td><td>$-</td><td>$15,500</td><td
        >0.00%</td
      ></tr
    >
    <tr
      ><td>Purchasing Salaries</td><td>$100,547</td><td>$53,963</td><td>$46,584</td><td>53.67%</td
      ></tr
    >
    <tr
      ><td>Purchasing Expenses</td><td>$12,050</td><td>$4,242</td><td>$7,808</td><td>35.20%</td></tr
    >
    <tr
      ><td>Law Department Salaries</td><td>$46,818</td><td>$23,877</td><td>$22,941</td><td
        >51.00%</td
      ></tr
    >
    <tr
      ><td>Law Department Legal</td><td>$536,000</td><td>$124,669</td><td>$411,331</td><td
        >23.26%</td
      ></tr
    >
    <tr
      ><td>Human Resources Salaries</td><td>$318,404</td><td>$170,673</td><td>$147,731</td><td
        >53.60%</td
      ></tr
    >
    <tr
      ><td>Human Resources Expenses</td><td>$147,550</td><td>$75,895</td><td>$71,655</td><td
        >51.44%</td
      ></tr
    >
    <tr><td>MIS Salaries</td><td>$160,000</td><td>$106,052</td><td>$53,948</td><td>66.28%</td></tr>
    <tr><td>MIS Expenses</td><td>$638,134</td><td>$368,795</td><td>$269,339</td><td>57.79%</td></tr>
    <tr><td>MIS Capital</td><td>$50,000</td><td>$20,512</td><td>$29,488</td><td>41.02%</td></tr>
    <tr
      ><td>City Clerk Salaries</td><td>$594,766</td><td>$300,199</td><td>$294,567</td><td>50.47%</td
      ></tr
    >
    <tr
      ><td>City Clerk Expenses</td><td>$171,380</td><td>$74,605</td><td>$96,775</td><td>43.53%</td
      ></tr
    >
    <tr
      ><th scope="row">*TOTAL GENERAL GOVERNMENT</th><td>$5,500,009</td><td>$2,488,044</td><td
        >$3,011,965</td
      ><td>45.2%</td></tr
    >
    <tr
      ><td>Building Maint. Salaries</td><td>$79,127</td><td>$31,339</td><td>$47,788</td><td
        >39.61%</td
      ></tr
    >
    <tr
      ><td>Building Maint. Expenses</td><td>$298,500</td><td>$99,111</td><td>$199,389</td><td
        >33.20%</td
      ></tr
    >
    <tr
      ><td>Inspectional &amp; Health Services Salaries</td><td>$1,205,528</td><td>$634,525</td><td
        >$571,003</td
      ><td>52.63%</td></tr
    >
    <tr
      ><td>Inspectional &amp; Health Services Expenses</td><td>$46,950</td><td>$18,112</td><td
        >$28,838</td
      ><td>38.58%</td></tr
    >
    <tr
      ><td>Public Health Salaries</td><td>$247,498</td><td>$140,719</td><td>$106,779</td><td
        >56.86%</td
      ></tr
    >
    <tr><td>Public Health Expenses</td><td>$9,000</td><td>$462</td><td>$8,538</td><td>5.14%</td></tr
    >
    <tr
      ><td>Economic Development Salaries</td><td>$291,516</td><td>$143,215</td><td>$148,301</td><td
        >49.13%</td
      ></tr
    >
    <tr
      ><td>Economic Development Expenses</td><td>$56,162</td><td>$5,910</td><td>$50,252</td><td
        >10.52%</td
      ></tr
    >
    <tr
      ><th scope="row">*TOTAL COMMUNITY &amp; ECONOMIC DEVELOPMENT</th><td>$2,234,281</td><td
        >$1,073,394</td
      ><td>$1,160,887</td><td>48.0%</td></tr
    >
    <tr
      ><td>Police Salaries</td><td>$14,399,407</td><td>$7,868,624</td><td>$6,530,783</td><td
        >54.65%</td
      ></tr
    >
    <tr
      ><td>Police Expenses</td><td>$1,813,628</td><td>$733,719</td><td>$1,079,909</td><td>40.46%</td
      ></tr
    >
    <tr><td>Police Capital</td><td>$353,000</td><td>$334,623</td><td>$18,377</td><td>94.79%</td></tr
    >
    <tr
      ><td>Fire Salaries</td><td>$13,774,479</td><td>$7,552,955</td><td>$6,221,524</td><td
        >54.83%</td
      ></tr
    >
    <tr
      ><td>Fire Expenses</td><td>$1,029,809</td><td>$418,952</td><td>$610,857</td><td>40.68%</td
      ></tr
    >
    <tr><td>Fire Capital</td><td>$5,824</td><td>$-</td><td>$5,824</td><td>0.00%</td></tr>
    <tr
      ><th scope="row">*TOTAL PUBLIC SAFETY</th><td>$31,376,147</td><td>$16,908,874</td><td
        >$14,467,273</td
      ><td>53.89%</td></tr
    >
    <tr
      ><td>Whittier Regional School Assessment</td><td>$8,704,320</td><td>$4,352,160</td><td
        >$4,352,160</td
      ><td>50.00%</td></tr
    >
    <tr
      ><td>North Shore Essex Tech. Assessment</td><td>$664,063</td><td>$372,887</td><td>$291,176</td
      ><td>56.15%</td></tr
    >
    <tr><td>School Other Funding</td><td>$15,000</td><td>$-</td><td>$15,000</td><td>0.00%</td></tr>
    <tr
      ><td>School Department</td><td>$133,801,660</td><td>$51,187,820</td><td>$82,613,840</td><td
        >38.26%</td
      ></tr
    >
    <tr
      ><th scope="row">*TOTAL EDUCATION</th><td>$143,185,043</td><td>$55,912,867</td><td
        >$87,272,176</td
      ><td>39.0%</td></tr
    >
    <tr
      ><td>Public Works Administration Salaries</td><td>$59,607</td><td>$31,269</td><td>$28,338</td
      ><td>52.46%</td></tr
    >
    <tr
      ><td>Public Works Administration Expenses</td><td>$44,804</td><td>$11,247</td><td>$33,557</td
      ><td>25.10%</td></tr
    >
    <tr
      ><td>Public Works Highways Salaries</td><td>$1,404,280</td><td>$701,358</td><td>$702,922</td
      ><td>49.94%</td></tr
    >
    <tr
      ><td>Public Works Highways Expenses</td><td>$840,655</td><td>$413,256</td><td>$427,399</td><td
        >49.16%</td
      ></tr
    >
    <tr
      ><td>Public Works Highways Capital</td><td>$112,000</td><td>$19,062</td><td>$92,938</td><td
        >17.02%</td
      ></tr
    >
    <tr
      ><td>Public Works Solid Waste/Recycling Salaries</td><td>$218,185</td><td>$111,888</td><td
        >$106,297</td
      ><td>51.28%</td></tr
    >
    <tr
      ><td>Public Works Solid Waste/Recycling Expenses</td><td>$5,985,808</td><td>$1,968,423</td><td
        >$4,017,385</td
      ><td>32.88%</td></tr
    >
    <tr
      ><td>Public Works Parking Area Salaries</td><td>$51,726</td><td>$27,146</td><td>$24,580</td
      ><td>52.48%</td></tr
    >
    <tr
      ><td>Public Works Parking Area Expenses</td><td>$369,101</td><td>$153,294</td><td>$215,807</td
      ><td>41.53%</td></tr
    >
    <tr
      ><td>Public Works Street Marking Expenses</td><td>$116,883</td><td>$107,434</td><td>$9,449</td
      ><td>91.92%</td></tr
    >
    <tr
      ><td>Public Works Fleet Maint. Salaries</td><td>$274,157</td><td>$105,633</td><td>$168,524</td
      ><td>38.53%</td></tr
    >
    <tr
      ><td>Public Works Fleet Maint. Expenses</td><td>$49,080</td><td>$9,549</td><td>$39,531</td><td
        >19.45%</td
      ></tr
    >
    <tr
      ><td>Public Works Park Dept. Salaries</td><td>$584,634</td><td>$262,594</td><td>$322,040</td
      ><td>44.92%</td></tr
    >
    <tr
      ><td>Public Works Park Dept. Expenses</td><td>$332,850</td><td>$140,001</td><td>$192,849</td
      ><td>42.06%</td></tr
    >
    <tr
      ><td>Public Works Street Lighting Expenses</td><td>$725,800</td><td>$343,754</td><td
        >$382,046</td
      ><td>47.36%</td></tr
    >
    <tr
      ><td>Public Works Snow &amp; Ice Removal Salaries</td><td>$229,330</td><td>$61,450</td><td
        >$167,880</td
      ><td>26.80%</td></tr
    >
    <tr
      ><td>Public Works Snow &amp; Ice Removal Expenses</td><td>$980,670</td><td>$319,766</td><td
        >$660,904</td
      ><td>32.61%</td></tr
    >
    <tr
      ><th scope="row">*TOTAL PUBLIC WORKS</th><td>$12,379,570</td><td>$4,787,123</td><td
        >$7,592,447</td
      ><td>38.7%</td></tr
    >
    <tr
      ><td>Citizens Center Salaries</td><td>$303,619</td><td>$185,387</td><td>$118,232</td><td
        >61.06%</td
      ></tr
    >
    <tr
      ><td>Citizens Center Expenses</td><td>$188,010</td><td>$66,939</td><td>$121,071</td><td
        >35.60%</td
      ></tr
    >
    <tr
      ><td>Veterans Services Salaries</td><td>$115,545</td><td>$61,483</td><td>$54,062</td><td
        >53.21%</td
      ></tr
    >
    <tr
      ><td>Veterans Services Expenses</td><td>$558,000</td><td>$206,312</td><td>$351,688</td><td
        >36.97%</td
      ></tr
    >
    <tr
      ><td>Senior Services Salaries</td><td>$13,500</td><td>$5,192</td><td>$8,308</td><td>38.46%</td
      ></tr
    >
    <tr><td>Senior Services Expenses</td><td>$2,700</td><td>$-</td><td>$2,700</td><td>0.00%</td></tr
    >
    <tr
      ><td>Stadium Commission</td><td>$59,000</td><td>$39,657</td><td>$19,343</td><td>67.22%</td
      ></tr
    >
    <tr
      ><td>Recreation Salaries</td><td>$193,129</td><td>$152,300</td><td>$40,829</td><td>78.86%</td
      ></tr
    >
    <tr
      ><td>Recreation Expenses</td><td>$85,000</td><td>$21,602</td><td>$63,398</td><td>25.41%</td
      ></tr
    >
    <tr
      ><td>Public Library Salaries</td><td>$1,665,862</td><td>$840,300</td><td>$825,563</td><td
        >50.44%</td
      ></tr
    >
    <tr
      ><td>Public Library Expenses</td><td>$293,585</td><td>$183,693</td><td>$109,892</td><td
        >62.57%</td
      ></tr
    >
    <tr
      ><th scope="row">*TOTAL HUMAN SERVICES</th><td>$3,477,950</td><td>$1,762,865</td><td
        >$1,715,085</td
      ><td>50.7%</td></tr
    >
    <tr
      ><td>Debt Service</td><td>$9,491,008</td><td>$6,027,659</td><td>$3,463,349</td><td>63.51%</td
      ></tr
    >
    <tr
      ><th scope="row">*TOTAL DEBT SERVICE</th><td>$9,491,008</td><td>$6,027,659</td><td
        >$3,463,349</td
      ><td>63.5%</td></tr
    >
    <tr
      ><td>Retirement Fund</td><td>$22,967,281</td><td>$22,967,281</td><td>$-</td><td>100.00%</td
      ></tr
    >
    <tr
      ><td>Unemployment Compensation</td><td>$230,000</td><td>$60,410</td><td>$169,590</td><td
        >26.27%</td
      ></tr
    >
    <tr
      ><td>Group Insurance</td><td>$29,765,000</td><td>$13,334,956</td><td>$16,430,044</td><td
        >44.80%</td
      ></tr
    >
    <tr
      ><td>Payroll Taxes (FICA/Medicare)</td><td>$2,103,796</td><td>$1,010,876</td><td
        >$1,092,920</td
      ><td>48.05%</td></tr
    >
    <tr
      ><td>Workers Compensation</td><td>$915,000</td><td>$346,473</td><td>$568,527</td><td
        >37.87%</td
      ></tr
    >
    <tr
      ><td>Injured on Duty Claims</td><td>$230,967</td><td>$178,414</td><td>$52,553</td><td
        >77.25%</td
      ></tr
    >
    <tr
      ><td>Sick Leave Bank</td><td>$126,000</td><td>$273,438</td><td>$(147,438)</td><td>217.01%</td
      ></tr
    >
    <tr
      ><td>Vacational Buyback</td><td>$55,000</td><td>$59,315</td><td>$(4,315)</td><td>107.85%</td
      ></tr
    >
    <tr
      ><td>Retiree Medical Claims</td><td>$121,000</td><td>$30,712</td><td>$90,288</td><td
        >25.38%</td
      ></tr
    >
    <tr
      ><th scope="row">*TOTAL EMPLOYEE BENEFITS</th><td>$56,514,044</td><td>$38,261,876</td><td
        >$18,252,168</td
      ><td>67.7%</td></tr
    >
    <tr
      ><td>General Liability Insurance</td><td>$1,303,678</td><td>$1,256,819</td><td>$46,859</td><td
        >96.41%</td
      ></tr
    >
    <tr
      ><td>Salary Reserve</td><td>$1,080,000</td><td>$20,311</td><td>$1,059,689</td><td>1.88%</td
      ></tr
    >
    <tr><td>Budget Reserve</td><td>$805,671</td><td>$61,930</td><td>$743,741</td><td>7.69%</td></tr>
    <tr
      ><td>State Assessments (Cherry Sheets)</td><td>$9,524,223</td><td>$4,831,409</td><td
        >$4,692,814</td
      ><td>50.73%</td></tr
    >
    <tr
      ><td>Reserve for Abatement &amp; Exemption (Overlay)</td><td>$250,000</td><td>$-</td><td
        >$250,000</td
      ><td>0.00%</td></tr
    >
    <tr
      ><th scope="row">*TOTAL OTHER CITY EXPENSES</th><td>$12,963,572</td><td>$6,170,468</td><td
        >$6,793,104</td
      ><td>47.6%</td></tr
    >
    <tr
      ><th scope="row">*TOTAL GENERAL FUND</th><td>$277,121,624</td><td>$133,393,171</td><td
        >$143,728,453</td
      ><td>48.1%</td></tr
    >
  </tbody>
</table>

<table>
  <caption>Enterprise funds</caption>
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
    <tr
      ><td>Water Department Salaries</td><td>$3,780,009</td><td>$1,959,166</td><td>$1,820,843</td
      ><td>51.83%</td></tr
    >
    <tr
      ><td>Water Department Expenses</td><td>$9,318,378</td><td>$5,045,177</td><td>$4,273,201</td
      ><td>54.14%</td></tr
    >
    <tr
      ><td>Water Department Capital</td><td>$300,000</td><td>$221,088</td><td>$78,912</td><td
        >73.70%</td
      ></tr
    >
    <tr
      ><td>Water Department Indirect</td><td>$248,494</td><td>$-</td><td>$248,494</td><td>0.00%</td
      ></tr
    >
    <tr
      ><th scope="row">*TOTAL WATER DEPARTMENT</th><td>$13,646,881</td><td>$7,225,430</td><td
        >$6,421,451</td
      ><td>52.9%</td></tr
    >
    <tr
      ><td>Wastewater Salaries</td><td>$3,089,104</td><td>$1,373,747</td><td>$1,715,357</td><td
        >44.47%</td
      ></tr
    >
    <tr
      ><td>Wastewater Expenses</td><td>$11,894,907</td><td>$4,792,908</td><td>$7,101,999</td><td
        >40.29%</td
      ></tr
    >
    <tr
      ><td>Wastewater Capital</td><td>$1,127,000</td><td>$40,808</td><td>$1,086,192</td><td
        >3.62%</td
      ></tr
    >
    <tr><td>Wastewater Indirect</td><td>$698,442</td><td>$-</td><td>$698,442</td><td>0.00%</td></tr>
    <tr
      ><th scope="row">*TOTAL WASTEWATER DEPARTMENT</th><td>$16,809,453</td><td>$6,207,463</td><td
        >$10,601,990</td
      ><td>36.9%</td></tr
    >
  </tbody>
</table>

<table>
  <caption>Expenditures by year</caption>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">FY &rsquo;24 through 12/31/23</th>
      <th scope="col">FY &rsquo;25 through 12/31/24</th>
      <th scope="col">FY &rsquo;26 through 12/31/25</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><td>TOTAL GENERAL GOVERNMENT</td><td>$2,685,967</td><td>$2,968,716</td><td>$2,488,044</td
      ></tr
    >
    <tr
      ><td>TOTAL COMMUNITY &amp; ECONOMIC DEVELOPMENT</td><td>$1,013,645</td><td>$1,029,648</td><td
        >$1,073,394</td
      ></tr
    >
    <tr><td>TOTAL PUBLIC SAFETY</td><td>$14,601,924</td><td>$15,625,107</td><td>$16,908,874</td></tr
    >
    <tr><td>TOTAL EDUCATION</td><td>$50,725,101</td><td>$52,322,065</td><td>$55,912,867</td></tr>
    <tr><td>TOTAL PUBLIC WORKS</td><td>$5,282,793</td><td>$4,556,874</td><td>$4,787,123</td></tr>
    <tr><td>TOTAL HUMAN SERVICES</td><td>$1,765,150</td><td>$1,701,658</td><td>$1,762,865</td></tr>
    <tr><td>TOTAL DEBT SERVICE</td><td>$3,097,474</td><td>$3,384,058</td><td>$6,027,659</td></tr>
    <tr
      ><td>TOTAL EMPLOYEE BENEFITS</td><td>$34,528,494</td><td>$31,745,425</td><td>$38,261,876</td
      ></tr
    >
    <tr
      ><td>TOTAL OTHER CITY EXPENSES</td><td>$6,531,386</td><td>$5,867,396</td><td>$6,170,468</td
      ></tr
    >
    <tr
      ><th scope="row">*TOTAL CITY EXPENDITURES</th><td>$120,231,934</td><td>$119,200,947</td><td
        >$133,393,171</td
      ></tr
    >
    <tr><td>TOTAL WATER DEPARTMENT</td><td>$6,503,745</td><td>$6,207,296</td><td>$7,225,430</td></tr
    >
    <tr
      ><td>TOTAL WASTEWATER DEPARTMENT</td><td>$6,389,884</td><td>$5,897,545</td><td>$6,207,463</td
      ></tr
    >
  </tbody>
</table>

<h2>Revenue Report, Period Ending 12/31/25</h2>

<table>
  <caption>Year to Year Comparison</caption>
  <thead>
    <tr>
      <th scope="col">Revenue Source</th>
      <th scope="col">12/31/2023</th>
      <th scope="col">12/31/2024</th>
      <th scope="col">12/31/2025</th>
      <th scope="col">FY 25 to 26 % Change</th>
      <th scope="col">FY 25 to 26 $ Change</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><td>Real Estate &amp; Pers Property</td><td>$59,236,018</td><td>$61,577,833</td><td
        >$65,986,796</td
      ><td>7.16%</td><td>$4,408,963</td></tr
    >
    <tr
      ><td>Motor Vehcile Excise</td><td>$1,419,402</td><td>$1,513,392</td><td>$1,351,495</td><td
        >-10.70%</td
      ><td>$(161,897)</td></tr
    >
    <tr
      ><td>Meals Excise</td><td>$653,664</td><td>$656,596</td><td>$655,953</td><td>-0.10%</td><td
        >$(643)</td
      ></tr
    >
    <tr
      ><td>Hotel / Room Excise</td><td>$202,386</td><td>$198,128</td><td>$201,655</td><td>1.78%</td
      ><td>$3,527</td></tr
    >
    <tr
      ><td>Boat &amp; Other Excise</td><td>$7,838</td><td>$5,492</td><td>$6,171</td><td>12.36%</td
      ><td>$679</td></tr
    >
    <tr
      ><td>Cannabis Excise</td><td>$567,650</td><td>$582,077</td><td>$640,705</td><td>10.07%</td><td
        >$58,628</td
      ></tr
    >
    <tr
      ><td>Waste Disposal Facility Program</td><td>$1,451,553</td><td>$1,085,383</td><td
        >$1,493,671</td
      ><td>37.62%</td><td>$408,288</td></tr
    >
    <tr
      ><td>PILOT</td><td>$21,525</td><td>$243,793</td><td>$30,764</td><td>-87.38%</td><td
        >$(213,029)</td
      ></tr
    >
    <tr
      ><td>Penalties &amp; Interest</td><td>$382,078</td><td>$290,904</td><td>$320,955</td><td
        >10.33%</td
      ><td>$30,051</td></tr
    >
    <tr
      ><td>Fees</td><td>$404,760</td><td>$451,491</td><td>$472,190</td><td>4.58%</td><td>$20,699</td
      ></tr
    >
    <tr
      ><td>Rentals</td><td>$127,111</td><td>$100,551</td><td>$103,088</td><td>2.52%</td><td
        >$2,537</td
      ></tr
    >
    <tr
      ><td>Departmental Revenue</td><td>$473,392</td><td>$474,515</td><td>$276,958</td><td
        >-41.63%</td
      ><td>$(197,557)</td></tr
    >
    <tr
      ><td>License &amp; Permits</td><td>$1,659,761</td><td>$1,661,686</td><td>$1,436,629</td><td
        >-13.54%</td
      ><td>$(225,057)</td></tr
    >
    <tr
      ><td>Fines &amp; Forefits</td><td>$398,568</td><td>$288,564</td><td>$316,965</td><td>9.84%</td
      ><td>$28,401</td></tr
    >
    <tr
      ><td>Investments</td><td>$1,115,344</td><td>$1,591,556</td><td>$1,620,755</td><td>1.83%</td
      ><td>$29,199</td></tr
    >
    <tr
      ><td>Medicaid Reimbursement</td><td>$464,116</td><td>$253,345</td><td>$271,389</td><td
        >7.12%</td
      ><td>$18,044</td></tr
    >
    <tr
      ><th scope="row">*Misc Revenue</th><td>$102,652</td><td>$87,446</td><td>$10,833</td><td
        >-87.61%</td
      ><td>$(76,613)</td></tr
    >
    <tr
      ><td>Comm of MA Cherry Sheet</td><td>$48,284,877</td><td>$50,691,887</td><td>$54,100,773</td
      ><td>6.72%</td><td>$3,408,886</td></tr
    >
    <tr
      ><td>Wastewater Enterprise Fund</td><td>$7,683,135</td><td>$8,698,581</td><td>$8,541,013</td
      ><td>-1.81%</td><td>$(157,568)</td></tr
    >
    <tr
      ><td>Water Enterprise Fund</td><td>$6,444,419</td><td>$7,569,485</td><td>$8,361,520</td><td
        >10.46%</td
      ><td>$792,035</td></tr
    >
    <tr
      ><td>Other GF Rev - Trnsf From Sp Rev &amp; Free Cash</td><td>$6,312,779</td><td
        >$5,300,000</td
      ><td>$6,250,867</td><td>17.94%</td><td>$950,867</td></tr
    >
    <tr
      ><th scope="row">Total</th><td>$137,413,028</td><td>$143,322,705</td><td>$152,451,145</td><td
        >6.37%</td
      ><td>$9,128,440</td></tr
    >
    <tr
      ><th scope="row">Total without Enterprise Funds</th><td>$123,285,474</td><td>$127,054,639</td
      ><td>$135,548,612</td><td>6.69%</td><td>$8,493,973</td></tr
    >
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
    <tr
      ><td>Real Estate &amp; Pers Property</td><td>$140,323,000</td><td>$65,986,796</td><td
        >$(74,336,204)</td
      ><td>50%</td><td>47.0%</td></tr
    >
    <tr
      ><td>Motor Vehcile Excise</td><td>$8,391,880</td><td>$1,351,495</td><td>$(7,040,385)</td><td
        >25%</td
      ><td>16.1%</td></tr
    >
    <tr
      ><td>Meals Excise</td><td>$1,259,948</td><td>$655,953</td><td>$(603,995)</td><td>50%</td><td
        >52.1%</td
      ></tr
    >
    <tr
      ><td>Hotel / Room Excise</td><td>$309,000</td><td>$201,655</td><td>$(107,345)</td><td>50%</td
      ><td>65.3%</td></tr
    >
    <tr
      ><td>Boat &amp; Other Excise</td><td>$9,476</td><td>$6,171</td><td>$(3,305)</td><td>50%</td
      ><td>65.1%</td></tr
    >
    <tr
      ><td>Cannabis Excise</td><td>$1,133,040</td><td>$640,705</td><td>$(492,335)</td><td>50%</td
      ><td>56.5%</td></tr
    >
    <tr
      ><td>Waste Disposal Facility Program</td><td>$2,740,175</td><td>$1,493,671</td><td
        >$(1,246,504)</td
      ><td>50%</td><td>54.5%</td></tr
    >
    <tr
      ><td>PILOT</td><td>$274,189</td><td>$30,764</td><td>$(243,425)</td><td>25%</td><td>11.2%</td
      ></tr
    >
    <tr
      ><td>Penalties &amp; Interest</td><td>$742,361</td><td>$320,955</td><td>$(421,407)</td><td
        >50%</td
      ><td>43.2%</td></tr
    >
    <tr
      ><td>Fees</td><td>$962,671</td><td>$472,190</td><td>$(490,481)</td><td>50%</td><td>49.1%</td
      ></tr
    >
    <tr
      ><td>Rentals</td><td>$198,450</td><td>$103,088</td><td>$(95,362)</td><td>50%</td><td>51.9%</td
      ></tr
    >
    <tr
      ><td>Departmental Revenue</td><td>$658,253</td><td>$276,958</td><td>$(381,295)</td><td>50%</td
      ><td>42.1%</td></tr
    >
    <tr
      ><td>License &amp; Permits</td><td>$2,522,301</td><td>$1,436,629</td><td>$(1,085,672)</td><td
        >50%</td
      ><td>57.0%</td></tr
    >
    <tr
      ><td>Fines &amp; Forefits</td><td>$628,275</td><td>$316,965</td><td>$(311,310)</td><td>50%</td
      ><td>50.5%</td></tr
    >
    <tr
      ><td>Investments</td><td>$1,976,990</td><td>$1,620,755</td><td>$(356,235)</td><td>50%</td><td
        >82.0%</td
      ></tr
    >
    <tr
      ><td>Medicaid Reimbursement</td><td>$735,000</td><td>$271,389</td><td>$(463,611)</td><td
        >50%</td
      ><td>36.9%</td></tr
    >
    <tr
      ><th scope="row">*Misc Revenue</th><td></td><td>$10,833</td><td>$10,833</td><td>50%</td><td
        >100.0%</td
      ></tr
    >
    <tr
      ><td>Comm of MA Cherry Sheet</td><td>$108,005,748</td><td>$54,100,773</td><td
        >$(53,904,975)</td
      ><td>50%</td><td>50.1%</td></tr
    >
    <tr
      ><td>Wastewater Enterprise Fund</td><td>$16,809,453</td><td>$8,541,013</td><td
        >$(8,268,440)</td
      ><td>50%</td><td>50.8%</td></tr
    >
    <tr
      ><td>Water Enterprise Fund</td><td>$14,146,881</td><td>$8,361,520</td><td>$(5,785,361)</td><td
        >50%</td
      ><td>59.1%</td></tr
    >
    <tr
      ><td>Other GF Rev - Trnsf From Sp Rev &amp; Free Cash</td><td>$6,250,867</td><td
        >$6,250,867</td
      ><td>$-</td><td>0%</td><td>100.0%</td></tr
    >
    <tr
      ><th scope="row">Total</th><td>$308,077,958</td><td>$152,451,145</td><td>$(155,626,813)</td
      ><td>48%</td><td>49.5%</td></tr
    >
    <tr
      ><th scope="row">Estimated General Fund Revenue</th><td>$277,121,624</td><td>$135,548,612</td
      ><td>$(141,573,012)</td><td>48%</td><td>48.9%</td></tr
    >
    <tr
      ><th scope="row">Estimated Local Receipts</th><td>$22,542,009</td><td>$9,210,176</td><td
        >$(13,331,833)</td
      ><td>40%</td><td>40.9%</td></tr
    >
  </tbody>
</table>

<h2>Minutes</h2>

<p>
  Motion by Vice President Michitson, Second by Councilor LePage<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-letter`)} target="_blank" rel="noopener">
      Letter from Angel A. Perkins, City Auditor and Chief Financial Officer, January 7, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/expense-report`)} target="_blank" rel="noopener">
      Expense Report as of 12/31/2025<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/revenue-report`)} target="_blank" rel="noopener">
      Revenue Report, Period Ending 12/31/25<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

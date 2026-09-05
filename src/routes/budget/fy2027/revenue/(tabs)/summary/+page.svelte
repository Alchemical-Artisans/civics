<script lang="ts">
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
</script>

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
    <tr>
      <th scope="row">7. Levy Amount Used</th>
      <td>$115,387,595</td>
      <td>$119,052,946</td>
      <td>$123,093,875</td>
      <td>$133,336,191</td>
      <td>15.6%</td>
      <td>$140,340,389</td>
      <td>$146,107,374</td>
      <td>4.1%</td>
      <td>$5,766,985</td>
    </tr>
    <tr>
      <th scope="row">FEES</th>
      <td>$1,120,263</td>
      <td>$1,128,853</td>
      <td>$1,118,203</td>
      <td>$1,157,268</td>
      <td>3.3%</td>
      <td>$962,670</td>
      <td>$998,900</td>
      <td>3.8%</td>
      <td>$36,230</td>
    </tr>
    <tr>
      <th scope="row">FINES &amp; FORFEITS</th>
      <td>$738,716</td>
      <td>$867,029</td>
      <td>$725,450</td>
      <td>$674,504</td>
      <td>-8.7%</td>
      <td>$628,275</td>
      <td>$625,000</td>
      <td>-0.5%</td>
      <td>$(3,275)</td>
    </tr>
    <tr>
      <th scope="row">INVESTMENTS</th>
      <td>$282,915</td>
      <td>$1,606,088</td>
      <td>$3,222,599</td>
      <td>$3,120,502</td>
      <td>1003.0%</td>
      <td>$1,976,991</td>
      <td>$1,000,000</td>
      <td>-49.4%</td>
      <td>$(976,991)</td>
    </tr>
    <tr>
      <th scope="row">LICENSE &amp; PERMITS</th>
      <td>$3,678,439</td>
      <td>$4,098,379</td>
      <td>$3,042,484</td>
      <td>$2,888,395</td>
      <td>-21.5%</td>
      <td>$2,289,912</td>
      <td>$2,300,000</td>
      <td>0.4%</td>
      <td>$10,088</td>
    </tr>
    <tr>
      <th scope="row">MEDICAID REIMBURSEMENT</th>
      <td>$1,069,782</td>
      <td>$789,022</td>
      <td>$796,530</td>
      <td>$1,014,469</td>
      <td>-5.2%</td>
      <td>$950,000</td>
      <td>$1,000,000</td>
      <td>5.3%</td>
      <td>$50,000</td>
    </tr>
    <tr>
      <th scope="row">MISC REV</th>
      <td>$1,782,442</td>
      <td>$212,916</td>
      <td>$97,122</td>
      <td>$257,755</td>
      <td>-85.5%</td>
      <td></td>
      <td></td>
      <td>0.0%</td>
      <td>&ndash;</td>
    </tr>
    <tr>
      <th scope="row">Motor Vehicle Excise</th>
      <td>$7,620,870</td>
      <td>$7,700,291</td>
      <td>$8,459,321</td>
      <td>$9,308,339</td>
      <td>22.1%</td>
      <td>$8,477,111</td>
      <td>$9,025,789</td>
      <td>6.5%</td>
      <td>$548,678</td>
    </tr>
    <tr>
      <th scope="row">OTHER AVAILABLE REVENUE</th>
      <td>$6,539,817</td>
      <td>$7,717,830</td>
      <td>$7,065,921</td>
      <td>$6,290,257</td>
      <td>-3.8%</td>
      <td>$6,233,062</td>
      <td>$6,210,304</td>
      <td>-0.4%</td>
      <td>$(22,758)</td>
    </tr>
    <tr>
      <th scope="row">OTHER DEPT REVENUE</th>
      <td>$707,963</td>
      <td>$672,134</td>
      <td>$817,194</td>
      <td>$899,501</td>
      <td>27.1%</td>
      <td>$658,253</td>
      <td>$555,000</td>
      <td>-15.7%</td>
      <td>$(103,253)</td>
    </tr>
    <tr>
      <th scope="row">OTHER EXCISE</th>
      <td>$2,507,796</td>
      <td>$2,779,100</td>
      <td>$2,797,580</td>
      <td>$2,793,127</td>
      <td>11.4%</td>
      <td>$2,711,464</td>
      <td>$2,751,440</td>
      <td>1.5%</td>
      <td>$39,976</td>
    </tr>
    <tr>
      <th scope="row">PENALTIES &amp; INTEREST</th>
      <td>$473,484</td>
      <td>$609,464</td>
      <td>$800,461</td>
      <td>$743,548</td>
      <td>57.0%</td>
      <td>$742,361</td>
      <td>$742,000</td>
      <td>0.0%</td>
      <td>$(361)</td>
    </tr>
    <tr>
      <th scope="row">PILOT/WASTE DISPOSAL FEE</th>
      <td>$2,603,112</td>
      <td>$2,762,606</td>
      <td>$3,179,846</td>
      <td>$3,119,403</td>
      <td>19.8%</td>
      <td>$3,014,364</td>
      <td>$3,304,799</td>
      <td>9.6%</td>
      <td>$290,435</td>
    </tr>
    <tr>
      <th scope="row">RENTALS</th>
      <td>$152,470</td>
      <td>$191,513</td>
      <td>$225,058</td>
      <td>$199,510</td>
      <td>30.9%</td>
      <td>$198,450</td>
      <td>$198,450</td>
      <td>0.0%</td>
      <td>&ndash;</td>
    </tr>
    <tr>
      <th scope="row">STATE AID (CHERRY SHEET)</th>
      <td>$77,470,801</td>
      <td>$87,517,136</td>
      <td>$96,332,931</td>
      <td>$102,119,697</td>
      <td>31.8%</td>
      <td>$108,035,147</td>
      <td>$110,453,103</td>
      <td>2.2%</td>
      <td>$2,417,956</td>
    </tr>
    <tr>
      <th scope="row">Grand Total</th>
      <td>$222,136,464</td>
      <td>$237,705,306</td>
      <td>$251,774,575</td>
      <td>$267,922,466</td>
      <td>20.6%</td>
      <td>$277,218,449</td>
      <td>$285,272,159</td>
      <td>2.9%</td>
      <td>$8,053,710</td>
    </tr>
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
    <tr>
      <th scope="row">1. TAX LEVY</th>
      <td>$146,107,374</td>
      <td>$150,928,917</td>
      <td>$155,909,572</td>
      <td>$160,898,678</td>
      <td>$166,047,436</td>
      <td>$171,360,954</td>
      <td>$176,844,504</td>
      <td>$182,503,528</td>
      <td>$188,343,641</td>
      <td>$194,370,638</td>
    </tr>
    <tr>
      <th scope="row">2. MOTORVEHICLE EXCISE</th>
      <td>$9,025,789</td>
      <td>$9,116,047</td>
      <td>$9,298,367</td>
      <td>$9,577,319</td>
      <td>$9,960,411</td>
      <td>$10,358,828</td>
      <td>$10,773,181</td>
      <td>$11,204,108</td>
      <td>$11,652,272</td>
      <td>$12,118,363</td>
    </tr>
    <tr>
      <th scope="row">3. OTHER EXCISE</th>
      <td>$2,751,440</td>
      <td>$2,820,226</td>
      <td>$2,904,833</td>
      <td>$3,006,502</td>
      <td>$3,126,762</td>
      <td>$3,251,832</td>
      <td>$3,381,906</td>
      <td>$3,517,182</td>
      <td>$3,657,869</td>
      <td>$3,804,184</td>
    </tr>
    <tr>
      <th scope="row">4. PENALTIES &amp; INTEREST</th>
      <td>$742,000</td>
      <td>$764,260</td>
      <td>$787,188</td>
      <td>$810,803</td>
      <td>$835,128</td>
      <td>$860,181</td>
      <td>$885,987</td>
      <td>$912,566</td>
      <td>$939,943</td>
      <td>$968,142</td>
    </tr>
    <tr>
      <th scope="row">5. PILOT &amp; WASTE DISPOSAL FEE</th>
      <td>$3,304,799</td>
      <td>$3,387,419</td>
      <td>$3,489,042</td>
      <td>$3,593,713</td>
      <td>$3,701,525</td>
      <td>$3,812,570</td>
      <td>$3,926,948</td>
      <td>$4,044,756</td>
      <td>$4,166,099</td>
      <td>$4,291,082</td>
    </tr>
    <tr>
      <th scope="row">6. FEES</th>
      <td>$998,900</td>
      <td>$1,018,878</td>
      <td>$1,039,256</td>
      <td>$1,060,041</td>
      <td>$1,081,241</td>
      <td>$1,102,866</td>
      <td>$1,124,924</td>
      <td>$1,147,422</td>
      <td>$1,170,371</td>
      <td>$1,193,778</td>
    </tr>
    <tr>
      <th scope="row">7. RENTALS</th>
      <td>$198,450</td>
      <td>$204,404</td>
      <td>$210,536</td>
      <td>$216,852</td>
      <td>$223,357</td>
      <td>$230,058</td>
      <td>$236,960</td>
      <td>$244,068</td>
      <td>$251,391</td>
      <td>$258,932</td>
    </tr>
    <tr>
      <th scope="row">8. OTHER DEPT. REVENUE</th>
      <td>$555,000</td>
      <td>$568,875</td>
      <td>$583,097</td>
      <td>$597,674</td>
      <td>$612,616</td>
      <td>$627,932</td>
      <td>$643,630</td>
      <td>$659,721</td>
      <td>$676,214</td>
      <td>$693,119</td>
    </tr>
    <tr>
      <th scope="row">9. MEDICAID REIMBURSEMENT</th>
      <td>$1,000,000</td>
      <td>$1,025,000</td>
      <td>$1,050,625</td>
      <td>$1,082,144</td>
      <td>$1,114,608</td>
      <td>$1,148,046</td>
      <td>$1,182,488</td>
      <td>$1,217,962</td>
      <td>$1,254,501</td>
      <td>$1,292,136</td>
    </tr>
    <tr>
      <th scope="row">10. LICENSE &amp; PERMITS</th>
      <td>$2,300,000</td>
      <td>$2,346,000</td>
      <td>$2,404,650</td>
      <td>$2,484,003</td>
      <td>$2,570,944</td>
      <td>$2,660,927</td>
      <td>$2,727,450</td>
      <td>$2,795,636</td>
      <td>$2,865,527</td>
      <td>$2,937,165</td>
    </tr>
    <tr>
      <th scope="row">11. FINES &amp; FORFEITS</th>
      <td>$625,000</td>
      <td>$643,750</td>
      <td>$663,063</td>
      <td>$682,954</td>
      <td>$703,443</td>
      <td>$724,546</td>
      <td>$746,283</td>
      <td>$768,671</td>
      <td>$791,731</td>
      <td>$815,483</td>
    </tr>
    <tr>
      <th scope="row">12. INVESTMENTS</th>
      <td>$1,000,000</td>
      <td>$1,030,000</td>
      <td>$1,060,900</td>
      <td>$1,098,032</td>
      <td>$1,136,463</td>
      <td>$1,176,239</td>
      <td>$1,217,407</td>
      <td>$1,260,016</td>
      <td>$1,304,117</td>
      <td>$1,349,761</td>
    </tr>
    <tr>
      <th scope="row">14. STATE AID (CHERRY SHEET) W/O CH. 70</th>
      <td>$14,026,061</td>
      <td>$14,376,713</td>
      <td>$14,736,130</td>
      <td>$15,163,478</td>
      <td>$15,603,219</td>
      <td>$16,055,712</td>
      <td>$16,521,328</td>
      <td>$17,000,447</td>
      <td>$17,493,459</td>
      <td>$18,000,770</td>
    </tr>
    <tr>
      <th scope="row">15. CH 70 STATE AID</th>
      <td>$96,427,042</td>
      <td>$98,355,583</td>
      <td>$100,322,694</td>
      <td>$102,329,148</td>
      <td>$104,375,731</td>
      <td>$106,463,246</td>
      <td>$108,592,511</td>
      <td>$110,764,361</td>
      <td>$112,979,648</td>
      <td>$115,239,241</td>
    </tr>
    <tr>
      <th scope="row">17. OTHER AVAILABLE REVENUE SOURCES</th>
      <td>$6,210,304</td>
      <td>$5,775,583</td>
      <td>$5,371,292</td>
      <td>$4,995,301</td>
      <td>$4,645,630</td>
      <td>$4,320,436</td>
      <td>$4,018,006</td>
      <td>$3,736,745</td>
      <td>$3,475,173</td>
      <td>$3,231,911</td>
    </tr>
    <tr>
      <th scope="row">Grand Total</th>
      <td>$285,272,159</td>
      <td>$292,361,654</td>
      <td>$299,831,244</td>
      <td>$307,596,643</td>
      <td>$315,738,514</td>
      <td>$324,154,374</td>
      <td>$332,823,510</td>
      <td>$341,777,191</td>
      <td>$351,021,957</td>
      <td>$360,564,705</td>
    </tr>
    <tr>
      <th scope="row"><em>Annual % Increase</em></th>
      <td>2.9%</td>
      <td>2.5%</td>
      <td>2.6%</td>
      <td>2.6%</td>
      <td>2.6%</td>
      <td>2.7%</td>
      <td>2.7%</td>
      <td>2.7%</td>
      <td>2.7%</td>
      <td>2.7%</td>
    </tr>
  </tbody>
</table>

<h3>The 10-Year Revenue Estimate includes the following</h3>

<ul>
  <li>Increases the annual tax <GlossaryTerm term="Levy">levy</GlossaryTerm> by 3.3%</li>
  <li>Allocates 100% of Ch. 70 to the School</li>
  <li>Projects local receipts based on recent trends</li>
  <li>Reduce the amount of <GlossaryTerm term="Free Cash">free cash</GlossaryTerm> used to 20%</li>
</ul>

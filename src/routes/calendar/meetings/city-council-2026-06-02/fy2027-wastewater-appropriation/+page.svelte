<script lang="ts">
  import { Router } from "$lib/router"
  import { ORDERS } from "../../../../budget/fy2027/council-orders"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "fy2027-wastewater-appropriation"
  const ORDER = ORDERS[1]
</script>

<!-- The order's words come from `council-orders.ts`, which the budget pages
     read too, so the two cannot drift apart. -->
<p>13.2. {ORDER.text}</p>

<ul>
  {#each ORDER.parts ?? [] as part (part)}
    <li>{part}</li>
  {/each}
</ul>

<h2>Minutes</h2>

<p>
  <strong
    >Asst. City Clerk Leonard Flynn stated related communications from Mayor Barrett to continue to <a
      href={Router.meeting("city-council-2026-06-16")}>June 16<sup>th</sup></a
    >.</strong
  >
</p>

<p>
  Vice President Michitson asked if the number was correct for zero. Mayor Barrett stated yes. Vice
  President Michitson stated one of the two water/wastewater I thought one of those two were using
  retained. Mayor stated we got this from Bob we have time to correct it if it is incorrect.
</p>

<p>
  MOTION BY COUNCILOR SULLIVAN, SECOND BY COUNCILOR TOOHEY<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<hr />

<h2>The order&rsquo;s attachment</h2>

<p>
  Introduced by the Mayor Melinda E. Barrett<br />
  an Order Concerning Appropriations for the <strong>Fiscal Year Beginning July 1, 2026</strong>
</p>

<p>City Council<br />City of Haverhill<br /><strong>Submitted May 21, 2026</strong></p>

<table>
  <caption
    ><strong
      >Ordered that the following sums, designated as appropriations, are hereby appropriated in the
      Wastewater Fund of the City of Haverhill and that $698,981 be appropriated in the General Fund
      and funded from Wastewater revenue.</strong
    ></caption
  >
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Salaries Appropriation</th>
      <th scope="col">Expenses Appropriation</th>
      <th scope="col">Capital Appropriation</th>
      <th scope="col">Total City</th>
      <th scope="col">Other Assessments From General Fund</th>
      <th scope="col">Grand Totals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>General Operations</td>
      <td>3,102,959</td>
      <td>6,087,180</td>
      <td>225,000</td>
      <td>9,415,139</td>
      <td></td>
      <td>9,415,139</td>
    </tr>
    <tr>
      <td>Stormwater</td>
      <td>103,974</td>
      <td>285,100</td>
      <td>122,000</td>
      <td>511,074</td>
      <td></td>
      <td>511,074</td>
    </tr>
    <tr>
      <td>Transfers</td>
      <td>0</td>
      <td>0</td>
      <td></td>
      <td>0</td>
      <td>698,981</td>
      <td>698,981</td>
    </tr>
    <tr>
      <td>Benefits</td>
      <td>1,572,118</td>
      <td></td>
      <td></td>
      <td>1,572,118</td>
      <td></td>
      <td>1,572,118</td>
    </tr>
    <tr>
      <td>Debt</td>
      <td></td>
      <td>4,367,996</td>
      <td></td>
      <td>4,367,996</td>
      <td></td>
      <td>4,367,996</td>
    </tr>
    <tr>
      <td>Reserves</td>
      <td></td>
      <td>0</td>
      <td></td>
      <td>0</td>
      <td></td>
      <td>0</td>
    </tr>
    <tr>
      <td>Insurance</td>
      <td></td>
      <td>100,716</td>
      <td></td>
      <td>100,716</td>
      <td></td>
      <td>100,716</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Total Wastewater Fund</th>
      <td>4,779,051</td>
      <td>10,840,992</td>
      <td>347,000</td>
      <td>15,967,043</td>
      <td>698,981</td>
      <td>16,666,024</td>
    </tr>
  </tbody>
</table>

<table>
  <caption
    ><strong
      >Be it further ordered that the City appropriations and assessments in the Wastewater Fund are
      to be financed by estimated revenues drawn from the following sources.</strong
    ></caption
  >
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Charges for Services</th>
      <th scope="col">Other Revenue</th>
      <th scope="col"></th>
      <th scope="col">Total Revenue</th>
      <th scope="col">Availible Fund Balance</th>
      <th scope="col">Grand Totals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Wastewater Fund</td>
      <td>16,446,024</td>
      <td>220,000</td>
      <td>0</td>
      <td>16,666,024</td>
      <td>-</td>
      <td>16,666,024</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Total Wastewater Fund</th>
      <td>16,446,024</td>
      <td>220,000</td>
      <td>0</td>
      <td>16,666,024</td>
      <td>-</td>
      <td>16,666,024</td>
    </tr>
  </tbody>
</table>

<p>Water WW Appropriation27 5/22/2026</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      The order, May 22, 2026, and its attachment<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

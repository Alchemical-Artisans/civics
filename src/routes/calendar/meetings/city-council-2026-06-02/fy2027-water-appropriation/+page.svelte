<script lang="ts">
  import { Router } from "$lib/router"
  import { ORDERS } from "../../../../budget/fy2027/council-orders"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "fy2027-water-appropriation"
  const ORDER = ORDERS[0]
</script>

<!-- The order's words come from `council-orders.ts`, which the budget pages
     read too, so the two cannot drift apart. -->
<p>13.1. {ORDER.text}</p>

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
      Water Fund of the City of Haverhill and that $234,784 be appropriated in the General Fund and
      funded from Water revenue.</strong
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
      <td>3,102,226</td>
      <td>3,250,346</td>
      <td>851,000</td>
      <td>7,203,572</td>
      <td></td>
      <td>7,203,572</td>
    </tr>
    <tr>
      <td>Engineering</td>
      <td>747,090</td>
      <td>193,100</td>
      <td></td>
      <td>940,190</td>
      <td></td>
      <td>940,190</td>
    </tr>
    <tr>
      <td>Conservation</td>
      <td>172,519</td>
      <td>13,550</td>
      <td></td>
      <td>186,069</td>
      <td></td>
      <td>186,069</td>
    </tr>
    <tr>
      <td>Transfers</td>
      <td></td>
      <td>0</td>
      <td></td>
      <td>0</td>
      <td>234,784</td>
      <td>234,784</td>
    </tr>
    <tr>
      <td>Benefits</td>
      <td>1,797,561</td>
      <td></td>
      <td></td>
      <td>1,797,561</td>
      <td></td>
      <td>1,797,561</td>
    </tr>
    <tr>
      <td>Debt</td>
      <td></td>
      <td>4,526,123</td>
      <td></td>
      <td>4,526,123</td>
      <td></td>
      <td>4,526,123</td>
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
      <td>152,118</td>
      <td></td>
      <td>152,118</td>
      <td></td>
      <td>152,118</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Total Water Fund</th>
      <td>5,819,396</td>
      <td>8,135,237</td>
      <td>851,000</td>
      <td>14,805,633</td>
      <td>234,784</td>
      <td>15,040,417</td>
    </tr>
  </tbody>
</table>

<table>
  <caption
    ><strong
      >Be it further ordered that the City appropriations and assessments in the Water Fund are to
      be financed by estimated revenues drawn from the following sources.</strong
    ></caption
  >
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Charges for Services</th>
      <th scope="col">Other Revenue</th>
      <th scope="col">Engineering Fees</th>
      <th scope="col">Total Revenue</th>
      <th scope="col">Available Fund Balance</th>
      <th scope="col">Grand Totals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Water Fund</td>
      <td>14,701,567</td>
      <td>185,000</td>
      <td>153,850</td>
      <td>15,040,417</td>
      <td>-</td>
      <td>15,040,417</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row">Total Water Fund</th>
      <td>14,701,567</td>
      <td>185,000</td>
      <td>153,850</td>
      <td>15,040,417</td>
      <td>-</td>
      <td>15,040,417</td>
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

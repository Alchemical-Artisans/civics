<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "pay-previous-years-bills"
</script>

<p>
  Mayor Barrett submits an Order to pay bills of the previous years in the amount of $266.46 to the
  Police Department
</p>

<hr />

<h2>Order</h2>

<p>
  That in accordance with General Laws, Chapter 44, Section 64, authorizes the payment of bill(s) of
  the previous years, from current year departmental appropriations as listed below:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Vendor</th>
      <th scope="col">Amount</th>
      <th scope="col">Account</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>WB Mason</td>
      <td>$133.23</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>WB Mason</td>
      <td>$133.23</td>
      <td>Police</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$266.46</td>
      <td></td>
    </tr>
  </tfoot>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 22, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order to pay bills of the previous years<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/invoices`)} target="_blank" rel="noopener">
      The two W.B. Mason invoices<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
</ul>

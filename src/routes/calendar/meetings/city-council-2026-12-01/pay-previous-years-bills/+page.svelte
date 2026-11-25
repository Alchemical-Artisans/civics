<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-12-01"
  const ITEM = "pay-previous-years-bills"
</script>

<p>
  13.1. Order- Pay bills of the previous years and to further authorize the payment from the current
  year departmental appropriations as listed:
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
      <td>AAA Pump Service, Inc</td>
      <td>$4,952.29</td>
      <td>WWTP</td>
    </tr>
    <tr>
      <td>Coady's Garage &amp; Towing</td>
      <td>$2,004.89</td>
      <td>WWTP</td>
    </tr>
    <tr>
      <td>Coady's Garage &amp; Towing</td>
      <td>$35.00</td>
      <td>WWTP</td>
    </tr>
    <tr>
      <td>Coady's Garage &amp; Towing</td>
      <td>$35.00</td>
      <td>WWTP</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$660.00</td>
      <td>Public Property</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$330.00</td>
      <td>Public Property</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$330.00</td>
      <td>Public Property</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$330.00</td>
      <td>Public Property</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$330.00</td>
      <td>Public Property</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$660.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$330.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$330.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$330.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$330.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$330.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Delta Beckwith Elevator</td>
      <td>$275.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>T-Mobile USA, Inc</td>
      <td>$50.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>T-Mobile USA, Inc</td>
      <td>$50.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Vestis</td>
      <td>$107.43</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Al Auto Care</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>(37 Invoices $35 Each)</td>
      <td>$1,295.00</td>
      <td>Police</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$12,764.61</td>
      <td></td>
    </tr>
  </tfoot>
</table>

<hr />

<!-- The order in the packet lists the same twenty-one lines and total as the
     agenda's table above; the clerk's stamp over its opening sentence covers
     the end of "previous years". -->

<h2>Order</h2>

<p>
  That in accordance with General Laws, Chapter 44, Section 64, authorize the payment of bill(s) of
  the previous years and to further authorize the payment from current year departmental
  appropriations as listed below:
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, November 25, 2026, FY25 Bills<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
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
</ul>

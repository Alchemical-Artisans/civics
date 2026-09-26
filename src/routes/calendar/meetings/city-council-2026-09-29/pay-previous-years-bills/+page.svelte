<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-29"
  const ITEM = "pay-previous-years-bills"
</script>

<p>
  <strong>13.1</strong> Order- Pay bills of the previous years and authorize payment from the current
  year departmental appropriations as listed:
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, September 25, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      The order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/comcast`)} target="_blank" rel="noopener">
      Comcast Business bill, Highway Dept<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/att-0283528316`)} target="_blank" rel="noopener">
      AT&amp;T OneNet Service invoice 0283528316, Fire Department, invoice date 06-01-26<span
        class="sr-only"
      >
        , PDF, seven pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/att-0283395068`)} target="_blank" rel="noopener">
      AT&amp;T OneNet Service invoice 0283395068, Fire Department, invoice date 05-01-26<span
        class="sr-only"
      >
        , PDF, eight pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/atwood-memorial`)} target="_blank" rel="noopener">
      Atwood Memorial Company invoice 170, Haverhill Police Department<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/klemms-express`)} target="_blank" rel="noopener">
      Klemms Express house account invoice 144, Haverhill Police<span class="sr-only">
        , PDF, twenty-four pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<hr />

<!-- The order itself, which is a table and nothing else: five bills the city
     did not pay in the fiscal year they belong to, and the accounts the Mayor
     asks to pay them out of now. The vendors' own invoices behind it are
     linked above rather than transcribed -- they are the evidence for each
     row, not the list of bills. -->

<p>
  That in accordance with General Laws, Chapter 44, Section 64, authorize the payment of bill(s) of
  the previous years and to further authorize the payment from current year departmental
  appropriations as listed below:
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
      <td>Comcast</td>
      <td>$32.43</td>
      <td>Highway</td>
    </tr>
    <tr>
      <td>AT&amp;T</td>
      <td>$8.50</td>
      <td>Fire</td>
    </tr>
    <tr>
      <td>AT&amp;T</td>
      <td>$8.50</td>
      <td>Fire</td>
    </tr>
    <tr>
      <td>Atwood Memorial</td>
      <td>$1,200.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Klemms Express</td>
      <td>$45.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <th scope="row"></th>
      <td>$1,294.43</td>
      <td></td>
    </tr>
  </tbody>
</table>

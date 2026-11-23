<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2025-12-09"
  const ITEM = "pay-bills-of-previous-years"
</script>

<p>
  Order- Pay bills of previous years and authorize payment from the current year departmental
  appropriation listed:
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
      <td>Tree Green Capital</td>
      <td>$1,320.74</td>
      <td>Public Property</td>
    </tr>
    <tr>
      <td>Tree Green Capital</td>
      <td>$999.81</td>
      <td>Public Property</td>
    </tr>
    <tr>
      <td>Tree Green Capital</td>
      <td>$1,574.89</td>
      <td>Public Property</td>
    </tr>
    <tr>
      <td>Tree Green Capital</td>
      <td>$1,731.64</td>
      <td>Public Property</td>
    </tr>
    <tr>
      <td>AAT</td>
      <td>$1,020.00</td>
      <td>Highway</td>
    </tr>
  </tbody>
</table>

<p><strong>TOTAL = $6,647.08</strong></p>

<h2>Minutes</h2>

<p><strong>10-O</strong></p>

<p>
  Motion by Vice President Jordan to approve, second by Councilor McGonagle<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Rogers)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, December 4, 2025, FY25 Bills<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/invoices`)} target="_blank" rel="noopener">
      Invoices, True Green Capital and AAT<span class="sr-only"
        >, PDF, 5 pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

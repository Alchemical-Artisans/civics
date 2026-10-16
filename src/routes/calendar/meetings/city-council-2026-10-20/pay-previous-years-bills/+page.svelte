<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "pay-previous-years-bills"
</script>

<p>
  Order- Pay bills of the previous years and authorize payment from the current year departmental
  appropriations as listed:
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 16, 2026<span class="sr-only">
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
    <a href={Router.excerpt(MEETING, `${ITEM}/t-mobile`)} target="_blank" rel="noopener">
      T-Mobile invoice, Haverhill Police Dept<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/sanoni-blades-and-brooms`)}
      target="_blank"
      rel="noopener"
    >
      SaNoNi Blades &amp; Brooms invoice, City of Haverhill DPW<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/phenova`)} target="_blank" rel="noopener">
      Phenova invoice 215890, Haverhill Water Department Lab<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/mallory-safety-and-supply`)}
      target="_blank"
      rel="noopener"
    >
      Mallory Safety and Supply LLC invoice 6323918, City of Haverhill Wastewater<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/vestis`)} target="_blank" rel="noopener">
      Vestis invoice 27976390, Haverhill Waste Water Plant<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/sunbelt-rentals`)} target="_blank" rel="noopener">
      Sunbelt Rentals invoice 179571782-0001, Haverhill Water Dept<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/mission-communications`)}
      target="_blank"
      rel="noopener"
    >
      Mission Communications invoice 2031842, Haverhill MA, City of<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/lse-enhanced-holdco`)} target="_blank" rel="noopener">
      LSE Enhanced Holdco 1 LLC invoice 0296, City of Haverhill<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<hr />

<!-- The order itself, which is a table and nothing else: eight bills the city
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
      <td>T-Mobile</td>
      <td>$50.00</td>
      <td>Police</td>
    </tr>
    <tr>
      <td>Sanoni Blades &amp; Brooms</td>
      <td>$2,780.00</td>
      <td>Highway</td>
    </tr>
    <tr>
      <td>Phenova</td>
      <td>$382.69</td>
      <td>Water</td>
    </tr>
    <tr>
      <td>Mallory Safety &amp; Supply</td>
      <td>$668.51</td>
      <td>Wastewater</td>
    </tr>
    <tr>
      <td>Vestis</td>
      <td>$194.98</td>
      <td>Wastewater</td>
    </tr>
    <tr>
      <td>Sunbelt Rentals</td>
      <td>$2,578.00</td>
      <td>Wastewater</td>
    </tr>
    <tr>
      <td>Mission Communications</td>
      <td>$3,727.80</td>
      <td>Wastewater</td>
    </tr>
    <tr>
      <td>LSE Enhances Holdco</td>
      <td>$11,907.24</td>
      <td>Wastewater</td>
    </tr>
    <tr>
      <th scope="row"></th>
      <td>$22,289.22</td>
      <td></td>
    </tr>
  </tbody>
</table>

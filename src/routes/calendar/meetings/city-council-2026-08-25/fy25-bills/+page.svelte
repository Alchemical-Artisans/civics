<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-25"
  const ITEM = "fy25-bills"
</script>

<p>
  Order &ndash; Pay bills of the previous years and authorize payment from current year departmental
  appropriations as listed:
</p>

<table>
  <caption> Prior-year bills for payment </caption>
  <thead>
    <tr>
      <th scope="col">Vendor</th>
      <th scope="col">Amount</th>
      <th scope="col">Account</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Discrimination &amp; Harassment Solutions</td>
      <td>$1,260.00</td>
      <td>Mayor&rsquo;s Office</td>
    </tr>
    <tr>
      <td>National Grid</td>
      <td>$206.81</td>
      <td>Highway</td>
    </tr>
    <tr>
      <td>Edgemont Oil LLC</td>
      <td>$135.00</td>
      <td>Water Dept</td>
    </tr>
    <tr>
      <td>Milton Rents, Inc.</td>
      <td>$5,175.00</td>
      <td>Water Dept</td>
    </tr>
    <tr>
      <td>United Rentals</td>
      <td>$3,630.27</td>
      <td>Water Dept</td>
    </tr>
    <tr>
      <td>Northeast Electrical</td>
      <td>$102.04</td>
      <td>Fire Dept</td>
    </tr>
    <tr>
      <td>O&rsquo;Reilly Auto Parts</td>
      <td>$50.22</td>
      <td>Police Dept</td>
    </tr>
    <tr>
      <td>O&rsquo;Reilly Auto Parts</td>
      <td>$5.32</td>
      <td>Police Dept</td>
    </tr>
    <tr>
      <td>New Westgate Cleaners &amp; Tailors</td>
      <td>$214.00</td>
      <td>Police Dept</td>
    </tr>
    <tr>
      <td>Weston &amp; Sampson</td>
      <td>$4,850.00</td>
      <td>Water Treatment Plant</td>
    </tr>
    <tr>
      <td>Town of Merrimac</td>
      <td>$166.99</td>
      <td>Water Treatment Plant</td>
    </tr>
    <tr>
      <td>Town of Merrimac</td>
      <td>$143.32</td>
      <td>Water Treatment Plant</td>
    </tr>
    <tr>
      <td>Town of Merrimac</td>
      <td>$147.64</td>
      <td>Water Treatment Plant</td>
    </tr>
    <tr>
      <td>Town of Merrimac</td>
      <td>$151.93</td>
      <td>Water Treatment Plant</td>
    </tr>
    <tr>
      <td>Town of Merrimac</td>
      <td>$149.05</td>
      <td>Water Treatment Plant</td>
    </tr>
    <tr>
      <td>Atlantic Coast Polymers</td>
      <td>$11,616.00</td>
      <td>Wastewater</td>
    </tr>
    <tr>
      <td>Spencer Meadow Solar LLC</td>
      <td>$19,404.06</td>
      <td>Wastewater</td>
    </tr>
    <tr>
      <td>Sunwealth Project Pool</td>
      <td>$10,612.28</td>
      <td>Wastewater</td>
    </tr>
    <tr>
      <td>Shoe City Hardware</td>
      <td>$174.94</td>
      <td>Wastewater</td>
    </tr>
    <tr>
      <td>Kingston Materials</td>
      <td>$1,637.00</td>
      <td>Wastewater</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$59,831.87</td>
      <td></td>
    </tr>
  </tfoot>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, August 20, 2026<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
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
      Invoices for the bills listed<span class="sr-only">
        , PDF, twenty-three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "pay-bills-of-previous-years"
</script>

<p>
  Order- Pay bills of previous years and authorize payment from the current year departmental
  appropriation listed:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">VENDOR</th>
      <th scope="col">AMOUNT</th>
      <th scope="col">ACCOUNT</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Hippo Prints</td><td>$675.00</td><td>Recreation Department</td></tr>
  </tbody>
  <tfoot>
    <tr><th scope="row">Total:</th><td colspan="2">$675.00</td></tr>
  </tfoot>
</table>

<h2>Minutes</h2>

<p>
  Motion by Vice President Michitson, Second by Councilor Diodati<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, January 5, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, in Municipal Council<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/invoice`)} target="_blank" rel="noopener">
      Invoice from Hippo Prints<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

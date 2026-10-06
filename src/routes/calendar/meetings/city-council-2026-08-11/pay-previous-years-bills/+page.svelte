<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "pay-previous-years-bills"
</script>

<p>
  <strong>13.1.</strong> Order &ndash; Pay bills of the previous years and authorize payment from current
  year departmental appropriations as listed:
</p>

<table>
  <thead>
    <tr><th scope="col">Vendor</th><th scope="col">Amount</th><th scope="col">Account</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Weston &amp; Sampson</th><td>$5,092.16</td><td>Engineering</td></tr>
    <tr><th scope="row">CCMSI</th><td>$3,691.67</td><td>Human Resources</td></tr>
    <tr><th scope="row">AFC</th><td>$1,065.00</td><td>Human Resources</td></tr>
    <tr><th scope="row">Comcast Business</th><td>$354.89</td><td>Water Treatment</td></tr>
    <tr><th scope="row">Primo Brands</th><td>$23.07</td><td>Auditor</td></tr>
  </tbody>
  <tfoot>
    <tr><th scope="row">TOTAL</th><td colspan="2">$10,226.79</td></tr>
  </tfoot>
</table>

<h2>Minutes</h2>

<p>
  Motion by Councilor Basiliere for approval, Second by Councilor LePage<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Sullivan)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

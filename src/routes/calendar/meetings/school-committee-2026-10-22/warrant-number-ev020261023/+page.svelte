<script lang="ts">
  import { Router } from "$lib/router"
  import { LINES, TOTAL } from "./warrant"

  const MEETING = "school-committee-2026-10-22"
  const ITEM = "warrant-number-ev020261023"
</script>

<p>
  Superintendent&rsquo;s Recommendation for approval of Warrant Number EV020261023 totaling
  $4,445,025.60, as indicated in the agenda material.
</p>

<table>
  <caption>HPS Warrant EV20261023</caption>
  <thead>
    <tr>
      <th scope="col">Vendor</th>
      <th scope="col">Total</th>
      <th scope="col">Account</th>
      <th scope="col">Detail Line Description</th>
    </tr>
  </thead>
  <tbody>
    {#each LINES as line, index (index)}
      <tr>
        <td>{line.vendor}</td>
        <td>{line.total}</td>
        <td>{line.account}</td>
        <td>{line.detail}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">TOTAL</th>
      <td>{TOTAL}</td>
      <td></td>
      <td></td>
    </tr>
  </tfoot>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      HPS Warrant EV20261023<span class="sr-only"> , PDF, fifteen pages, opens in a new tab</span>
    </a>
  </li>
</ul>

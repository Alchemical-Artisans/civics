<script lang="ts">
  import { Router } from "$lib/router"
  import { LINES, TOTAL } from "./warrant"

  const MEETING = "school-committee-2026-09-24"
  const ITEM = "warrant-number-ev020260925"
</script>

<p>
  Superintendent&rsquo;s Recommendation for approval of Warrant Number EV020260925 totaling
  $7,098,919.36, as indicated in the agenda material.
</p>

<table>
  <caption>HPS Combined Warrant EV20260925</caption>
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
      HPS Combined Warrant EV20260925<span class="sr-only">
        , PDF, twenty pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

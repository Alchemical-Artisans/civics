<script lang="ts">
  import { Router } from "$lib/router"
  import { LINES, TOTAL } from "./warrant"

  const MEETING = "school-committee-2026-10-08"
  const ITEM = "warrant-number-ev020261009"
</script>

<p>
  Superintendent&rsquo;s Recommendation for approval of Warrant Number EV020261009 totaling
  $1,297,697.03, as indicated in the agenda material.
</p>

<table>
  <caption>HPS warrant EV20261009</caption>
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
      HPS warrant EV20261009<span class="sr-only">
        , PDF, twenty-three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "2027-capital-account-reallocation"
</script>

<p>
  Ordered: That $74,452.12 be reallocated from the following capital accounts to a new capital
  account to fund fiscal 2027 capital
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 15, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      The order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

<hr />

<!-- The order, which is a sentence and a table: the eleven capital accounts
     whose leftover balances the Mayor asks to gather into one. -->

<h2>The order</h2>

<p>
  That $74,452.12 be reallocated from the following capital accounts to a new capital account to
  fund fiscal 2027 capital.
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Fund #</th>
      <th scope="col">Description</th>
      <th scope="col">Remaining Balance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>3418800</td>
      <td>City Docks Capital</td>
      <td>$ 6,367.62</td>
    </tr>
    <tr>
      <td>3416190</td>
      <td>City Hall A/C</td>
      <td>$ 1,106.88</td>
    </tr>
    <tr>
      <td>3417193</td>
      <td>City Hall Bathrooms Fund Balance</td>
      <td>$ 9,254.29</td>
    </tr>
    <tr>
      <td>3416120</td>
      <td>City Hall Document Management</td>
      <td>$ 128.60</td>
    </tr>
    <tr>
      <td>3422138</td>
      <td>City Hall Wall Replacement Fund Balance</td>
      <td>$ 52,478.93</td>
    </tr>
    <tr>
      <td>3416192</td>
      <td>FY16 Retaining Wall City Hall Fund Balance</td>
      <td>$ 588.51</td>
    </tr>
    <tr>
      <td>3440155</td>
      <td>Info Tech Capital Project Fund Balance</td>
      <td>$ 357.07</td>
    </tr>
    <tr>
      <td>3416510</td>
      <td>Insp/Health Vehicle Fund Balance</td>
      <td>$ 64.30</td>
    </tr>
    <tr>
      <td>3500012</td>
      <td>Landfill Southern Mound Closure Fund Bal</td>
      <td>$ 2,512.35</td>
    </tr>
    <tr>
      <td>3419424</td>
      <td>Replace Streetlights Fund Balance</td>
      <td>$ 1,093.57</td>
    </tr>
    <tr>
      <td>3418221</td>
      <td>Winnekenni Undesignated Fund Balance</td>
      <td>$ 500.00</td>
    </tr>
    <tr>
      <th scope="row"></th>
      <td></td>
      <td>$ 74,452.12</td>
    </tr>
  </tbody>
</table>

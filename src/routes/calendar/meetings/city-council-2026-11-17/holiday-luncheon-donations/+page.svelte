<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "holiday-luncheon-donations"
</script>

<p>Mayor Barrett submits the following donations:</p>

<ul>
  <li>
    <strong>5.5.1</strong> Order- Authorizing City Council to accept the following donations for the Holiday
    Luncheon at the Citizen Center to the Council on Aging Department :
  </li>
</ul>

<table>
  <tbody>
    <tr>
      <td>$200.00</td>
      <td>Bethany Communities</td>
    </tr>
    <tr>
      <td>$500.00</td>
      <td>Lowell Five Savings Bank</td>
    </tr>
    <tr>
      <td>$250.00</td>
      <td>Breakfast Exchange Club</td>
    </tr>
    <tr>
      <td>$500.00</td>
      <td>Haverhill Bank</td>
    </tr>
    <tr>
      <td>$200.00</td>
      <td>Fallon Community Health Plan</td>
    </tr>
  </tbody>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, November 13, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, Acceptance of Donations<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/bethany-communities-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Beth Grady, Bethany Communities<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/holiday-luncheon-email`)}
      target="_blank"
      rel="noopener"
    >
      Email correspondence, Haverhill Council on Aging Holiday Luncheon, October 15, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

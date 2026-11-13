<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "high-school-fire-alarm-bonds"
</script>

<p>
  <u><strong>Doc 32-X-</strong></u> Mayor Barrett submits an Order to authorize borrowing for the Haverhill
  High School Fire Alarm Project Bonds
</p>

<ul>
  <li>
    <strong>17.5.1</strong> Order- That the City of Haverhill hereby appropriates Eight Hundred Thousand
    Dollars ($800,000), for the purpose of paying costs of the replacement, modernization and equipping
    of the fire alarm at the Haverhill High School
  </li>
</ul>

<p class="text-right"><strong><u>Filed on October 28, 2026</u></strong></p>

<AddressMap
  address="Haverhill High School, 137 Monument Street, Haverhill, MA"
  lat={42.7851758}
  lon={-71.1063061}
/>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/document-32-x`)} target="_blank" rel="noopener">
      Document # 32-X, with the clerk's record of October 27, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 23, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/school-cfo-memo`)} target="_blank" rel="noopener">
      Memorandum from Clancy Main, Chief Financial Officer, Haverhill Public Schools, October 23,
      2026<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, $800,000 Haverhill High School Fire Alarm Project Bonds<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/notice-confirmation`)} target="_blank" rel="noopener">
      Confirmation of the notice placed with the Haverhill Gazette<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

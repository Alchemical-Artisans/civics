<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"
  import { SCHOOL } from "../../../../projects/golden-hill-roof-replacement/roof"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "golden-hill-roof-replacement-bonds"
</script>

<p>
  <u><strong>Doc 32-U-</strong></u> Mayor Barrett submits an Order to authorize borrowing from the Golden
  Hill Elementary School Roof Replacement Project
</p>

<ul>
  <li>
    <strong>17.1.1</strong> Order- That the City of Haverhill hereby appropriates Three Million Five Hundred
    Sixty- Four Thousand Dollars, including Three Hundred Thousand Dollars already appropriated for feasibility
    study and schematic design costs on January 13,2026, to pay costs of the design and construction of
    a roof replacement at Golden Hill Elementary School located at 140 Boardman Street
  </li>
</ul>

<p class="text-right"><strong><u>Filed on October 21, 2026</u></strong></p>

<AddressMap address={SCHOOL.address} lat={SCHOOL.lat} lon={SCHOOL.lon} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/document-32-u`)} target="_blank" rel="noopener">
      Document # 32-U, with the clerk's record of October 20, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 15, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/schools-letter`)} target="_blank" rel="noopener">
      Letter from Clancy Main, Chief Financial Officer, Haverhill Public Schools, October 15, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, Golden Hill Elementary School Roof Replacement Bonds<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/notice-confirmation`)} target="_blank" rel="noopener">
      Confirmation of the notice placed with the Haverhill Gazette for publication on October 22,
      2026<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
</ul>

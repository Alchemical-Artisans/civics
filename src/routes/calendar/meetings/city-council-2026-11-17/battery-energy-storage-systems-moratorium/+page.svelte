<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "battery-energy-storage-systems-moratorium"
</script>

<p>
  Petition by request of the City Council to amend Chapter 255, Zoning, by adding a new section 7.9,
  Temporary Moratorium on Battery Energy Storage Systems
</p>

<p class="text-right"><strong><u>Hearing for December 1, 2026</u></strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      An Ordinance Relating to Amending Chapter 255, Zoning, by Adding a New Section 7.9<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/solicitors-memo`)} target="_blank" rel="noopener">
      Memorandum from Lisa Mead and Neva Peyton, City Solicitor, to Mayor Barrett and President
      Jordan, November 3, 2026<span class="sr-only">, PDF, three pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/notice-confirmations`)}
      target="_blank"
      rel="noopener"
    >
      Confirmations of the notices placed with The Eagle-Tribune and the Haverhill Gazette<span
        class="sr-only">, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2016-09-27"
  const ITEM = "al-forno-building-special-permit"
</script>

<p>
  <strong>7.1</strong> Petition from Dave Traggorth/<em>Traggorth Companies</em> LLC, requesting
  special permit to redevelop and restore 81-87 Washington st; known as the
  <em>Al Forno Building</em>; to create up to 24 rental apartments, including 6 two-bedroom units
  and 12 one-bedroom units to include 1,900 SF of ground floor retail space for lease along
  Washington st; Assessor&rsquo;s Map 301, Block 52, Lot 6
</p>

<p class="text-right">
  (Refer to Planning Board &amp;
  <a href={Router.meeting("city-council-2016-11-29")}><u>Council Hearing Nov 29<sup>th</sup></u></a
  >)
</p>

<AddressMap address="81-87 Washington St, Haverhill, MA" lat={42.7732175} lon={-71.0850172} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/traggorth-letter`)} target="_blank" rel="noopener">
      Letter from Dave Traggorth, Traggorth Companies LLC, September 13, 2016<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/legal-description`)} target="_blank" rel="noopener">
      Legal Description of the land<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/hearing-notice`)} target="_blank" rel="noopener">
      Notice of hearing, Linda L. Koutoulas, City Clerk, November 11 2016<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

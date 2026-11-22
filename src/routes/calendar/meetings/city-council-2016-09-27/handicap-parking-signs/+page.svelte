<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2016-09-27"
  const ITEM = "handicap-parking-signs"
</script>

<ul>
  <li><strong>8.1</strong> Rodney Ball &ndash; <em>New</em> 13 &frac12; Grove st</li>
  <li>
    <strong>8.2</strong> Joseph Miller &ndash; <em>Renewal</em> 20 Swasey st, 1<sup>st</sup> Floor
  </li>
</ul>

<p><em>Applications have Police approval</em></p>

<AddressMap address="20 Swasey St, Haverhill, MA" lat={42.7745348} lon={-71.0925883} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/rodney-ball`)} target="_blank" rel="noopener">
      Application for Handicap Parking Sign, Rodney Ball, with Officer Powell&rsquo;s memo of
      September 21, 2016<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/joseph-miller`)} target="_blank" rel="noopener">
      Application for Handicap Parking Sign, Joseph Miller, with Officer Powell&rsquo;s memo of
      September 21, 2016<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
</ul>

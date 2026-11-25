<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-12-01"
  const ITEM = "water-emergency-declaration-update"
</script>

<p>
  5.7. Mayor Barrett wishes to introduce Robert Ward who will provide an update on the Water
  Emergency Declaration from MassDEP
</p>

<hr />

<h2>Letter from the Mayor</h2>

<p>Re: Water Emergency Declaration by MassDEP</p>

<p>
  I respectfully request to introduce Robert Ward who will provide an update on the Water Emergency
  Declaration from MassDEP.
</p>

<p>Thank you.</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, November 25, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("city-council-2026-09-15", "drought-emergency-update")}>
      Minutes of the City Council Meeting, September 15, 2026
    </a>
    &ndash; Robert Ward&rsquo;s update on the Drought Emergency
  </li>
  <li><a href={Router.drought()}>Haverhill&rsquo;s drought emergency</a></li>
</ul>

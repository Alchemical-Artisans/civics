<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-25"
  const ITEM = "road-opening-135-hyatt-ave"
</script>

<p>
  <strong>EROM-26-19</strong> - Lisa DeMeo, <em>City Engineer,</em> requests approval to open the roadway
  to allow for a gas leak repair at 135 Hyatt Ave, which requires National Grid to excavate in the right
  of way
</p>

<ul>
  <li><strong>8.1.1</strong> Order &ndash; approve request to excavate at 135 Hyatt Ave</li>
</ul>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, City Engineer, August 19, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
  const ITEM = "road-opening-628-main-st"
</script>

<p>
  <strong>EROM-26-20</strong> - Lisa DeMeo, <em>City Engineer,</em> requests approval to open the roadway
  to allow for a gas leak repair at 628 Main St, which requires National Grid to excavate in the right
  of way
</p>

<ul>
  <li><strong>8.3.1</strong> Order &ndash; approve request to excavate at 628 Main St</li>
</ul>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, City Engineer<span class="sr-only">
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

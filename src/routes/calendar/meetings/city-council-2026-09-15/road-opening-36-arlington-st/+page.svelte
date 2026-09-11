<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
  const ITEM = "road-opening-36-arlington-st"
</script>

<p>
  <strong>EROM-26-22</strong> - Lisa DeMeo, <em>City Engineer</em>, requests approval to open the
  roadway to allow for a gas cut off at the main due to exposed plastic at 36 Arlington St, which
  requires National Grid to excavate in the right of way
</p>

<ul>
  <li><strong>8.5.1</strong> Order &ndash; approve request to excavate at 36 Arlington St</li>
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

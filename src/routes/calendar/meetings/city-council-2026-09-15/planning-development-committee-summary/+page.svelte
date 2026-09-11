<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
  const ITEM = "planning-development-committee-summary"
</script>

<p>
  Vice President Michitson submits the summary of minutes and recommendations of the Planning and
  Development Committee held on August 24, 2026 for acceptance and approval
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-letter`)} target="_blank" rel="noopener">
      Letter from Vice President John A. Michitson submitting the committee&rsquo;s summary<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/minutes`)} target="_blank" rel="noopener">
      Summary of the Planning and Development Committee meeting, August 24, 2026<span
        class="sr-only"
      >
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/site-comparison`)} target="_blank" rel="noopener">
      Site comparison and department review comments for the proposed Battery Energy Storage Systems
      Overlay District, presented to the committee<span class="sr-only">
        , PDF, sixteen pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

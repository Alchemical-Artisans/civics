<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "joint-pole-location-lowell-ave"
</script>

<p>
  Petition from National Grid and Verizon, requesting joint pole location on Lowell Ave -
  WR#31189041
</p>

<p class="text-right"><em>Hearing - February 10, 2026</em></p>

<h2>Minutes</h2>

<p>
  Motion by Councilor Rogers, Second by Councilor LePage<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/petition`)} target="_blank" rel="noopener">
      Letter from National Grid, October 29, 2025, petition for joint or identical pole locations,
      plan and order<span class="sr-only">, PDF, six pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/abutters`)} target="_blank" rel="noopener">
      List of abutters<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

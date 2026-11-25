<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-12-01"
  const ITEM = "flock-cameras"
</script>

<p>
  15.3. Councilors Ferreira and Michitson request an update from Mayor and/or Haverhill Police
  Department on status of the cancellation of the city&rsquo;s contract with Flock
</p>

<hr />

<h2>Letter from Councilors Ferreira and Michitson</h2>

<p>November 24, 2026</p>

<p>TO: President and City Councilors</p>

<p>
  Councilors Ferreira and Michitson request an update from Mayor and/or Haverhill Police Department
  on status of the cancellation of the city&rsquo;s contract with Flock.
</p>

<p>
  Vice President John A. Michitson<br />
  Councilor Devan Ferreira
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/letter`)} target="_blank" rel="noopener">
      Letter from Vice President John A. Michitson and Councilor Devan Ferreira, November 24, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("public-health-safety-works-committee-2026-11-12", ITEM)}>
      Public Health, Safety &amp; Works Committee, November 12, 2026
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("city-council-2026-08-11", ITEM)}>City Council, August 11, 2026</a>
  </li>
  <li><a href={Router.alpr()}>Haverhill&rsquo;s license plate readers</a></li>
</ul>

<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "public-safety-committee-summary"
</script>

<p>
  Councilor McGonagle submits the summary of minutes and recommendations of the Public Safety
  committee meeting held on July 29, 2026, for acceptance and approval
</p>

<h2>Minutes</h2>

<p>
  Councilor McGonagle read the summary of minutes of the public safety committee meeting. He
  provided a summary of the July 29<sup>th</sup> meeting.
</p>

<p>
  Motion by Councilor McGonagle to place on file, Second by Councilor LePage<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Sullivan)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/letter`)} target="_blank" rel="noopener">
      Letter from Councilor Michael S. McGonagle, August 5, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/committee-minutes`)} target="_blank" rel="noopener">
      Minutes of the Public Safety Committee meeting, July 29, 2026<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

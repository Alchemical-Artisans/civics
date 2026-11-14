<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the meeting's id. */
  const MEETING = "zoning-board-of-appeals-2026-10-21"
</script>

<h2>5:30 P.M. Training</h2>

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "training")}>Training</a>
  </li>
</ul>

<h2>7:00 P.M. Public Hearings:</h2>

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "135-washington-street-h-c-rental-llc")}>
      135 Washington Street &ndash; H &amp; C Rental, LLC
    </a>
  </li>
  <li>
    <a href={Router.meetingItem(MEETING, "32-south-pine-street-rjcs-consulting-llc")}>
      32 South Pine Street &ndash; RJCS Consulting, LLC
    </a>
  </li>
  <li>
    <a href={Router.meetingItem(MEETING, "746-amesbury-road-zachary-sindoni")}>
      746 Amesbury Road &ndash; Zachary Sindoni
    </a>
  </li>
  <li>
    <a href={Router.meetingItem(MEETING, "0-nineteenth-avenue-wolpk-realty-llc")}>
      0 Nineteenth Avenue &ndash; Wolpk Realty LLC
    </a>
  </li>
</ul>

<h2>Minutes:</h2>

<p>August 19, 2026</p>

<p>George Moriarty, Chair</p>

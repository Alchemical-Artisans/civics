<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the sitting's id. */
  const MEETING = "school-committee-2026-09-24"
</script>

<p>Updated Posting 09.23.26 @ 3:00 pm</p>

<h2>1. Roll Call &ndash; Pledge of Allegiance.</h2>

<h2>2. Public Comment (In-person &amp; Remote).</h2>

<h2>3. Superintendent&rsquo;s Reports/Communications.</h2>

<ul>
  <li><strong>A)</strong> Introduction of Student Advisory Council members with report.</li>
  <li><strong>B)</strong> MCAS Report.</li>
</ul>

<h2>4. School Committee Reports/Communications.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "focus-areas-for-district-improvement")}>
      Focus Areas for District Improvement
    </a>
  </li>
  <li>
    <strong>B)</strong>
    <a href={Router.meetingItem(MEETING, "masc-2026-delegate-assembly")}>
      MASC 2026 Delegate Assembly
    </a>
  </li>
</ul>

<h2>5. Subcommittee Reports.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "policy-jlida-powered-micromobility-device")}>
      Policy JLIDA Powered Micromobility Device
    </a>
  </li>
  <li>
    <strong>B)</strong> Dr. Grannemann: Appointment of subcommittee members (recommendation &amp; vote).
  </li>
</ul>

<h2>6. School Committee Community Announcements.</h2>

<h2>7. New Business.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "warrant-number-ev020260925")}>
      Warrant Number EV020260925
    </a>
  </li>
</ul>

<h2>8. Items by Consensus.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "hybrid-regular-meeting-minutes-september-10-2026")}>
      Hybrid Regular Meeting Minutes of September 10, 2026
    </a>
  </li>
  <li>
    <strong>B)</strong>
    <a href={Router.meetingItem(MEETING, "use-of-facilities")}>Use of Facilities</a>
  </li>
</ul>

<h2>9. Adjournment.</h2>

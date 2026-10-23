<script lang="ts">
  import { agendaHref } from "$lib/projects"
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the sitting's id. */
  const MEETING = "school-committee-2026-10-22"
</script>

<h2>1. Roll Call &ndash; Pledge of Allegiance.</h2>

<h2>2. Public Comment (In-person &amp; Remote).</h2>

<h2>3. Student Advisory Council Report &ndash; Ben Ellis.</h2>

<h2>4. Superintendent&rsquo;s Reports/Communications.</h2>

<ul>
  <li><strong>A)</strong> Haverhill High School CTE Annex Pilot Grant Award.</li>
  <li><strong>B)</strong> High School Updates.</li>
  <li>
    <strong>C)</strong>
    <a href={agendaHref(MEETING, "jgw-tilton-school-building-updates")}>
      JGW/Tilton School Building Updates
    </a>
  </li>
</ul>

<h2>5. School Committee Reports/Communications.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "principals-e-bike-e-scooter-survey")}>
      Principals&rsquo; E-bike/E-scooter Survey
    </a>
  </li>
  <li>
    <strong>B)</strong>
    <a href={Router.meetingItem(MEETING, "secure-firearm-storage-communications")}>
      Secure Firearm Storage Communications
    </a>
  </li>
</ul>

<h2>6. Subcommittee Reports.</h2>

<ul>
  <li><strong>A)</strong> Dr. Grannemann: Report on Superintendent&rsquo;s Goals Subcommittee.</li>
</ul>

<h2>7. School Committee Community Announcements.</h2>

<h2>8. New Business.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "warrant-number-ev020261023")}>
      Warrant Number EV020261023
    </a>
  </li>
  <li>
    <strong>B)</strong>
    <a href={Router.meetingItem(MEETING, "warrant-number-je20261023b-september-p-card")}>
      Warrant Number JE20261023B September P-Card
    </a>
  </li>
  <li>
    <strong>C)</strong>
    <a href={Router.meetingItem(MEETING, "warrant-number-je20261023-july-p-card")}>
      Warrant Number JE20261023 July P-Card
    </a>
  </li>
  <li>
    <strong>D)</strong>
    <a href={Router.meetingItem(MEETING, "warrant-number-je20261023b-august-p-card")}>
      Warrant Number JE20261023B August P-Card
    </a>
  </li>
  <li>
    <strong>E)</strong>
    <a href={Router.meetingItem(MEETING, "declare-items-surplus")}>Declare Items Surplus</a>
  </li>
</ul>

<h2>9. Items by Consensus.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "hybrid-regular-meeting-minutes-october-8-2026")}>
      Hybrid Regular Meeting Minutes of October 8, 2026
    </a>
  </li>
  <li>
    <strong>B)</strong>
    <a href={Router.meetingItem(MEETING, "use-of-facilities")}>Use of Facilities</a>
  </li>
</ul>

<h2>10. Executive Session/Adjournment (<strong>City Hall, Room 104</strong>)</h2>

<p>
  Motion to enter Executive Session pursuant to G.L. c. 30A, &sect; 21(a)(3), to discuss and decide
  (with vote) on the following: a Level 3 grievance filed by the Haverhill Education Association
  (Teachers Unit), on behalf of a bargaining-unit member, and a Level 3 Grievance filed by the
  Haverhill Education Association (teachers, educational support personnel, secretaries and
  professional security specialists), because an open meeting may have a detrimental effect on the
  bargaining or litigating position of the School Committee and the Chair so declares.
</p>

<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the sitting's id. */
  const MEETING = "school-committee-2026-10-08"
</script>

<h2>1. Roll Call &ndash; Pledge of Allegiance.</h2>

<h2>2. Public Comment (In-person &amp; Remote).</h2>

<h2>3. Student Advisory Council Report &ndash; Ben Ellis.</h2>

<h2>4. Superintendent&rsquo;s Reports/Communications.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "donation-from-the-freeman-estate")}>
      Donation from the Freeman Estate
    </a>
  </li>
  <li>
    <strong>B)</strong>
    <a
      href={Router.meetingItem(
        MEETING,
        "hps-anti-bullying-campaign-overview-and-anti-bullying-poster-contest-winners",
      )}
    >
      HPS Anti-bullying Campaign Overview and Anti-bullying Poster Contest Winners!
    </a>
  </li>
  <li><strong>C)</strong> JGW/Tilton School Building Updates.</li>
</ul>

<h2>5. School Committee Reports/Communications.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "masc-resolutions")}>MASC Resolutions</a>
  </li>
  <li>
    <strong>B)</strong>
    <a href={Router.meetingItem(MEETING, "change-of-school-committee-meeting-schedule-for-2027")}>
      Change of School Committee Meeting Schedule for 2027
    </a>
  </li>
</ul>

<h2>6. Subcommittee Reports.</h2>

<h2>7. School Committee Community Announcements.</h2>

<h2>8. New Business.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "warrant-number-ev020261009")}>
      Warrant Number EV020261009
    </a>
  </li>
</ul>

<h2>9. Items by Consensus.</h2>

<ul>
  <li>
    <strong>A)</strong>
    <a href={Router.meetingItem(MEETING, "hybrid-regular-meeting-minutes-september-24-2026")}>
      Hybrid Regular Meeting Minutes of September 24, 2026
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
  (with vote) a Level 3 grievance filed by the Haverhill Education Association (Teachers Unit), on
  behalf of a bargaining-unit member, because an open meeting may have a detrimental effect on the
  bargaining or litigating position of the School Committee and the Chair so declares.
</p>

<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "planning-development-committee-meeting"
  // The sitting this item announces, which has a page of its own.
  const COMMITTEE = "planning-and-development-committee-2026-11-09"
</script>

<p>
  Vice President Michitson wishes to announce a
  <a href={Router.meeting(COMMITTEE)}
    >Planning and Development Committee meeting on Monday, November 9, 2026</a
  >, at 6PM in Room 202, City Council Chambers.
</p>

<hr />

<!-- The notice the Chairperson filed with the Clerk, which names what the
     committee is meeting about; the agenda's own line does not. Each of the two
     referred documents is written up on the committee sitting's own page, so
     the motions here link there rather than being quoted twice. -->

<h2>
  Letter from John A. Michitson, Chairperson, Planning and Development Committee, October 15, 2026
</h2>

<p>TO: Kaitlin M. Wright, City Clerk</p>

<p>
  RE: Planning and Development Committee Meeting &ndash;
  <strong>Monday, November 9, 2026, 6:00 PM</strong>
</p>

<p>Dear Ms. Wright:</p>

<p>
  Please be advised, I have scheduled a Planning and Development Committee meeting for
  <strong>
    Monday, November 9, 2026, at 6:00 PM in the City Council Chambers, Room 202, City Hall, 4 Summer
    Street.
  </strong>
</p>

<p>The purpose of the meeting is to discuss and review the following:</p>

<dl>
  <dt><strong>Doc.85-e:</strong></dt>
  <dd>
    <a href={Router.meetingItem(COMMITTEE, "fiscal-impact-analysis-progress-report")}>
      Motion by Councilor Michitson to send Judi Barrett&rsquo;s progress report on the fiscal
      impact analysis prepared for the City Council for further discussion
    </a>
  </dd>
  <dt><strong>Doc. 44-a</strong></dt>
  <dd>
    <a href={Router.meetingItem(COMMITTEE, "marijuana-overlay-consolidation")}>
      Motion by Councilor Ferreira to send information regarding the consolidation of the
      city&rsquo;s existing medical marijuana overlay district and licensed marijuana establishment
      overlay zone for review and discussion
    </a>
  </dd>
</dl>

<p>
  You can also join the meeting remotely by using the link:
  <a href="https://meet.google.com/zup-rexj-kja" target="_blank" rel="external noopener noreferrer">
    https://meet.google.com/zup-rexj-kja
  </a>
</p>

<p>
  Sincerely,<br />
  John A. Michitson<br />
  Planning and Development Committee
</p>

<p>
  C: P&amp;D Committee Members, City Council, Mayor Melinda E. Barrett, Water/Wastewater Department,
  Engineering Department, Economic Development and Planning Department, Judi Barrett, City Solicitor
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/announcement`)} target="_blank" rel="noopener">
      Announcement from Vice President John A. Michitson, October 20, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/agenda-letter`)} target="_blank" rel="noopener">
      Notice of the committee meeting, filed with the City Clerk, October 15, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

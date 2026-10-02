<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "planning-development-committee-meeting"
</script>

<p>
  Vice President Michitson wishes to announce a Planning and Development Committee meeting on
  Monday, October 19, 2026, at 6:00PM in Room 202, City Council Chambers.
</p>

<hr />

<!-- The notice the Chairperson filed with the Clerk, which names what the
     committee is meeting about; the agenda's own line does not. -->

<h2>
  Letter from John A. Michitson, Chairperson, Planning and Development Committee, September 29, 2026
</h2>

<p>TO: Kaitlin M. Wright, City Clerk</p>

<p>
  RE: Planning and Development Committee Meeting - <strong>Monday, October 19, 2026, 6:00 PM</strong
  >
</p>

<p>Dear Ms. Wright:</p>

<p>
  Please be advised, I have scheduled a Planning and Development Committee meeting for
  <strong>
    Monday, October 19, 2026, at 6:00 PM in the City Council Chambers, Room 202, City Hall, 4 Summer
    Street.
  </strong>
</p>

<p>The purpose of the meeting is to discuss and review the following:</p>

<dl>
  <dt><strong>Doc. 32-k:</strong></dt>
  <dd>
    <p>
      Motion by Vice President Michitson to work with the administration and appropriate departments
      on an initial risk-based assessment of the City&rsquo;s critical infrastructure, beginning
      with the wastewater and drinking water systems.
    </p>
    <p>
      <strong>
        The purpose of the first meeting will be to define the scope of the project, identify
        outcomes, and organize the study.
      </strong>
    </p>
  </dd>
</dl>

<p>
  You can also join the meeting remotely by using the link:
  <a href="https://meet.google.com/tow-hfmn-jov" target="_blank" rel="external noopener noreferrer">
    https://meet.google.com/tow-hfmn-jov
  </a>
</p>

<p>
  C: P&amp;D Committee Members, City Council, Mayor Melinda E. Barrett, DPW Department,
  Water/Wastewater Department, Engineering Department
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/announcement`)} target="_blank" rel="noopener">
      Announcement from Vice President John A. Michitson, September 29, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/committee-notice`)} target="_blank" rel="noopener">
      Notice of the committee meeting, filed with the City Clerk<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

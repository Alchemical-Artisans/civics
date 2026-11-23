<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-30"
  const ITEM = "planning-development-committee-meeting"
  // The sitting this item announces, which has records of its own.
  const COMMITTEE = "planning-and-development-committee-2026-07-07"
</script>

<p>
  Vice President Michitson wishes to announce the <a href={Router.meeting(COMMITTEE)}
    >Planning and Development Committee meeting on Tuesday, July 7, 2026 at 6 PM</a
  > in Room 202, City Council Chambers
</p>

<h2>Minutes</h2>

<p>Placed on file</p>

<hr />

<h2>Planning and Development Committee Meeting, June 12, 2026</h2>

<p>
  TO: Kaitlin M. Wright, City Clerk<br />
  RE: Planning and Development Committee Meeting -<br />
  <strong>Tuesday, July 7, 2026, 6:00 PM</strong>
</p>

<p>Dear Ms. Wright:</p>

<p>
  Please be advised, I have scheduled a Planning and Development Committee meeting for <strong
    >Tuesday, July 7, 2026, at 6:00 PM in the City Council Chambers, Room 202, City Hall, 4 Summer
    Street.</strong
  >
</p>

<p>The purpose of the meeting is to discuss and review the following:</p>

<ul>
  <li>
    <strong
      >Doc. 21-B Motion by Councilor Sullivan to send for further discussion Chapter 255-Zoning
      Ordinance and Zoning Map &ndash; <a
        href={Router.meetingItem(
          "city-council-2026-07-14",
          "battery-energy-storage-systems-ordinance",
        )}>Battery Energy Storage Systems Overlay District (BESS)</a
      ></strong
    >
  </li>
</ul>

<p>
  You can also join the meeting remotely by using the link: https://meet.google.com/tym-zahy-gyq
</p>

<p>
  Sincerely,<br />
  John A. Michitson, Chairperson<br />
  Planning and Development Committee
</p>

<p>
  JAM/lar<br />
  Attachments
</p>

<p>
  C: P&amp;D Committee Members, City Council, Mayor Melinda E. Barrett, Fire Department, Engineering
  Department, Planning Department
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/announcement`)} target="_blank" rel="noopener">
      Vice President Michitson&rsquo;s announcement, June 25, 2026, the Chairperson&rsquo;s letter
      to the City Clerk, June 12, 2026, and the e-mail notice<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/bess-attachments`)} target="_blank" rel="noopener">
      Attachments: Document # 21-B and the Battery Energy Storage Systems ordinance&rsquo;s file<span
        class="sr-only">, PDF, thirty pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

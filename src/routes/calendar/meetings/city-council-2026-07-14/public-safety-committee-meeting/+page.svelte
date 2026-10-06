<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-07-14"
  const ITEM = "public-safety-committee-meeting"
  // The sitting this item announces, which has records of its own.
  const COMMITTEE = "public-health-safety-works-committee-2026-07-29"
</script>

<p>
  Councilor McGonagle wishes to announce the
  <a href={Router.meeting(COMMITTEE)}
    >Public Safety subcommittee meeting on Wednesday, July 29, 2026 at 6 PM</a
  >
  in Room 202, City Council Chambers
</p>

<h2>Minutes</h2>

<p>
  Councilor McGonagle invites the public to the public and safety meeting on July 29<sup>th</sup> at 6PM.
</p>

<hr />

<!-- The notice the Chairperson filed with the Clerk, which names what the
     committee is meeting about; the agenda's own line does not. -->

<h2>Public Meeting Notice, July 7, 2026</h2>

<p>
  To: Kaitlin M. Wright, City Clerk<br />
  Re: Public Safety Committee Meeting<br />
  <strong>Wednesday, July 29, 2026 at 6:00 PM</strong>
</p>

<p>Dear Ms. Wright:</p>

<p>
  Please be advised I have scheduled a Public Safety Committee Meeting for Wednesday, July 29, 2026,
  at 6:00 PM in the City Council Chambers, Room 202, City Hall, 4 Summer Street. The purpose of the
  meeting is to discuss the following:
</p>

<p>
  <strong
    >Doc. 33-F: Motion by Councilor Lewandowski to refer the matter of e-bike safety to committee
    for further review and discussion</strong
  >
</p>

<p>
  You can also join the meeting remotely by using the link: https://meet.google.com/ynp-mrxt-fwx
</p>

<p>
  Sincerely,<br />
  Michael S. McGonagle, Chairperson<br />
  Public Safety Committee<br />
  Haverhill City Council
</p>

<p>MM/lar</p>

<p>
  c: Public Safety Committee Members, City Council, Mayor Melinda E. Barrett, Christine Lindberg,
  City Solicitor Lisa Mead, Chief Wayne Tracy, Sgt. Lynch
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/announcement`)} target="_blank" rel="noopener">
      Letter from Councilor Michael S. McGonagle, July 7, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/public-meeting-notice`)}
      target="_blank"
      rel="noopener"
    >
      Public Meeting Notice, July 7, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/remote-link-email`)} target="_blank" rel="noopener">
      Email from HC Media with the link to join, July 7, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ride-safe-flyer`)} target="_blank" rel="noopener">
      Ride Safe flyer<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/councilors-letter`)} target="_blank" rel="noopener">
      Letter from Councilors Lewandowski and Toohey and Vice President Michitson, June 23, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett on Bill S.3077, June 26, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/governors-letter`)} target="_blank" rel="noopener">
      Letter from Governor Maura T. Healey transmitting Senate No. 3077, May 4, 2026<span
        class="sr-only">, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/senate-bill-3077`)} target="_blank" rel="noopener">
      Senate No. 3077, An Act to enhance the safe use of micromobility devices<span class="sr-only"
        >, PDF, 12 pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<script lang="ts">
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "state-election-reminder"

  /** Election Day itself, which this letter is the last reminder of. */
  const event: CalendarEvent = {
    uid: `${MEETING}-${ITEM}@haverhill.alchemicalartisans.com`,
    title: "State Election",
    start: "20261103T070000",
    end: "20261103T200000",
    allDay: false,
    location: "Haverhill, MA",
    description:
      "Voters who have not already cast a ballot have the opportunity to vote on Election Day, Tuesday, November 3, between 7:00 AM and 8:00 PM at their regular polling location.",
    url: Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`),
  }
</script>

<p>Kaitlin M. Wright Esposito, <em>City Clerk</em>, shares November 3rd state election reminder</p>

<hr />

<p>October 18, 2026</p>

<p>To: President Jordan and Members of the Haverhill City Council,</p>

<p>
  As of the October 27, 2026 City Council meeting, we are just one week away from the 2026 Midterm
  Elections.
</p>

<p>
  Early Voting is still ongoing and there are just a few days left where voters can cast a ballot
  early in-person. Voters can vote early in-person on Wednesday 10/28, Thursday 10/29, and Friday
  10/30 8 AM to 4 PM in the Early Voting Room, located on the basement level of City Hall.
</p>

<p>
  If you are voting by mail and have not yet returned your ballot, please hand-deliver it either
  using our secure election drop box located on the Main Street side of City Hall or directly to the
  City Clerk&rsquo;s Office (room 118) to ensure timely receipt. Do not risk placing it in the mail
  as it may not arrive in time.
</p>

<p>
  As always, voters who have not already cast a ballot have the opportunity to vote on Election Day,
  Tuesday, November 3, between 7:00 AM and 8:00 PM at their regular polling location. Unsure where
  your polling location is? Visit
  <a href="https://www.wheredoivotema.com/" target="_blank" rel="external noopener noreferrer">
    wheredoivotema.com<span class="sr-only">, opens in a new tab</span>
  </a> to find out.
</p>

<div class="not-prose my-4">
  <AddToCalendar {event} filename="state-election-2026-11-03" />
</div>

<p>
  A gentle reminder to all Haverhill voters, no matter if you are voting by mail, early in-person,
  or on Election Day, you will receive a two-card ballot. Card 1 is front and back, with all
  candidates and questions 1-3 on the front and the backside lists questions 4-7. Card 2 is only
  one-sided and has questions 8-10. Once you reach the bottom of card 2, you will have now completed
  voting. Please be sure to return both cards when voting.
</p>

<p>Respectfully,</p>

<p>
  Kaitlin M. Wright Esposito, <em>CMC/CMMC</em><br />
  <strong>City Clerk</strong>
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Letter from Kaitlin M. Wright Esposito, City Clerk, October 18, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<script lang="ts">
  import { Router } from "$lib/router"
  import {
    OFFICES,
    POLLING_PLACES,
    QUESTIONS,
  } from "../../../../projects/2026-state-election/election"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "election-warrant"
</script>

<p>
  Kaitlin M. Wright Esposito, <em>City Clerk</em>, submits Election Warrant for the 2026 State
  Election to be held on Tuesday, November 3, 2026 from 7 AM to 8 PM
</p>

<hr />

<!-- The warrant itself, seven pages of it, transcribed rather than linked: the
     polling places are a table and the ballot questions are the text a voter
     will be asked to vote on, and neither is searchable or readable aloud
     inside a scan. The Secretary's form prints the signature block empty, so
     it is left out; the scan at the foot of the page has it.

     The three parts a precinct's own page also states -- the polling places,
     the offices and the questions -- are transcribed once, into the 2026
     State Election project's `election.ts`, and drawn from there, so a
     precinct page and this transcription cannot disagree. Everything else is
     here as markup, as any other write-up is. -->

<h2>Commonwealth of Massachusetts</h2>

<p>William Francis Galvin<br />Secretary of the Commonwealth</p>

<h2>Warrant for 2026 State Election</h2>

<p>SS.<br />To the Constables of the City of Haverhill</p>

<p><strong>GREETINGS:</strong></p>

<p>
  In the name of the Commonwealth, you are hereby required to notify and warn the inhabitants of
  said city or town who are qualified to vote in Elections to vote at:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Ward and Precinct</th>
      <th scope="col">Polling place</th>
      <th scope="col">Address</th>
    </tr>
  </thead>
  <tbody>
    {#each POLLING_PLACES as place (place.label)}
      <tr>
        <th scope="row">{place.label}</th>
        <td>{place.name}</td>
        <td>{place.address}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p>
  On <strong>TUESDAY, THE THIRD DAY OF NOVEMBER, 2026,</strong> from 7:00 A.M. to 8:00 P.M. for the following
  purpose:
</p>

<p>
  To cast their votes in the State Election for the candidates for the following offices and
  questions:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Office</th>
      <th scope="col">District</th>
    </tr>
  </thead>
  <tbody>
    {#each OFFICES as row (row.office + row.district)}
      <tr><th scope="row">{row.office}</th><td>{row.district}</td></tr>
    {/each}
  </tbody>
</table>

{#each QUESTIONS as q (q.number)}
  <h2>
    QUESTION {q.number}{#if q.kind}: {q.kind}{/if}
  </h2>

  <p>{q.question}</p>

  <h3>SUMMARY</h3>

  {#each q.summary as paragraph (paragraph)}
    <p>{paragraph}</p>
  {/each}

  {#if q.yes}
    <p><em><strong>A YES VOTE</strong></em> {q.yes}</p>
  {/if}
  {#if q.no}
    <p><em><strong>A NO VOTE</strong></em> {q.no}</p>
  {/if}
{/each}

<p>
  Hereof fail not and make return of this warrant with your doings thereon at the time and place of
  said voting.
</p>

<p>
  Warrant must be posted by <strong>October 27, 2026</strong> (at least <em>seven days prior</em> to
  the <strong>November 3, 2026</strong> State Election).
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Warrant for 2026 State Election<span class="sr-only">
        , PDF, seven pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

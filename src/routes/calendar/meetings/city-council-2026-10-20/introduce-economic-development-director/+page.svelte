<script lang="ts">
  import BackgroundNote from "$lib/BackgroundNote.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "introduce-economic-development-director"

  // WHAV is Greater Haverhill's public radio station and covers the Council
  // and the Mayor's office as a beat; both of these pieces quote Barrett
  // directly, which is why the panel can carry her own words for a decision
  // the city published no document about.
  const SOURCES = [
    {
      title: "Barrett Names Gulubicki as City's Economic Development Chief",
      publisher: "WHAV",
      date: "October 11, 2026",
      url: "https://whav.net/2026/10/11/barrett-names-gulubicki-as-citys-economic-development-chief/",
    },
    {
      title:
        "Tarpy to Become Haverhill's First Assistant Fire Chief; Byerley Joins City as Planning Director",
      publisher: "WHAV",
      date: "January 6, 2026",
      url: "https://whav.net/2026/01/06/tarpy-to-become-haverhills-first-assistant-fire-chief-byerley-joins-city-as-planning-director/",
    },
  ]
</script>

<p>
  Mayor Barrett wishes to introduce Alison Gulubicki, <em>Economic Development Director</em>
</p>

<!--
  SCAFFOLD -- these bullets are research notes, not the page's text. They are
  here to be written up by hand and replaced; the words on this site are the
  city's or a person's, never the assistant's. Source tags say which of the two
  pieces in `SOURCES` carries each fact, so a sentence can be checked as it is
  written. Internal links are to this site's own record and can be kept.
-->
<BackgroundNote sources={SOURCES}>
  <ul>
    <li>
      Took up the post in early October 2026; the item is the introduction itself, with nothing for
      the Council to decide. (WHAV, Oct 11)
    </li>
    <li>
      Succeeds William Pillsbury Jr., Economic Development <em>and</em> Planning Director for some 35
      years, who retired in the autumn of 2025 along with his assistant, Pamela Price. (WHAV, Jan 6)
    </li>
    <li>
      Barrett split that combined role back into two, as it had been in the 1980s. Jacki Byerley
      took the planning half in January 2026 &mdash; the title she appears under throughout this
      calendar, including
      <a href={Router.meetingItem(MEETING, "marshland-st-special-permit")}>in this sitting</a>. The
      economic development half stayed open about a year. (WHAV, Jan 6)
    </li>
    <li>
      The post was advertised in August 2025 at $116,630 to $133,000. Stated duties: prepare and
      implement a citywide economic development strategy, work with existing businesses, manage
      local, state and federally paid economic development planning. (WHAV, Jan 6)
    </li>
    <li>
      Came from the Greater Haverhill Foundation, where she was executive director for nearly two
      years; before that vice president of the Greater Haverhill Chamber of Commerce, legislative
      aide to then-state Senator Steven A. Baddour, and a program manager in Methuen&rsquo;s
      Economic and Community Development Department. MPA, Norwich University, in urban and economic
      development. (WHAV, Oct 11)
    </li>
    <li>
      Barrett worked with her on the Mayor&rsquo;s Economic Development Task Force, where she
      represented the foundation, and called her &ldquo;very competent and very dynamic.&rdquo;
      (WHAV, Oct 11)
    </li>
    <li>
      Conflict worth a councillor&rsquo;s attention: she is still wrapping up foundation work and
      will abstain on Harbor Place and other foundation projects. The foundation developed the Ward
      Hill Business Park, spearheaded Harbor Place, and
      <a href={Router.meetingItem("city-council-2026-08-11", "boardwalk-block-party")}
        >wrote to this Council</a
      > about an event on the Lawn at Harbor Place as recently as August 2026. (WHAV, Oct 11)
    </li>
    <li>
      The city&rsquo;s own record shows the hire without explaining it: a Retirement Board
      <a href={Router.meeting("retirement-board-2026-10-13")}>new-member enrollment on October 13</a
      >, a $30,000 surplus moved off Economic Development Salaries at the
      <a href={Router.meetingItem("city-council-2026-07-14", "fy26-budget-transfers")}
        >FY2026 close</a
      >, and that line 10.27% spent against a 17.31% benchmark in
      <a href={Router.meetingItem("city-council-2026-09-22", "revenue-and-expense-reports")}
        >August</a
      >.
    </li>
  </ul>
</BackgroundNote>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 16, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

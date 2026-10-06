<script lang="ts">
  import { Router } from "$lib/router"
  import OrdinanceDiff from "$lib/OrdinanceDiff.svelte"
  import {
    HEADING,
    REDLINE,
  } from "../../city-council-2026-09-22/recreational-motorized-vehicles-ordinance/ordinance"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "recreational-motorized-vehicles-ordinance"
</script>

<p>
  Mayor Barrett submits an ordinance relating to amending Chapter 222 Article XI Recreational
  Motorized Vehicles of the Haverhill City Ordinance restricting the use of motorized bicycles and
  scooters
</p>

<p class="text-right"><strong>Filed September 23, 2026</strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 32-Q<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>, with the Council&rsquo;s vote of
    <a href={Router.meetingItem("city-council-2026-09-22", ITEM)}>September 22, 2026</a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, September 18, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/city-solicitors-opinion`)}
      target="_blank"
      rel="noopener"
    >
      Opinion of City Solicitors Lisa Mead and Elizabeth Lydon, September 11, 2026<span
        class="sr-only"
      >
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      An Ordinance Relating to Amendment to Chapter 222 of the Haverhill City Ordinances<span
        class="sr-only"
      >
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/ordinance-amendments-marked`)}
      target="_blank"
      rel="noopener"
    >
      The same ordinance, with the deletions struck through and the additions in italic<span
        class="sr-only"
      >
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ad-confirmation`)} target="_blank" rel="noopener">
      Confirmation of the ordinance&rsquo;s publication notice<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<hr />

<!-- The article as the ordinance would amend it, drawn as a diff. The packet
     carries the city's own marked-up copy, so the strike-through the diff
     links to is that PDF rather than one generated here, and the diff's marks
     are a transcription of its marks rather than a word diff -- see
     `ordinance.ts` under the 22 September item, where the same copy was first filed. -->
<h2>{HEADING.chapter}, {HEADING.article}, {HEADING.title}</h2>

<OrdinanceDiff
  redline={REDLINE}
  name="{HEADING.chapter}, {HEADING.article}, {HEADING.title}"
  strikeThrough={{
    href: Router.excerpt(MEETING, `${ITEM}/ordinance-amendments-marked`),
    external: true,
  }}
/>

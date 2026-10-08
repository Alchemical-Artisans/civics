<script lang="ts">
  import { Router } from "$lib/router"
  import OrdinanceDiff from "$lib/OrdinanceDiff.svelte"
  import { HEADING, REDLINE } from "./ordinances"

  const MEETING = "city-council-2026-09-22"
  const ITEM = "water-use-restriction-ordinance"
  // The Planning and Development Committee sittings that took the matter up
  // (Docs. 94-B and 1-F) before the Mayor filed this order; the DPW memo below
  // says the revised ordinance "incorporates items discussed" there.
  const COMMITTEE = [
    ["planning-and-development-committee-2026-03-02", "March 2, 2026"],
    ["planning-and-development-committee-2026-03-30", "March 30, 2026"],
  ]
</script>

<p>
  Mayor Barrett submits an order relating to the Water Use Restriction Ordinance &ndash; Ch. 250
  Article VI of the Code of the City of Haverhill
</p>

<ul>
  <li>
    <strong>5.2.1</strong> Order- That the City Council hereby votes to repeal and replace Chapter 250,
    Article VI of the Code the of the City of Haverhill, entitled Water Restriction, in its entirety,
    with the following revised ordinance
  </li>
</ul>

<p class="text-right"><strong>File 10 Days</strong></p>

<hr />

<!-- The order and the article it would replace, transcribed out of the two
     PDFs linked below and drawn as a diff of one against the other. The order
     says only "in its entirety", and the packet leaves a reader to hold seven
     scanned pages against five; which words actually move is the whole
     question in front of the Council. The packet has no marked-up copy, so the
     strike-through the diff links to is generated, from the same redline. See
     `ordinances.ts` for how the two are paired and `$lib/redline` for how the
     marks are written out of them. -->
<h2>{HEADING.article}, {HEADING.title}</h2>
<p class="text-sm text-slate-600">{HEADING.adopted}</p>

<OrdinanceDiff
  redline={REDLINE}
  name="Chapter 250, {HEADING.article}, {HEADING.title}"
  strikeThrough={{ href: Router.strikeThrough(MEETING, ITEM), external: false }}
/>

<hr />

<ul>
  {#each COMMITTEE as [id, day] (id)}
    <li>
      <a href={Router.meeting(id)}>
        Minutes/Summary of the Planning and Development Committee Meeting, {day}
      </a>
    </li>
  {/each}
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, September 18, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/public-works-memo`)} target="_blank" rel="noopener">
      Memorandum from Robert E. Ward, DPW Director &ndash; Water/Wastewater, September 17, 2026<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      An Order Relating to the Water Use Restriction Ordinance, with the revised Article VI<span
        class="sr-only"
      >
        , PDF, seven pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/current-ordinance`)} target="_blank" rel="noopener">
      The current Article VI, Water Use Restriction, attached for reference<span class="sr-only">
        , PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

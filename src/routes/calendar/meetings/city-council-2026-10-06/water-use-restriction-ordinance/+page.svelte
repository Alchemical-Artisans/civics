<script lang="ts">
  import { Router } from "$lib/router"
  import OrdinanceDiff from "$lib/OrdinanceDiff.svelte"
  // The order and the article it replaces are the same two documents the
  // Mayor filed on 22 September, rescanned into this packet at a different
  // resolution; the transcription and the pairing are read from there rather
  // than copied, so the two pages cannot come to state the article
  // differently, and `ordinances.spec.ts` beside it goes on pinning both.
  import {
    HEADING,
    REDLINE,
  } from "../../city-council-2026-09-22/water-use-restriction-ordinance/ordinances"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "water-use-restriction-ordinance"
</script>

<p>
  Mayor Barrett submits an order relating to the Water Use Restriction Ordinance &ndash; Ch. 250
  Article VI of the Code of the City of Haverhill
</p>

<ul>
  <li>
    <strong>16.2.1</strong> Order- That the City Council hereby votes to repeal and replace Chapter 250,
    Article VI of the Code the of the City of Haverhill, entitled Water Restriction, in its entirety,
    with the following revised ordinance
  </li>
</ul>

<p class="text-right"><strong>Filed on September 23, 2026</strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 32-R, with the Council&rsquo;s vote of September 22, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
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

<hr />

<!-- The order and the article it would replace, drawn as a diff of one
     against the other. The order says only "in its entirety", and the packet
     leaves a reader to hold seven scanned pages against five; which words
     actually move is the whole question in front of the Council. This packet
     has no marked-up copy either, so the strike-through is generated. -->
<h2>{HEADING.article}, {HEADING.title}</h2>
<p class="text-sm text-slate-600">{HEADING.adopted}</p>

<OrdinanceDiff
  redline={REDLINE}
  name="Chapter 250, {HEADING.article}, {HEADING.title}"
  strikeThrough={{ href: Router.strikeThrough(MEETING, ITEM), external: false }}
/>

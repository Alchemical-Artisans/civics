<script lang="ts">
  import { Router } from "$lib/router"
  import StrikeThrough from "$lib/StrikeThrough.svelte"
  import {
    HEADING,
    REDLINE,
  } from "../../../city-council-2026-09-22/water-use-restriction-ordinance/ordinances"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "water-use-restriction-ordinance"
</script>

<!-- The one line on this page that is not the city's: the packet carries no
     marked-up copy of this order, so this one is ours, and a reader has to
     know that before taking a struck word for the city's own mark. -->
<p class="text-sm text-slate-600">
  Generated from the order and the article it replaces; the packet has no marked-up copy.
  <del class="text-rose-800">Struck</del> wording is removed by the order;
  <ins class="font-semibold text-emerald-800 italic no-underline">italic</ins> wording is added.
  <a href={Router.meetingItem(MEETING, ITEM)}>Back to the diff</a>
</p>

<h2>{HEADING.article}, {HEADING.title}</h2>
<p class="text-sm text-slate-600">{HEADING.adopted}</p>

<StrikeThrough redline={REDLINE} />

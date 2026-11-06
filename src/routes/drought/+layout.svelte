<!--
  The drought page, with the city's own acts on it beside the reading.

  **The layout owns the two columns rather than the page.** Everything on
  `/drought` is the page's -- its heading, its charts, its paragraphs -- and
  wrapping all of that in a grid would have meant indenting the whole page to
  put one column beside it. A layout renders `{@render children()}` into the
  first column and the timeline into the second, which is the same shape the
  election's own layout has and leaves the page itself untouched.

  The timeline is `FoldedTimeline` over `DROUGHT_TIMELINE`, not
  `ProjectTimeline`: the drought is a subject this site reports on rather than
  an undertaking in `PROJECTS`, and the bar's Projects menu is what `PROJECTS`
  lists.

  Two columns only from `lg`. Below it the timeline follows the reading, which
  is the right order on a phone: the page is what a reader came for and the
  record of sittings is what they turn to afterwards.
-->
<script lang="ts">
  import FoldedTimeline from "$lib/FoldedTimeline.svelte"
  import { DROUGHT_TIMELINE } from "./timeline"

  let { data, children } = $props()
</script>

<div class="mx-auto max-w-6xl px-4 py-8">
  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <!-- `min-w-0` so the page's own wide things -- a table of the city's,
         a chart's own box -- scroll inside this column instead of widening
         it and squeezing the timeline out. -->
    <div class="min-w-0">
      {@render children()}
    </div>

    <!-- Unfolded. The fold holds the record back so it is not in the way of
         what a reader can still act on, which is the right trade on a
         project with sittings still to come. Here what is ahead is two
         steps nobody has dated -- the tiered-rates analysis and the Methuen
         connection -- and folding leaves those two showing with the six
         meetings that actually happened hidden behind an arrow. The record
         is what this page is about. -->
    <FoldedTimeline entries={DROUGHT_TIMELINE} today={data.today} fold={false} />
  </div>
</div>

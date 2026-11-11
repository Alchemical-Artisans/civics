<!--
  The ALPR page, laid out the way `/issues/drought` is: the page's own reading
  in the first column and its timeline in the second, two columns only from
  `lg`. See `../drought/+layout.svelte` for why the layout rather than the
  page owns the columns.
-->
<script lang="ts">
  import FoldedTimeline from "$lib/FoldedTimeline.svelte"
  import { ALPR_TIMELINE } from "./timeline"

  let { data, children } = $props()
</script>

<div class="mx-auto max-w-6xl px-4 py-8">
  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <div class="min-w-0 [overflow-wrap:anywhere]">
      {@render children()}
    </div>

    <FoldedTimeline
      entries={ALPR_TIMELINE}
      today={data.today}
      fold={false}
      class="[overflow-wrap:anywhere]"
    />
  </div>
</div>

<!--
  The ALPR page, laid out the way `/issues/drought` is: the page's own reading
  in the first column and its timeline in the second, two columns only from
  `lg`. See `../drought/+layout.svelte` for why the layout rather than the
  page owns the columns.

  A page-history version is drawn in one column with no timeline, as the
  drought guide's is: the timeline beside it would be today's, next to text
  that may be weeks older.
-->
<script lang="ts">
  import { page } from "$app/state"
  import FoldedTimeline from "$lib/FoldedTimeline.svelte"
  import { ALPR_TIMELINE } from "./timeline"

  let { data, children } = $props()

  // Matched on the route id, never the URL: see `SiteHeader`'s own note.
  const inHistory = $derived(page.route.id?.startsWith("/issues/ALPR/history") ?? false)
</script>

{#if inHistory}
  <div class="mx-auto max-w-3xl px-4 py-8">
    {@render children()}
  </div>
{:else}
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
{/if}

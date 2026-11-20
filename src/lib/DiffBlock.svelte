<!--
  One changed block of the drought guide, shown as the reader would see it with
  what went and what came marked.

  `<del>` and `<ins>` rather than colour alone: the strike and the underline
  are the browser's own and say the same thing to a reader who cannot tell red
  from green, and a screen reader announces both.
-->
<script lang="ts">
  import BlockText from "$lib/BlockText.svelte"
  import type { Change } from "$lib/text-diff"

  let { change }: { change: Change } = $props()

  const LABEL = {
    added: "Added",
    removed: "Removed",
    changed: "Changed",
    same: "Unchanged",
  } as const
</script>

<div
  class="my-3 rounded border-l-4 px-3 py-1 {change.kind === 'added'
    ? 'border-green-600 bg-green-50'
    : change.kind === 'removed'
      ? 'border-red-600 bg-red-50'
      : 'border-amber-500 bg-amber-50'}"
>
  <p class="m-0 text-xs font-semibold tracking-wide text-slate-600 uppercase">
    {LABEL[change.kind]}
  </p>
  <p class="my-1">
    {#if change.kind === "changed"}
      {#each change.parts as part, i (i)}
        {#if part.kind === "removed"}
          <del class="bg-red-200 text-red-900"><BlockText tokens={part.tokens} /></del>
        {:else if part.kind === "added"}
          <ins class="bg-green-200 text-green-900 no-underline"
            ><BlockText tokens={part.tokens} /></ins
          >
        {:else}
          <BlockText tokens={part.tokens} />
        {/if}
      {/each}
    {:else if change.kind === "removed"}
      <del class="bg-red-200 text-red-900"><BlockText tokens={change.tokens} /></del>
    {:else}
      <ins class="bg-green-200 text-green-900 no-underline"
        ><BlockText tokens={change.tokens} /></ins
      >
    {/if}
  </p>
</div>

<script lang="ts">
  import { onMount } from "svelte"
  import { diffView } from "$lib/diff-view.svelte"

  /**
   * GitHub's split/unified choice, as a pair of pressed-or-not buttons, over
   * the preference every diff on the site reads. Drawn in a `DiffFrame`'s
   * controls by any diff that can be laid out both ways.
   */
  onMount(() => diffView.load())
</script>

<span
  class="inline-flex overflow-hidden rounded-md border border-[#d0d7de]"
  role="group"
  aria-label="Diff layout"
>
  {#each [["split", "Split"], ["unified", "Unified"]] as const as [value, label] (value)}
    <button
      type="button"
      class="px-2.5 py-1 text-xs font-medium {diffView.current === value
        ? 'bg-[#0969da] text-white'
        : 'bg-white text-[#1f2328] hover:bg-[#f3f4f6]'}"
      aria-pressed={diffView.current === value}
      onclick={() => diffView.choose(value)}>{label}</button
    >
  {/each}
</span>

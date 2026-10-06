<script lang="ts">
  import type { Redline } from "$lib/redline"

  /**
   * A redline set as a marked-up copy prints it: the text running on, struck
   * words left in place with a line through them and added words in italic
   * beside them -- the convention the city's own marked-up copies use
   * ("the deletions struck through and the additions in italic"), so a copy
   * drawn here reads like the ones the city publishes.
   *
   * Only drawn where the packet carries no marked-up copy of its own; where it
   * does, the diff links to that instead, since the city's is the document of
   * record and this would be a second copy of it in our hand.
   */

  let { redline }: { redline: Redline } = $props()
</script>

{#snippet marks(text: Redline[number]["text"])}
  {#each text as segment, i (i)}{#if typeof segment === "string"}{segment}{:else if "struck" in segment}<del
        class="text-rose-800 decoration-rose-700">{segment.struck}</del
      >{:else}<ins class="font-semibold text-emerald-800 italic no-underline">{segment.added}</ins
      >{/if}{/each}
{/snippet}

{#each redline as block, i (i)}
  {#if block.kind === "heading"}
    <h3>{@render marks(block.text)}</h3>
  {:else if block.kind === "term"}
    <p class="mb-0 font-semibold">{@render marks(block.text)}</p>
  {:else}
    <p style:margin-left="{(block.indent ?? 0) * 1.5}rem">{@render marks(block.text)}</p>
  {/if}
{/each}

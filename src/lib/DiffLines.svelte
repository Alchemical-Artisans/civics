<script lang="ts">
  import { splitRows, type DiffLine, type SplitRow } from "$lib/redline"
  import { LINE, WORD } from "$lib/diff-style"

  /**
   * A run of diff lines, each a paragraph of the text: today's wording in red
   * with a minus and the amended wording in green with a plus, the words that
   * actually move highlighted darker inside the line.
   *
   * Split sets the two sides beside each other, a paragraph and its amendment
   * on one row; unified puts the removed line above the added. Which of them
   * is the drawing's own business -- `OrdinanceDiff` offers the reader both,
   * a schedule drawn as table rows has only the one -- so it is a prop here
   * rather than a choice this component makes.
   */
  let { items, view = "unified" }: { items: DiffLine[]; view?: "split" | "unified" } = $props()

  const ROW =
    "grid grid-cols-[2.25rem_2.25rem_1.25rem_minmax(0,1fr)] sm:grid-cols-[3rem_3rem_1.5rem_minmax(0,1fr)]"

  const SPLIT =
    "grid grid-cols-[2rem_1rem_minmax(0,1fr)_2rem_1rem_minmax(0,1fr)] sm:grid-cols-[2.75rem_1.25rem_minmax(0,1fr)_2.75rem_1.25rem_minmax(0,1fr)]"
</script>

{#snippet words(item: DiffLine)}
  <!-- The words a line marks are deletions or insertions in their own right,
       so a screen reader is told so, but they are drawn GitHub's way -- a
       darker background, no strike or underline -- since the line's own
       colour has already said which side they are on. -->
  {#if item.type !== "context"}<span class="sr-only"
      >{LINE[item.type].label}:
    </span>{/if}{#each item.runs as run, i (i)}{#if run.changed && item.type === "removed"}<del
        class="rounded-sm no-underline {WORD.removed}">{run.text}</del
      >{:else if run.changed && item.type === "added"}<ins
        class="rounded-sm no-underline {WORD.added}">{run.text}</ins
      >{:else}{run.text}{/if}{/each}
{/snippet}

{#snippet text(item: DiffLine, hidden = false)}
  <span
    class="pr-3 break-words whitespace-pre-wrap text-[#1f2328]"
    class:font-semibold={item.kind !== "text"}
    style:padding-left="{item.indent * 1.5}rem"
    aria-hidden={hidden || undefined}
  >
    {@render words(item)}
  </span>
{/snippet}

{#snippet unified(item: DiffLine)}
  {@const style = LINE[item.type]}
  <div class="{ROW} {style.row}">
    <span class="{style.gutter} pr-2 text-right text-[#6e7781] select-none" aria-hidden="true">
      {item.old ?? ""}
    </span>
    <span class="{style.gutter} pr-2 text-right text-[#6e7781] select-none" aria-hidden="true">
      {item.new ?? ""}
    </span>
    <span class="text-center select-none" aria-hidden="true">{style.sign}</span>
    {@render text(item)}
  </div>
{/snippet}

{#snippet half(item: DiffLine | undefined, number: number | undefined, hidden: boolean)}
  {#if item}
    {@const style = LINE[item.type]}
    <span class="{style.gutter} pr-2 text-right text-[#6e7781] select-none" aria-hidden="true"
      >{number ?? ""}</span
    >
    <span class="{style.row} text-center select-none" aria-hidden="true">{style.sign}</span>
    <span class="{style.row} flex">{@render text(item, hidden)}</span>
  {:else}
    <!-- Nothing on this side: GitHub's grey, so the gap reads as an absence
         rather than as a blank paragraph. -->
    <span class="col-span-3 bg-[#f6f8fa]" aria-hidden="true"></span>
  {/if}
{/snippet}

{#snippet split(row: SplitRow)}
  <div class={SPLIT}>
    {@render half(row.left, row.left?.old, false)}
    <!-- An unchanged paragraph is on both sides; a screen reader hears it once. -->
    {@render half(row.right, row.right?.new, row.right?.type === "context")}
  </div>
{/snippet}

{#if view === "split"}
  {#each splitRows(items) as row, i (i)}
    {@render split(row)}
  {/each}
{:else}
  {#each items as item, i (i)}
    {@render unified(item)}
  {/each}
{/if}

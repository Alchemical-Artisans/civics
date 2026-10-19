<script lang="ts">
  import type { Snippet } from "svelte"
  import { DIFF_BORDER, DIFF_BUTTON, SQUARE } from "$lib/diff-style"

  /**
   * The panel every diff on the site sits in: GitHub's file box, with the
   * header that names what the diff is of, counts what changed, and carries
   * the way out to the strike-through.
   *
   * Separate from what is drawn inside it because the drawing differs and the
   * frame does not. An ordinance is a run of paragraphs and `OrdinanceDiff`
   * draws it a line at a time; the snow plowing rates are a four-column
   * schedule, whose lines are table rows -- flattened to paragraphs a row
   * would lose which column each figure sits in, which is the whole of what
   * the schedule says. Both are diffs of one document, and a reader should
   * not have to learn two boxes to read them.
   */
  let {
    name,
    added,
    removed,
    unit = { one: "paragraph", many: "paragraphs" },
    strikeThrough,
    controls,
    children,
  }: {
    /** What the diff is of, as a file header names its file. */
    name: string
    /** Lines the amendment adds, and lines it removes, for the counts. */
    added: number
    removed: number
    /** What a line is here, for the count a screen reader hears. */
    unit?: { one: string; many: string }
    /** The strike-through: `external` where it is the city's PDF, else one generated here, which the button says. */
    strikeThrough: { href: string; external: boolean }
    /** The drawing's own controls -- a layout choice, an "Expand all" -- if it has any. */
    controls?: Snippet
    children: Snippet
  } = $props()

  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

  /**
   * GitHub's five-square bar: the share of changed lines that are additions,
   * in fifths, rounded so a change with any additions shows at least one green
   * square and one with any deletions at least one red.
   */
  const squares = $derived.by(() => {
    const total = added + removed
    if (total === 0) return Array<"neutral">(5).fill("neutral")
    let green = Math.round((added / total) * 5)
    if (added && green === 0) green = 1
    if (removed && green === 5) green = 4
    return [...Array<"added">(green).fill("added"), ...Array<"removed">(5 - green).fill("removed")]
  })
</script>

<!-- `not-prose`: a diff is a drawing of a text, not a reading column, and the
     typography plugin's paragraph and `del`/`ins` rules fight it. -->
<div class="not-prose overflow-hidden rounded-md border {DIFF_BORDER} text-[#1f2328]">
  <div
    class="flex flex-wrap items-center gap-x-3 gap-y-2 border-b {DIFF_BORDER} bg-[#f6f8fa] px-3 py-2 text-sm"
  >
    <!-- The name first, on a line of its own on a phone: beside the counts it
         was squeezed to a word a line. -->
    <span
      class="w-full min-w-0 font-mono text-xs font-semibold break-words sm:order-2 sm:w-auto sm:flex-1"
      >{name}</span
    >
    <span class="inline-flex items-center gap-2 font-mono text-xs sm:order-1">
      <span class="font-semibold text-[#1a7f37]">+{added}</span>
      <span class="font-semibold text-[#d1242f]">&minus;{removed}</span>
      <span class="sr-only">
        {plural(added, `${unit.one} added`, `${unit.many} added`)},
        {plural(removed, `${unit.one} removed`, `${unit.many} removed`)}
      </span>
      <span class="inline-flex gap-px" aria-hidden="true">
        {#each squares as square, i (i)}
          <span class="inline-block h-2 w-2 rounded-[1px] {SQUARE[square]}"></span>
        {/each}
      </span>
    </span>

    <span class="ml-auto inline-flex flex-wrap items-center gap-2 sm:order-3">
      {@render controls?.()}
      {#if strikeThrough.external}
        <a href={strikeThrough.href} target="_blank" rel="noopener" class={DIFF_BUTTON}>
          View strike-through<span class="sr-only">
            , the packet's own marked-up copy, PDF, opens in a new tab</span
          >
        </a>
      {:else}
        <!-- Said on the button itself: a reader opening it should know before
             they do that this copy is ours, not one the city published. -->
        <a href={strikeThrough.href} class={DIFF_BUTTON}>View strike-through (generated)</a>
      {/if}
    </span>
  </div>

  <div class="font-mono text-xs leading-5">
    {@render children()}
  </div>
</div>

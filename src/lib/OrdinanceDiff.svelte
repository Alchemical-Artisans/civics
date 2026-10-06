<script lang="ts">
  import { diff, type DiffLine, type Redline } from "$lib/redline"

  /**
   * An amendment drawn the way GitHub draws a change to a file: one column,
   * each paragraph a line, today's wording in red with a minus and the amended
   * wording in green with a plus, the words that actually move highlighted
   * darker inside the line, and the unchanged stretches between changes folded
   * behind a blue `@@` row that opens them.
   *
   * It replaced a two-column comparison, today's text beside the order's. That
   * read well on a wide screen and not at all on a phone, and every reader who
   * has looked at a pull request already knows how to read this one -- red
   * goes, green comes, the darker words are the change. One column also needs
   * no pairing of columns to stay in step, so a paragraph that is new or gone
   * is simply a line on one side, as it would be in a diff of code.
   *
   * A paragraph is a line here, not a line of print: the city's line breaks
   * fall wherever its page margins put them, and a diff of those would mark a
   * whole paragraph changed because one word re-flowed it. The gutter numbers
   * paragraphs for the same reason.
   *
   * The header carries the link to the strike-through -- the city's own
   * marked-up copy where the packet has one, a copy generated from the same
   * redline where it does not -- the way GitHub's file header carries "View
   * file".
   */

  let {
    redline,
    name,
    strikeThrough,
  }: {
    redline: Redline
    /** What the diff is of, as a file header names its file. */
    name: string
    /** The strike-through copy: `external` where it is the city's PDF. */
    strikeThrough: { href: string; external: boolean }
  } = $props()

  const shown = $derived(diff(redline))

  /**
   * GitHub's five-square bar: the share of changed lines that are additions,
   * in fifths, rounded so a change with any additions shows at least one green
   * square and one with any deletions at least one red.
   */
  const squares = $derived.by(() => {
    const total = shown.added + shown.removed
    if (total === 0) return Array<"neutral">(5).fill("neutral")
    let green = Math.round((shown.added / total) * 5)
    if (shown.added && green === 0) green = 1
    if (shown.removed && green === 5) green = 4
    return [...Array<"added">(green).fill("added"), ...Array<"removed">(5 - green).fill("removed")]
  })

  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

  const range = (r: { start: number; count: number }) =>
    r.count === 1 ? `${r.start}` : `${r.start},${r.count}`

  const ROW =
    "grid grid-cols-[2.25rem_2.25rem_1.25rem_minmax(0,1fr)] sm:grid-cols-[3rem_3rem_1.5rem_minmax(0,1fr)]"

  const LINE = {
    context: { row: "bg-white", gutter: "bg-white", sign: " ", label: "Unchanged" },
    removed: { row: "bg-[#ffebe9]", gutter: "bg-[#ffd7d5]", sign: "-", label: "Removed" },
    added: { row: "bg-[#e6ffec]", gutter: "bg-[#ccffd8]", sign: "+", label: "Added" },
  }

  const SQUARE = {
    added: "bg-[#1f883d]",
    removed: "bg-[#cf222e]",
    neutral: "bg-[#d0d7de]",
  }

  const WORD = {
    context: "",
    removed: "bg-[#ff818266]",
    added: "bg-[#abf2bc]",
  }
</script>

{#snippet line(item: DiffLine)}
  {@const style = LINE[item.type]}
  <div class="{ROW} {style.row}">
    <span class="{style.gutter} pr-2 text-right text-[#6e7781] select-none" aria-hidden="true">
      {item.old ?? ""}
    </span>
    <span class="{style.gutter} pr-2 text-right text-[#6e7781] select-none" aria-hidden="true">
      {item.new ?? ""}
    </span>
    <span class="text-center text-[#1f2328] select-none" aria-hidden="true">{style.sign}</span>
    <!-- The words a line marks are deletions or insertions in their own right,
         so a screen reader is told so, but they are drawn GitHub's way -- a
         darker background, no strike or underline -- since the line's own
         colour has already said which side they are on. -->
    <span
      class="pr-3 break-words whitespace-pre-wrap text-[#1f2328]"
      class:font-semibold={item.kind !== "text"}
      style:padding-left="{item.indent * 1.5}rem"
    >
      {#if item.type !== "context"}<span class="sr-only"
          >{style.label}:
        </span>{/if}{#each item.runs as run, i (i)}{#if run.changed && item.type === "removed"}<del
            class="rounded-sm no-underline {WORD.removed}">{run.text}</del
          >{:else if run.changed && item.type === "added"}<ins
            class="rounded-sm no-underline {WORD.added}">{run.text}</ins
          >{:else}{run.text}{/if}{/each}
    </span>
  </div>
{/snippet}

{#snippet fold(lines: DiffLine[], header: string)}
  <!-- A folded stretch opens in place, as GitHub's expander does. A
       `<details>`, so it opens before anything hydrates and without any. -->
  <details class="group">
    <summary
      class="{ROW} cursor-pointer list-none bg-[#ddf4ff] text-[#59636e] hover:bg-[#b6e3ff] [&::-webkit-details-marker]:hidden"
    >
      <span class="col-span-2 bg-[#b6e3ff] text-center text-[#0969da]" aria-hidden="true">
        <span class="group-open:hidden">&#x2195;</span><span class="hidden group-open:inline"
          >&#x2191;</span
        >
      </span>
      <span></span>
      <span class="pr-3 whitespace-pre-wrap">
        {header}<span class="sr-only">
          ({plural(lines.length, "unchanged paragraph", "unchanged paragraphs")}, folded)</span
        >
      </span>
    </summary>
    {#each lines as item, i (i)}
      {@render line(item)}
    {/each}
  </details>
{/snippet}

<!-- `not-prose`: a diff is a drawing of a text, not a reading column, and the
     typography plugin's paragraph and `del`/`ins` rules fight it. -->
<div class="not-prose overflow-hidden rounded-md border border-[#d0d7de] text-[#1f2328]">
  <div
    class="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[#d0d7de] bg-[#f6f8fa] px-3 py-2 text-sm"
  >
    <!-- The name first, on a line of its own on a phone: beside the counts it
         was squeezed to a word a line. -->
    <span
      class="w-full min-w-0 font-mono text-xs font-semibold break-words sm:order-2 sm:w-auto sm:flex-1"
      >{name}</span
    >
    <span class="inline-flex items-center gap-2 font-mono text-xs sm:order-1">
      <span class="font-semibold text-[#1a7f37]">+{shown.added}</span>
      <span class="font-semibold text-[#d1242f]">&minus;{shown.removed}</span>
      <span class="sr-only">
        {plural(shown.added, "paragraph added", "paragraphs added")},
        {plural(shown.removed, "paragraph removed", "paragraphs removed")}
      </span>
      <span class="inline-flex gap-px" aria-hidden="true">
        {#each squares as square, i (i)}
          <span class="inline-block h-2 w-2 rounded-[1px] {SQUARE[square]}"></span>
        {/each}
      </span>
    </span>

    {#if strikeThrough.external}
      <a
        href={strikeThrough.href}
        target="_blank"
        rel="noopener"
        class="ml-auto rounded-md border border-[#d0d7de] bg-white px-3 py-1 text-xs font-medium text-[#1f2328] no-underline hover:bg-[#f3f4f6] sm:order-3"
      >
        View strike-through<span class="sr-only">
          , the packet's own marked-up copy, PDF, opens in a new tab</span
        >
      </a>
    {:else}
      <a
        href={strikeThrough.href}
        class="ml-auto rounded-md border border-[#d0d7de] bg-white px-3 py-1 text-xs font-medium text-[#1f2328] no-underline hover:bg-[#f3f4f6] sm:order-3"
      >
        View strike-through
      </a>
    {/if}
  </div>

  <div class="font-mono text-xs leading-5">
    {#each shown.hunks as hunk, h (h)}
      {@const header = `@@ -${range(hunk.old)} +${range(hunk.new)} @@${hunk.section ? ` ${hunk.section}` : ""}`}
      {#if hunk.hidden.length}
        {@render fold(hunk.hidden, header)}
      {:else}
        <div class="{ROW} bg-[#ddf4ff] text-[#59636e]">
          <span class="col-span-2 bg-[#b6e3ff]"></span>
          <span></span>
          <span class="pr-3 whitespace-pre-wrap">{header}</span>
        </div>
      {/if}
      {#each hunk.lines as item, i (i)}
        {@render line(item)}
      {/each}
    {/each}
    {#if shown.trailing.length}
      {@render fold(shown.trailing, "")}
    {/if}
  </div>
</div>

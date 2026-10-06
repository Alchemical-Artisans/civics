<script lang="ts">
  import { onMount } from "svelte"
  import { diff, splitRows, type DiffLine, type Redline, type SplitRow } from "$lib/redline"

  /**
   * An amendment drawn the way GitHub draws a change to a file: each paragraph
   * a line, today's wording in red with a minus and the amended wording in
   * green with a plus, the words that actually move highlighted darker inside
   * the line, and the unchanged stretches between changes folded behind a blue
   * `@@` row that opens them.
   *
   * Two layouts, as GitHub offers: split, today's text on the left and the
   * amended on the right, a paragraph and its amendment on one row; and
   * unified, one column, the removed line above the added. Split is the
   * default, being how a reader compares two versions of a sentence, but it
   * halves the width of each, so a reader on a phone starts on unified. The
   * choice is remembered in the browser; it is a reader's preference and
   * nothing more.
   *
   * It replaced a two-column comparison that paired provisions by hand and
   * labelled each one; every reader who has looked at a pull request already
   * knows how to read this -- red goes, green comes, the darker words are the
   * change.
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
    /** The strike-through: `external` where it is the city's PDF, else one generated here, which the button says. */
    strikeThrough: { href: string; external: boolean }
  } = $props()

  const shown = $derived(diff(redline))

  type View = "split" | "unified"
  const VIEW_KEY = "ordinance-diff-view"

  /** Split until the browser says otherwise, so the prerendered page is split. */
  let view = $state<View>("split")

  onMount(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(VIEW_KEY)
    } catch {
      // Storage refused (a private window, blocked site data): the default stands.
    }
    if (stored === "split" || stored === "unified") view = stored
    else if (window.matchMedia("(max-width: 767px)").matches) view = "unified"
  })

  const choose = (next: View) => {
    view = next
    try {
      localStorage.setItem(VIEW_KEY, next)
    } catch {
      // Remembered for this page view only.
    }
  }

  /**
   * Every folded stretch, in page order: the one above each hunk that has one,
   * then the one after the last. Their open state lives here rather than only
   * in each `<details>`, so "Expand all" can open the lot.
   */
  const folds = $derived([
    ...shown.hunks.map((h) => h.hidden).filter((lines) => lines.length),
    ...(shown.trailing.length ? [shown.trailing] : []),
  ])
  let open = $state<boolean[]>([])
  const allOpen = $derived(folds.length > 0 && folds.every((_, k) => open[k]))
  const expandAll = (to: boolean) => (open = folds.map(() => to))

  /** Which fold sits above hunk `h`, or undefined where nothing is folded there. */
  const foldOf = (h: number) => {
    if (!shown.hunks[h].hidden.length) return undefined
    return shown.hunks.slice(0, h).filter((x) => x.hidden.length).length
  }

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

  const SPLIT =
    "grid grid-cols-[2rem_1rem_minmax(0,1fr)_2rem_1rem_minmax(0,1fr)] sm:grid-cols-[2.75rem_1.25rem_minmax(0,1fr)_2.75rem_1.25rem_minmax(0,1fr)]"

  const BUTTON =
    "rounded-md border border-[#d0d7de] bg-white px-3 py-1 text-xs font-medium text-[#1f2328] no-underline hover:bg-[#f3f4f6]"

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
  <div class="{SPLIT} border-[#d0d7de]">
    {@render half(row.left, row.left?.old, false)}
    <!-- An unchanged paragraph is on both sides; a screen reader hears it once. -->
    {@render half(row.right, row.right?.new, row.right?.type === "context")}
  </div>
{/snippet}

{#snippet lines(items: DiffLine[])}
  {#if view === "split"}
    {#each splitRows(items) as row, i (i)}
      {@render split(row)}
    {/each}
  {:else}
    {#each items as item, i (i)}
      {@render unified(item)}
    {/each}
  {/if}
{/snippet}

{#snippet hunkRow(header: string)}
  <div class="flex bg-[#ddf4ff] text-[#59636e]">
    <span class="w-16 shrink-0 bg-[#b6e3ff] sm:w-24" aria-hidden="true"></span>
    <span class="min-w-0 px-3 whitespace-pre-wrap">{header}</span>
  </div>
{/snippet}

{#snippet fold(items: DiffLine[], header: string, k: number)}
  <!-- A folded stretch of unchanged text opens in place, as GitHub's expander
       does, and says so in words as well as with the arrow: a blue bar alone
       did not read as something that opens. A `<details>`, so it opens before
       anything hydrates and without any; its state is mirrored into `open` so
       "Expand all" can reach it. -->
  <details class="group" open={open[k] ?? false} ontoggle={(e) => (open[k] = e.currentTarget.open)}>
    <summary
      class="flex cursor-pointer list-none bg-[#ddf4ff] text-[#59636e] hover:bg-[#b6e3ff] [&::-webkit-details-marker]:hidden"
    >
      <span
        class="w-16 shrink-0 bg-[#b6e3ff] text-center text-[#0969da] sm:w-24"
        aria-hidden="true"
      >
        <span class="group-open:hidden">&#x2195;</span><span class="hidden group-open:inline"
          >&#x2191;</span
        >
      </span>
      <!-- Wraps rather than squeezing: on a phone the header and the word
           "Expand" each take a line, where side by side the header was
           crushed to a few letters a line. -->
      <span class="flex min-w-0 flex-1 flex-wrap justify-between gap-x-3 px-3">
        <span class="min-w-0 break-words whitespace-pre-wrap">{header}</span>
        <span class="text-[#0969da] group-hover:underline">
          <span class="group-open:hidden"
            >Expand {plural(items.length, "unchanged paragraph", "unchanged paragraphs")}</span
          ><span class="hidden group-open:inline">Collapse</span>
        </span>
      </span>
    </summary>
    {@render lines(items)}
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

    <span class="ml-auto inline-flex flex-wrap items-center gap-2 sm:order-3">
      <!-- GitHub's split/unified choice, as a pair of pressed-or-not buttons. -->
      <span
        class="inline-flex overflow-hidden rounded-md border border-[#d0d7de]"
        role="group"
        aria-label="Diff layout"
      >
        {#each [["split", "Split"], ["unified", "Unified"]] as const as [value, label] (value)}
          <button
            type="button"
            class="px-2.5 py-1 text-xs font-medium {view === value
              ? 'bg-[#0969da] text-white'
              : 'bg-white text-[#1f2328] hover:bg-[#f3f4f6]'}"
            aria-pressed={view === value}
            onclick={() => choose(value)}>{label}</button
          >
        {/each}
      </span>
      {#if folds.length}
        <button type="button" class={BUTTON} onclick={() => expandAll(!allOpen)}>
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      {/if}
      {#if strikeThrough.external}
        <a href={strikeThrough.href} target="_blank" rel="noopener" class={BUTTON}>
          View strike-through<span class="sr-only">
            , the packet's own marked-up copy, PDF, opens in a new tab</span
          >
        </a>
      {:else}
        <!-- Said on the button itself: a reader opening it should know before
             they do that this copy is ours, not one the city published. -->
        <a href={strikeThrough.href} class={BUTTON}>View strike-through (generated)</a>
      {/if}
    </span>
  </div>

  <div class="font-mono text-xs leading-5">
    {#each shown.hunks as hunk, h (h)}
      {@const header = `@@ -${range(hunk.old)} +${range(hunk.new)} @@${hunk.section ? ` ${hunk.section}` : ""}`}
      {@const k = foldOf(h)}
      {#if k !== undefined}
        {@render fold(hunk.hidden, header, k)}
      {:else}
        {@render hunkRow(header)}
      {/if}
      {@render lines(hunk.lines)}
    {/each}
    {#if shown.trailing.length}
      {@render fold(shown.trailing, "", folds.length - 1)}
    {/if}
  </div>
</div>

<script lang="ts">
  import { onMount } from "svelte"
  import DiffFrame from "$lib/DiffFrame.svelte"
  import DiffLines from "$lib/DiffLines.svelte"
  import { diff, type DiffLine, type Redline } from "$lib/redline"
  import { DIFF_BUTTON } from "$lib/diff-style"

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
   * What is drawn is `DiffLines`, and the box around it `DiffFrame`: this
   * component is the hunks and the fold between them, which belong to a text
   * read as a run of paragraphs. A schedule of rates is a diff too and shares
   * both of those without sharing any of this.
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

  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

  const range = (r: { start: number; count: number }) =>
    r.count === 1 ? `${r.start}` : `${r.start},${r.count}`
</script>

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
    <DiffLines {items} {view} />
  </details>
{/snippet}

{#snippet controls()}
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
    <button type="button" class={DIFF_BUTTON} onclick={() => expandAll(!allOpen)}>
      {allOpen ? "Collapse all" : "Expand all"}
    </button>
  {/if}
{/snippet}

<DiffFrame {name} added={shown.added} removed={shown.removed} {strikeThrough} {controls}>
  {#each shown.hunks as hunk, h (h)}
    {@const header = `@@ -${range(hunk.old)} +${range(hunk.new)} @@${hunk.section ? ` ${hunk.section}` : ""}`}
    {@const k = foldOf(h)}
    {#if k !== undefined}
      {@render fold(hunk.hidden, header, k)}
    {:else}
      {@render hunkRow(header)}
    {/if}
    <DiffLines items={hunk.lines} {view} />
  {/each}
  {#if shown.trailing.length}
    {@render fold(shown.trailing, "", folds.length - 1)}
  {/if}
</DiffFrame>

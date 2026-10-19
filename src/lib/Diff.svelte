<script lang="ts">
  import DiffFrame from "$lib/DiffFrame.svelte"
  import DiffTable from "$lib/DiffTable.svelte"
  import DiffText from "$lib/DiffText.svelte"
  import DiffViewToggle from "$lib/DiffViewToggle.svelte"
  import { DIFF_BORDER, DIFF_BUTTON } from "$lib/diff-style"
  import { diffView } from "$lib/diff-view.svelte"
  import { tableCounts, type DiffPart } from "$lib/diff"
  import { diff, folds as foldsOf, type Diff as Hunks } from "$lib/redline"

  /**
   * An amendment drawn the way GitHub draws a change to a file, and the one
   * way an amendment is drawn here: what the document removes in red with a
   * minus, what it adds in green with a plus, the words or figures that
   * actually move highlighted darker inside the line, and the unchanged
   * stretches between changes folded behind a blue `@@` row that opens them.
   *
   * It replaced a two-column comparison that paired provisions by hand and
   * labelled each one; every reader who has looked at a pull request already
   * knows how to read this -- red goes, green comes, the darker words are the
   * change.
   *
   * A document is `parts`, and a part is a run of paragraphs or a table. Most
   * amendments are one run of paragraphs: an ordinance amending an article in
   * place. The snow plowing order is a rate schedule and seven conditions
   * under it, which is two parts of one document and one box here, since a
   * reader should not have to learn two boxes to read one order. A paragraph
   * is a line and so is a row of a table; `DiffText` and `DiffTable` draw
   * them, `DiffFrame` is the box, and the reader's split-or-unified choice is
   * `diffView`, which every diff on the site shares.
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
    parts,
    name,
    strikeThrough,
  }: {
    /** The document, in the order it prints: a run of paragraphs, a table, or both. */
    parts: DiffPart[]
    /** What the diff is of, as a file header names its file. */
    name: string
    /** The strike-through: `external` where it is the city's PDF, else one generated here, which the button says. */
    strikeThrough: { href: string; external: boolean }
  } = $props()

  const view = $derived(diffView.current)

  /** Each part with what it draws: a text part's hunks, a table its lines. */
  type Drawn =
    { kind: "text"; hunks: Hunks } | { kind: "table"; table: Extract<DiffPart, { kind: "table" }> }

  const drawn: Drawn[] = $derived(
    parts.map((part) =>
      part.kind === "text"
        ? { kind: "text", hunks: diff(part.redline) }
        : { kind: "table", table: part },
    ),
  )

  /**
   * The folds of every text part, end to end, with where each part's own
   * begin: one array, so "Expand all" opens the lot however many parts the
   * document is in.
   */
  const counts = $derived(drawn.map((d) => (d.kind === "text" ? foldsOf(d.hunks).length : 0)))
  const offsets = $derived(counts.map((_, i) => counts.slice(0, i).reduce((a, b) => a + b, 0)))
  const foldCount = $derived(counts.reduce((a, b) => a + b, 0))

  let open = $state<boolean[]>([])
  const everyFold = $derived(Array.from({ length: foldCount }, (_, k) => open[k]))
  const allOpen = $derived(foldCount > 0 && everyFold.every(Boolean))
  const expandAll = (to: boolean) => (open = Array.from({ length: foldCount }, () => to))

  const count = (side: "added" | "removed") =>
    drawn.reduce(
      (n, d) => n + (d.kind === "text" ? d.hunks[side] : tableCounts(d.table.lines)[side]),
      0,
    )
  const added = $derived(count("added"))
  const removed = $derived(count("removed"))

  /** What a line is in this document, for the count a screen reader hears. */
  const unit = $derived(
    parts.every((p) => p.kind === "text")
      ? { one: "paragraph", many: "paragraphs" }
      : parts.every((p) => p.kind === "table")
        ? { one: "row", many: "rows" }
        : { one: "line", many: "lines" },
  )
</script>

{#snippet controls()}
  <DiffViewToggle />
  {#if foldCount}
    <button type="button" class={DIFF_BUTTON} onclick={() => expandAll(!allOpen)}>
      {allOpen ? "Collapse all" : "Expand all"}
    </button>
  {/if}
{/snippet}

<DiffFrame {name} {added} {removed} {unit} {strikeThrough} {controls}>
  {#each drawn as d, i (i)}
    <!-- One part follows another as it does in the document, ruled off from
         it: one box, because it is one document. -->
    <div class={i > 0 ? `border-t ${DIFF_BORDER} pt-1` : ""}>
      {#if d.kind === "text"}
        <DiffText shown={d.hunks} {view} {open} offset={offsets[i]} />
      {:else}
        <DiffTable
          lines={d.table.lines}
          columns={d.table.columns}
          caption={d.table.caption}
          {view}
        />
      {/if}
    </div>
  {/each}
</DiffFrame>

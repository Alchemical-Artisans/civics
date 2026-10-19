<script lang="ts">
  import { LINE, WORD } from "$lib/diff-style"
  import type { DiffView } from "$lib/diff-view.svelte"
  import { isHeading, tableLines, tableRows, type Cell, type TableLine } from "$lib/diff"

  /**
   * A table as a diff: the values in force in red with a minus, the
   * amendment's in green with a plus, and the figures that actually move
   * highlighted darker inside the row.
   *
   * `DiffLines` draws a paragraph that way and this draws a row the same way,
   * for the same reason -- a reader who has looked at a pull request knows
   * what the two colours mean -- but a row is not a paragraph: the columns
   * are what the table says, so it keeps its own shape and the diff is drawn
   * across it rather than over the top of it. The gutter numbers the lines of
   * the table, and a row the amendment leaves alone is a context line, as an
   * untouched paragraph is.
   *
   * Unified draws an amended line twice, in force above and amended below.
   * Split keeps one row per line and sets the two sides of it side by side --
   * one table rather than two, because the row is about the same thing on
   * both sides: two tables would print every label twice and still leave
   * their rows to drift out of line as soon as one wrapped and the other did
   * not.
   */
  let {
    lines,
    columns,
    caption,
    view = "unified",
  }: {
    lines: TableLine[]
    /** The headed columns, as the document prints them. */
    columns: string[]
    /** The table's own caption, where the document prints one. */
    caption?: string
    view?: DiffView
  } = $props()

  type Side = "removed" | "added"

  const numbered = $derived(tableLines(lines))
  const rows = $derived(tableRows(lines))

  const figure = (cell: Cell, side: Side) =>
    typeof cell === "string" ? cell : side === "removed" ? cell.was : cell.now

  const GUTTER = "w-9 pr-2 text-right text-[#6e7781] select-none sm:w-12"
  const SIGN = "w-5 text-center text-[#6e7781] select-none sm:w-6"

  /** What a side is called where a screen reader would otherwise hear one column name twice. */
  const SIDE = { removed: "in force", added: "as amended" }
</script>

<!-- A value in a row the amendment touches: marked, as a changed word is
     marked inside a changed line. One it leaves alone is left plain, in a
     changed row as in an unchanged one. -->
{#snippet amount(cell: Cell, side: Side, changed: boolean)}
  {#if typeof cell === "string" || !changed}
    {figure(cell, side)}
  {:else if side === "removed"}
    <del class="rounded-sm no-underline {WORD.removed}">{cell.was}</del>
  {:else}
    <ins class="rounded-sm no-underline {WORD.added}">{cell.now}</ins>
  {/if}
{/snippet}

{#snippet sign(type: "context" | Side)}
  <td class={SIGN}>
    {#if type !== "context"}<span class="sr-only">{LINE[type].label}:</span>{/if}
    <span aria-hidden="true">{LINE[type].sign}</span>
  </td>
{/snippet}

{#snippet names(side?: Side)}
  {#each columns as column (column)}
    <th scope="col" class="px-3 align-bottom font-semibold">
      {column}{#if side}<span class="sr-only">, {SIDE[side]}</span>{/if}
    </th>
  {/each}
{/snippet}

{#snippet cells(line: { label: string; cells: Cell[] }, side: Side, changed: boolean, row: string)}
  {#each line.cells as cell, c (c)}
    <td class="px-3 whitespace-nowrap {row}">{@render amount(cell, side, changed)}</td>
  {/each}
{/snippet}

<div class="overflow-x-auto">
  <table class="w-full border-collapse text-left">
    {#if caption}
      <caption class="px-3 py-1 text-left font-semibold text-[#1f2328]">{caption}</caption>
    {/if}
    {#if view === "split"}
      <thead>
        <tr class={LINE.context.row}>
          <th class="{GUTTER} {LINE.context.gutter}" aria-hidden="true">1</th>
          <th class={SIGN} aria-hidden="true"></th>
          <th scope="col" class="px-3 font-normal"><span class="sr-only">Row</span></th>
          {@render names("removed")}
          <th class="{GUTTER} {LINE.context.gutter}" aria-hidden="true">1</th>
          <th class={SIGN} aria-hidden="true"></th>
          {@render names("added")}
        </tr>
      </thead>
      <tbody>
        {#each numbered as { n, line, changed } (n)}
          {@const left = changed ? LINE.removed : LINE.context}
          {@const right = changed ? LINE.added : LINE.context}
          <tr>
            <td class="{GUTTER} {left.gutter}" aria-hidden="true">{n}</td>
            {@render sign(changed ? "removed" : "context")}
            {#if isHeading(line)}
              <!-- A group's own line, as the document prints it: the name in
                   the first column and the rest of the row empty. -->
              <th scope="row" colspan={columns.length} class="px-3 font-semibold">
                {line.heading}
              </th>
              <td class="{GUTTER} {right.gutter}" aria-hidden="true">{n}</td>
              {@render sign("context")}
              <td colspan={columns.length}></td>
            {:else}
              <th scope="row" class="px-3 font-normal">{line.label}</th>
              {@render cells(line, "removed", changed, left.row)}
              <td class="{GUTTER} {right.gutter}" aria-hidden="true">{n}</td>
              {@render sign(changed ? "added" : "context")}
              {@render cells(line, "added", changed, right.row)}
            {/if}
          </tr>
        {/each}
      </tbody>
    {:else}
      <thead>
        <tr class={LINE.context.row}>
          <th class="{GUTTER} {LINE.context.gutter}" aria-hidden="true">1</th>
          <th class="{GUTTER} {LINE.context.gutter}" aria-hidden="true">1</th>
          <th class={SIGN} aria-hidden="true"></th>
          <th scope="col" class="px-3 font-normal"><span class="sr-only">Row</span></th>
          {@render names()}
        </tr>
      </thead>
      <tbody>
        {#each rows as row, i (i)}
          {@const style = LINE[row.type]}
          <tr class={style.row}>
            <td class="{GUTTER} {style.gutter}" aria-hidden="true">{row.old ?? ""}</td>
            <td class="{GUTTER} {style.gutter}" aria-hidden="true">{row.new ?? ""}</td>
            {@render sign(row.type)}
            {#if isHeading(row.line)}
              <th scope="row" colspan={columns.length + 1} class="px-3 font-semibold">
                {row.line.heading}
              </th>
            {:else}
              <th scope="row" class="px-3 font-normal">{row.line.label}</th>
              {@render cells(
                row.line,
                row.type === "removed" ? "removed" : "added",
                row.type !== "context",
                "",
              )}
            {/if}
          </tr>
        {/each}
      </tbody>
    {/if}
  </table>
</div>

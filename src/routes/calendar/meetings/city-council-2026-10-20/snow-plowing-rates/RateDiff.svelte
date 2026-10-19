<script lang="ts">
  import { LINE, WORD } from "$lib/diff-style"
  import { amended, isHeading, type Line } from "./rates"

  /**
   * The rate schedule as a diff: a row the order amends is drawn twice, the
   * rates in force in red with a minus and the order's in green with a plus,
   * and the figures that actually move highlighted darker inside the row.
   *
   * `DiffLines` draws a paragraph that way and this draws a row the same way,
   * for the same reason -- a reader who has looked at a pull request knows
   * what the two colours mean -- but a row is not a paragraph: the four
   * columns are what the schedule says, so the table keeps its own shape and
   * the diff is drawn across it rather than over the top of it. The gutter
   * numbers the lines of the table, and a row the order leaves alone is a
   * context line, as an untouched paragraph is.
   *
   * The sign column alone has only the one layout. There is no split view
   * here: side by side, each half of a four-column schedule gets half the
   * width, and the figures are the narrowest thing on the page already.
   */
  let {
    lines,
    columns,
    caption,
  }: {
    lines: Line[]
    /** The three headed columns, as the copy prints them. */
    columns: string[]
    /** The table's own caption. */
    caption: string
  } = $props()

  type Row = { type: "context" | "removed" | "added"; old?: number; new?: number; line: Line }

  /** Every line of the table, an amended one twice: as it stands, then as amended. */
  const rows = $derived.by(() => {
    const out: Row[] = []
    let n = 1 // The headed columns are the table's first line.
    for (const line of lines) {
      n++
      if (amended(line)) {
        out.push({ type: "removed", old: n, line })
        out.push({ type: "added", new: n, line })
      } else out.push({ type: "context", old: n, new: n, line })
    }
    return out
  })

  const GUTTER = "w-9 pr-2 text-right text-[#6e7781] select-none sm:w-12"
  const SIGN = "w-5 text-center text-[#6e7781] select-none sm:w-6"
</script>

<div class="overflow-x-auto">
  <table class="w-full border-collapse text-left">
    <caption class="px-3 py-1 text-left font-semibold text-[#1f2328]">{caption}</caption>
    <thead>
      <tr class={LINE.context.row}>
        <th class="{GUTTER} {LINE.context.gutter}" aria-hidden="true">1</th>
        <th class="{GUTTER} {LINE.context.gutter}" aria-hidden="true">1</th>
        <th class={SIGN} aria-hidden="true"></th>
        <th scope="col" class="px-3 font-normal"><span class="sr-only">Equipment</span></th>
        {#each columns as column (column)}
          <th scope="col" class="px-3 align-bottom font-semibold">{column}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i (i)}
        {@const style = LINE[row.type]}
        <tr class={style.row}>
          <td class="{GUTTER} {style.gutter}" aria-hidden="true">{row.old ?? ""}</td>
          <td class="{GUTTER} {style.gutter}" aria-hidden="true">{row.new ?? ""}</td>
          <td class={SIGN}>
            {#if row.type !== "context"}<span class="sr-only">{style.label}:</span>{/if}
            <span aria-hidden="true">{style.sign}</span>
          </td>
          {#if isHeading(row.line)}
            <!-- A group's own line, as the copy prints it: the name in the
                 first column and the rest of the row empty. -->
            <th scope="row" colspan={columns.length + 1} class="px-3 font-semibold">
              {row.line.heading}
            </th>
          {:else}
            <th scope="row" class="px-3 font-normal">{row.line.label}</th>
            {#each row.line.cells as cell, c (c)}
              <td class="px-3 whitespace-nowrap">
                {#if typeof cell === "string"}
                  {cell}
                {:else if row.type === "removed"}
                  <del class="rounded-sm no-underline {WORD.removed}">{cell.was}</del>
                {:else}
                  <ins class="rounded-sm no-underline {WORD.added}">{cell.now}</ins>
                {/if}
              </td>
            {/each}
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

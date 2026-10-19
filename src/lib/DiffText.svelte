<script lang="ts">
  import DiffLines from "$lib/DiffLines.svelte"
  import type { DiffView } from "$lib/diff-view.svelte"
  import { folds, type Diff, type DiffLine } from "$lib/redline"

  /**
   * A run of paragraphs as a diff: the hunks of changed text, and the
   * unchanged stretches between them folded behind a blue `@@` row that
   * opens them.
   *
   * The lines themselves are `DiffLines`; what is here is the folding, which
   * belongs to a text read as a run of paragraphs. A table has no equivalent:
   * its rows are short and its columns only mean anything beside each other,
   * so none of them are hidden.
   */
  let {
    shown,
    view = "unified",
    open,
    offset = 0,
  }: {
    shown: Diff
    view?: DiffView
    /**
     * The open state of every fold in the whole diff, which the box above
     * owns so its "Expand all" can reach them. `offset` is where this part's
     * own folds start in it.
     */
    open: boolean[]
    offset?: number
  } = $props()

  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

  const range = (r: { start: number; count: number }) =>
    r.count === 1 ? `${r.start}` : `${r.start},${r.count}`

  /** Which fold sits above hunk `h`, or undefined where nothing is folded there. */
  const foldOf = (h: number) => {
    if (!shown.hunks[h].hidden.length) return undefined
    return offset + shown.hunks.slice(0, h).filter((x) => x.hidden.length).length
  }
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
  {@render fold(shown.trailing, "", offset + folds(shown).length - 1)}
{/if}

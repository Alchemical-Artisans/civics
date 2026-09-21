<script lang="ts">
  import { wordDiff, type Run } from "$lib/word-diff"

  /**
   * Two versions of an ordinance, provision by provision, with the words that
   * moved marked.
   *
   * Built for an order that repeals and replaces an article of the Code "in
   * its entirety": the packet attaches the article it would replace, and the
   * only way to see what the vote actually changes is to hold the two up
   * against each other -- seven scanned pages beside five, in the Council's
   * own reading, which is not a thing a person can do.
   *
   * The reading runs down the page as two columns, today's text and the
   * order's, so a provision and its replacement sit on one line. Below the
   * column breakpoint they stack, today's first and each labelled in place: a
   * pair of forty-character columns of legal prose is unreadable, and stacked
   * they are still in the order a reader wants them.
   *
   * What is marked is the difference, which cuts both ways -- a word today's
   * text has and the order drops is marked on the left, a word the order adds
   * is marked on the right. Colour alone does not say which, so the two are
   * drawn differently besides (struck-through rose against solid emerald) and
   * every provision that differs at all carries a word saying how, for a
   * reader who sees neither.
   */

  type Row = {
    key: string
    label?: string
    now?: string[]
    proposed?: string[]
    rewritten?: boolean
  }

  type Part = {
    key: string
    now?: { number: string; title: string }
    proposed?: { number: string; title: string }
    rows: Row[]
  }

  let {
    parts,
    nowLabel,
    proposedLabel,
  }: { parts: Part[]; nowLabel: string; proposedLabel: string } = $props()

  /**
   * What each side of a provision looks like once compared.
   *
   * Five outcomes, and the page draws each of them differently: identical
   * (nothing marked, and nothing said -- most of the article is identical, and
   * a badge on every one of those would bury the handful that are not),
   * amended (the changed words marked on both sides), rewritten (two different
   * sentences about one subject, which the comparison states by hand because a
   * word diff of those marks nearly every word and so says nothing), and
   * present on one side only.
   */
  type Compared = {
    row: Row
    state: "same" | "amended" | "rewritten" | "added" | "dropped"
    now: Run[][]
    proposed: Run[][]
  }

  /** Paragraphs that are not being word-compared, as single unmarked runs. */
  const plain = (paragraphs: string[] | undefined): Run[][] =>
    (paragraphs ?? []).map((text) => [{ text, changed: false }])

  const compare = (row: Row): Compared => {
    if (!row.now?.length) return { row, state: "added", now: [], proposed: plain(row.proposed) }
    if (!row.proposed?.length) return { row, state: "dropped", now: plain(row.now), proposed: [] }
    if (row.rewritten)
      return { row, state: "rewritten", now: plain(row.now), proposed: plain(row.proposed) }

    // A provision is one passage however many paragraphs the city breaks it
    // into, and the breaks fall in the same places on both sides wherever it
    // is an amendment rather than a rewrite -- so pairing them by position is
    // safe here, and pairing them any other way would take a judgement this
    // has no business making.
    const pairs = Math.max(row.now.length, row.proposed.length)
    const now: Run[][] = []
    const proposed: Run[][] = []
    let changed = false

    for (let i = 0; i < pairs; i++) {
      const diff = wordDiff(row.now[i] ?? "", row.proposed[i] ?? "")
      now.push(diff.before)
      proposed.push(diff.after)
      if (diff.before.some((r) => r.changed) || diff.after.some((r) => r.changed)) changed = true
    }

    return { row, state: changed ? "amended" : "same", now, proposed }
  }

  const compared = $derived(parts.map((part) => ({ part, rows: part.rows.map(compare) })))

  const NOTE: Record<Compared["state"], string | null> = {
    same: null,
    amended: "Wording changed",
    rewritten: "Rewritten",
    added: "New",
    dropped: "Dropped",
  }

  const NOTE_CLASS: Record<Compared["state"], string> = {
    same: "",
    amended: "bg-amber-100 text-amber-900",
    rewritten: "bg-amber-100 text-amber-900",
    added: "bg-emerald-100 text-emerald-900",
    dropped: "bg-rose-100 text-rose-900",
  }

  const MARK = {
    now: "bg-rose-100 text-rose-900 line-through decoration-rose-400",
    proposed: "bg-emerald-100 text-emerald-900",
  }
</script>

{#snippet column(runs: Run[][], label: string, mark: string)}
  <div class="text-sm leading-relaxed text-slate-800">
    <!-- Which version this is. Stacked, there is nothing else to say so; in
         columns the heading above says it, but a screen reader reads straight
         down either way, so it is read out at both widths. -->
    <span class="mb-1 block text-[11px] tracking-wide text-slate-500 uppercase md:sr-only">
      {label}
    </span>
    {#if runs.length}
      {#each runs as paragraph, i (i)}
        <p class="mb-2 last:mb-0">
          {#each paragraph as run, j (j)}
            {#if run.changed}<mark class="rounded px-0.5 {mark}">{run.text}</mark
              >{:else}{run.text}{/if}
          {/each}
        </p>
      {/each}
    {:else}
      <p class="text-slate-400 italic">&mdash;</p>
    {/if}
  </div>
{/snippet}

<!-- `not-prose`: this is a two-column comparison rather than a reading column,
     and the typography plugin's own paragraph and heading rules fight it. -->
<div class="not-prose">
  <!-- The key. It names the two marks in the same words they are drawn in, and
       sits above the comparison rather than below it, since a reader meets the
       first marked word within a line of starting. -->
  <p class="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
    <span class="inline-flex items-center gap-1.5">
      <span class="rounded bg-rose-100 px-1.5 py-0.5 text-rose-900 line-through">struck</span>
      wording only in {nowLabel}
    </span>
    <span class="inline-flex items-center gap-1.5">
      <span class="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-900">added</span>
      wording only in {proposedLabel}
    </span>
  </p>

  <!-- The column headings, which stay put while the comparison scrolls: a
       provision two screens down still has to say which column is which, and
       both columns are the same ordinance in the same voice. Drawn only where
       there are columns, and hidden from a screen reader at every width --
       each column labels itself above, which is what a reader going straight
       down the page needs. -->
  <div
    class="sticky top-0 z-10 hidden grid-cols-2 gap-6 border-b border-slate-300 bg-white py-2 text-xs font-semibold tracking-wide text-slate-700 uppercase md:grid"
    aria-hidden="true"
  >
    <span>{nowLabel}</span>
    <span>{proposedLabel}</span>
  </div>

  {#each compared as { part, rows } (part.key)}
    <section class="border-b border-slate-200 py-6">
      <!-- One heading for the provision, so the page has an outline to move
           through; the two numbers under it are what a reader sees, because
           the order renumbers most of what it keeps -- today's § 250-25 is the
           order's § 250-25.1, and printing one number over both columns would
           say the two agree.

           h3 because the page names the article in its own h2 above the
           comparison: a section of an article sits under it. -->
      <h3 class="sr-only">{(part.proposed ?? part.now)?.title}</h3>
      <div class="mb-4 grid gap-1 md:grid-cols-2 md:gap-6" aria-hidden="true">
        <p class="text-sm font-semibold text-slate-900">
          {#if part.now}
            <span class="md:hidden">{nowLabel}:</span>
            {part.now.number}
            {part.now.title}
          {:else}
            <span class="text-slate-400 italic">No counterpart</span>
          {/if}
        </p>
        <p class="text-sm font-semibold text-slate-900">
          {#if part.proposed}
            <span class="md:hidden">{proposedLabel}:</span>
            {part.proposed.number}
            {part.proposed.title}
          {:else}
            <span class="text-slate-400 italic">No counterpart</span>
          {/if}
        </p>
      </div>

      {#each rows as item (item.row.key)}
        {@const note = NOTE[item.state]}
        <div class="mb-5 last:mb-0">
          <!-- The provision's own letter or number where both versions use
               one, and the trigger level where the two drought tables share
               nothing else. Over both columns, being the one thing they agree
               on; beside it, what the comparison found. -->
          {#if item.row.label || note}
            <p class="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {#if item.row.label}
                <span class="text-xs font-semibold text-slate-700">{item.row.label}</span>
              {/if}
              {#if note}
                <span class="rounded px-1.5 py-0.5 text-[11px] {NOTE_CLASS[item.state]}">
                  {note}
                </span>
              {/if}
            </p>
          {/if}

          <div class="grid gap-3 md:grid-cols-2 md:gap-6">
            {@render column(item.now, nowLabel, MARK.now)}
            {@render column(item.proposed, proposedLabel, MARK.proposed)}
          </div>
        </div>
      {/each}
    </section>
  {/each}
</div>

<!--
  The project's figures as cards: a label, the figure, and the document's own
  qualification of it underneath.

  The shape is the debt page's bond-rating card -- small label, the figure
  itself at the size of a heading, the source's own caveat in small type --
  because that is already how this site draws a single fact worth a reader's
  first look. One component rather than a copy on each page, so the project's
  front page and the loan order's write-up cannot come to state the same
  figures differently.

  `not-prose` because both pages draw these inside an `<article class="prose">`,
  where the typography plugin's margins are for text.
-->
<script lang="ts">
  import type { Figure } from "./roof"

  let { figures, class: className = "" }: { figures: Figure[]; class?: string } = $props()
</script>

<!--
  A `<dl>`: each card is a term and what the documents say about it, which is
  what a description list is for and what three `<span>`s in a box only looked
  like. A `<div>` grouping a `<dt>` with its `<dd>` is allowed inside one, and
  is what lets each pair be a card.

  **The whole card opens the file the figure is read off.** A figure lifted
  out of a letter and set on a page of its own has to carry the way back to
  it, and the card is where a reader meets the figure, so the card is the
  citation rather than a line of small print beneath the set of them.

  The link is the label's own, stretched over the card by `after:absolute
  after:inset-0` -- the trick the front page's two cards use. An `<a>` cannot
  wrap a `<dt>` and a `<dd>` (a `<dl>` takes only those and the `<div>`s that
  group them), and the pseudo-element covering the card means the pointer is
  over the card wherever it is, so the card's own `hover:` still answers.
-->
<dl class="not-prose flex flex-col gap-3 {className}">
  {#each figures as figure (figure.label)}
    <!-- `flex-1` so that a row of them divides the width evenly: the labels
         and the notes are of very different lengths, and cards sized to
         their own text make three figures of one kind look like three
         unrelated things. -->
    <div
      class="relative flex min-w-0 flex-1 flex-col gap-1 rounded-lg border border-slate-200 px-5 py-4 transition-colors hover:border-slate-400"
    >
      <dt class="text-xs font-medium text-slate-500">
        <a
          class="underline after:absolute after:inset-0 hover:text-slate-900"
          href={figure.href}
          target="_blank"
          rel="noopener"
        >
          {figure.label}<span class="sr-only">, PDF, one page, opens in a new tab</span>
        </a>
      </dt>
      <dd class="flex flex-col gap-1">
        <span class="text-3xl font-bold text-slate-900">{figure.value}</span>
        <span class="text-xs text-slate-500">{figure.note}</span>
      </dd>
    </div>
  {/each}
</dl>

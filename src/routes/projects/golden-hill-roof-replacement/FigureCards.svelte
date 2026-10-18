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

<div class="not-prose flex flex-col gap-3 {className}">
  {#each figures as figure (figure.label)}
    <div class="flex flex-col gap-1 rounded-lg border border-slate-200 px-5 py-4">
      <span class="text-xs font-medium text-slate-500">{figure.label}</span>
      <span class="text-3xl font-bold text-slate-900">{figure.value}</span>
      <span class="text-xs text-slate-500">{figure.note}</span>
    </div>
  {/each}
</div>

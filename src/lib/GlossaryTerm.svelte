<!--
  A word the budget book defines, with the book's definition a pointer away.

  These pages are the city's own prose, and the city's prose is full of terms of
  art -- levy limit, free cash, cherry sheets, overlay -- that a reader either
  knows or is stopped by. The book answers all of them, 245 pages away, in a
  glossary nobody reaches. So the answer comes to the word instead: hover it,
  tab to it, or tap it, and the definition opens over the page.

  The word on the page is whatever the page wrote -- "free cash" mid-sentence,
  "levies" for "Levy" -- and `term` is what the glossary heads it, which is what
  the definition is looked up by. Nothing here rewrites the city's text.

  It is a `<button>` because it does something when pressed, which is what a
  touch screen needs: there is no hovering a word with a thumb. `aria-describedby`
  is what a screen reader follows, so the definition is read as a description of
  the word rather than as a stray paragraph.
-->
<script lang="ts">
  import { define, termSlug } from "$lib/glossary"
  import type { Snippet } from "svelte"

  let { term, children }: { term: string; children?: Snippet } = $props()

  const entry = $derived(define(term))
  const id = $derived(`glossary-${termSlug(term)}`)

  // Hover and focus open it; a press pins it, so a reader can move the pointer
  // away from a definition they are still reading. Escape and a click elsewhere
  // put it away, the way the bar's menu does.
  let pointer = $state(false)
  let focused = $state(false)
  let pinned = $state(false)
  const shown = $derived(pointer || focused || pinned)

  let root: HTMLElement | undefined = $state()

  $effect(() => {
    const past = (event: PointerEvent) => {
      if (pinned && !root?.contains(event.target as Node)) pinned = false
    }
    // Escape dismisses it outright, focus included: a reader who has read the
    // definition and pressed Escape has answered their question, and a tooltip
    // that stayed up because the word still holds focus would be ignoring them.
    // Tabbing away and back opens it again.
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      pinned = false
      focused = false
    }

    document.addEventListener("pointerdown", past)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", past)
      document.removeEventListener("keydown", escape)
    }
  })
</script>

<span class="glossary-term relative inline-block" bind:this={root}>
  <button
    class="cursor-help border-b border-dotted border-slate-400 bg-transparent p-0 text-inherit hover:border-slate-900"
    type="button"
    aria-describedby={shown ? id : undefined}
    aria-expanded={shown}
    onpointerenter={(event) => (pointer = event.pointerType === "mouse")}
    onpointerleave={() => (pointer = false)}
    onfocus={() => (focused = true)}
    onblur={() => (focused = false)}
    onclick={() => (pinned = !pinned)}
  >
    {#if children}{@render children()}{:else}{term}{/if}
  </button>

  {#if shown}
    <!-- Over the page rather than in it: a definition that pushed the paragraph
         apart would move the word the reader is pointing at. -->
    <span
      class="glossary-definition absolute top-full left-0 z-20 mt-1 block w-80 max-w-[80vw] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-snug font-normal text-slate-700 shadow-lg"
      {id}
      role="tooltip"
    >
      <span class="block font-medium text-slate-900">{entry.printed ?? entry.term}</span>
      {entry.definition}
    </span>
  {/if}
</span>

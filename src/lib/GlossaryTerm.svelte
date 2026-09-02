<!--
  A word the budget book defines, with the book's definition attached to it.

  These pages are the city's own prose, and the city's prose is full of terms of
  art -- levy limit, free cash, cherry sheets, overlay -- that a reader either
  knows or is stopped by. The book answers all of them, 200 pages away, in a
  glossary nobody reaches. So the answer comes to the word.

  **It is a link, not a button.** A button that only shows text is a control
  with no action: it does nothing without a script, nothing in a reader mode,
  nothing for a crawler, and it fills the tab order with stops that go nowhere.
  A link to the term's own entry in the glossary is the ordinary technique
  (WCAG G55), works with no script at all, is announced as a link, and gives a
  touch reader somewhere to go rather than a tooltip to dismiss.

  **The definition is on the link before anyone asks for it.** It sits in the
  markup as `aria-describedby`, so a screen reader reads the word and then its
  definition, with no hovering, focusing or timing involved. It is
  `aria-hidden` so that reading the page straight through does not recite the
  definition of "levy" thirty-one times; a description referenced by id is still
  computed from hidden text.

  **The tooltip is CSS.** Hover or focus the word and the same node that holds
  the description becomes a box under it -- no script, so it works on a page
  that has not hydrated, and the pointer can move onto the definition without
  losing it, which is what WCAG 1.4.13 asks of anything shown on hover. The one
  script is Escape, which that rule also asks for and CSS cannot do.

  The word on the page is whatever the city wrote -- "free cash" mid-sentence,
  "levies" for "Levy" -- and `term` is what the glossary heads it, which is what
  the definition is looked up by. Nothing here rewrites the city's text.
-->
<script lang="ts">
  import { page } from "$app/state"
  import { Router } from "$lib/router"
  import { define, termSlug } from "$lib/glossary"
  import type { Snippet } from "svelte"

  let { term, children }: { term: string; children?: Snippet } = $props()

  const entry = $derived(define(term))
  const slug = $derived(termSlug(term))

  // Unique per use, not per term: a page names the same word many times, and
  // `aria-describedby` points at an id. `$props.id()` is the same string on the
  // server and in the browser, which a counter of our own would not be.
  const id = $props.id()

  // The book this page sits in, from the layout above it, which is also what
  // the bar reads. A term only appears inside a book.
  const book = $derived(page.data.book as { id: string })

  // Escape puts the tooltip away without moving the pointer or the focus, which
  // is the one part of "content on hover or focus" that CSS cannot do. It comes
  // back when the pointer or the focus leaves and returns.
  let dismissed = $state(false)

  $effect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissed = true
    }

    document.addEventListener("keydown", escape)
    return () => document.removeEventListener("keydown", escape)
  })
</script>

<!-- `role="none"`: the wrapper positions the definition and notices when the
     reader has moved on, and nothing more -- the link and the description carry
     the meaning. -->
<span
  class="glossary-term"
  role="none"
  data-dismissed={dismissed ? "" : undefined}
  onpointerleave={() => (dismissed = false)}
  onfocusout={() => (dismissed = false)}
>
  <a class="glossary-word" href={Router.glossaryTerm(book.id, slug)} aria-describedby={id}>
    {#if children}{@render children()}{:else}{term}{/if}
  </a>

  <span class="glossary-definition" {id} aria-hidden="true">
    <span class="glossary-name">{entry.printed ?? entry.term}</span>
    {entry.definition}
  </span>
</span>

<style>
  .glossary-term {
    position: relative;
    display: inline-block;
  }

  /* Not the prose link: a definition is not somewhere the reader is being sent,
     it is a word with something under it. */
  .glossary-word {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted var(--color-slate-400);
  }

  .glossary-word:hover,
  .glossary-word:focus-visible {
    border-bottom-color: var(--color-slate-900);
  }

  /*
    The definition is always here, and always hidden the way a screen reader
    still finds it: clipped rather than `display: none`, which would take it out
    of the tree that `aria-describedby` reads.
  */
  .glossary-definition {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  .glossary-name {
    display: block;
    font-weight: 500;
    color: var(--color-slate-900);
  }

  /*
    Hovering or focusing the word turns that same node into the tooltip. It is
    inside the hovered element, so the pointer can move onto it without closing
    it -- content shown on hover has to be hoverable.

    `hover: hover` because a tap counts as a hover on a touch screen and would
    leave the definition open over the page; there the link goes to the glossary
    instead, which is a better answer anyway.
  */
  @media (hover: hover) {
    .glossary-term:hover > .glossary-definition {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 20;
      display: block;
      width: 20rem;
      max-width: 80vw;
      height: auto;
      padding: 0.5rem 0.75rem;
      margin: 0.25rem 0 0;
      overflow: visible;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.4;
      color: var(--color-slate-700);
      clip-path: none;
      white-space: normal;
      background: white;
      border: 1px solid var(--color-slate-200);
      border-radius: 0.375rem;
      box-shadow:
        0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
  }

  .glossary-term:focus-within > .glossary-definition {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 20;
    display: block;
    width: 20rem;
    max-width: 80vw;
    height: auto;
    padding: 0.5rem 0.75rem;
    margin: 0.25rem 0 0;
    overflow: visible;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.4;
    color: var(--color-slate-700);
    clip-path: none;
    white-space: normal;
    background: white;
    border: 1px solid var(--color-slate-200);
    border-radius: 0.375rem;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  /* Escape, which wins over both of the above. */
  .glossary-term[data-dismissed] > .glossary-definition {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    background: none;
    border: 0;
    box-shadow: none;
  }
</style>

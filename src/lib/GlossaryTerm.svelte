<!--
  A word the budget book defines, linked to where the book defines it.

  These pages are the city's own prose, and the city's prose is full of terms of
  art -- levy limit, free cash, cherry sheets, overlay -- that a reader either
  knows or is stopped by. The book answers all of them, 200 pages away, in a
  glossary nobody reaches. So the word carries the way there: a link to that
  term's own entry on the glossary page, which is one page holding every
  definition rather than a definition folded into every page.

  A link and nothing else. It works with no script, in a reader mode, and for a
  crawler; it is announced as a link and reached by the keyboard like any other;
  and a touch reader gets somewhere to go rather than something to dismiss. An
  earlier version put the definition on the page under the word and described the
  link with it, which meant a screen reader read the definition of "levy" at
  every one of its twenty-nine uses. Bringing the definition to the word is
  worth doing; it needs a shape that does not do that.

  The word on the page is whatever the city wrote -- "free cash" mid-sentence,
  "levies" for "Levy" -- and `term` is what the glossary heads it, which is what
  the link is built from. `scripts/check-glossary.mjs` is what checks that the
  term named here is one the book actually defines.
-->
<script lang="ts">
  import { page } from "$app/state"
  import { Router } from "$lib/router"
  import { termSlug } from "$lib/glossary"
  import type { Snippet } from "svelte"

  let { term, children }: { term: string; children?: Snippet } = $props()

  // The book this page sits in, from the layout above it, which is also what
  // the bar reads. A term only appears inside a book.
  const book = $derived(page.data.book as { id: string })
</script>

<!-- Not the prose link's colour and underline: a definition is not somewhere
     the reader is being sent, it is a word with something behind it. -->
<a
  class="glossary-term text-inherit no-underline [border-bottom:1px_dotted_var(--color-slate-500)] hover:[border-bottom-color:var(--color-slate-900)]"
  href={Router.glossaryTerm(book.id, termSlug(term))}
>
  {#if children}{@render children()}{:else}{term}{/if}
</a>

<!--
  Where a page came from, and what it belongs with: the tail of a category page.

  It was "Elsewhere in the book", which named half of what it holds. A list of
  what a page is next to is a see-also; a list of what a page was built out of
  is a reference, and a reader who wants to check a figure against the city's
  own file wants the second one. So the heading is "References" and both go in
  it -- the pages the words and the charts were taken off, and the pages the
  book keeps the rest of the subject on. What a reader does with either is the
  same thing: open the book there.

  The heading is ours -- the one line on these pages that is not the book's --
  and so is the choice of what to list. Everything else follows the rule the
  contents page follows: a section written up here opens on this site, and one
  that is not opens the city's own file at the page the book gives it, so the
  reader lands on the section either way.
-->
<script lang="ts">
  import { Router } from "$lib/router"

  export interface Reference {
    /** The section, named as the book's contents or its own page names it. */
    title: string
    /** A section written up here: its route segment under the book. */
    section?: string
    /** A section that is not: the city's file, opened at its page. */
    href?: string
  }

  let { items, book }: { items: Reference[]; book: { id: string } } = $props()

  const away = (item: Reference) => !item.section
</script>

<h2>References</h2>

<ul>
  {#each items as item (item.title)}
    <li>
      <a
        href={item.section ? Router.budgetSection(book.id, item.section) : item.href}
        target={away(item) ? "_blank" : null}
        rel={away(item) ? "external noopener noreferrer" : null}
      >
        {item.title}{#if away(item)}<span class="sr-only">
            , in the city's PDF, opens in a new tab</span
          >{/if}
      </a>
    </li>
  {/each}
</ul>

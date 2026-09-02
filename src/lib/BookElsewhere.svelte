<!--
  The parts of the book a page belongs with but does not carry: the tail of a
  category page.

  The heading is ours -- the one line on these pages that is not the book's --
  and so is the choice of what to list, which makes this the site's only
  "see also" and worth keeping short. Everything else follows the rule the
  contents page follows: a section written up here opens on this site, and one
  that is not opens the city's own file at the page the book gives it, so the
  reader lands on the section either way.
-->
<script lang="ts">
  import { Router } from "$lib/router"

  export interface Elsewhere {
    /** The section, named as the book's contents names it. */
    title: string
    /** A section written up here: its route segment under the book. */
    section?: string
    /** A section that is not: the city's file, opened at its page. */
    href?: string
  }

  let { items, book }: { items: Elsewhere[]; book: { id: string } } = $props()

  const away = (item: Elsewhere) => !item.section
</script>

<h2>Elsewhere in the book</h2>

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

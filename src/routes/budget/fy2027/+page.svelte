<script lang="ts">
  import { Router } from "$lib/router"
  import type { BookSection } from "$lib/budget"

  let { data } = $props()

  const book = $derived(data.book)
  const contents = $derived(data.contents as BookSection[])
  const unlisted = $derived(data.unlisted as BookSection[])

  // A section written up here opens on this site; one that is not opens the
  // city's PDF at the page the book's own contents give for it. Either way the
  // reader lands on the section, which is the whole point of the page.
  const linkFor = (s: BookSection) =>
    s.written ? Router.budgetSection(book.id, s.slug) : Router.pdfPage(book.budget!, s.page)
</script>

{#snippet list(sections: BookSection[])}
  <!-- Not a `prose` list: the page numbers want a column of their own, and the
       leader rule between title and number is what the book itself prints. -->
  <ol class="not-prose mt-2 list-none space-y-0 p-0">
    {#each sections as section (section.slug)}
      <li class="flex items-baseline gap-2 border-b border-slate-100 py-1.5 text-sm">
        <a
          class="text-slate-800 underline decoration-slate-300 hover:decoration-slate-800"
          href={linkFor(section)}
          target={section.written ? null : "_blank"}
          rel={section.written ? null : "external noopener noreferrer"}
        >
          {section.title}{#if !section.written}<span class="sr-only">
              , in the city's PDF, opens in a new tab</span
            >{/if}
        </a>
        <span class="grow border-b border-dotted border-slate-200"></span>
        <span class="text-slate-500 tabular-nums">{section.page}</span>
      </li>
    {/each}
  </ol>
{/snippet}

<h2>Table of Contents</h2>

{@render list(contents)}

<h2>Not in the book's contents</h2>

<p class="text-sm">
  Pages with a heading of their own that the contents page above does not list, so following it
  alone skips them.
</p>

{@render list(unlisted)}

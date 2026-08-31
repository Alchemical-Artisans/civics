<script lang="ts">
  import { Router } from "$lib/router"
  import BudgetBars from "$lib/BudgetBars.svelte"
  import type { BookSection } from "$lib/budget"

  let { data } = $props()

  const book = $derived(data.book)
  const contents = $derived(data.contents as BookSection[])
  const unlisted = $derived(data.unlisted as BookSection[])
  const overview = $derived(data.overview)

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  const inBrief = $derived(Router.budgetSection(book.id, overview.section.slug))

  // One scale across both charts. They are two halves of the same total, so a
  // reader will compare them; scaled separately, Tax Levy and Education would
  // draw the same length while differing by a million dollars.
  const scale = $derived(
    Math.max(
      ...overview.appropriations.map((r) => r.amount),
      ...overview.revenue.map((r) => r.amount),
    ),
  )

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

<!--
  The two halves of one number, which is what a budget is: everything the city
  expects to take in, and everything it plans to spend. Both tables are on page
  78 and both come to the same total, so the two charts are the same size and
  can be read against each other.
-->
<h2>Appropriations</h2>

<p class="text-sm">
  {money.format(overview.total)}, from the table on page {overview.section.page}, transcribed at
  <a href={inBrief}>2027 Budget in Brief</a>.
</p>

<BudgetBars rows={overview.appropriations} scaleTo={scale} />

<h2>Revenue</h2>

<p class="text-sm">{money.format(overview.total)}, from the same page.</p>

<BudgetBars rows={overview.revenue} scaleTo={scale} />

<h2>Table of Contents</h2>

{@render list(contents)}

<h2>Not in the book's contents</h2>

<p class="text-sm">
  Pages with a heading of their own that the contents page above does not list, so following it
  alone skips them.
</p>

{@render list(unlisted)}

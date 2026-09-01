<script lang="ts">
  import { Router } from "$lib/router"
  import BudgetPie from "$lib/BudgetPie.svelte"
  import BudgetTimeline from "$lib/BudgetTimeline.svelte"
  import type { BookSection } from "$lib/budget"

  let { data } = $props()

  const book = $derived(data.book)
  const contents = $derived(data.contents as BookSection[])
  const unlisted = $derived(data.unlisted as BookSection[])
  const overview = $derived(data.overview)
  const calendar = $derived(data.calendar)

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  // A section written up here opens on this site; one that is not opens the
  // city's PDF at the page the book's own contents give for it. Either way the
  // reader lands on the section, which is the whole point of the page.
  const linkFor = (s: BookSection) =>
    s.written ? Router.budgetSection(book.id, s.slug) : Router.pdfPage(book.budget!, s.page)
</script>

{#snippet list(sections: BookSection[])}
  <!-- Not a `prose` list, and no page numbers: the book prints them beside its
       own contents because paper is the only way through it, and here the line
       is the way through -- it opens the section, on this site or at that page
       of the city's PDF, and which page that is stays the link's business rather
       than the reader's. Sixty-odd lines of it, so it runs in columns once
       there is room for two rather than as one strip down the page. -->
  <ol class="not-prose mt-2 list-none space-y-0 p-0 sm:columns-2 sm:gap-x-10 2xl:columns-3">
    {#each sections as section (section.slug)}
      <li class="break-inside-avoid border-b border-slate-100 py-1.5 text-sm">
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
      </li>
    {/each}
  </ol>
{/snippet}

<!--
  The charts on the left, the book on the right.

  The two halves of one number, which is what a budget is: everything the city
  expects to take in, and everything it plans to spend. Both tables are on page
  78 and both come to the same total, so the two pies are one circle divided two
  ways and can be read against each other.

  The contents is what most readers came for -- it is the way into every section
  of the book -- so on a wide screen it sits beside the charts rather than below
  them, where it would start under the fold. Stacked below `lg`, charts first,
  because a column narrower than a pie has nowhere to put one.
-->
<div
  class="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-12 2xl:grid-cols-[20rem_minmax(0,1fr)]"
>
  <div>
    <!--
      The total belongs on the heading line: it is the same figure for both
      charts, and a line of its own under each said so twice. Where it came from
      is not written out either -- the contents beside these charts links
      2027 Budget in Brief, which is page 78 transcribed, and that is one line
      away rather than restated under every heading.
    -->
    <h2>
      Appropriations
      <span class="font-normal text-slate-500 tabular-nums">{money.format(overview.total)}</span>
    </h2>

    <BudgetPie rows={overview.appropriations} />

    <h2>
      Revenue
      <span class="font-normal text-slate-500 tabular-nums">{money.format(overview.total)}</span>
    </h2>

    <BudgetPie rows={overview.revenue} />
  </div>

  <div>
    <h2>Table of Contents</h2>

    {@render list(contents)}

    <h2>Not in the book's contents</h2>

    <p class="text-sm">
      Pages with a heading of their own that the contents page above does not list, so following it
      alone skips them.
    </p>

    {@render list(unlisted)}
  </div>
</div>

<!--
  The calendar last, across the foot of the page: it is the process the two
  charts above are the outcome of, and page 13 of the book drawn the way the
  book draws it, turned on its side.
-->
<h2>Budget Calendar</h2>

<BudgetTimeline steps={calendar} asOf={data.asOf} />

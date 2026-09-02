<script lang="ts">
  import { Router } from "$lib/router"
  import BudgetPie from "$lib/BudgetPie.svelte"
  import BudgetStack from "$lib/BudgetStack.svelte"
  import BudgetTimeline from "$lib/BudgetTimeline.svelte"
  import type { BookSection } from "$lib/budget"

  let { data } = $props()

  const book = $derived(data.book)
  const contents = $derived(data.contents as BookSection[])
  const departments = $derived(data.departments as BookSection[])
  const overview = $derived(data.overview)
  const calendar = $derived(data.calendar)
  const reserves = $derived(data.reserves)
  const debt = $derived(data.debt)

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
       than the reader's. The two lists are the page's columns, so a list is one
       strip and not two. -->
  <ol class="not-prose mt-2 list-none space-y-0 p-0">
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
      is not written out either -- each heading opens the side of the book its
      chart is about, and page 78's table is at the foot of that page, which is
      one click away rather than restated under every heading.
    -->
    <h2>
      <a
        class="font-semibold text-slate-900 underline decoration-slate-400 decoration-2 underline-offset-4 hover:decoration-slate-900"
        href={Router.budgetSection(book.id, "appropriations")}
      >
        Appropriations
      </a>
      <span class="font-normal text-slate-500 tabular-nums">{money.format(overview.total)}</span>
    </h2>

    <BudgetPie rows={overview.appropriations} />

    <!-- Each heading opens the side of the book its chart is about, which is
         why neither has a line in the contents below. Page 78, which is what
         both pies are drawn from, is split between those two pages the same
         way: its appropriations table on one, its revenue table on the other,
         each beside the chart that reads it. -->
    <h2>
      <!-- `font-semibold` because `prose` gives a link its own weight of 500,
           which is lighter than the heading it sits in and made this one read
           as less than the heading beside it. The underline is the heavy one:
           a heading is the last thing a reader expects to be a link, so a
           hairline under it is not enough to say that it is. -->
      <a
        class="font-semibold text-slate-900 underline decoration-slate-400 decoration-2 underline-offset-4 hover:decoration-slate-900"
        href={Router.budgetSection(book.id, "revenue")}
      >
        Revenue
      </a>
      <span class="font-normal text-slate-500 tabular-nums">{money.format(overview.total)}</span>
    </h2>

    <BudgetPie rows={overview.revenue} />
  </div>

  <div>
    <!--
      What the city has put by and what it owes, above the contents rather than
      beside the pies: the pies are the year -- what comes in and what goes out
      of it -- and this is the standing position underneath it, which is a
      different question.

      One chart and not two, on one scale, because the only useful thing to do
      with these two figures is hold them against each other. Full width, so the
      shorter bar is still long enough to be divided into what it is made of.
    -->
    <div class="mb-8">
      <h2>Reserves and Debt</h2>

      <!-- Each bar's name opens the section it is drawn from, which is why
           neither has a line in the contents below: the same page offered twice,
           once as a chart and once as a line, is a page offered twice. -->
      <BudgetStack
        rows={[
          {
            label: "Reserves",
            href: Router.budgetSection(book.id, "reserves"),
            parts: reserves,
          },
          {
            label: "Debt",
            href: Router.budgetSection(book.id, "outstanding-debt"),
            parts: debt,
          },
        ]}
      />
    </div>

    <!--
      Two lists and no heading over either: what the year is, and what each of
      the things the city funds costs. Sixty lines in one list is a list nobody
      reads to the end of, and a reader arrives wanting one question or the
      other -- but the second list is not all departments, and a name short
      enough to head a column is wrong about part of what is under it.
    -->
    <div class="sm:grid sm:grid-cols-2 sm:items-start sm:gap-x-10">
      {@render list(contents)}
      {@render list(departments)}
    </div>
  </div>
</div>

<!--
  The calendar is the page's footer, fixed to the bottom of the window: it is
  the process everything above it is the outcome of, so it belongs under all of
  it and stays there while the contents scrolls past. The layout pads the page
  by more than this is tall, because a fixed footer cannot push anything out
  from under itself.
-->
<footer
  class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-2 backdrop-blur"
>
  <BudgetTimeline steps={calendar} asOf={data.asOf} />
</footer>

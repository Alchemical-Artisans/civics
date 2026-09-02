<script lang="ts">
  import { Router } from "$lib/router"
  import BudgetColumns from "$lib/BudgetColumns.svelte"
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

  The two sides of a budget: everything the city expects to take in, and
  everything it spends. They no longer come to the same figure, and that is not
  a mistake in either of them -- the spending pie is the budget the Council
  adopted, water and wastewater included, and the revenue pie is still the
  book's page-78 estimate for the general fund alone. The spending page says
  what the difference is made of, in the city's own words.

  The contents is what most readers came for -- it is the way into every section
  of the book -- so on a wide screen it sits beside the charts rather than below
  them, where it would start under the fold. Stacked below `lg`, charts first,
  because a column narrower than a pie has nowhere to put one.
-->
<div
  class="lg:grid lg:h-[calc(100vh-197px)] lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-12 2xl:grid-cols-[20rem_minmax(0,1fr)]"
>
  <!--
    The charts stay on the screen and the list moves under them. They are the
    answer the page exists to give, and a reader working down thirty-four
    department names is exactly the reader who wants the two columns still in
    view; a chart that scrolls away is a chart consulted once.

    So the page is one screen: 197px of it is spoken for -- the bar at the top
    (53), the padding the layout puts above the page (16) and the padding it
    puts below to clear the fixed footer (128) -- and the grid takes the rest.
    The footer then sits inside that bottom padding rather than over anything,
    and the only thing that scrolls is the list itself. Full height also buys the chart every pixel it can get, which
    $5,151,539 out of $316 million needs. Below `lg` this is all off -- the page
    is a single column and scrolls as a page.
  -->
  <div class="lg:h-full">
    <!--
      The two sides of the budget as two columns on one scale, rather than two
      pies. A pie says what a side is made of; two pies cannot say whether the
      sides are the same size, which is the first thing to know about a budget
      and the thing this one turns on: the columns do not reach the same height,
      and the gap is the $5,150,000 of last year's free cash that closes it.

      Free cash is not drawn as revenue for that reason. It is in the book's
      revenue table, inside "Other Available Revenue Sources", and it is last
      year's surplus rather than this year's income; counting it would balance
      the chart by hiding the thing worth seeing. The Mayor's third goal is to
      stop relying on it, and the spending page says the rest in the city's own
      words.

      Each column's name is the way into the side of the book it is drawn from,
      which is why neither has a line in the contents.
    -->
    <BudgetColumns
      rows={[
        {
          label: "Spending",
          href: Router.budgetSection(book.id, "spending"),
          parts: overview.spending,
          total: overview.spendingTotal,
        },
        {
          label: "Revenue",
          href: Router.budgetSection(book.id, "revenue"),
          parts: overview.revenue,
        },
      ]}
    />
  </div>

  <div class="lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
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
      What is left of the book's contents once everything with a home has gone
      to it: one line per thing the city funds. Every other section is reached
      from a chart, from the bar, from a see-also, or -- for the glossary --
      from a word in the prose.

      Two lists where anything remains that is not one of those things: what the
      year is on the left, what it funds on the right. Neither is headed, since
      no name short enough to head the second column is true of all of it.
    -->
    <!-- The one thing on this page that scrolls. `min-h-0` because a flex child
         will not shrink below its content without it, and a box that cannot
         shrink cannot scroll; `relative` because the `sr-only` note on a line
         that opens the city's PDF is absolutely positioned, and without a
         positioned ancestor it is laid out against the page instead of this
         box -- which a scroller does not clip, so the page grew by the height
         of the list hanging out of the bottom of it. -->
    <div class="lg:relative lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
      {#if contents.length}
        <div class="sm:grid sm:grid-cols-2 sm:items-start sm:gap-x-10">
          {@render list(contents)}
          {@render list(departments)}
        </div>
      {:else}
        <!-- Columns rather than one strip down the page: a list of thirty-four
             is two columns' worth, and there is no second list to be beside. -->
        <div class="sm:columns-2 sm:gap-x-10 2xl:columns-3">
          {@render list(departments)}
        </div>
      {/if}
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

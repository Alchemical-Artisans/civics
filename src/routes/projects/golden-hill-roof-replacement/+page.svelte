<!--
  The Golden Hill roof, as a project: the school's roof the city began paying
  to design in January, the borrowing the Mayor filed for it in October, and
  the notice that puts the order in the paper two days after the Council first
  sees it.

  It was one agenda item with everything on it -- an eight-hundred-word loan
  order, two letters, a notice and its confirmation, the whole of it one
  evening's packet. But the thing itself is older than the packet and outlasts
  it: January's $300,000 is in the order only as a clause of its own
  arithmetic, and what happens after the ten days is not in the packet at all.
  That is what a project is for, so the item's own furniture -- what it costs,
  where the school is -- is here, and the loan order's write-up keeps the
  documents it transcribes.

  What this page says is quoted and attributed, as every page here is. The
  city's words for why the roof is being replaced, and for what it will cost
  after the state's share, are the Schools' Chief Financial Officer's, filed
  with the order; each quotation is cited to the writer and opens the city's
  own file.
-->
<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import { PROJECTS, type Project } from "$lib/projects"
  import { Router } from "$lib/router"
  import FigureCards from "./FigureCards.svelte"
  import { COST, SCHOOL } from "./roof"

  let { data } = $props()

  const PROJECT = PROJECTS.find((p) => p.slug === "golden-hill-roof-replacement") as Project

  const MEETING = "city-council-2026-10-20"
  const ITEM = "golden-hill-roof-replacement-bonds"

  /**
   * The letter both quotations are from, as the city filed it. A quotation
   * here cites the document rather than this site's transcription of it: the
   * reader who follows a quotation is checking it, and what settles it is the
   * paper the city sent, over the writer's own signature.
   */
  const SCHOOLS_LETTER = Router.excerpt(MEETING, `${ITEM}/schools-letter`)

  /** Who wrote it, as the letterhead and the signature give them. */
  const WRITER = "Clancy Main, Chief Financial Officer, Haverhill Public Schools"
</script>

<svelte:head>
  <title>{PROJECT.title} - Haverhill</title>
  <meta
    name="description"
    content="Haverhill's Golden Hill Elementary School roof replacement: what the city has appropriated for it, what the MSBA is expected to reimburse, and every sitting that has taken it up."
  />
</svelte:head>

<!--
  A passage of the letter, cited the way the Marshland permit's pairs are: the
  writer and their position, linking the city's own file. The name alone,
  without the letter's date or a sentence introducing it -- a reader following
  a quotation wants to see who said it and then the page they said it on, and
  the rest of the apparatus was this site talking over the person quoted.
-->
{#snippet passage(quote: string)}
  <figure class="mt-3">
    <blockquote class="border-l-4 border-slate-200 pl-4 text-slate-800">
      <p>{quote}</p>
    </blockquote>
    <figcaption class="mt-2 pl-4 text-sm text-slate-600">
      <a
        class="text-sky-800 underline hover:text-slate-900"
        href={SCHOOLS_LETTER}
        target="_blank"
        rel="noopener"
      >
        {WRITER}<span class="sr-only">, PDF, one page, opens in a new tab</span>
      </a>
    </figcaption>
  </figure>
{/snippet}

<div class="mx-auto max-w-6xl px-4 py-8">
  <header class="mb-6 border-b border-slate-200 pb-6">
    <p class="text-sm text-slate-500">Project</p>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{PROJECT.title}</h1>
  </header>

  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <div>
      <!-- Why there is a project at all, in the Schools' own words rather
           than ours: a roof past its life, leaking, and the building behind
           it. The order's own write-up transcribes the whole letter; the
           citation goes to the file instead, which is what a reader checking
           a quotation is after. -->
      <section aria-labelledby="the-roof">
        <h2 id="the-roof" class="text-lg font-semibold text-slate-900">The roof</h2>
        {@render passage(
          "The existing roof has exceeded its useful life and has experienced ongoing leaks and water infiltration. The roof replacement is necessary to address these conditions, protect the building, and prevent further deterioration.",
        )}
      </section>

      <!-- What it costs and who pays. The three cards are the figures; the
           sentence under them is the one place any document puts all three
           together, which is why it is quoted whole rather than cut up into
           the cards' own captions. -->
      <section aria-labelledby="the-cost" class="mt-8">
        <h2 id="the-cost" class="text-lg font-semibold text-slate-900">What it costs</h2>
        <FigureCards figures={COST} class="mt-3 sm:flex-row" />
        {@render passage(
          "The project is currently in the schematic design phase. The estimated total cost of the roof replacement is $3,564,770, prior to reimbursement from the MSBA. The City is eligible for an anticipated reimbursement rate of 77.47%, which would result in a projected local contribution of approximately $803,000, subject to final eligible project costs and MSBA approval.",
        )}
      </section>

      <!-- Where the school is. The same point the order's write-up draws,
           from `roof.ts`, so the two cannot disagree about the building. -->
      <section aria-labelledby="the-school" class="mt-8">
        <h2 id="the-school" class="text-lg font-semibold text-slate-900">The school</h2>
        <AddressMap address={SCHOOL.address} lat={SCHOOL.lat} lon={SCHOOL.lon} />
      </section>
    </div>

    <!-- Three steps, one of them behind the reader: nothing worth folding,
         and folding January would leave a timeline looking emptier than the
         project is. The Infrastructure Risk Assessment's two are turned off
         for the same reason. -->
    <ProjectTimeline project={PROJECT} today={data.today} fold={false} />
  </div>
</div>

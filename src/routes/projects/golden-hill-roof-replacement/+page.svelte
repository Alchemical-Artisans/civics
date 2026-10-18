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
  import FigureCards from "./FigureCards.svelte"
  import { APPROPRIATION, SCHOOL, SCHOOLS_LETTER, SHARES } from "./roof"

  let { data } = $props()

  const PROJECT = PROJECTS.find((p) => p.slug === "golden-hill-roof-replacement") as Project

  /**
   * Who wrote the letter both quotations are from, as the letterhead and the
   * signature give them. A quotation here cites the document rather than this
   * site's transcription of it: the reader who follows one is checking it,
   * and what settles it is the paper the city sent, over the writer's own
   * signature. `SCHOOLS_LETTER` is that file, named in `roof.ts` because the
   * financing cards link it too.
   */
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

<!-- An `<article>`: the page is one undertaking followed from end to end, and
     what is in it belongs to that and to nothing else on the site. Its
     `<header>` names it, and the rail beside the reading is its `<aside>`. -->
<article class="mx-auto max-w-6xl px-4 py-8">
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

      <!--
        What it costs, then who is expected to pay it.

        The appropriation has a row to itself and is stated bare: it is the
        one settled figure on the page, and the heading over it is the whole
        of what it needs saying about it. It was a card among three, which
        made the sum the city is actually borrowing one of a set of three
        equal-looking numbers, two of which nobody has granted.

        The Schools' own sentence putting the figures together was quoted
        under them and said the same thing a second time, at greater length;
        what it qualified each figure with is on the card it qualifies, which
        is where a reader meets the figure. `roof.ts` says why both of those
        are conditions rather than facts.
      -->
      <section aria-labelledby="the-cost" class="mt-8">
        <h2 id="the-cost" class="text-lg font-semibold text-slate-900">What it costs</h2>
        <p class="mt-2 text-4xl font-bold text-slate-900">{APPROPRIATION}</p>

        <!-- The state's part, under a heading that says once what each card
             would otherwise have to say for itself: nothing here has been
             granted. -->
        <section aria-labelledby="msba" class="mt-6">
          <h3 id="msba" class="text-base font-semibold text-slate-900">
            MSBA financing <span class="font-normal text-slate-600">(if approved)</span>
          </h3>
          <FigureCards figures={SHARES} class="mt-3 sm:flex-row" />
        </section>
      </section>
    </div>

    <!--
      The place and the record, the way the Marshland Street permit's rail
      carries them: a reader asks where before they ask when, and neither is
      what the project is about, which is why both sit beside the reading
      rather than in it. The map takes no heading of its own -- its caption
      names the school, and the rail is short enough that a title over it
      would be the loudest thing in the column.

      The point is `roof.ts`'s, the same one the loan order's write-up draws,
      so the two maps cannot come to show different buildings.
    -->
    <aside aria-label="Where the school is, and what has happened so far">
      <AddressMap address={SCHOOL.address} lat={SCHOOL.lat} lon={SCHOOL.lon} />

      <!-- Three steps, one of them behind the reader: nothing worth folding,
           and folding January would leave a timeline looking emptier than the
           project is. The Infrastructure Risk Assessment's two are turned off
           for the same reason. -->
      <ProjectTimeline project={PROJECT} today={data.today} fold={false} />
    </aside>
  </div>
</article>

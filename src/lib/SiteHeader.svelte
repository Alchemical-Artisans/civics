<!--
  The bar across the top of every page: the mark, the page's own name, and the
  two things the site holds.

  It exists because the two halves were only reachable from each other through
  links buried in each page's own chrome -- a line above the calendar's heading
  pointing at the budget, another under the budget's table pointing back. That
  works until a reader is three levels down a budget book, at which point the
  other half of the site is gone. A header is the ordinary answer and it
  replaces all of them.
-->
<script lang="ts">
  import { page } from "$app/state"
  import HeaderMenu from "$lib/HeaderMenu.svelte"
  import { PROJECTS, PROJECT_KINDS } from "$lib/projects"
  import { Router } from "$lib/router"
  import { barOf } from "$lib/heading"
  import type { FiscalYear } from "$lib/budget"
  import mark from "$lib/assets/favicon.svg"

  let {
    /** Every fiscal year the city publishes, newest first, from the root layout. */
    years,
  }: { years: FiscalYear[] } = $props()

  // Matched on `page.route.id`, not on the URL.
  //
  // The obvious spelling -- comparing `page.url.pathname` against a
  // Router-built href -- is wrong here, and wrong in a way that hides itself.
  // With `paths.relative` on, `base` is a relative prefix that differs per page
  // during prerendering, so the same route is "./budget" on one page and
  // "../budget" on another while the pathname stays absolute: the comparison
  // never matches, and no prerendered page gets `aria-current`. It then starts
  // matching once the client takes over and `base` goes back to "", so the
  // markup a crawler sees and the markup a reader ends up with disagree, and a
  // browser test notices nothing because it waits for hydration.
  //
  // `route.id` is the matched route -- "/budget/fy2027/fiscal-reserves" -- and
  // never carries the base path, so it reads the same in both.
  const within = (prefix: string) => (page.route.id ?? "").startsWith(prefix)

  const current = $derived({
    budget: within("/budget"),
    projects: within("/projects"),
    calendar: within("/calendar"),
  })

  const bar = $derived(barOf(page.data))

  /** The newest book with a page here: where the word "Budget" goes. */
  const newest = $derived(years.find((year) => year.written))

  // Projects by kind, in the order the menu lists the kinds: what the city is
  // doing, grouped by what sort of thing it is, rather than one flat list that
  // would mix an election in with a building project.
  const projectGroups = $derived(
    PROJECT_KINDS.map((kind) => ({
      ...kind,
      projects: PROJECTS.filter((project) => project.kind === kind.id),
    })).filter((group) => group.projects.length),
  )
</script>

<header class="border-b border-slate-200 bg-white">
  <!-- `relative`: on a phone the menus in the bar hang off its right edge
       rather than off their own words -- see `HeaderMenu`. -->
  <div class="relative flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
    <a class="flex items-center gap-2 text-slate-900 hover:text-slate-600" href={Router.home()}>
      <!-- Decorative: the name sits right beside it, so a screen reader
           announcing the mark as well would only say the same thing twice. -->
      <img class="h-7 w-7" src={mark} alt="" />
      <span class="font-semibold tracking-tight">Meetinghouse</span>
    </a>

    <!-- What the page sits inside, before the page's own name: on a section of
         a budget book that is the book, so the bar reads "Meetinghouse / 2027
         Budget / Reserves" and the middle of it is the way back. A section used
         to take the bar over, which named the page and lost the year it
         belonged to.

         Plain links rather than a `<nav>` and a list. The bar already carries
         one navigation landmark, for the two halves of the site, and a second
         one holding a single link is more for a screen reader to walk past
         than it is worth -- the mark to the left of these is a link home on
         the same terms. -->
    {#each bar.trail as crumb (crumb.href)}
      <span class="text-slate-300" aria-hidden="true">/</span>
      <a
        class="truncate text-base font-medium tracking-tight text-slate-600 hover:text-slate-900"
        href={crumb.href}
      >
        {crumb.name}
      </a>
    {/each}

    {#if bar.name}
      <!-- The page's one `<h1>`, and everything that used to sit under it. It
           is in the bar rather than the page because the bar is where a reader
           looks to know where they are, and the page below it is the thing
           itself. -->
      <span class="text-slate-300" aria-hidden="true">/</span>
      <h1 class="m-0 truncate text-base font-medium tracking-tight text-slate-900">
        {bar.name}
      </h1>
    {/if}

    {#if bar.dates}
      <p class="m-0 text-xs text-slate-500">{bar.dates}</p>
    {/if}

    <!-- No link to the city's own file here. The budget calendar in the footer
         carries every document a book rests on, each hung off the step of the
         year that produced it, which is more than a bar can say about one. -->

    <!-- `ml-auto` rather than `justify-between`, so the two stay together at
         the right and wrap as a pair on a narrow screen. -->
    <nav class="ml-auto flex items-center gap-4 text-sm" aria-label="Sections">
      <!--
        The budget half is a word and a menu under it. The word goes where `/`
        goes -- this year's book -- and the menu is every year the city
        publishes, which was a page once, `/budget`, that every reader wanting a
        book paid a hop through. Between them they also replace the way back up:
        a book and its sections used to carry a "back" line of their own.
      -->
      <!-- `aria-current="page"` on the link is the same section marker the
           calendar link carries; the year inside the menu gets `"true"` -- the
           current item of a set -- rather than a second "page" for one page. -->
      <HeaderMenu
        label="Budget"
        href={newest ? Router.budgetBook(newest.id) : undefined}
        current={current.budget}
        id="budget-years"
        toggle="Every fiscal year"
      >
        {#each years as year (year.id)}
          <li class="flex items-baseline justify-between gap-3 px-2 py-1 hover:bg-slate-50">
            {#if year.written}
              <a
                class="font-medium text-slate-900 underline decoration-slate-300 hover:decoration-slate-900"
                href={Router.budgetBook(year.id)}
                aria-current={within(`/budget/${year.id}`) ? "true" : undefined}
              >
                FY{year.year}
              </a>
            {:else if year.budget}
              <a
                class="text-slate-600 underline decoration-slate-300 hover:text-slate-900"
                href={year.budget}
                target="_blank"
                rel="external noopener noreferrer"
              >
                FY{year.year}<span class="sr-only">
                  budget, PDF, opens the city's file in a new tab</span
                >
              </a>
            {:else}
              <!-- The city's page prints the year with nothing behind it, as
                   it does for FY2022 and FY2023. Saying so beats a row the
                   reader has to work out is dead. -->
              <span class="text-slate-500"
                >FY{year.year}<span class="sr-only"> — no budget file</span></span
              >
            {/if}

            {#if year.audit}
              <a
                class="text-xs text-slate-500 underline decoration-slate-300 hover:text-slate-900"
                href={year.audit}
                target="_blank"
                rel="external noopener noreferrer"
              >
                Audit<span class="sr-only">
                  report for FY{year.year}, PDF, opens the city's file in a new tab</span
                >
              </a>
            {/if}
          </li>
        {/each}
      </HeaderMenu>

      <!--
        Projects: what the city is doing that runs across more than one
        sitting, by kind. There is no page listing them -- the menu is the
        list, the way the budget's menu replaced `/budget` -- so the word opens
        the menu rather than going anywhere. A kind's name heads its projects
        and is not a link.
      -->
      {#if projectGroups.length}
        <HeaderMenu
          label="Projects"
          current={current.projects}
          id="project-list"
          toggle="every project"
        >
          {#each projectGroups as group (group.id)}
            <li class="px-2 pt-1.5 pb-0.5 text-[11px] tracking-wide text-slate-500 uppercase">
              {group.label}
            </li>
            {#each group.projects as project (project.slug)}
              <li class="px-2 py-1 hover:bg-slate-50">
                <a
                  class="font-medium text-slate-900 underline decoration-slate-300 hover:decoration-slate-900"
                  href={Router.project(project.slug)}
                  aria-current={within(`/projects/${project.slug}`) ? "true" : undefined}
                >
                  {project.title}
                </a>
              </li>
            {/each}
          {/each}
        </HeaderMenu>
      {/if}

      <a
        class="underline decoration-slate-300 hover:decoration-slate-900 {current.calendar
          ? 'font-medium text-slate-900'
          : 'text-slate-600'}"
        href={Router.calendar()}
        aria-current={current.calendar ? "page" : undefined}
      >
        Calendar
      </a>
    </nav>
  </div>
</header>

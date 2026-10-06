<!--
  The bar across the top of every page: the mark, the page's own name, the
  projects -- budgets among them -- and the calendar.

  It exists because the two halves were only reachable from each other through
  links buried in each page's own chrome -- a line above the calendar's heading
  pointing at the budget, another under the budget's table pointing back. That
  works until a reader is three levels down a budget book, at which point the
  other half of the site is gone. A header is the ordinary answer and it
  replaces all of them.
-->
<script lang="ts">
  import { onMount } from "svelte"
  import { page } from "$app/state"
  import HeaderMenu from "$lib/HeaderMenu.svelte"
  import { PROJECTS } from "$lib/projects"
  import { Router } from "$lib/router"
  import { barOf, bookName } from "$lib/heading"
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

  // A budget book is a project as far as the bar is concerned -- the city's
  // year of spending, followed from the Mayor's book to the Council's orders --
  // so reading one marks Projects, though the books keep their own `/budget`
  // routes rather than moving under `/projects`.
  const current = $derived({
    projects: within("/projects") || within("/budget"),
    calendar: within("/calendar"),
  })

  const bar = $derived(barOf(page.data))

  /**
   * The Projects menu, a group per kind, each newest first.
   *
   * Elections are projects proper, from `$lib/projects`. Budgets are the
   * fiscal years from `budget.json`, which were the bar's own Budget menu
   * until that was folded in here: one book a year, a project of its own, and
   * the list of them every bit as long as it was.
   *
   * Only the most recent of each kind shows until a reader asks for the rest.
   * Twenty-two budget years ahead of the one election would bury the election,
   * and the reader opening this menu almost always wants what is current: the
   * election being held, the budget being spent. For a budget that is the
   * newest book written up here, which is also where the old Budget link went.
   */
  const elections = $derived(PROJECTS.filter((project) => project.kind === "election"))
  const currentYear = $derived(years.find((year) => year.written) ?? years[0])

  let showArchived = $state(false)
  // Hiding the archive is the script's to do: before the page hydrates, or on
  // a page that runs none, there is no button to bring it back, so every entry
  // stays in the menu as it always was.
  let live = $state(false)
  onMount(() => (live = true))
  const hidden = (archived: boolean) => (archived && live && !showArchived ? "hidden" : "")
  const archivedCount = $derived(elections.length - 1 + years.length - 1)
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
        Projects: what the city is doing that runs across more than one
        sitting, by kind, budgets among them. There is no page listing them --
        the menu is the list, the way the old Budget menu replaced `/budget` --
        so the word opens the menu rather than going anywhere. A kind's name
        heads its entries and is not a link.

        The menu replaced a Budget entry of its own, whose list of every year
        was itself the replacement for a `/budget` page every reader wanting a
        book paid a hop through. The entry in the menu the reader is in gets
        `aria-current="true"` -- the current item of a set -- rather than a
        second "page" for one page.
      -->
      <HeaderMenu
        label="Projects"
        current={current.projects}
        id="project-list"
        toggle="every project"
      >
        {#if elections.length}
          <li class="px-2 pt-1.5 pb-0.5 text-[11px] tracking-wide text-slate-500 uppercase">
            Elections
          </li>
          {#each elections as project, at (project.slug)}
            <li class="px-2 py-1 hover:bg-slate-50 {hidden(at > 0)}">
              <a
                class="font-medium text-slate-900 underline decoration-slate-300 hover:decoration-slate-900"
                href={Router.project(project.slug)}
                aria-current={within(`/projects/${project.slug}`) ? "true" : undefined}
              >
                {project.title}
              </a>
            </li>
          {/each}
        {/if}

        <li class="px-2 pt-2.5 pb-0.5 text-[11px] tracking-wide text-slate-500 uppercase">
          Budgets
        </li>
        {#each years as year (year.id)}
          <li
            class="flex items-baseline justify-between gap-3 px-2 py-1 hover:bg-slate-50 {hidden(
              year !== currentYear,
            )}"
          >
            {#if year.written}
              <a
                class="font-medium text-slate-900 underline decoration-slate-300 hover:decoration-slate-900"
                href={Router.budgetBook(year.id)}
                aria-current={within(`/budget/${year.id}`) ? "true" : undefined}
              >
                {bookName(year.year)}
              </a>
            {:else if year.budget}
              <a
                class="text-slate-600 underline decoration-slate-300 hover:text-slate-900"
                href={year.budget}
                target="_blank"
                rel="external noopener noreferrer"
              >
                {bookName(year.year)}<span class="sr-only">
                  , PDF, opens the city's file in a new tab</span
                >
              </a>
            {:else}
              <!-- The city's page prints the year with nothing behind it, as
                   it does for FY2022 and FY2023. Saying so beats a row the
                   reader has to work out is dead. -->
              <span class="text-slate-500"
                >{bookName(year.year)}<span class="sr-only"> — no budget file</span></span
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

        {#if live && archivedCount > 0}
          <li class="mt-1 border-t border-slate-100 px-2 pt-1.5 pb-1">
            <button
              type="button"
              class="cursor-pointer text-xs text-slate-600 underline decoration-slate-300 hover:text-slate-900"
              aria-pressed={showArchived}
              onclick={() => (showArchived = !showArchived)}
            >
              {showArchived ? "Hide archived" : `Show archived (${archivedCount})`}
            </button>
          </li>
        {/if}
      </HeaderMenu>

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

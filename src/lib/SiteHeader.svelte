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
    calendar: within("/calendar"),
  })

  const bar = $derived(barOf(page.data))

  // The menu is a `<details>`, so it opens, closes and takes the keyboard with
  // no script at all -- which matters on a site whose pages are all prerendered
  // and readable before anything hydrates. The script below is only the two
  // habits a browser does not give a `<details>` for free: closing when the
  // reader clicks past it or presses Escape, and closing once they have gone
  // somewhere.
  let menu: HTMLDetailsElement | undefined = $state()

  const close = () => {
    if (menu) menu.open = false
  }

  // Closing after a click on one of the menu's own links takes a line too: the
  // page changes under a `<details>` that stays exactly as it was, because
  // SvelteKit navigates without replacing the bar.
  $effect(() => {
    if (page.url.pathname) close()
  })

  $effect(() => {
    const past = (event: PointerEvent) => {
      if (menu?.open && !menu.contains(event.target as Node)) close()
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }

    document.addEventListener("pointerdown", past)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", past)
      document.removeEventListener("keydown", escape)
    }
  })
</script>

<header class="border-b border-slate-200 bg-white">
  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
    <a class="flex items-center gap-2 text-slate-900 hover:text-slate-600" href={Router.home()}>
      <!-- Decorative: the name sits right beside it, so a screen reader
           announcing the mark as well would only say the same thing twice. -->
      <img class="h-7 w-7" src={mark} alt="" />
      <span class="font-semibold tracking-tight">Haverhill Public Documents</span>
    </a>

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

    {#if bar.source}
      <!-- The city's own file, which is the record. Named for what it is
           rather than for what it contains, because on a section it is the same
           file opened at that section's page. -->
      <a
        class="text-xs text-slate-600 underline decoration-slate-300 hover:text-slate-900"
        href={bar.source}
        target="_blank"
        rel="external noopener noreferrer"
      >
        Original Source<span class="sr-only">, PDF, opens in a new tab</span>
      </a>
    {/if}

    <!-- `ml-auto` rather than `justify-between`, so the two stay together at
         the right and wrap as a pair on a narrow screen. -->
    <nav class="ml-auto flex items-center gap-4 text-sm" aria-label="Sections">
      <!--
        The budget half is a menu of years rather than a link to a page listing
        them. The list was a page once, `/budget`, and every reader who wanted a
        book paid a hop through it; here the same twenty-two years are one click
        from anywhere on the site, and the year a reader is in stays visible
        while they pick another. It also replaces the way back up: a book and
        its sections used to carry a "back" line of their own, which is the
        first thing the menu makes redundant.
      -->
      <!-- `aria-current="page"` on the summary is the same section marker the
           calendar link carries; the year inside gets `"true"` -- the current
           item of a set -- rather than a second "page" for the one page. -->
      <details class="relative" bind:this={menu}>
        <summary
          class="cursor-pointer list-none underline decoration-slate-300 hover:decoration-slate-900 [&::-webkit-details-marker]:hidden {current.budget
            ? 'font-medium text-slate-900'
            : 'text-slate-600'}"
          aria-current={current.budget ? "page" : undefined}
        >
          Budget <span aria-hidden="true">&#9662;</span>
        </summary>

        <!-- Taller than most screens if it ran to its content, so it scrolls
             within itself; `right-0` because the menu hangs off the end of the
             bar and would otherwise run off the window on a phone. -->
        <ul
          class="absolute right-0 z-50 m-0 mt-2 max-h-[70vh] w-60 list-none overflow-y-auto rounded border border-slate-200 bg-white p-1 shadow-lg"
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
                <span class="text-slate-400"
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
        </ul>
      </details>

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

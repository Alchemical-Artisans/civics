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
  import { onMount } from "svelte"
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

  /** The newest book with a page here: where the word "Budget" goes. */
  const newest = $derived(years.find((year) => year.written))

  // The menu opens under the pointer and closes when it leaves, which is the
  // only way to have "Budget" be a link to this year's book *and* a way to
  // every other year: a word that navigates cannot also be the thing you press
  // to see a list. The caret beside it is that press, and it is what a touch
  // screen -- which has no hover to give -- uses instead.
  //
  // The hover is written twice on purpose: in the CSS below, so it works on a
  // page that has not hydrated or that runs no script at all, and here, so the
  // caret's `aria-expanded` says what is actually on screen. The two agree
  // because both are the same condition.
  let shown = $state(false)
  let item: HTMLElement | undefined = $state()

  // Which of the two is in charge. Before the page hydrates the CSS is, because
  // it is the only thing there; from mount on the state above is, so that
  // Escape and a second press on the caret can close a menu the pointer is
  // still sitting on -- which CSS `:hover`, left in play, would hold open.
  let live = $state(false)
  onMount(() => (live = true))

  const close = () => (shown = false)

  // Only a mouse. A tap fires `pointerenter` as well, and on a phone that
  // would open the menu under the finger already on its way to the link.
  const enter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") shown = true
  }

  // Not while the reader is in it: the menu they pressed the caret to open, and
  // are tabbing through, should not vanish because the mouse wandered off.
  const leave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    if (item?.contains(document.activeElement)) return
    shown = false
  }

  // Tab through the years and the menu stays up; tab past the last of them and
  // it closes. `focusout` fires before the next element takes focus, so where
  // focus is going is `relatedTarget` rather than anything readable from here.
  //
  // There is no matching `focusin`. Focus does not open the menu -- pressing
  // the caret does, by keyboard exactly as by thumb -- because a click gives
  // the button focus a moment before it fires, and a menu that opens on focus
  // would then be closed again by the press that opened it.
  const left = (event: FocusEvent) => {
    if (!item?.contains(event.relatedTarget as Node | null)) close()
  }

  // The page changes under a menu that stays exactly as it was, because
  // SvelteKit navigates without replacing the bar.
  $effect(() => {
    if (page.url.pathname) close()
  })

  $effect(() => {
    const past = (event: PointerEvent) => {
      if (shown && !item?.contains(event.target as Node)) close()
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

    <!-- The city's own files, which are the record. The book is named for what
         it is rather than for what it contains, because on a section it is the
         same file opened at that section's page; anything else a page rests on
         is named by the page. -->
    {#each bar.sources as source (source.label)}
      <a
        class="text-xs text-slate-600 underline decoration-slate-300 hover:text-slate-900"
        href={source.href}
        target="_blank"
        rel="external noopener noreferrer"
      >
        {source.label}<span class="sr-only">, PDF, opens in a new tab</span>
      </a>
    {/each}

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
      <!-- `role="none"`: the wrapper is where hovering is noticed and where the
           menu is positioned from, and nothing more -- the link, the caret and
           the list under it carry every bit of the meaning. -->
      <div
        role="none"
        class="budget-item relative flex items-center gap-1"
        class:open={shown}
        class:live
        bind:this={item}
        onpointerenter={enter}
        onpointerleave={leave}
        onfocusout={left}
      >
        {#if newest}
          <a
            class="underline decoration-slate-300 hover:decoration-slate-900 {current.budget
              ? 'font-medium text-slate-900'
              : 'text-slate-600'}"
            href={Router.budgetBook(newest.id)}
            aria-current={current.budget ? "page" : undefined}
          >
            Budget
          </a>
        {:else}
          <!-- No book is written up, so the word leads nowhere and the years
               in the menu are all links to the city's own files. -->
          <span class="text-slate-600">Budget</span>
        {/if}

        <!-- The caret is the whole control on a touch screen, so it is a
             button of its own rather than a decoration on the link, and it is
             padded out to something a thumb can hit. -->
        <button
          class="-m-2 cursor-pointer p-2 text-slate-500 hover:text-slate-900"
          type="button"
          aria-expanded={shown}
          aria-controls="budget-years"
          onclick={() => (shown = !shown)}
        >
          <span aria-hidden="true">&#9662;</span>
          <span class="sr-only">Every fiscal year</span>
        </button>

        <!-- Taller than most screens if it ran to its content, so it scrolls
             within itself; `right-0` because the menu hangs off the end of the
             bar and would otherwise run off the window on a phone. It sits
             against the bar rather than below a gap, so crossing into it does
             not take the pointer out of what it is hovering. -->
        <ul
          class="budget-years absolute top-full right-0 z-50 m-0 max-h-[70vh] w-60 list-none overflow-y-auto rounded border border-slate-200 bg-white p-1 shadow-lg"
          id="budget-years"
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
      </div>

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

<style>
  /*
    The menu is hidden markup rather than markup that is not there, so hovering
    reveals it with no script: a reader whose page has not hydrated, or who runs
    none at all, still gets every year the city publishes. `:not(.live)` hands
    that job over the moment the component mounts, so there is never a page
    where CSS and the component disagree about what is on screen.

    `@media (hover: hover)` keeps it off a touch screen, where a tap counts as a
    hover and then stays hovered until something else is touched -- the menu
    would open on the way to the link and sit there afterwards. The caret is
    what a touch screen presses instead, and `.open` is that press.
  */
  .budget-years {
    display: none;
  }

  .budget-item.open .budget-years {
    display: block;
  }

  @media (hover: hover) {
    .budget-item:not(.live):hover .budget-years,
    .budget-item:not(.live):focus-within .budget-years {
      display: block;
    }
  }
</style>

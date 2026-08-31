<!--
  The bar across the top of every page: the mark, and the two things the site
  holds.

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
  import mark from "$lib/assets/favicon.svg"

  let {
    /** The newest budget book with a page here, or null if none is written. */
    book,
  }: { book: { id: string; year: number } | null } = $props()

  // The budget link goes where `/` goes: the newest book itself, not the list
  // of fiscal years. Sending it to the index would put back the hop that
  // landing straight on the budget was meant to remove -- the index is still
  // there, one level up from the book, for anyone who wants an older year.
  const budget = $derived(book ? Router.budgetBook(book.id) : Router.budget())

  // Matched on `page.route.id`, not on the URL.
  //
  // The obvious spelling -- comparing `page.url.pathname` against
  // `Router.budget()` -- is wrong here, and wrong in a way that hides itself.
  // With `paths.relative` on, `base` is a relative prefix that differs per page
  // during prerendering, so `Router.budget()` is "./budget" on one page and
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
</script>

<header class="border-b border-slate-200 bg-white">
  <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
    <a class="flex items-center gap-2 text-slate-900 hover:text-slate-600" href={Router.home()}>
      <!-- Decorative: the name sits right beside it, so a screen reader
           announcing the mark as well would only say the same thing twice. -->
      <img class="h-7 w-7" src={mark} alt="" />
      <span class="font-semibold tracking-tight">Haverhill Public Documents</span>
    </a>

    <!-- `ml-auto` rather than `justify-between`, so the two stay together at
         the right and wrap as a pair on a narrow screen. -->
    <nav class="ml-auto flex items-center gap-4 text-sm" aria-label="Sections">
      <a
        class="underline decoration-slate-300 hover:decoration-slate-900 {current.budget
          ? 'font-medium text-slate-900'
          : 'text-slate-600'}"
        href={budget}
        aria-current={current.budget ? "page" : undefined}
      >
        Budget
      </a>
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

<script lang="ts">
  import { page } from "$app/state"
  import { Router } from "$lib/router"
  import BudgetTimeline from "$lib/BudgetTimeline.svelte"

  let { data, children } = $props()

  /**
   * Where the book's own file opens: at this section's page where the reader is
   * on a section, at the front of it on the book's front page.
   *
   * This is the deep link the bar used to carry as "Original Source". It is
   * better here: the bar could say only that the page came from somewhere, and
   * the box says which step of the year produced the thing it came from.
   */
  const section = $derived(page.data.section as { page: number } | undefined)
  const book = $derived(
    data.book.budget && section ? Router.pdfPage(data.book.budget, section.page) : data.book.budget,
  )
</script>

{@render children()}

<!--
  The calendar is the footer of every page of the book, fixed to the bottom of
  the window: it is the process all of this is the outcome of, so it belongs
  under all of it and stays there while the page scrolls past. The budget layout
  pads the page by more than this is tall, because a fixed footer cannot push
  anything out from under itself.

  `bottom-10` and not `bottom-0`: the site's attribution line is fixed to the
  bottom of the window on this half of the site, and this sits on top of it. Its
  40px is `SiteFooter`'s own fixed height, which is fixed precisely so that
  something can be measured against it.
-->
<footer
  class="fixed inset-x-0 bottom-10 z-40 border-t border-slate-200 bg-white/95 px-4 py-2 backdrop-blur"
  data-budget-footer
>
  <BudgetTimeline steps={data.calendar} asOf={data.asOf} documents={{ book, order: data.order }} />
</footer>

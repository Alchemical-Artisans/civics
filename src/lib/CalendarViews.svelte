<script lang="ts">
  // The Month / Week / Day switch at the head of each of the calendar's three
  // views. Plain links to real pages, the way Prev and Next are: each view is
  // its own prerendered route, so there is no state here for a script to hold.
  //
  // `date` is the day the other two views should open on -- today where the
  // page being read contains it, else the first day of what is shown -- so
  // moving Month -> Week -> Day narrows toward the same day rather than
  // dropping the reader somewhere unrelated.
  import { monthKey } from "$lib/calendar"
  import { Router } from "$lib/router"

  let {
    view,
    date,
    months,
  }: { view: "month" | "week" | "day"; date: string; months?: [string, string] } = $props()

  // A week or day at either end of the record can lie outside the months that
  // have a page; the Month link is clamped to the nearest one that does.
  const month = $derived.by(() => {
    const key = monthKey(date)
    return months ? (key < months[0] ? months[0] : key > months[1] ? months[1] : key) : key
  })

  const views = $derived([
    { name: "month", label: "Month", href: Router.calendarMonth(month) },
    { name: "week", label: "Week", href: Router.calendarWeek(date) },
    { name: "day", label: "Day", href: Router.calendarDay(date) },
  ] as const)
</script>

<nav
  aria-label="Calendar view"
  class="inline-flex overflow-hidden rounded-md ring-1 ring-slate-300"
>
  {#each views as v (v.name)}
    <a
      href={v.href}
      aria-current={v.name === view ? "page" : undefined}
      class="px-3 py-2 text-sm font-medium transition {v.name === view
        ? 'bg-slate-800 text-white'
        : 'text-slate-700 hover:bg-slate-100'}"
    >
      {v.label}
    </a>
  {/each}
</nav>

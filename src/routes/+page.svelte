<script lang="ts">
  // The front page. It names the site and points at what it holds: the
  // meeting calendar, and the project the city is in the middle of.
  //
  // `/` forwarded straight to the budget book for a while, on the reasoning that
  // an index costs every visitor a hop. That held while the budget was the
  // whole point and the calendar a side door; it stopped holding once the site
  // grew into separate things a reader arrives wanting one or another of. A
  // reader who lands here now gets to choose rather than being dropped into
  // something they may not have come for.
  //
  // Each card *is* its subject rather than a description of one: the week the
  // calendar is on, and the current project's own picture -- for the election,
  // its map. The second card was the budget's, drawn as the year's two
  // columns, until budgets became one kind of project among several, reached
  // from the bar's Projects menu. Both cards used to carry a paragraph saying
  // what was behind them, under a paragraph saying what the site was for, and
  // all three were the site talking about itself to a reader who had not been
  // shown anything yet. What is left is a slogan and two pictures.
  import { Router } from "$lib/router"
  import type { MeetingKind } from "$lib/calendar"
  import type { WeekDay, WeekEntry } from "./+page"
  import ElectionCard from "./projects/2026-state-election/ElectionCard.svelte"

  let { data } = $props()

  const week = $derived(data.week as WeekDay[])

  // The calendar's own colours for a document's kind, so the week reads as a
  // week of the page it opens rather than as a second vocabulary for the same
  // thing.
  const kindClass = (kind: MeetingKind) =>
    kind === "agenda"
      ? "bg-sky-100 text-sky-900"
      : kind === "minutes"
        ? "bg-emerald-100 text-emerald-900"
        : "bg-slate-100 text-slate-900"

  /**
   * The week the card is showing, as "Sep 6 - 12".
   *
   * Seven rows headed by a weekday and a day of the month say which days, and
   * nothing at all about which week -- and the week the card shows is the week
   * the build ran in, which is not always the week the reader is in. Named as a
   * range rather than as a month, because a week is only inside one month five
   * times out of six.
   *
   * `timeZone: "UTC"` for the reason every date on this site is handled in it:
   * these are `YYYY-MM-DD` strings, and formatting one in the reader's own zone
   * is what slides it a day.
   */
  const dayMonth = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  })
  const on = (date: string) => {
    const [year, month, day] = date.split("-").map(Number)
    return new Date(Date.UTC(year, month - 1, day))
  }
  const span = $derived.by(() => {
    const [first, last] = [week[0], week.at(-1)!]
    return first.date.slice(0, 7) === last.date.slice(0, 7)
      ? `${dayMonth.format(on(first.date))} – ${last.day}`
      : `${dayMonth.format(on(first.date))} – ${dayMonth.format(on(last.date))}`
  })

  // Dashed outline for a sitting the city has published nothing for, exactly as
  // on the calendar: an entry that looked like one carrying an agenda would
  // claim more than the board's schedule says.
  const entryClass = (meeting: WeekEntry) =>
    meeting.expected
      ? "border border-dashed border-slate-400 text-slate-600 hover:bg-slate-100"
      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
</script>

<svelte:head>
  <title>Meetinghouse</title>
  <meta
    name="description"
    content="The City of Haverhill's meeting documents and budget, rearranged so a reader can follow what the city is doing."
  />
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-10 sm:py-14">
  <!--
    The slogan is the only sentence on this page, and it is about finding
    things rather than about what the site thinks of the city. What was here
    before was a paragraph explaining the editorial arrangement -- true, and
    the sort of thing a reader wants on a second visit rather than a first.
  -->
  <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Meetinghouse</h1>
  <p class="mt-3 text-xl text-slate-600 sm:text-2xl">
    Haverhill's public information, close at hand.
  </p>

  <!--
    Side by side, and tall enough that each half is a picture rather than a
    strip. Stacked below `lg`, where two of these would be half a card wide
    apiece and neither drawing survives that.

    The whole card is the link, by way of the heading's own `::after` covering
    it -- which is what lets the things inside it be links too. A card wrapped
    in an `<a>` could hold no meeting link at all, and a week of the calendar
    whose sittings cannot be opened is a picture of a calendar rather than a
    way into one.
  -->
  <nav class="mt-10 grid gap-5 lg:grid-cols-2" aria-label="The calendar and the current project">
    <div
      class="relative flex min-h-[30rem] flex-col rounded-xl border border-slate-200 p-5 transition-colors focus-within:border-slate-400 hover:border-slate-300 hover:bg-slate-50 sm:p-6"
    >
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-lg font-semibold text-slate-900">
          <a class="after:absolute after:inset-0 after:content-['']" href={Router.calendar()}>
            Meeting calendar
          </a>
        </h2>
        <p class="m-0 text-xs whitespace-nowrap text-slate-500">{span}</p>
      </div>

      <!--
        The week we are in, a day to a row: today's row ringed, the days behind
        us greyed the way the calendar greys a day outside the month it is
        showing, and each sitting the chip the calendar draws it as.

        Rows and not a Sunday-to-Saturday rail, which is how the calendar
        itself is laid out and was the first shape of this. A day cell in a rail
        is a seventh of half a page -- ninety pixels on a laptop, fifty on a
        phone -- and "Planning Board" arrives in one as "P…". Down the page each
        day has the width of the card to name what is on it, and seven rows fill
        the height a rail left empty.

        A mostly empty week is the ordinary case and is drawn as one. Haverhill's
        boards sit once or twice a week, and the point of showing the week is
        that a reader can see which days those are.
      -->
      <ul class="not-prose mt-4 flex flex-1 flex-col gap-1">
        {#each week as day (day.date)}
          <li
            class="flex flex-1 items-center gap-3 rounded-md border border-slate-200 px-2 py-1.5 {day.date <
            data.today
              ? 'bg-slate-50'
              : 'bg-white'} {day.isToday ? 'ring-2 ring-amber-400 ring-inset' : ''}"
          >
            <p class="m-0 flex w-14 shrink-0 items-baseline gap-1.5">
              <span class="text-[10px] tracking-wide text-slate-500 uppercase">{day.weekday}</span>
              <span class="text-sm font-medium {day.isToday ? 'text-slate-900' : 'text-slate-500'}">
                {day.day}
              </span>
            </p>

            <ul class="flex min-w-0 flex-1 flex-wrap gap-1">
              {#each day.meetings as meeting (meeting.id)}
                <li class="min-w-0">
                  <!-- `relative`, so it sits above the heading's `::after` and
                       stays clickable inside a card that is itself one big
                       link. -->
                  <a
                    href={Router.meeting(meeting.id)}
                    class="relative flex items-center gap-1 rounded px-1.5 py-0.5 text-xs leading-tight transition {entryClass(
                      meeting,
                    )}"
                  >
                    <!-- The hour ahead of the name, exactly as the calendar's
                         own chips lead with it: this card is a week of that
                         page, and the two reading the same way is the point of
                         sharing its colours. Only a notice or a published
                         schedule states one, so the week ahead of today mostly
                         carries an hour and the days behind it mostly do not. -->
                    {#if meeting.time}
                      <span class="shrink-0 tabular-nums">{meeting.time}</span>
                    {/if}
                    <span class="min-w-0 truncate">{meeting.board}</span>
                    <span class="flex shrink-0 gap-0.5" aria-hidden="true">
                      {#each meeting.kinds as kind, at (at)}
                        <span class="rounded-sm px-1 text-[10px] font-semibold {kindClass(kind)}">
                          {kind === "agenda" ? "A" : kind === "minutes" ? "M" : "·"}
                        </span>
                      {/each}
                    </span>
                    {#if meeting.expected}
                      <span class="sr-only">, expected; no agenda published yet</span>
                    {:else}
                      <span class="sr-only">
                        , {meeting.kinds.length} document{meeting.kinds.length === 1 ? "" : "s"}
                      </span>
                    {/if}
                  </a>
                </li>
              {/each}
            </ul>
          </li>
        {/each}
      </ul>
    </div>

    <!--
      The project the city is in the middle of, beside the calendar: today that
      is the election, drawn as its map. It took the budget's place -- a budget
      book is a project too, and reached now from the bar's Projects menu along
      with the rest of them.
    -->
    <ElectionCard />
  </nav>
</div>

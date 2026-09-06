<!--
  "Add to calendar" for one sitting, in the meeting header.

  Two ways in, because no one format reaches every reader: a Google Calendar
  link, which is a plain `<a>` and works with no script, and a `.ics` download
  for Apple Calendar and Outlook, built in the browser on click so its
  timestamp says when the file was made. Both describe the one `CalendarEvent`
  from `$lib/ics`, so they cannot drift apart.

  The panel is dismissed by Escape or a click outside, the two things a reader
  tries without being told -- the same as `Note.svelte`. It is not a `role=menu`
  widget: it is two links, reached with Tab, the way the year menu in the header
  is.
-->
<script lang="ts">
  import Icon from "@iconify/svelte/dist/OfflineIcon.svelte"
  import calendarAdd from "@iconify-icons/material-symbols/calendar-add-on-outline-rounded"
  import { Router } from "$lib/router"
  import type { Meeting, MeetingDetails } from "$lib/calendar"
  import { eventForMeeting, icsStamp, toIcs } from "$lib/ics"

  let { meeting, details }: { meeting: Meeting; details?: MeetingDetails } = $props()

  const event = $derived(eventForMeeting(meeting, details))

  const googleUrl = $derived(
    Router.googleCalendar({
      title: event.title,
      start: event.start,
      end: event.end,
      details: event.description,
      location: event.location,
      allDay: event.allDay,
    }),
  )

  let open = $state(false)
  let button = $state<HTMLButtonElement>()
  let panel = $state<HTMLDivElement>()
  const id = $props.id()

  function close(refocus = false) {
    open = false
    if (refocus) button?.focus()
  }

  function onkeydown(e: KeyboardEvent) {
    if (open && e.key === "Escape") close(true)
  }

  function onpointerdown(e: PointerEvent) {
    const target = e.target as Node
    if (open && !button?.contains(target) && !panel?.contains(target)) close()
  }

  function downloadIcs() {
    const blob = new Blob([toIcs(event, icsStamp(new Date()))], {
      type: "text/calendar;charset=utf-8",
    })
    const href = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = href
    a.download = `${meeting.id}.ics`
    a.click()
    URL.revokeObjectURL(href)
    close()
  }
</script>

<svelte:window {onkeydown} {onpointerdown} />

<div class="relative">
  <button
    bind:this={button}
    type="button"
    aria-expanded={open}
    aria-controls={id}
    onclick={() => (open = !open)}
    class="inline-flex cursor-pointer items-center gap-1 text-sm text-slate-600 underline hover:text-slate-900"
  >
    <Icon icon={calendarAdd} width="16" height="16" aria-hidden="true" />
    Add to calendar
  </button>

  <div
    bind:this={panel}
    {id}
    hidden={!open}
    class="absolute left-0 z-20 mt-1 flex w-max flex-col rounded-lg border border-slate-200 bg-white p-1 text-sm shadow-lg"
  >
    <a
      href={googleUrl}
      target="_blank"
      rel="external noopener noreferrer"
      onclick={() => close()}
      class="rounded px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
    >
      Google Calendar<span class="sr-only">, opens in a new tab</span>
    </a>
    <button
      type="button"
      onclick={downloadIcs}
      class="cursor-pointer rounded px-2 py-1 text-left text-slate-700 hover:bg-slate-50 hover:text-slate-900"
    >
      Download <code>.ics</code> <span class="text-slate-400">— Apple, Outlook</span>
    </button>
  </div>
</div>

<script lang="ts">
  // One meeting as the calendar draws it: the stated hour, the board, and a
  // letter per document, coloured by kind. The month grid carries its own copy
  // of this markup; the week and day views share this one.
  import { statedTime, type Meeting, type MeetingKind } from "$lib/calendar"
  import { Router } from "$lib/router"

  let { meeting }: { meeting: Meeting } = $props()

  const kindClass = (kind: MeetingKind) =>
    kind === "agenda"
      ? "bg-sky-100 text-sky-900"
      : kind === "minutes"
        ? "bg-emerald-100 text-emerald-900"
        : kind === "recording"
          ? "bg-violet-100 text-violet-900"
          : "bg-slate-100 text-slate-900"

  const letter = (kind: MeetingKind) =>
    kind === "agenda" ? "A" : kind === "minutes" ? "M" : kind === "recording" ? "▶" : "·"

  // Dashed outline for a sitting the city has published nothing for, as on the
  // month grid.
  const entryClass = $derived(
    meeting.scheduled
      ? "border border-dashed border-slate-500 text-slate-600 hover:bg-slate-100"
      : "bg-slate-100 text-slate-900 hover:bg-slate-200",
  )
</script>

<a
  href={Router.meeting(meeting.id)}
  class="flex items-center gap-1.5 rounded px-2 py-1 text-sm leading-tight transition {entryClass}"
>
  {#if statedTime(meeting)}
    <span class="shrink-0 tabular-nums">{statedTime(meeting)}</span>
  {/if}
  <span class="min-w-0 truncate">{meeting.board}</span>
  <span class="flex shrink-0 gap-0.5" aria-hidden="true">
    {#each meeting.documents as doc, i (i)}
      <span class="rounded-sm px-1 text-[10px] font-semibold {kindClass(doc.kind)}">
        {letter(doc.kind)}
      </span>
    {/each}
  </span>
  {#if meeting.scheduled}
    <span class="sr-only">, expected; no agenda published yet</span>
  {:else}
    <span class="sr-only">
      , {meeting.documents.length} document{meeting.documents.length === 1 ? "" : "s"}
    </span>
  {/if}
</a>

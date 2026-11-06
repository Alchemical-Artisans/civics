<!--
  The rail a timeline is drawn on: a left border, a dot per entry, and each
  entry's date over what happened on it.

  It was `ProjectTimeline`'s own markup until a second thing wanted the same
  drawing. A project's timeline is the agenda items that bear on one
  undertaking; a continued public hearing has a timeline too, and it is the
  back of the Council's own document -- the vote setting the hearing, then one
  line per continuance. The two differ in where their entries come from and in
  nothing else, so the rail is one component and `ProjectTimeline` keeps the
  fold, the project registry and today's date to itself.

  An entry's `id` is the fragment it answers to, and `:target` rings it, so a
  page can link to one entry of a timeline on another page. No script: the
  highlight is CSS and it is there in the served HTML.
-->
<script lang="ts">
  import { formatLongDate } from "$lib/calendar"
  import type { TimelineEntry } from "$lib/timeline"

  /**
   * `class` is the whole of the `<ol>`'s classes rather than an addition to a
   * base, because the one thing callers vary is the rail's own colour and
   * Tailwind settles two `border-*` utilities by the order they land in the
   * stylesheet, not the order they are written in the attribute.
   */
  let {
    entries,
    class: className = "mt-3 space-y-3 border-l-2 border-slate-200 pl-4 text-sm",
  }: { entries: TimelineEntry[]; class?: string } = $props()

  const key = (entry: TimelineEntry) => entry.id ?? `${entry.date ?? ""}-${entry.title}`

  /**
   * A timeline entry's link leaves the site or it does not, and the two want
   * different treatment -- outbound gets a new tab on this site's usual
   * terms. Read off the href rather than passed in: every internal URL here
   * is built by `Router` and so is a path, which makes an absolute one
   * external by construction and leaves nothing for a caller to forget.
   * `/drought`'s steps are HC Media recordings; a project's are write-ups
   * on this site.
   */
  const away = (href: string) => /^https?:/.test(href)
</script>

<ol class={className}>
  {#each entries as entry (key(entry))}
    <li
      id={entry.id}
      class="relative scroll-mt-24 rounded-md px-2 py-1.5 target:bg-amber-50 target:ring-2 target:ring-amber-400"
    >
      <span
        aria-hidden="true"
        class="absolute top-3 -left-[1.4rem] h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-400"
      ></span>
      <!-- No date line at all for a step nobody has dated yet: an empty
           slot above the title reads as a missing value, where leaving it
           out reads as what it is. -->
      {#if entry.dateLabel || entry.date}
        <p class="text-xs text-slate-500">
          {entry.dateLabel ?? formatLongDate(entry.date!)}{#if entry.through}
            &ndash; {formatLongDate(entry.through)}{/if}
        </p>
      {/if}
      {#if entry.eyebrow}
        <p class="text-slate-500">{entry.eyebrow}</p>
      {/if}
      {#if entry.href}
        <a
          class="font-medium text-slate-900 underline hover:text-sky-800"
          href={entry.href}
          target={away(entry.href) ? "_blank" : null}
          rel={away(entry.href) ? "external noopener noreferrer" : null}>{entry.title}</a
        >
      {:else}
        <p class="text-slate-800">{entry.title}</p>
      {/if}
      {#if entry.note}
        <p class="text-xs text-slate-500">{entry.note}</p>
      {/if}
    </li>
  {/each}
</ol>

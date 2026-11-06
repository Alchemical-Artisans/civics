<!--
  A project's timeline: every agenda item and date on it, in order.

  It was the election's own, inside that project's layout, until a second
  project needed the same list; every project page draws it, so it is one
  component rather than a copy per project.

  **What is left here is the registry and nothing else.** The fold, the
  heading, today's date and the fragment handling were all in this file until
  `/drought` wanted a timeline without being a project -- an authored topic
  page, not an undertaking in `PROJECTS` -- and they are `FoldedTimeline`
  now. So the rail is `Timeline`, the fold is `FoldedTimeline`, and this maps
  a `Project` onto the list both of them read.

  An agenda item that belongs to a project links back with its own entry's id
  as the fragment, which is why `entryId` is what sets `id` here: that is the
  name the fold opens for and `:target` rings.
-->
<script lang="ts">
  import FoldedTimeline from "$lib/FoldedTimeline.svelte"
  import { entryDate, entryId, timeline, type Entry, type Project } from "$lib/projects"
  import type { TimelineEntry } from "$lib/timeline"
  import { Router } from "$lib/router"

  let {
    project,
    /** The build's date, from the page's server load. */
    today,
    /**
     * Whether what is behind the reader is folded away. A project only a
     * step or two old has no record long enough to be in the way of what is
     * ahead, and folding its first step leaves its timeline looking emptier
     * than it is, so such a project turns this off and lists every step.
     */
    fold = true,
    class: className = "",
  }: { project: Project; today: string; fold?: boolean; class?: string } = $props()

  /**
   * A project's entries as rail entries. An agenda item names its board and
   * the agenda's own number above its title and links to its write-up; a date
   * the documents set is a line of text, since nobody met.
   */
  const rows = (list: Entry[]): TimelineEntry[] =>
    list.map((entry) => ({
      id: entryId(entry),
      date: entryDate(entry),
      through: entry.kind === "date" ? entry.through : undefined,
      eyebrow:
        entry.kind === "item"
          ? entry.number
            ? `${entry.board}, item ${entry.number}`
            : entry.board
          : undefined,
      title: entry.title,
      href: entry.kind === "item" ? Router.meetingItem(entry.meeting, entry.item) : undefined,
    }))

  const entries = $derived(rows(timeline(project)))
</script>

<FoldedTimeline {entries} {today} {fold} class={className} />

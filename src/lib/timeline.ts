/**
 * One entry on a timeline rail, drawn by `Timeline.svelte`.
 *
 * The type is here rather than in the component because a `<script lang="ts">`
 * block is the instance script and exports nothing a sibling module can
 * import; the two things that build these lists -- a project's registry and a
 * hearing's own record -- both want to name the shape they are building.
 */
export interface TimelineEntry {
  /** The fragment this entry answers to, where anything links to one. */
  id?: string
  /** `YYYY-MM-DD`. */
  date: string
  /** The last day of a run of days, like early voting's. */
  through?: string
  /** A line above the title: the board and the agenda's number for an item. */
  eyebrow?: string
  title: string
  /** Where the title goes, where it goes anywhere. */
  href?: string
  /** A line under the title: the vote the Council recorded, say. */
  note?: string
}

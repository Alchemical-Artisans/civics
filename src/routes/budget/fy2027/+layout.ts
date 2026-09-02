import type { LayoutLoad } from "./$types"
import { CALENDAR } from "./budget-calendar"
import { AGENDA } from "./council-orders"

/**
 * The book's own process, which every page of the book sits under.
 *
 * This was the front page's until the documents moved onto it. The calendar is
 * where the city's files hang now -- the book off the step that produced it,
 * the Council's appropriation orders off the run of hearings their agenda falls
 * inside -- and a reader on a section wants those as much as a reader on the
 * front page does. Loading it here puts the footer under every page of the
 * book rather than under one of them, which is also why the bar at the top no
 * longer carries a source link: one presentation, everywhere, saying where in
 * the year each document came from.
 */
export const load: LayoutLoad = () => ({
  calendar: CALENDAR,

  /**
   * The day this page was built, so the timeline's today mark is in the HTML
   * that is served rather than appearing when a script runs. The browser
   * replaces it with the reader's own date on mount; this is what a reader
   * without a script sees, and it is never more stale than the last deploy.
   */
  asOf: new Date().toISOString().slice(0, 10),

  /**
   * The agenda the Council's appropriation orders are on. It hangs off the run
   * of public hearings its meeting of 2 June falls inside; the spending page
   * quotes the orders themselves.
   */
  order: AGENDA.file,
})

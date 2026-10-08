import { error } from "@sveltejs/kit"
import type { EntryGenerator, PageServerLoad } from "./$types"
import { calendarWeek, weekList } from "$lib/meetings"

/** Every Sunday the calendar's span touches; a week's route is its Sunday. */
export const entries: EntryGenerator = () => weekList().map((start) => ({ start }))

/**
 * A server load for the reason the month page's is: the whole record stays out
 * of the browser's JavaScript, and client-side Prev/Next fetch this page's own
 * small `__data.json`.
 */
export const load: PageServerLoad = ({ params }) => {
  const data = calendarWeek(params.start)
  if (!data) error(404, `No such week: ${params.start}`)
  return data
}

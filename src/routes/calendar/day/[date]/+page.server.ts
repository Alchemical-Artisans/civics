import { error } from "@sveltejs/kit"
import type { EntryGenerator, PageServerLoad } from "./$types"
import { calendarDay, dayList } from "$lib/meetings"

/** Every day the month pages cover, so any cell on any of them has somewhere to go. */
export const entries: EntryGenerator = () => dayList().map((date) => ({ date }))

export const load: PageServerLoad = ({ params }) => {
  const data = calendarDay(params.date)
  if (!data) error(404, `No such day: ${params.date}`)
  return data
}

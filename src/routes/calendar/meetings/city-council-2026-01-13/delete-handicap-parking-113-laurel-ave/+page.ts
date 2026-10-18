import type { PageLoad } from "./$types"

/**
 * As with 14.1: the printed title is the chapter and the schedule, so the
 * title names what this one does and where. The minutes number it 14.2 and
 * the agenda the same.
 */
export const load: PageLoad = () => ({
  item: { title: "Delete Handicap Parking, 113 Laurel Ave" },
})

import type { PageLoad } from "./$types"

/**
 * The ordinance's printed title names the chapter and the schedule, not the
 * street, and the sitting has two of them; the title names what this one
 * does and where. The agenda numbers it 14.1 and the minutes 12.3.
 */
export const load: PageLoad = () => ({
  item: { title: "Add Handicap Parking, 60 Franklin St" },
})

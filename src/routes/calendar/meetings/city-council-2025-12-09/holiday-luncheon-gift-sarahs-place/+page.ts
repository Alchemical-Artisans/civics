import type { PageLoad } from "./$types"

/**
 * The agenda line is a full sentence with no name of its own; the title names
 * the gift and the giver. The packet also holds Sarah's Place's payment slip
 * and cheque, left out of the excerpts since they carry account and routing
 * numbers, as on `city-council-2026-11-17/holiday-luncheon-donations`.
 */
export const load: PageLoad = () => ({
  item: { title: "Gift for the Holiday Luncheon, Sarah’s Place" },
})

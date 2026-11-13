import type { PageLoad } from "./$types"

/**
 * Five donors and one department, which the agenda prints as a table. The
 * packet also holds the donors' cheques, left out of the excerpts since they
 * carry account and routing numbers.
 */
export const load: PageLoad = () => ({
  item: { title: "Holiday Luncheon Donations, Council on Aging" },
})

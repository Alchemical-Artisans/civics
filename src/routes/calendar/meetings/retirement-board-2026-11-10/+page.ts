import type { PageLoad } from "./$types"

/**
 * The announcement states the hour and that the sitting is "in person and
 * online", and nothing else -- no room and no join link, which the board's own
 * agenda carries when it is posted. So the header gets the hour alone.
 */
export const load: PageLoad = () => ({
  details: {
    time: "9:00AM",
  },
})

import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "9:30 A.M.",
    location: {
      name: "Whittier Board Room, Haverhill Public Library",
      // The room geocodes to nothing; hand the map the library's address.
      mapQuery: "99 Main Street, Haverhill, MA 01830",
    },
  },
})

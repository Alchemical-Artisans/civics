import type { PageLoad } from "./$types"

/**
 * When and where the sitting is, read off the two lines under the agenda's own
 * title. The layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    // The hour as the agenda prints it, lower case and without minutes.
    time: "6 pm",
    location: {
      // The agenda's own line, less the "At" that opens it.
      name: "City Hall, 3rd Floor, Room 300",
      // A room number geocodes to nothing; hand the map City Hall's address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

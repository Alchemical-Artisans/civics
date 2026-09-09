import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 P.M.",
    location: {
      name: "Room 202, Haverhill City Hall",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    notice: [
      "The Haverhill Planning Board will hold its public meeting on Wednesday, September 9, 2026, at 7:00 P.M. in Room 202, Haverhill City Hall, to hear the petition(s) listed below. (See files in the Planning Dept. for further information.)",
    ],
  },
})

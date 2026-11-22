import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's notice. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * No `members`: the city's Haverhill Historic Commission page names that
 * commission's seven members and says nothing of this district commission, and
 * no other page the city or the commission publishes names who sits on it.
 */
export const load: PageLoad = () => ({
  details: {
    time: "5:00 P.M.",
    location: {
      name: "Haverhill City Hall, Room #308",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

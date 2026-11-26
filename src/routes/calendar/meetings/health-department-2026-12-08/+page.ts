import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the board's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * No `members`: the city publishes no page naming the Board of Health's
 * members -- neither its Public Health page nor the board-of-health
 * regulations page, and the boards-and-commissions index has no entry for it
 * -- and a roster pieced together from appointment orders would be ours, not a
 * source's.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7 P.M.",
    location: {
      name: "4 SUMMER ST. - ROOM 301",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

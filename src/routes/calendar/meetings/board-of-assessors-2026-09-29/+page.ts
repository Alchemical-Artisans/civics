import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's notice. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "10:00 AM",
    location: {
      name: "Haverhill City Hall, Assessor's Office, RM. 115",
      // The room geocodes to nothing; hand the map the street address, which
      // the notice prints in its own footer.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    // The board's own caveat on its list, not the boilerplate every agenda in
    // the city carries: it is this board saying the Chair's anticipated topics
    // are neither a promise nor a limit, which is a fact about how this list
    // should be read.
    notice: [
      "**These agenda items are those reasonably anticipated by the Chair which may be discussed at the meeting. Not all items listed may in fact be discussed and other items not listed may also be brought up for discussion to the extent permitted by law. The Board reserves the right to consider items on the agenda out of order.",
    ],
  },
})

import type { PageLoad } from "./$types"

/**
 * When and where, from the notice's own sentence: "a meeting for Wednesday
 * November 4, 2026, at 6:00 PM in Room 301 City Hall". That sentence also
 * recites the day, which the header already shows, so it is not transcribed
 * onto the page; the hour and the room are these fields instead. See
 * $lib/calendar's MeetingDetails.
 *
 * No `members`: the Rating Board sets the water and wastewater rates and the
 * city publishes no roster of it -- not on the boards, committees and
 * commissions listing, which does not name the body at all, and not on the
 * Water/Wastewater Services page, which covers abatements and meter tests and
 * never says who sits. A roster guessed from the offices an ordinance names
 * would not be one.
 *
 * The notice is signed by the Water/Wastewater Billing and Collection Manager
 * and addressed to the City Clerk, which is the Open Meeting Law filing rather
 * than anything about this sitting, so none of it is on the page either.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 PM",
    location: {
      // As the notice prints it. The room geocodes to nothing; hand the map
      // City Hall's street address.
      name: "Room 301 City Hall",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

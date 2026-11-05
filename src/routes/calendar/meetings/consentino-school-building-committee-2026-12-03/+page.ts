import type { PageLoad } from "./$types"

/**
 * The announcement states the hour and the room and nothing else -- no join
 * link, which the committee's own filing carries when it is posted, and which
 * has been a different Google Meet address at each of its last three sittings.
 */
export const load: PageLoad = () => ({
  details: {
    time: "9:00 AM",
    location: {
      // As the announcement prints it. The committee's own agendas call the
      // same place "Consentino Middle School, Conference Room 001C".
      name: "New Consentino Building Conference Room 001C",
      // The room geocodes to nothing; hand the map the street address, which
      // the committee's covering letters print.
      mapQuery: "685 Washington Street, Haverhill, MA 01832",
    },
  },
})

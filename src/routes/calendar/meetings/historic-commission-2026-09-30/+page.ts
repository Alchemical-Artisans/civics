import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's notice. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * The commission is sitting at the museum that is item b.i on its own agenda,
 * not at the Room 309 office its letterhead gives.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 P.M.",
    location: {
      name: "Buttonwoods Museum- Haverhill Historic Society, 240 Water Street",
      // The museum geocodes to nothing; hand the map the street address.
      mapQuery: "240 Water Street, Haverhill, MA 01830",
    },
  },
})

import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the city's Notice of Meeting. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 PM",
    location: {
      name: "Dr. Albert B. Consentino School, 685 Washington St, Haverhill, MA 01832",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "685 Washington St, Haverhill, MA 01832",
    },
  },
})

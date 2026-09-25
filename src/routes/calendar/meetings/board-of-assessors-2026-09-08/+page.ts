import type { PageLoad } from "./$types"

/**
 * When and where the meeting was, read off the head of the city's minutes. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "10:00AM",
    location: {
      name: "Assessors Office, City Hall, Rm 115",
      // The room geocodes to nothing; hand the map the street address, which
      // the minutes print in their own footer.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

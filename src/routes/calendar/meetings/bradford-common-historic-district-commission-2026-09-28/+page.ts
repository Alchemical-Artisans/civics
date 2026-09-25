import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's notice. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * The commission is meeting at the building that is item 2 on its own agenda,
 * not at City Hall.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 P.M.",
    location: {
      name: "Bradford Christian Academy, Hasseltine Hall, First Floor Conference Room",
      // The hall geocodes to nothing; hand the map the street address.
      mapQuery: "320 South Main Street, Bradford, MA 01835",
    },
  },
})

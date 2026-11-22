import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * No `members`: the minutes print a roll call, but the only roster the city
 * publishes is today's Council, which is not the Council of 2016, and a roll
 * call is not a roster. The roll call stays in the minutes below as printed.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    location: {
      name: "City Council Chambers, Room 202",
      // The agenda prints no street; this is Haverhill City Hall, and the room
      // is dropped because it geocodes to nothing.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

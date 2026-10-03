import type { PageLoad } from "./$types"

/**
 * When and where the meeting is. The layout renders these into the page header;
 * see $lib/calendar's MeetingDetails for why none of it can come from the
 * scrape.
 */
export const load: PageLoad = () => ({
  details: {
    // The agenda's own sentence, which gives an end as well as a start.
    time: "5:30pm to 6:30pm",
    location: {
      // The agenda names only the room. The building is the city's own notice
      // for this sitting, whose Location block reads "Haverhill City Hall, 4
      // Summer Street".
      name: "Haverhill City Hall, Room #301",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

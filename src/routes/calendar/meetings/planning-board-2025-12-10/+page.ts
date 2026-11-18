import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * agenda's opening sentence recites the day, the hour and the room, which the
 * header already states, so only the closing parenthesis is kept.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 P.M.",
    location: {
      name: "Room 201, Haverhill City Hall",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    notice: ["(See files in the Planning Dept. for further information.)"],
  },
})

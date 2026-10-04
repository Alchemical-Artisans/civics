import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the Vice Chairperson's Open Meeting
 * Law posting to the City Clerk -- the same one-page letter this board's
 * 8 October sitting was written up from, with the same three-item agenda set
 * inside it. Neither the letter's opening paragraph nor the signature under it
 * is transcribed: the paragraph says in prose what the date line and the
 * location link say above it, and the one thing it adds, that the subcommittee
 * meets jointly with the bargaining-unit members and their HEA representatives,
 * the agenda's own item 2 already states. The closing paragraph on the 2027
 * sunset of the remote-meeting act is the same sentence on every board's agenda
 * in the city and belongs to none of them.
 *
 * No `remote`: the letter calls the session hybrid and prints no way to join
 * it, so there is nothing to put in the slot.
 */
export const load: PageLoad = () => ({
  details: {
    // The letter gives an end as well as a start; both are the city's.
    time: "5:00 pm-6:45 pm",
    location: {
      name: "City Hall, School Administration Office (Room 104), 4 Summer Street, Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

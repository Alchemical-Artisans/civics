import type { PageLoad } from "./$types"

/**
 * Read off the head of the clerk's agenda (the notice on the events calendar
 * is the same page). The layout renders these into the page header.
 */
export const load: PageLoad = () => ({
  details: {
    time: "3:00 PM",
    location: {
      name: "Room 118, 4 Summer St, Haverhill, MA 01830",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    // The city's Board of Registrars page, which says the board "consists of
    // the City Clerk and 3 other people", and names exactly those four, so no
    // `partial`. Names as the page prints them, party letter as the role; the
    // agenda's letterhead lists the same four.
    members: {
      source: {
        title: "the city's Board of Registrars page",
        url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/board-of-registrars/",
      },
      roster: [
        { name: "Joseph Leblanc", role: "D" },
        { name: "Mary Ellen Daly O'Brien", role: "D" },
        { name: "Marc Harvey", role: "R" },
        { name: "Kaitlin M. Wright", role: "City Clerk" },
      ],
    },
  },
})

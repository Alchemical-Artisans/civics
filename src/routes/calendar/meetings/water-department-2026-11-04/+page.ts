import type { PageLoad } from "./$types"

/**
 * When and where, from the agenda's own third heading line: "6:00 PM Room 301".
 * The layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * `wide` because the page is one table of six columns and thirty-six rows,
 * and a 48rem reading column has nowhere to put an account number beside an
 * address and a name.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 PM",
    location: {
      // The agenda names only the room. Room 301 is City Hall's — the
      // Conservation Commission's own notice for the same room spells it
      // "4 Summer Street, City Hall Room 301" — but this document does not
      // say so, so the name stays as printed and only the map is told the
      // building.
      name: "Room 301",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
  wide: true,
})

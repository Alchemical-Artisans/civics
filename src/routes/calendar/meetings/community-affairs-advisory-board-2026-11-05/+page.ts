import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the notice's own second paragraph.
 * The layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * No `members`. Nothing the city or the board publishes names who sits on the
 * CAAB: it is absent from the city's Boards, Committees and Commissions
 * listing, the Community Development page that administers it names only the
 * department's own staff, and the 2025-2029 Consolidated Plan cites the board's
 * rankings without listing it. Local reporting has named members, but a roster
 * out of a news story is not a published roster.
 */
export const load: PageLoad = () => ({
  details: {
    // The notice's own hour, lower case with the stops it prints.
    time: "6:00 p.m.",
    location: {
      // The notice's own words, less the street address that follows them.
      name: "Room 308, City Hall",
      // A room number geocodes to nothing; hand the map the street address the
      // notice prints after it.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

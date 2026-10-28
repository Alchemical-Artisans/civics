import type { PageLoad } from "./$types"

/**
 * When and where the meeting was, read off the head of the city's notice, and
 * who sat at it, off the minutes the clerk published afterwards. The layout
 * renders these into the page header; see $lib/calendar's MeetingDetails for
 * why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "10:00 AM",
    location: {
      name: "Haverhill City Hall, Assessor's Office, RM. 115",
      // The room geocodes to nothing; hand the map the street address, which
      // the notice prints in its own footer.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    // The board's own caveat on its list, not the boilerplate every agenda in
    // the city carries: it is this board saying the Chair's anticipated topics
    // are neither a promise nor a limit, which is a fact about how this list
    // should be read.
    notice: [
      "**These agenda items are those reasonably anticipated by the Chair which may be discussed at the meeting. Not all items listed may in fact be discussed and other items not listed may also be brought up for discussion to the extent permitted by law. The Board reserves the right to consider items on the agenda out of order.",
    ],
    // The "Board of Assessors" row of the department table on the city's
    // Assessors page, which prints the three names and no seats beside them --
    // the Assessor and Assistant Assessor rows above it are the office's staff,
    // not the board, though the city's own Assessor sits on it as well. Three
    // is the whole of it, so no `partial`: the same three the September 8
    // minutes take a roll call of.
    members: {
      source: {
        title: "the city's Assessors page",
        url: "https://www.haverhillma.gov/government/assessors/",
      },
      roster: [{ name: "Stephen Gullo" }, { name: "Roy Wright" }, { name: "Chris M. Loughnane" }],
      // The minutes' own item 2, names and seats as it prints them, typo
      // included. Item 8's later roll of the executive session says Roy Wright
      // "joined telephonically"; item 2's roll of the open session says only
      // that all three were present, so that is what this records -- reading
      // the exec session's line back onto the open one would be a guess about a
      // roll call the minutes took separately.
      present: [
        "Chris Loughnane-Chariman",
        "Stephen Gullo-Board Member",
        "Roy Wright-Board Member",
      ],
    },
  },
})

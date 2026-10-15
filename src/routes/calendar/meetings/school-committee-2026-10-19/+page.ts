import type { PageLoad } from "./$types"

/**
 * When, where and how to watch, read off the Chairperson's Open Meeting Law
 * posting to the City Clerk. The layout renders these into the page header;
 * see $lib/calendar's MeetingDetails for why none of it can come from the
 * scrape.
 *
 * The document is one page: a letter to the Clerk with the four-item agenda
 * set inside it, the same shape as this subcommittee's 13 October sitting,
 * which item 3 here continues. Neither the letter's opening paragraph nor the
 * signature under it is transcribed -- the paragraph says in prose what the
 * date line, the location link and the "Remote Access" link say above it, and
 * the purpose it adds, that the subcommittee is preparing the
 * superintendent's goals for the full School Committee, is the subcommittee's
 * own name over items 2 and 3. The closing paragraph on the 2027 sunset of
 * the remote-meeting act is the same sentence on every board's agenda in the
 * city and belongs to none of them.
 */
export const load: PageLoad = () => ({
  details: {
    // The letter gives an end as well as a start; both are the city's.
    time: "6:00 pm -8:00 pm",
    location: {
      name: "City Hall, 4 Summer Street, (Superintendent's Conference Room - Room 206), Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      // Read off the scan: the letter prints the Meet link as text, and the
      // PDF carries no link annotation to check it against. It is not the
      // link the 13 October sitting printed -- the subcommittee opened a new
      // one for this meeting.
      url: "https://meet.google.com/wur-ssip-wph",
      // A condition this body set on joining, not boilerplate -- it sits in
      // the letter's own sentence about the link, so it belongs beside it.
      how: ["No AI notetakers allowed in the meeting."],
    },
  },
})

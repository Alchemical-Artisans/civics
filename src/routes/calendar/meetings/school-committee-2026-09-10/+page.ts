import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * The document is three pages: the Vice Chairperson's Open Meeting Law posting
 * to the City Clerk, and then the agenda itself, whose own preamble repeats
 * most of the letter. Neither is transcribed into the write-up -- both are
 * about the sitting rather than items on it -- and the header takes them apart
 * by what a reader does with each: when and where above, how to attend
 * remotely behind a disclosure beside it, and the standing Open Meeting Law
 * paragraph behind the information icon.
 *
 * Most of what the letter and the preamble print is not here at all, because
 * it is not about this sitting. "Updated 09.09.26 @ 9:00 am" and the opening
 * paragraph -- the day, the hour, the room -- say in prose what the date line
 * and the location link say above them. Two paragraphs on the 2027 sunset of
 * the remote-meeting act, and the wiretap statement the chair reads at the top
 * of every meeting, are the same text on every board's agenda in the city and
 * belong to none of them. What is left in `notice` is the one paragraph that
 * turns on a choice this agenda's own body made -- to hold the meeting
 * in-person as its official location, with the stream a courtesy that can drop
 * without ending the sitting.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 pm",
    location: {
      name: "Theodore A. Pelosi, Jr. City Council Chambers, City Hall, Room 202, 4 Summer Street, Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    // No `url`: the document prints no join link, because there is not one to
    // print -- the link is emailed to whoever registers. The address it does
    // print for the form, `google.com/forms/d/17Z87UgL`, is an eight-character
    // form id where Google uses forty-odd and does not resolve; the scan
    // carries no link annotation to recover the real one from, so it stays the
    // text the city printed rather than becoming a link that 404s.
    remote: {
      how: [
        "In order to register to participate in public comment (virtual only) during the school committee meeting, please register here at least 6 hours prior to meeting: google.com/forms/d/17Z87UgL. No AI Notetakers allowed in meeting.",
        "A link to the public comment sessions of the meeting will be emailed to you at the address you supply prior to the start of the meeting. In-person public comment will be held in the City Council Chambers.",
      ],
    },
    notice: [
      "This meeting of the Haverhill School Committee will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the School Committee is not required to provide remote access to a meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Thank you.",
    ],
  },
})

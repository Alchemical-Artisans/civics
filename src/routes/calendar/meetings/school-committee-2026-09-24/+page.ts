import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * The document is the Vice Chairperson's Open Meeting Law posting to the City
 * Clerk and then the agenda itself, whose preamble repeats most of the letter,
 * split the same way the 09.10.26 sitting's page splits them: when and where
 * above, how to attend remotely behind a disclosure beside it, and the standing
 * Open Meeting Law paragraph behind the information icon. The day, the hour and
 * the room are the date line and the location link, so the opening paragraph
 * that recites them is not repeated here; the 2027 sunset of the remote-meeting
 * act and the wiretap statement the chair reads at the top of every meeting are
 * the same text on every board's agenda in the city and belong to none of them.
 *
 * The date is the one thing this posting is *for*. The city filed the notice in
 * its events calendar at the Wednesday 09.23.26 slot and then revised it: both
 * the letter and the agenda head say Thursday, September 24, 2026, and the city
 * highlighted that date in yellow to mark what had moved. So the sitting is the
 * 24th -- the day the school department's own "Final for Posting" agenda and
 * portfolio materials are filed under -- and reviews.json carries the
 * correction, since the events calendar never moved the entry itself.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 pm",
    location: {
      name: "Theodore A. Pelosi, Jr. City Council Chambers, City Hall, Room 202, 4 Summer Street, Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    // No `url`, for the reason the 09.10.26 posting gives: the join link is
    // emailed to whoever registers and is not printed, and the address the
    // document does print for the form, `google.com/forms/d/17Z87UgL`, is an
    // eight-character form id where Google uses forty-odd and does not resolve.
    // It stays the text the city printed rather than becoming a link that 404s.
    remote: {
      how: [
        "In order to register to participate in public comment (virtual only) during the school committee meeting, please register here at least 6 hours prior to meeting: google.com/forms/d/17Z87UgL. No AI Notetakers allowed in meeting.",
        "A link to the public comment sessions of the meeting will be emailed to you at the address you supply prior to the start of the meeting. In-person public comment will be held in the City Council Chambers.",
      ],
      // "The meeting will be live-streamed by Haverhill Community Television and
      // broadcast over WHAV" names channel 8 without printing an address; the
      // link says it better than the sentence does.
      stream: "http://haverhillcommunitytv.org/video/channel-8-live-stream",
    },
    notice: [
      "This meeting of the Haverhill School Committee will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the School Committee is not required to provide remote access to a meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Thank you.",
    ],
  },
})

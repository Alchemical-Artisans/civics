import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * The document is three pages: the Vice Chairperson's Open Meeting Law posting
 * to the City Clerk, and then the agenda itself, whose own preamble repeats
 * most of the letter. Both are standing boilerplate about the sitting rather
 * than items on it, so both are here rather than in the write-up; the letter's
 * postal address block is the only part left out, being about the delivery and
 * not about the meeting. There is no `remote` link to give: the join link is
 * emailed to whoever registers, and the registration form is printed as a
 * shortened address the scan does not carry as a link.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 pm",
    location: {
      name: "Theodore A. Pelosi, Jr. City Council Chambers, City Hall, Room 202, 4 Summer Street, Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    notice: [
      "Updated 09.09.26 @ 9:00 am",
      "The Haverhill School Committee will hold a Hybrid Regular Meeting on Thursday, September 10, 2026, from 7:00 pm to 10:00 pm in the Theodore A. Pelosi, Jr., City Council Chambers, 4 Summer Street, Room 202, Haverhill MA 01830.",
      "In order to register to participate in public comment (virtual only) during the school committee meeting, please register here at least 6 hours prior to meeting: google.com/forms/d/17Z87UgL. No AI Notetakers allowed in meeting.",
      "A link to the public comment sessions of the meeting will be emailed to you at the address you supply prior to the start of the meeting. In-person public comment will be held in the City Council Chambers.",
      "The meeting will be live-streamed by Haverhill Community Television and broadcast over WHAV. A full recording will be available on the Haverhill Community Television Website. The agenda is attached.",
      "Sincerely, Thomas Grannemann, PhD, Vice Chairperson",
      "An Act relative to extending certain COVID-19 measures adopted during the state of emergency has been extended to allow for remote meetings and hearings by public bodies through June 30, 2027.",
      "Governor Healey signed legislation that will allow municipalities to continue to use hybrid options for public meetings. The option for remote attendance for public meetings has been extended until June 30, 2027.",
      "In order to register to participate in remote public comment only during the school committee meeting, please register here at least 6 hours prior to the meeting: google.com/forms/d/17Z87UgL. A link to the public comment session of the meeting will be emailed to you at the address you supply at least two hours before the meeting. There will also be in-person public comments, which do not require registration. This meeting will be broadcast over HCTV and WHAV. The full meeting recording will be posted on the HCTV website.",
      "Statement to be read by mayor/chairperson at the beginning of each meeting: those attending tonight's meeting should be aware that the meeting is being audio and video recorded by HCTV, Eagle Tribune and WHAV. Any audience members who wish to record any part of the meeting must inform the Chairperson who will announce the recording. This is to comply with the MA wiretap statute.",
      "This meeting of the Haverhill School Committee will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the School Committee is not required to provide remote access to a meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Thank you.",
    ],
  },
})

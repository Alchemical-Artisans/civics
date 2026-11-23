import type { PageLoad } from "./$types"

/**
 * The amended agenda's header prints the hour and the room, and the standing
 * Open Meeting Law paragraph beneath it. It names no remote join link, so there
 * is no `remote` here: "In-Person/Remote Meeting" in the heading is a title,
 * not an address.
 *
 * The roster is the Council's own letterhead, on the councilors' letter for
 * item 15.1 at page 212 of the agenda file: eleven names, the President and
 * Vice President marked, in its order. The city's councilors page lists
 * today's Council, which is not this one -- President Sullivan and Councilor
 * Hobbs Everett sat on it, Councilor Diodati did not -- so the letterhead the
 * Council was using that week is the better source, and it is the city's own
 * file. The roll call is the minutes', split at its commas and its "and", the
 * honorific left on the name it is printed against: "Present: President
 * Sullivan, Councilors Jordan, McGonagle, Basiliere, Ferreira, Michitson,
 * Toohey and Lewandowski", "Remote: Councilor LePage and Hobbs Everett",
 * "Absent: Councilor Rogers". Every name in it is on the letterhead and every
 * name on the letterhead is in it.
 *
 * No highlights. The 233 Winter Street permit was before the Council once
 * already, on 7 October 2025, but those minutes record only that the hearing
 * was opened and continued at the applicant's attorney's agreement -- one
 * paragraph, no discussion of the project itself -- which is not the "at
 * length" `discussed-before` asks for. The memorandum of agreement is stamped
 * "File 10 Days" and so is never one. Nothing else on the agenda has an
 * earlier sitting, a letter of opposition or an appropriation behind it.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    location: {
      name: "Theodore A. Pelosi, Jr. Council Chambers, 4 Summer st, Room 202",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    members: {
      source: {
        title: "the Council's letterhead, in this sitting's agenda packet",
        url: "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/pk3daapa/comp-agenda-dec-9-2025.pdf#page=212",
      },
      roster: [
        { name: "Thomas J. Sullivan", role: "President" },
        { name: "Timothy J. Jordan", role: "Vice President" },
        { name: "John A. Michitson" },
        { name: "Colin F. LePage" },
        { name: "Melissa J. Lewandowski" },
        { name: "Catherine P. Rogers" },
        { name: "Shaun P. Toohey" },
        { name: "Michael S. McGonagle" },
        { name: "Katrina Hobbs Everett" },
        { name: "Devan Ferreira" },
        { name: "Ralph T. Basiliere" },
      ],
      present: [
        "President Sullivan",
        "Councilors Jordan",
        "McGonagle",
        "Basiliere",
        "Ferreira",
        "Michitson",
        "Toohey",
        "Lewandowski",
      ],
      remote: ["Councilor LePage", "Hobbs Everett"],
      absent: ["Councilor Rogers"],
    },
    notice: [
      "This meeting of Haverhill City Council will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the City Council is not required to provide remote access to the meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Those attending tonight’s meeting should be aware that the meeting is being audio and video recorded by HCTV, The Eagle Tribune, and WHAV. Any audience members who wish to record any part of the meeting must inform the Council President who will announce the recording. This is to comply with the MA wiretap statute. Thank you.",
    ],
  },
})

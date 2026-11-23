import type { PageLoad } from "./$types"

/**
 * The amended agenda's header prints the hour, the room and a Google Meet
 * link, and the standing Open Meeting Law paragraph beneath it.
 *
 * The roster is the Council's own letterhead, on Vice President Michitson's
 * letter for item 15.2 at page 252 of Part 2 of the agenda: eleven names, the
 * President and Vice President marked, in its order. The roll call is the
 * minutes', split at its commas and its "and": "Present: Councilors Jordan,
 * Diodati, Sullivan, Ferreira, Michitson, Lewandowski, Toohey, McGonagle and
 * Rogers", "Remote: Councilors Basiliere and LePage"; "Absent: None" is left
 * out. Every name in it is on the letterhead and every name on the
 * letterhead is in it.
 *
 * One highlight. Five letters in Part 2 of the agenda oppose Mariam's
 * Cottage, from neighbours on East Broadway and Isabel Street. The letters are
 * the opposition the test asks for. Other letters in the packet support the
 * permit, which does not change that. The emergency order for the force main
 * asks for $2,500,000, but nothing in `projects.ts` follows the repair, so it
 * does not meet the `appropriation` test.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    location: {
      name: "Theodore A. Pelosi, Jr. Council Chambers, 4 Summer St, Room 202",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/jeq-uait-izo",
    },
    highlights: [
      {
        item: "mariams-cottage-special-permit",
        title: "Mariam's Cottage Special Permit",
        number: "10.2",
        reasons: [
          {
            kind: "opposition-on-record",
            letters: [
              {
                meeting: "city-council-2026-06-30",
                excerpt: "mariams-cottage-special-permit/lee-letter",
                source: "Marcia R. Lee, 459 E Broadway, May 23, 2026",
              },
              {
                meeting: "city-council-2026-06-30",
                excerpt: "mariams-cottage-special-permit/sturgeon-biewener-letter",
                source: "Tim Sturgeon and Judith Biewener, 419 East Broadway, May 26, 2026",
              },
              {
                meeting: "city-council-2026-06-30",
                excerpt: "mariams-cottage-special-permit/tomaz-letter",
                source: "Fernand Tomaz, June 12, 2026",
              },
              {
                meeting: "city-council-2026-06-30",
                excerpt: "mariams-cottage-special-permit/simpson-letters",
                source: "Martha Simpson and Ernest Simpson, 384 East Broadway, June 15, 2026",
              },
            ],
          },
        ],
      },
    ],
    members: {
      source: {
        title: "the Council's letterhead, in this sitting's agenda packet",
        url: "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/iqqc55fl/full-agenda-63026-pt-2.pdf#page=252",
      },
      roster: [
        { name: "Timothy J. Jordan", role: "President" },
        { name: "John A. Michitson", role: "Vice President" },
        { name: "Thomas J. Sullivan" },
        { name: "Colin F. LePage" },
        { name: "Melissa J. Lewandowski" },
        { name: "Catherine P. Rogers" },
        { name: "Shaun P. Toohey" },
        { name: "Michael S. McGonagle" },
        { name: "Daniel R. Diodati" },
        { name: "Devan Ferreira" },
        { name: "Ralph T. Basiliere" },
      ],
      present: [
        "Councilors Jordan",
        "Diodati",
        "Sullivan",
        "Ferreira",
        "Michitson",
        "Lewandowski",
        "Toohey",
        "McGonagle",
        "Rogers",
      ],
      remote: ["Councilors Basiliere", "LePage"],
    },
    notice: [
      "This meeting of Haverhill City Council will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the City Council is not required to provide remote access to the meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Those attending tonight’s meeting should be aware that the meeting is being audio and video recorded by HCTV, The Eagle Tribune, and WHAV. Any audience members who wish to record any part of the meeting must inform the Council President who will announce the recording. This is to comply with the MA wiretap statute. Thank you.",
    ],
  },
})

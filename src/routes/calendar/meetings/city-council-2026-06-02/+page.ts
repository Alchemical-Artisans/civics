import type { PageLoad } from "./$types"

/**
 * The agenda's header prints the hour, the room and a Google Meet link, and
 * the standing Open Meeting Law paragraph above the outline. The paragraph is
 * word for word the one the 30 June agenda opens with, and is kept for the
 * same reason as there: it states the Council's choice to meet in person as
 * its official location.
 *
 * The roster is the Council's own letterhead, on Councilors Basiliere and
 * Ferreira's letter for item 6.1 at page 169 of the agenda: eleven names, the
 * President and Vice President marked, in its order. The letterhead prints
 * the President's first name "Timthoy", and it is kept as printed. The roll
 * call is the minutes', split at its commas and its "and": "Present:
 * Councilors Jordan, Basiliere, Diodati, Sullivan, Michitson, Lewandowski,
 * Toohey, McGonagle, LePage and Rogers", "Absent: Councilor Ferreira";
 * "Remote: None" is left out. Every name in it is on the letterhead and every
 * name on the letterhead is in it.
 *
 * Two highlights, both the radial collector well's land at 309 East Broadway
 * (`new-drinking-water-source` in `projects.ts`):
 *
 * - 5.4, the order of taking. An earlier order to take part of the same
 *   parcel by eminent domain was debated at length on 10 February 2026 and
 *   again on 10 March 2026, each sitting's minutes giving the item a section
 *   of its own with councilors' questions, the Water/Wastewater Director's and
 *   the Solicitor's answers and recorded votes. The DPW Director's memo behind
 *   this order (packet page 41) names that February sitting.
 * - 16.3, the $900,000.00 loan order to pay for it: the same earlier
 *   sittings, and a sum stated in the order for a project the site follows.
 *   It was placed on file on 19 May, so it is up for its vote here, not
 *   stamped "File 10 Days" at this sitting.
 *
 * The Silver Hill roof loan order (16.4) states a sum too, but no project in
 * `projects.ts` follows it, so it does not meet the `appropriation` test.
 * Mariam's Cottage has opposition letters in the packet, but the hearing was
 * continued to 30 June at the applicant's request and not taken up; it is
 * highlighted on the 30 June page, where it was heard.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    location: {
      name: "Theodore A. Pelosi, Jr. Council Chambers, 4 Summer St, Room 202",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/xdh-ycqz-bze",
    },
    highlights: [
      {
        item: "309-east-broadway-taking",
        title: "Order of Taking, 309 East Broadway",
        number: "5.4",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [
              { id: "city-council-2026-02-10", label: "City Council Minutes, February 10, 2026" },
              { id: "city-council-2026-03-10", label: "City Council Minutes, March 10, 2026" },
            ],
          },
        ],
      },
      {
        item: "309-east-broadway-loan-order",
        title: "Loan Order, Acquisition of 309 East Broadway",
        number: "16.3",
        reasons: [
          {
            kind: "appropriation",
            project: "new-drinking-water-source",
            amount: "$900,000.00",
          },
          {
            kind: "discussed-before",
            meetings: [
              { id: "city-council-2026-02-10", label: "City Council Minutes, February 10, 2026" },
              { id: "city-council-2026-03-10", label: "City Council Minutes, March 10, 2026" },
            ],
          },
        ],
      },
    ],
    members: {
      source: {
        title: "the Council's letterhead, in this sitting's agenda packet",
        url: "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/vuxlv1m5/full-agenda-6226.pdf#page=169",
      },
      roster: [
        { name: "Timthoy J. Jordan", role: "President" },
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
        "Basiliere",
        "Diodati",
        "Sullivan",
        "Michitson",
        "Lewandowski",
        "Toohey",
        "McGonagle",
        "LePage",
        "Rogers",
      ],
      absent: ["Councilor Ferreira"],
    },
    notice: [
      "This meeting of Haverhill City Council will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the City Council is not required to provide remote access to the meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Those attending tonight’s meeting should be aware that the meeting is being audio and video recorded by HCTV, The Eagle Tribune, and WHAV. Any audience members who wish to record any part of the meeting must inform the Council President who will announce the recording. This is to comply with the MA wiretap statute. Thank you.",
    ],
  },
})

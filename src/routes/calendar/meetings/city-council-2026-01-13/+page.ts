import type { PageLoad } from "./$types"

/**
 * The agenda's header prints the hour and the room, and the standing Open
 * Meeting Law paragraph beneath it. It names no remote join link, so there is
 * no `remote` here: "In-Person/Remote Meeting" in the heading is a title, not
 * an address.
 *
 * Both highlighted matters were argued out at length before this sitting took
 * them up: the housing plan through an evening of the Planning and Development
 * Committee's own hearing, and the Broco Energy permit through the December
 * hearing that granted it, on conditions, over the abutters' objections. Both
 * earlier sittings are linked from the items' own pages.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    location: {
      name: "Theodore A. Pelosi, Jr. Council Chambers, 4 Summer st, Room 202",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    highlights: [
      {
        item: "housing-production-plan",
        title: "Haverhill Housing Production Plan",
        number: "5.2",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [
              {
                id: "planning-and-development-committee-2025-06-16",
                label: "Planning and Development Committee, June 16, 2025",
              },
            ],
          },
        ],
      },
      {
        item: "broco-energy-permit-revocation",
        title: "Revocation Hearing, Broco Energy, 168 Hale Street",
        number: "10.1",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [{ id: "city-council-2025-12-02", label: "City Council, December 2, 2025" }],
          },
        ],
      },
    ],
    notice: [
      "This meeting of Haverhill City Council will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the City Council is not required to provide remote access to the meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Those attending tonight’s meeting should be aware that the meeting is being audio and video recorded by HCTV, The Eagle Tribune, and WHAV. Any audience members who wish to record any part of the meeting must inform the Council President who will announce the recording. This is to comply with the MA wiretap statute. Thank you.",
    ],
  },
})

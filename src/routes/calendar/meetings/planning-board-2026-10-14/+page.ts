import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * The agenda's opening sentence recites the day, the hour and the room, all of
 * which the header already states, so only the line after it is kept.
 *
 * Both highlighted matters were argued out before this sitting took them up:
 * the Pentucket North district through a full evening of testimony at the
 * board's own July hearing, and the BESS overlay through the board's May
 * recommendation and the Council committee's August site comparison, which
 * moved the proposed district from Amesbury Road to Hilldale Avenue and so
 * sent it back here to be heard again. Both are linked from the items' own
 * pages.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 P.M.",
    location: {
      name: "Room 202, Haverhill City Hall",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    highlights: [
      {
        item: "pentucket-north-planned-development-district",
        title: "Amend Chapter 255 Zoning Ordinance and Zoning Map",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [{ id: "planning-board-2026-07-08", label: "Planning Board, July 8, 2026" }],
          },
        ],
      },
      {
        item: "battery-energy-storage-systems-ordinance",
        title:
          "Amend Chapter 255 Zoning Ordinance and Zoning Map – Battery Energy Storage Systems Overlay District (BESS)",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [
              { id: "planning-board-2026-05-13", label: "Planning Board, May 13, 2026" },
              {
                id: "planning-and-development-committee-2026-08-24",
                label: "Planning and Development Committee, August 24, 2026",
              },
            ],
          },
        ],
      },
    ],
    notice: ["(See files in the Planning Dept. for further information.)"],
  },
})

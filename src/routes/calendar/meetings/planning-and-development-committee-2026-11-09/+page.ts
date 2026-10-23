import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the notice itself. The layout renders
 * these into the page header; see $lib/calendar's MeetingDetails for why none
 * of it can come from the scrape.
 *
 * The notice is a letter from the committee chairperson to the City Clerk, and
 * everything in it but the two referred documents is about the scheduling
 * rather than the business -- the salutation, the paragraph naming the day and
 * the room, the signature and the distribution list -- so none of that is in
 * the write-up, the same as this committee's own notice of 19 October.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 PM",
    location: {
      name: "City Council Chambers, Room 202, City Hall, 4 Summer Street",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/zup-rexj-kja",
    },
    members: {
      source: {
        title: "the city's City Council Committees page",
        url: "https://www.haverhillma.gov/government/mayor-and-council/city-councilors/city-council-committees/",
      },
      // The page heads this list "Committee Assignments 2026-2028" and prints
      // "Councilor" before every name and an office beside only the chair's, so
      // the four others carry no role: the title the honorific states is the
      // one thing the roster would otherwise repeat eleven times over.
      roster: [
        { name: "John A. Michitson", role: "Chairperson" },
        { name: "Catherine P. Rogers" },
        { name: "Daniel R. Diodati" },
        { name: "Melissa J. Lewandowski" },
        { name: "Devan Ferreira" },
      ],
    },
    highlights: [
      {
        item: "fiscal-impact-analysis-progress-report",
        title: "Fiscal Impact Analysis Progress Report",
        number: "Doc.85-e",
        reasons: [
          {
            // The Council did not merely refer this: the minutes of 9 December
            // 2025 give the item a section of its own in which the consultant
            // presented the study's findings and three councilors are recorded
            // pressing her on the accuracy of the school enrolment and
            // expenditure data behind them, before the vote to send it here.
            kind: "discussed-before",
            meetings: [{ id: "city-council-2025-12-09", label: "City Council, December 9, 2025" }],
          },
        ],
      },
    ],
  },
})

import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda: the
 * sitting opens at 5:30 P.M. with training and the public hearings begin at
 * 7:00 P.M. The agenda prints no remote access and no standing notice.
 */
export const load: PageLoad = () => ({
  details: {
    time: "5:30 P.M.",
    location: {
      name: "City Hall Room 202",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    // The roster is the one the city's Zoning Board of Appeals page prints:
    // a chair, four members and two associate members, in its order. The
    // agenda is not a roll call, so there is no attendance here.
    members: {
      source: {
        title: "the city's Zoning Board of Appeals page",
        url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/zoning-board-of-appeals/",
      },
      roster: [
        { name: "George Moriarty", role: "Chair" },
        { name: "Louise Bevilacqua" },
        { name: "Lynda M. Brown" },
        { name: "Theodore Vathally" },
        { name: "Michael Soraghan" },
        { name: "Magdiel Matias", role: "Assoc. Member" },
        { name: "Gary Ortiz", role: "Assoc. Member" },
      ],
    },
  },
})

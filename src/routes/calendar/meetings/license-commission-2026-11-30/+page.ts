import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape. Unlike the
 * November 5 agenda this one prints no remote option, and its notice stops
 * after the in-person sentences.
 */
export const load: PageLoad = () => ({
  details: {
    time: "2PM",
    location: {
      name: "City Council Chambers – Room 202",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    notice: [
      "This meeting/hearing of Haverhill License Commission will be held in-person at the location provided on this notice. Members of the public are welcome to attend this in-person meeting.",
    ],
    members: {
      source: {
        title: "the city's License Commission page",
        url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/license-commission/",
      },
      roster: [
        { name: "Elizabeth A. Laliberty", role: "Chairperson" },
        { name: "Patrick J. Driscoll" },
        { name: "Linda L. Koutoulas" },
      ],
    },
  },
})

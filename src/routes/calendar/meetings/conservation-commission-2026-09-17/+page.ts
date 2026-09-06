import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:15 P.M.",
    location: {
      name: "4 Summer Street, City Hall Room 301, Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://tinyurl.com/HaverhillConCom2026",
      meetingId: "243 284 796 220 8",
      passcode: "oz3UT23Q",
    },
    notice: [
      "The Haverhill Conservation Commission will meet Thursday, September 17, 2026, at 7:15 P.M. under M.G.L. Chapter 131, Sec. 40 and City of Haverhill Ordinance Chapter 253. If postponed by the Commission, the meeting will be held on September 24, 2026, at the same time. This meeting will be held in-person at 4 Summer Street, City Hall Room 301, Haverhill, MA 01830.",
      "Meeting attendees will have the option to participate remotely by joining online using the following link: https://tinyurl.com/HaverhillConCom2026 (Meeting ID: 243 284 796 220 8 Passcode: oz3UT23Q). Note if technological problems interrupt the virtual meeting, the meeting will continue in-person. For more information concerning this meeting, contact our office by email at conservation@haverhillma.gov or calling (978) 374-2334 or go to https://www.haverhillma.gov/government/boards-committees-and-commissions/conservation-commission/projects-under-review/ .",
    ],
  },
})

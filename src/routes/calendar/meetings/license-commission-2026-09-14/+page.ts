import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "1:00 PM",
    location: {
      name: "City Council Chambers – Room 202",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/cst-ewyg-ncs",
      meetingId: "cst-ewyg-ncs",
      how: ["Dial in (audio only): (US) +1 669-238-0471 PIN: 728 125 672#"],
    },
    notice: [
      "This meeting/hearing of Haverhill License Commission will be held in-person at the location provided on this notice. Members of the public are welcome to attend this in-person meeting. Please note that while an option for remote attendance and/or participation is being provided as a courtesy to the public, the meeting/hearing will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly.",
    ],
  },
})

import type { PageLoad } from "./$types"

export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    location: {
      name: "Theodore A. Pelosi, Jr. Council Chambers, 4 Summer st, Room 202",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    notice: [
      "This meeting/hearing of Haverhill City Council will be held in-person at the location provided at this notice. Members of the public are welcome to attend this in-person meeting. Please note that while an option for remote attendance and/or participation is being provided as a courtesy to the public, the meeting/hearing will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly.",
    ],
  },
})

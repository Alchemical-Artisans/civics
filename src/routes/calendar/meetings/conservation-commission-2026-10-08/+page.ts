import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * The agenda's opening paragraph is mostly the day, the hour and the room,
 * which the header already states, so only the two sentences that say
 * something it does not are kept: the Commission's own fallback date, in
 * `notice`, and the qualification on the join link -- the remote option can
 * fail and the sitting carries on without it -- in `how`, beside the link it
 * qualifies.
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
      how: [
        "Note if technological problems interrupt the virtual meeting, the meeting will continue in-person.",
      ],
    },
    notice: [
      "If postponed by the Commission, the meeting will be held on October 15, 2026, at the same time.",
    ],
  },
})

import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the city's Notice of Meeting. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * There is no `location`: this sitting is held over Microsoft Teams and
 * nowhere else, so the join link is the whole of where it is. The notice
 * prints the link twice, once as the bare URL and once under the label
 * "Haverhill/CLE (MCAS-Alt Training) | Meeting-Join | Microsoft Teams", which
 * is agenda item II said again and is dropped, the same as the sentence
 * reciting the day and hour the header already shows.
 *
 * The council's own site is the only page that names who sits on it: its
 * homepage heads two names "Meet the Current SEPAC Board", and names no other
 * seat, so the list is not marked `partial`. SEPAC's membership proper is open
 * to any parent, guardian, educator or resident -- the board is the part of it
 * a source settles.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    remote: {
      url: "https://teams.microsoft.com/meet/2220008255719511?p=ms7KB0ztHTsSaRMTJE",
    },
    members: {
      roster: [
        { name: "Mandy LaClair", role: "Chairperson" },
        { name: "Zwadita Morrison", role: "Secretary" },
      ],
      source: {
        title: "Meet the Current SEPAC Board",
        url: "https://www.haverhillsepac.com/",
      },
    },
  },
})

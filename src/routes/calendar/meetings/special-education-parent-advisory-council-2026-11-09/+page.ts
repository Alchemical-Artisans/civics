import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the city's Notice of Meeting. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * There is no `location`: this sitting is held over Zoom and nowhere else, so
 * the join link is the whole of where it is. The notice's Zoom block prints a
 * host address beside the link, which is the only way to reach the meeting
 * that is not the link itself, so it goes in `how`; the block's topic line
 * ("Anti-bullying Training - Haverhill") is agenda item II said again and is
 * dropped, the same as the sentence reciting the day and hour the header
 * already shows.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:30 PM",
    remote: {
      url: "https://us06web.zoom.us/j/82364296959",
      how: ["Meeting host: jpino@massadvocates.org"],
    },
  },
})

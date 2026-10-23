import type { PageLoad } from "./$types"

/**
 * When the sitting is and how to get into it, read off the principal's
 * notification memo on the first page. The layout renders these into the page
 * header; see $lib/calendar's MeetingDetails for why none of it can come from
 * the scrape.
 *
 * No location: neither the memo nor the agenda behind it names a room, a
 * building or an address, and the city's own notice page leaves its Location
 * field empty. The memo's one sentence about attending offers a Google Meet
 * and nothing else, so there is nothing here to hand a map.
 */
export const load: PageLoad = () => ({
  details: {
    // The hour the memo prints, in bold, as part of the day it also prints.
    time: "6:00 pm",
    // The remote option is not a link: the memo asks a reader to write to the
    // principal first and says the Google Meet link comes back by email, so
    // the sentence goes in `how` -- the city's own words -- and `url` is left
    // off rather than invented.
    remote: {
      how: [
        "If you would like to attend the meeting, please email Eileen Doherty at eileen.doherty@haverhill-ps.org, and you will receive a link to a Google Meet.",
      ],
    },
  },
})

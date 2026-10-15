import type { PageLoad } from "./$types"

/**
 * When and where the sitting is, read off the block under the agenda's own
 * title. The layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    // The hour range the agenda prints under its heading, kept as printed.
    time: "4:30-5:30 pm",
    location: {
      // The agenda's own Location line. The school names itself on the
      // letterhead above it; the conference room is inside that building.
      name: "Google Meet/Conference Room",
      // "Conference Room" geocodes to nothing; hand the map the school's own
      // address, which the letterhead prints.
      mapQuery: "118 Montvale Street, Haverhill, MA 01835",
    },
    // The agenda prints a working Google Meet link and then qualifies it: the
    // sitting is held in person and the call is an option on it, which the
    // Location line says only by naming both. The third line of the same block
    // restates the day and hour the header already shows, so it is left out.
    remote: {
      url: "https://meet.google.com/nnm-zdhw-zcy",
      how: [
        "Meeting in person",
        "Video call link: Site Council Meeting/In Person with a Virtual Option",
      ],
    },
  },
})

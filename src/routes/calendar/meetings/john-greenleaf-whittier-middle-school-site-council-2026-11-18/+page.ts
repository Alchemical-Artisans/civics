import type { PageLoad } from "./$types"

/**
 * When and where the sitting is, read off the Date, Time and Location lines
 * under the agenda's own heading. The layout renders these into the page
 * header; see $lib/calendar's MeetingDetails for why none of it can come from
 * the scrape.
 *
 * No members: the agenda names nobody at all, and as with the other schools'
 * site councils nobody publishes this council's membership anywhere a roster
 * could be read from.
 */
export const load: PageLoad = () => ({
  details: {
    // The hour range the agenda prints, kept as printed.
    time: "6:00pm - 7:00pm",
    location: {
      name: "JGW Library",
      // The room geocodes to nothing; the letterhead prints the school's
      // street address.
      mapQuery: "256 Concord St, Haverhill, MA 01830",
    },
  },
})

import type { PageLoad } from "./$types"

/**
 * When and where the sitting is, read off the Date, Time and Location lines
 * at the head of the agenda. The layout renders these into the page header;
 * see $lib/calendar's MeetingDetails for why none of it can come from the
 * scrape.
 *
 * No members: the letterhead names the principal and his assistants, who are
 * the school's administration rather than the council, and as with the other
 * schools' site councils nobody publishes this council's membership anywhere
 * a roster could be read from.
 */
export const load: PageLoad = () => ({
  details: {
    time: "4:00 PM",
    location: {
      // The agenda prints "Haverhill High School / Library" on two lines.
      name: "Haverhill High School Library",
      // The room geocodes to nothing; the letterhead prints the school's street
      // address.
      mapQuery: "137 Monument Street, Haverhill, MA 01832",
    },
  },
})

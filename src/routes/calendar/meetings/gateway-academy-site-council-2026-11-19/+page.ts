import type { PageLoad } from "./$types"

/**
 * When and where the sitting is, read off the Date, Time and Location lines
 * under the agenda's own heading. The layout renders these into the page
 * header; see $lib/calendar's MeetingDetails for why none of it can come from
 * the scrape.
 *
 * No members: the agenda names nobody but the principal on its letterhead, and
 * as with the other schools' site councils nobody publishes this council's
 * membership anywhere a roster could be read from.
 */
export const load: PageLoad = () => ({
  details: {
    // The hour range the agenda prints, kept as printed.
    time: "4:00 PM – 5:00 PM",
    location: {
      name: "Gateway Academy",
      // The school's name alone is a poor map search; the letterhead prints
      // its street address.
      mapQuery: "26 Belmont Ave, Haverhill, MA 01830",
    },
  },
})

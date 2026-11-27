import type { PageLoad } from "./$types"

/**
 * When the sitting is and how to join it, read off the block under the
 * agenda's own title; the layout renders these into the page header. The hour
 * is the range the agenda prints, kept as printed -- see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * No location: unlike October's, this agenda prints no room or address, only
 * the Google Meet link, so the sitting is given as remote alone rather than
 * placed at the school on a guess.
 *
 * No members: the agenda's "Attendance:" line is left blank, and the school's
 * own site-council page (walnutsquare.haverhill-ps.org/site-council/, which
 * October's agenda linked) answers 404, so nothing publishes a roster.
 */
export const load: PageLoad = () => ({
  details: {
    time: "5:00 – 6:00 pm",
    remote: {
      url: "https://meet.google.com/zvf-vmyp-mwa",
    },
  },
})

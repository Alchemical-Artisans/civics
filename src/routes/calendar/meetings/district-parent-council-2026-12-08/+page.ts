import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the agenda's own header. The layout
 * renders these into the page header; see $lib/calendar's MeetingDetails for
 * why none of it can come from the scrape.
 *
 * The agenda prints a span, "9:30 - 10:30 am", and the span is kept as
 * printed. There is no `remote`: the agenda offers no way to join from
 * elsewhere.
 *
 * There are no `members`. The council's page on the schools' site
 * (haverhill-ps.org/hps-district-parent-council) describes it as a forum open
 * to parents and caregivers and names nobody as sitting on it.
 */
export const load: PageLoad = () => ({
  details: {
    time: "9:30 - 10:30 am",
    location: {
      name: "HPS Central Office, 4 Summer Street, Haverhill, MA Room 104",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})

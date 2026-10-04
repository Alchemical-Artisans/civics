import type { PageLoad } from "./$types"

/**
 * When and where the sitting is, read off the block under the agenda's own
 * title; the layout renders these into the page header. The hour is the range
 * the agenda prints, kept as printed -- see $lib/calendar's MeetingDetails for
 * why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "5:00 – 6:00 pm",
    location: {
      name: "Walnut Square Elementary School",
      // The agenda prints the school's own street address under its name.
      mapQuery: "645 Main St., Haverhill, MA 01830",
    },
  },
})

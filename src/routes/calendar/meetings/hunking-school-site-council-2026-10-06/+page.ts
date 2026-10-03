import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the line under the agenda's own rule.
 * The layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "5:15 PM",
    location: {
      // All the agenda names is the room; the school is the heading above it.
      name: "Hunking Conference Room",
      // The room geocodes to nothing, and the agenda prints no address at all;
      // hand the map the school's own, which the city lists for the building.
      mapQuery: "100 Winchester Street, Haverhill, MA 01835",
    },
  },
})

import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the notice itself. The layout renders
 * these into the page header; see $lib/calendar's MeetingDetails for why none
 * of it can come from the scrape.
 *
 * The notice is a letter from the committee chairperson to the City Clerk, and
 * everything in it but the one referred document is about the scheduling rather
 * than the business -- the salutation, the paragraph naming the day and the
 * room, the signature and the distribution list -- so none of that is in the
 * write-up, the same as the Natural Resources committee's own notice.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 PM",
    location: {
      name: "City Council Chambers, Room 202, City Hall, 4 Summer Street",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/tow-hfmn-jov",
    },
  },
})

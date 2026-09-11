import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the notice itself. The layout
 * renders these into the page header; see $lib/calendar's MeetingDetails for
 * why none of it can come from the scrape.
 *
 * The notice is a letter from the committee chairperson to the City Clerk,
 * its salutation and closing about the scheduling itself rather than the
 * meeting's business, so none of that is in the write-up -- only the two
 * items it lists.
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
      url: "https://meet.google.com/jeb-jvyz-muq",
    },
  },
})

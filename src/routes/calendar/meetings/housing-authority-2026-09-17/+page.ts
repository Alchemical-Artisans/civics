import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the city's Notice of Meeting. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * The virtual option here is conditional -- "In the event of Inclement
 * Weather, Meetings will be held virtually" -- rather than a standing
 * alternative to attending in person, so the Zoom particulars go in `how`
 * alongside `url`/`meetingId`/`passcode` rather than being offered as a plain
 * join link.
 */
export const load: PageLoad = () => ({
  details: {
    time: "10:00 A.M.",
    location: {
      name: "Kennedy Circle Community Room, 40 Kennedy Circle, Haverhill, Massachusetts",
      // The room geocodes to nothing; hand the map the street address. The
      // notice gives no zip for this address (only for the Authority's own
      // office on Washington Square), so none is added here.
      mapQuery: "40 Kennedy Circle, Haverhill, MA",
    },
    remote: {
      url: "https://zoom.us/j/6787185632?pwd=k4eUQLkEfwERJWM8DgulrwIFauSTEm.1",
      meetingId: "678 718 5632",
      passcode: "380804",
      how: [
        "In the event of Inclement Weather, Meetings will be held virtually and can be joined via Conference Call using the Zoom application in accordance with Chapter 2 of the Acts of 2025 using the below methods: Call 1-646-876-9923.",
      ],
    },
  },
})

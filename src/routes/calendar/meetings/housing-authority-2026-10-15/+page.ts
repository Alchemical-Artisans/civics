import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the city's Notice of Meeting. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * As in September, the virtual option is conditional -- "In the event of
 * Inclement Weather, Meetings will be held virtually" -- rather than a
 * standing alternative to attending in person, so the Zoom particulars go in
 * `how` alongside `url`/`meetingId`/`passcode` rather than being offered as a
 * plain join link.
 */
export const load: PageLoad = () => ({
  details: {
    time: "10:00 A.M.",
    location: {
      name: "Washington Square Community Room, 25 Washington Square, Haverhill, Massachusetts",
      // The room geocodes to nothing; hand the map the street address. The
      // zip is the Authority's own, off the letterhead above the notice,
      // which gives this same square as 25C Washington Square, Haverhill,
      // Massachusetts 01831-2451.
      mapQuery: "25 Washington Square, Haverhill, MA 01831",
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

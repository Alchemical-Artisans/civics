import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the Notice of Meeting. As in
 * October, the virtual option is conditional -- "In the event of Inclement
 * Weather, Meetings will be held virtually" -- so the Zoom particulars go in
 * `how` beside `url`/`meetingId`/`passcode`.
 */
export const load: PageLoad = () => ({
  details: {
    time: "10:00 A.M.",
    location: {
      name: "Washington Square Community Room, 25 Washington Square, Haverhill, Massachusetts",
      // The room geocodes to nothing; hand the map the street address.
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

import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the council's notice to the City
 * Clerk. The layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * There is no `remote`: this sitting is held at the school and the notice
 * offers no way to join it from elsewhere, unlike the council's two November
 * sittings, which were a Zoom and a Teams link and nothing else.
 *
 * The notice's opening sentence is kept whole in `notice` for the sake of the
 * clause at the end of it. The Conservation Commission's fallback date is its
 * own sentence and so drops the recitation of day and hour around it; SEPAC's
 * snow date is a clause inside the sentence that states the meeting, and
 * cutting it loose would leave either a fragment or words of ours holding it
 * up. The small restatement is the price of quoting the city rather than
 * paraphrasing it.
 *
 * The council's own site is the only page that names who sits on it: its
 * homepage heads two names "Meet the Current SEPAC Board", and names no other
 * seat, so the list is not marked `partial`. SEPAC's membership proper is open
 * to any parent, guardian, educator or resident -- the board is the part of it
 * a source settles. The notice is signed by the Secretary it names.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 PM",
    location: {
      name: "Dr. Albert B. Consentino School, 685 Washington Street, Haverhill, MA 01832",
      // The school geocodes to nothing; hand the map the street address.
      mapQuery: "685 Washington Street, Haverhill, MA 01832",
    },
    notice: [
      "The Haverhill Special Education Parent Advisory Council (SEPAC) will hold a public meeting on Monday, December 7, 2026, at 6:00 PM with a snow date of Monday, December 14, 2026.",
    ],
    members: {
      roster: [
        { name: "Mandy LaClair", role: "Chairperson" },
        { name: "Zwadita Morrison", role: "Secretary" },
      ],
      source: {
        title: "Meet the Current SEPAC Board",
        url: "https://www.haverhillsepac.com/",
      },
    },
  },
})

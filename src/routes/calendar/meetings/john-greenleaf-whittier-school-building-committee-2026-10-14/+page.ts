import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the Mayor's covering letter to the
 * City Clerk, which is the whole of this filing -- there is no separate agenda
 * sheet behind it the way the Consentino committee's postings have one, only
 * the four numbered lines the letter prints under "The agenda is below:".
 * The layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 *
 * The letter is headed "Updated 10.02.26 @ 1:45 pm", so it supersedes an
 * earlier posting for this sitting. It does not say what moved and the city
 * publishes only the current copy, so there is nothing to compare it against.
 */
export const load: PageLoad = () => ({
  details: {
    // Verbatim from the letter, which prints the hour two ways in one phrase.
    time: "8:30 am - 9:30 a.m.",
    location: {
      name: "School Administration Office (large conference), City Hall, Room 104, Four Summer Street, Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/hdj-ryzz-uui",
    },
    // This committee's own condition on attending, the same one the Consentino
    // committee's agendas carry. The paragraph below it -- that the Governor
    // extended remote attendance to June 30, 2027 -- is on every board's agenda
    // in the city and is about none of them.
    notice: ["No AI Notetakers allowed in the meeting."],
  },
})

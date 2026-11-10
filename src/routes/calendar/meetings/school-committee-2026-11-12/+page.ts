import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the Chairperson's Open Meeting Law
 * posting to the City Clerk -- a one-page letter with the three-item agenda
 * set inside it, which is the whole of what the city published for this
 * sitting. It is the same shape as this subcommittee's 13 and 19 October
 * sittings, whose item 2 this one continues.
 *
 * Neither the letter's opening paragraph nor the signature under it is
 * transcribed: the paragraph says in prose what the date line and the location
 * link say above it, and the purpose it adds, that the subcommittee is
 * continuing the preparation of the superintendent's goals for the full School
 * Committee, is the subcommittee's own name over item 2. Unlike the October
 * postings this one carries no closing paragraph at all -- no remote-meeting
 * sunset, no wiretap statement -- so there is nothing for `notice` either way.
 *
 * No `remote`: the letter prints no way to join from elsewhere, where both
 * October sittings printed a Meet link. The board the sitting is filed under is
 * the School Committee, which is one of the three the page derives a channel 8
 * link for, so the header offers what this document does not.
 *
 * No `members`: this is a special subcommittee the Committee created by vote on
 * 24 September 2026, after the year's assignments were approved on 22 January,
 * so it is named neither on the district's Subcommittees & Negotiating Team
 * page nor in the "Approved Haverhill School Committee Assignments 2026" PDF
 * hanging off it -- the sources the full Committee's and the Budget & Finance
 * Subcommittee's rosters come from. The only published list of who sits on it
 * is the recommendation recorded in the minutes of that 24 September sitting,
 * and a roster read out of minutes is not a roster source.
 *
 * No `highlights`: the sitting's one substantive item answers none of the
 * tests in HighlightReason. `discussed-before` wants an earlier sitting whose
 * minutes record a discussion, and the two October sittings that took the goals
 * up have published agendas and no minutes; there is no packet here, so no
 * correspondence; and nothing on the agenda appropriates money.
 */
export const load: PageLoad = () => ({
  details: {
    // The letter gives an end as well as a start, and qualifies both: this
    // sitting follows the Budget & Finance Subcommittee's budget workshop in
    // the same building that evening, so the hour it prints is an estimate of
    // when that one finishes. All of it is the city's own wording.
    time: "7:00 pm -8:00 pm, (approximate time - at conclusion of the budget workshop)",
    location: {
      // Verbatim, doubled comma and all: the letter runs the Hunking School's
      // own address and the district office's together. Only the comma that
      // ends the letter's sentence is left off.
      name: "Hunking School, Library 480 South Main Street 4 Summer Street,, Haverhill, MA 01835",
      // The room geocodes to nothing, and neither does the run above; hand the
      // map the school's own street address, which resolves to the building.
      mapQuery: "480 South Main Street, Haverhill, MA 01835",
    },
  },
})

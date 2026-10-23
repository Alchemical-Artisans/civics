import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the Vice Chairperson's Open Meeting
 * Law posting to the City Clerk -- a one-page letter with the seven-item
 * agenda set inside it, which is the whole of what the city published for this
 * sitting. Neither the letter's opening paragraph nor the signature under it is
 * transcribed: the paragraph says in prose what the date line and the location
 * link say above it, and the one thing it adds that the agenda does not --
 * that School Committee members who do not sit on the subcommittee may attend
 * as well -- is the `notice` below, since a quorum of the parent body turning
 * up is this sitting's own circumstance rather than boilerplate.
 *
 * No `remote`: the letter calls the workshop neither hybrid nor remote and
 * prints no way to join it, so there is nothing to put in the slot.
 */
export const load: PageLoad = () => ({
  details: {
    // The letter gives an end as well as a start; both are the city's.
    time: "6:30 pm-8:00 pm",
    location: {
      name: "Library, Caleb Dustin Hunking School, 480 South Main Street, Haverhill, MA 01835",
      // The room geocodes to nothing; hand the map the street address, which
      // is the one the letter prints and which resolves to the school itself.
      mapQuery: "480 South Main Street, Haverhill, MA 01835",
    },
    notice: [
      "Other members of the school committee, who are not members of the subcommittee may also be in attendance.",
    ],
    // The subcommittee as the district's own page for it names the 2026
    // membership: five of the School Committee's members, the first of them
    // the chairperson who signed this posting. The page gives the year's list
    // entire -- the 2025, 2024 and 2023 lists are archived beneath it -- so
    // there is nothing partial about it.
    members: {
      source: {
        title: "the district's Budget & Finance Subcommittee page",
        url: "https://www.haverhill-ps.org/budget-and-finance-subcommittee",
      },
      roster: [
        { name: "Dr. Thomas Grannemann", role: "Chairperson" },
        { name: "Mr. Robert Brown III" },
        { name: "Ms. Penelope Guerrero" },
        { name: "Mr. Josiah E. Morrow" },
        { name: "Mrs. Toni Sapienza Donais" },
      ],
    },
  },
})

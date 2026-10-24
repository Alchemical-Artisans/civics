import type { PageLoad } from "./$types"

/**
 * When and how to join, read off the Chairperson's Open Meeting Law posting to
 * the City Clerk -- a one-page letter with the four-item agenda set inside it,
 * which is the whole of what the city published for this sitting. Neither the
 * letter's opening paragraph nor the signature under it is transcribed: the
 * paragraph says in prose what the date line and the remote link say above it.
 * The closing paragraph on the 2027 sunset of the remote-meeting act is the
 * same sentence on every board's agenda in the city and belongs to none of
 * them.
 *
 * No `location`: the letter calls this a remote meeting and names no room, so
 * there is nowhere to send a reader and nothing to hand a map.
 */
export const load: PageLoad = () => ({
  details: {
    // The letter gives an end as well as a start; both are the city's.
    time: "6:00 pm-7:30 pm",
    remote: {
      url: "https://meet.google.com/ffx-vrow-fra",
      // Printed under the join link and in the same bold blue as it: a
      // condition on how a reader may attend rather than Open Meeting Law
      // boilerplate, so it sits with the link instead of in `notice`.
      how: ["No AI Notetakers allowed in the meeting."],
    },
    // The subcommittee as the district's own page for it names the 2026
    // membership. The page gives the year's list entire -- the 2025 and 2024
    // lists are archived beneath it -- so there is nothing partial about it.
    // The first name is the chairperson who signed this posting.
    members: {
      source: {
        title: "the district's Policy Subcommittee page",
        url: "https://www.haverhill-ps.org/policy-subcommittee",
      },
      roster: [
        { name: "Mrs. Toni Sapienza Donais", role: "Chairperson" },
        { name: "Mr. Robert Brown" },
        { name: "Ms. Yonnie Collins" },
        { name: "Ms. Mirca Zoraida Rivera" },
        { name: "Dr. Jill Story" },
      ],
    },
  },
})

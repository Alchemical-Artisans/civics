import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, and how to join it, read off the
 * Chairperson's Open Meeting Law posting to the City Clerk -- a one-page
 * letter with the three-item agenda set inside it, which is the whole of what
 * the city published for this sitting. The city posted the same letter twice,
 * stamped an hour apart on 9 November, so both records point at one document.
 *
 * Neither the letter's opening paragraph nor the signature under it is
 * transcribed: the paragraph says in prose what the date line, the location
 * link and the join link say above it. The closing paragraph on the 2027
 * sunset of the remote-meeting act is the same sentence on every board's
 * agenda in the city and belongs to none of them.
 */
export const load: PageLoad = () => ({
  details: {
    // The letter gives an end as well as a start; both are the city's.
    time: "5:00 pm to 5:45 pm",
    location: {
      // Verbatim, the city's own slip included: the Hunking School's ZIP is
      // 01835, and this letter prints 01935.
      name: "Library, Hunking School, 480 South Main Street, Haverhill, MA 01935",
      // The room geocodes to nothing, and neither does the printed ZIP; hand
      // the map the street address, which resolves to the school itself.
      mapQuery: "480 South Main Street, Haverhill, MA 01835",
    },
    remote: {
      url: "https://meet.google.com/zaf-ucre-mnz",
      // Printed under the join link and in the same bold blue as it: a
      // condition on how a reader may attend rather than Open Meeting Law
      // boilerplate, so it sits with the link instead of in `notice`.
      how: ["No AI Notetakers allowed in meeting."],
    },
    // The subcommittee as the district's own page for it names the 2026
    // membership. The page gives the year's list entire -- the 2025 and 2024
    // lists are archived beneath it, under the body's former name -- so there
    // is nothing partial about it. The first name is the chairperson who
    // signed this posting and whom item 1 calls the meeting to order.
    members: {
      source: {
        title: "the district's Diversity, Health & Safety Subcommittee page",
        url: "https://www.haverhill-ps.org/diversity-subcommittee",
      },
      roster: [
        { name: "Ms. Yonnie Collins", role: "Chair" },
        { name: "Mrs. Amanda Basiliere" },
        { name: "Mr. Josiah E. Morrow" },
        { name: "Ms. Mirca Zoraida Rivera" },
        { name: "Mrs. Maura Ryan-Ciardiello" },
      ],
    },
  },
})

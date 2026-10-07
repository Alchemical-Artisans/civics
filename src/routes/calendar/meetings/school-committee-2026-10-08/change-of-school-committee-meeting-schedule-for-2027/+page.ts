import type { PageLoad } from "./$types"

/**
 * The agenda's phrase, cut to the matter: "Dr. Grannemann: Consider change of
 * School Committee Meeting Schedule for 2027 (vote)" is who brings it and what
 * the Committee does with it, and the schedule is what it is about. The change
 * is the one Dr. Grannemann announced to the community on 24 September --
 * second-and-fourth Thursdays to first-and-third -- and the draft the packet
 * attaches is what a vote tonight would adopt.
 *
 * What the packet attaches is one page: twelve month grids with a dated list
 * beside each. The grids are the drawing and the lists are what they draw --
 * every meeting, holiday and recess is in the list already, colour-coded on
 * the grid beside it -- so the lists are transcribed and the grids are left to
 * the excerpt, the same rule that leaves the Auditor's sparkline column out.
 * The page's own "Please note" paragraphs and its closing line about the hour
 * and the room are here too.
 *
 * Nothing here is written onto the calendar. These are 2027 dates on a sheet
 * headed DRAFT, which the Committee has not yet voted; a sitting reaches the
 * calendar from a notice or an adopted schedule, not from a proposal.
 */
export const load: PageLoad = () => ({
  item: { title: "Change of School Committee Meeting Schedule for 2027" },
})

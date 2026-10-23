import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item, as printed. The city calls the project
 * the Whittier Middle School Project in its own flyer and the agenda calls it
 * JGW/Tilton; the title stays the agenda's, since that is the line a reader
 * is following.
 *
 * The packet carries three documents behind this one line and all three are
 * transcribed: the flyer for the public information session of 5 November,
 * the district's two-page project overview, and the thirty-two-slide
 * presentation the School Building Committee was given on 14 October, which
 * is what the Superintendent is bringing to the Committee tonight.
 *
 * **What is a drawing is not transcribed.** The deck is largely pictures --
 * photographs of cracked paving and rusted doors, floor plans, pie charts
 * against the MSBA's space guidelines, and two Gantt charts. The words on
 * them are: each existing-conditions slide's two paragraphs, the space
 * summary table, the enrollment grids, and the dates and phase lengths the
 * Gantt charts label, which are discrete figures rather than a picture. The
 * charts themselves, the plans and the photographs are left to the excerpt.
 *
 * The enrollment grids are the deck's own four options drawn as a column of
 * coloured boxes per school, grades in each; here each is a table of school
 * and grades in the deck's own left-to-right order, elementary schools then
 * middle schools. Hunking appears twice in every one of them because the deck
 * draws it twice, once in each row -- it is a K-8 school. A school the option
 * closes is drawn as an empty box with a dash, and the dash is kept.
 *
 * The deck's own slips stay: "June18, 2031", "3/15/28? 3/21/28?" with the
 * question marks the designer left on the funding-vote dates, "Project Scope
 * an Budget Approva" where the second chart's labels are cut off at the slide
 * edge, and the overview's "why is it being considered".
 *
 * The 19 November School Committee meeting the outreach slide names had no
 * page on the calendar, so one is written for it; 5 November is a public
 * information session rather than a sitting of a board, so it gets the "add
 * to calendar" control and a map of the school instead. The school resolves
 * by name against Nominatim to the building itself, 256 Concord Street, which
 * is what the map is centred on.
 *
 * The flyer gives 6:00 PM and no closing hour, so the calendar event runs two
 * hours.
 */
export const load: PageLoad = () => ({
  item: { title: "JGW/Tilton School Building Updates" },
})

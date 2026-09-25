import type { PageLoad } from "./$types"

/**
 * An approval line that is only a date normally stays on the outline -- but
 * this one is not only a date. The packet attaches the minutes themselves,
 * five pages of them, and they are the whole record of what the Committee did
 * on 10 September: the city publishes School Committee minutes nowhere else,
 * so without this page the votes on the CTE admissions policy, the facilities
 * user fees and the September warrant exist on this site only as a scan
 * inside another sitting's packet.
 *
 * They are transcribed here, on the sitting that votes to approve them, rather
 * than moved onto the 09.10.26 meeting page: what the Committee is voting on
 * tonight is this document, and its own heading links back to that sitting for
 * a reader who wants the agenda the minutes answer to.
 *
 * "of" is dropped from the directory name and nowhere else -- the title is the
 * agenda's phrase as printed, the slug is what a reader has to type.
 *
 * The roll calls and the votes are printed two members to a row, eleven names
 * laid out in two columns to save the page; here they are one table of eleven
 * rows, in the document's own order down the first column and then the second.
 * Nothing is added or dropped, including the city's own slip of naming Dr.
 * Grannemann twice in every vote and Mrs. Ryan-Ciardiello in none of them.
 */
export const load: PageLoad = () => ({
  item: { title: "Hybrid Regular Meeting Minutes of September 10, 2026" },
})

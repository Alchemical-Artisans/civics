import type { PageLoad } from "./$types"

/**
 * An approval line that is only a date normally stays on the outline -- but
 * this one is not only a date, for the same reason the 8 October sitting's
 * approval of the 24 September minutes was not: the minutes themselves are
 * the whole record of what the Committee did on 8 October, and the city
 * publishes School Committee minutes nowhere else. Without this page the vote
 * to send the cell phone policy to the Policy Subcommittee, the acceptance of
 * the Freeman estate's gift and the superintendent's three enrollment options
 * for the JGW/Tilton project exist on this site only inside a PDF.
 *
 * They are transcribed here, on the sitting that votes to approve them,
 * rather than moved onto the 10.08.26 meeting page: what the Committee is
 * voting on tonight is this document, and its own heading links back to that
 * sitting for a reader who wants the agenda the minutes answer to.
 *
 * "of" is dropped from the directory name and nowhere else -- the title is the
 * agenda's phrase as printed, the slug is what a reader has to type.
 *
 * The roll call and the votes are printed two members to a row, the committee
 * laid out in two columns to save the page; here each is one table in the
 * document's own order down the first column and then the second. Nothing is
 * added or dropped, including "A motion was made by Mr. Mr. Morrow" and the
 * two spellings of the donor's wife -- "Louise Brown Freeman" in the
 * superintendent's recommendation and "Isabelle Brown Freeman" in the family's
 * own letter, both on the same page.
 *
 * The headings that name an item the 8 October packet carried link to that
 * item's page, which is where the document behind the vote is; the building
 * committee meeting the superintendent announces for 14 October links to that
 * sitting. The 5 November public meeting at Whittier is not linked here -- it
 * is a public information session rather than a sitting of a board, and it
 * belongs to the item that announces it on this agenda.
 *
 * The minutes are one of this sitting's own documents, so the link at the foot
 * is the city's file rather than an excerpt cut out of the portfolio.
 */
export const load: PageLoad = () => ({
  item: { title: "Hybrid Regular Meeting Minutes of October 8, 2026" },
})

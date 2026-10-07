import type { PageLoad } from "./$types"

/**
 * An approval line that is only a date normally stays on the outline -- but
 * this one is not only a date, for the same reason the September sitting's
 * approval of the 10 September minutes was not: the minutes themselves are the
 * whole record of what the Committee did on 24 September, and the city
 * publishes School Committee minutes nowhere else. Without this page the votes
 * on the MASC delegate, Policy JLIDA and the two special subcommittees exist
 * on this site only inside a PDF.
 *
 * They are transcribed here, on the sitting that votes to approve them, rather
 * than moved onto the 09.24.26 meeting page: what the Committee is voting on
 * tonight is this document, and its own heading links back to that sitting for
 * a reader who wants the agenda the minutes answer to.
 *
 * "of" is dropped from the directory name and nowhere else -- the title is the
 * agenda's phrase as printed, the slug is what a reader has to type.
 *
 * The roll calls and the votes are printed two members to a row, the committee
 * laid out in two columns to save the page; here each is one table in the
 * document's own order down the first column and then the second. Nothing is
 * added or dropped -- including the vote on the superintendent-goals
 * subcommittee, which the minutes print twice: once with Dr. Story's cell
 * blank, because a technical fault had dropped her from the meeting, and again
 * in full once she had returned and asked to be recorded as no.
 *
 * The minutes are one of this sitting's own documents, so the link at the foot
 * is the city's file rather than an excerpt cut out of the portfolio.
 */
export const load: PageLoad = () => ({
  item: { title: "Hybrid Regular Meeting Minutes of September 24, 2026" },
})

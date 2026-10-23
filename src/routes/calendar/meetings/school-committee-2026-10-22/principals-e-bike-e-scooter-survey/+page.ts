import type { PageLoad } from "./$types"

/**
 * The agenda's phrase cut to the matter, the way the September and October
 * sittings' items are: "Mrs. Sapienza Donais: Presentation of principals'
 * e-bike/e-scooter survey" is who is bringing it and what she will do with
 * it; the survey is what it is about.
 *
 * The survey is the one-month check-in on Policy JLIDA Powered Micromobility
 * Device, which the Committee adopted on its third reading on 24 September
 * -- the sitting where Mrs. Sapienza Donais asked for the survey to be
 * distributed to principals. The form's own heading links there, which is why
 * this page adds no sentence explaining the connection.
 *
 * It is a Google Forms results page printed to PDF: seven questions, eleven
 * principals answering. Each multiple-choice question is a pie chart with its
 * legend beside it, and the legend's four options print in the same order on
 * every chart whether or not anyone chose them -- so the tables here give all
 * four options and the percentage against the ones that have a slice, leaving
 * the rest empty, rather than dropping options nobody picked. Percentages are
 * the only figures the page prints; it gives no counts.
 *
 * The free-text answers are printed one under another with no attribution,
 * and two of them are a principal's name alone with no answer after it ("John
 * V DePolo", "Nancy Salach"); those stay as entries of their own, since that
 * is how the form recorded them. "initiall", "ahould" and the form's own
 * "e-bicycles" are as printed.
 */
export const load: PageLoad = () => ({
  item: { title: "Principals' E-bike/E-scooter Survey" },
})

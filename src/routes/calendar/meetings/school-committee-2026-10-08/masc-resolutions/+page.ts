import type { PageLoad } from "./$types"

/**
 * The agenda's phrase, cut to the matter the way the September sitting's items
 * are: "Dr. Grannemann & Ms. Guerrero: Consider MASC Resolutions (with
 * possible votes)" is who is bringing it and what the Committee may do about
 * it; the resolutions are what it is about.
 *
 * The packet attaches five pages of the MASC Delegate Manual 2026 -- the
 * Report of the resolutions committee, the five resolutions moved forward this
 * year, and the three set to expire unless the Delegate Assembly reauthorises
 * them. All of it is transcribed: these are what Haverhill's delegate will be
 * voting on, and the manual is a two-column print a reader cannot search.
 *
 * The delegate is Penelope Guerrero, elected at the sitting of 24 September,
 * which is why the report's own "2026 Annual Meeting of the Association" links
 * to that item rather than being explained in a sentence of ours.
 *
 * The manual's own slips stay as printed: "Chair-Divisison IX", "Laura Often",
 * "Hamden-Wilbraham" against Resolution 4's "Hampden-Wilbraham" for the same
 * district, "WHEREAS,vocational", "THEREFOREBE IT RESOLVED", "legislatre".
 */
export const load: PageLoad = () => ({
  item: { title: "MASC Resolutions" },
})

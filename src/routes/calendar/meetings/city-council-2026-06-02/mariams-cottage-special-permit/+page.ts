import type { PageLoad } from "./$types"

/**
 * The same matter the Council took up on 30 June, 25 August and 22
 * September, under the title and slug those meetings give it. Continued
 * tonight to 30 June at the applicant's request, without being heard.
 *
 * The packet carries the whole application -- narrative, plans, letters for
 * and against, petitions, departments' reviews -- from page 190 to 251; the
 * 30 June page excerpts the letters, so here the application is linked at its
 * page in the city's file, and only the docket cover and the request to
 * continue are cut out.
 */
export const load: PageLoad = () => ({
  item: { title: "Mariam's Cottage Special Permit" },
})

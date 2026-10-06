import type { PageLoad } from "./$types"

/**
 * The agenda prints the applicant's number, EVNT-26-21; the title names the
 * event and the school applying. The application's location is the Lawn at
 * Harbor Place, which a lookup by name does not find, so it is not mapped.
 */
export const load: PageLoad = () => ({
  item: { title: "Boardwalk Block Party, Snowdrop Montessori School" },
})

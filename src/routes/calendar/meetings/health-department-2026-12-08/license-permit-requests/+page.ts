import type { PageLoad } from "./$types"

/**
 * Item 4 is a bucket of seven unrelated applicants, so it is one page titled
 * after the agenda's own heading, each sub-item keeping its own line on the
 * outline -- the arrangement `confirming-appointments` and `event-applications`
 * use on the Council's agendas.
 */
export const load: PageLoad = () => ({
  item: { title: "License/Permit Requests" },
})

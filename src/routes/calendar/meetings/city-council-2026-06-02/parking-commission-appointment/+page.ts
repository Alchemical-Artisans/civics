import type { PageLoad } from "./$types"

/** The appointment and the body, as the 30 June page titles its own. */
export const load: PageLoad = () => ({
  item: { title: "Appointment, Parking Commission" },
})

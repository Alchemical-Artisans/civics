import type { PageLoad } from "./$types"

/** The bucket's own heading, the same slug it carries on earlier sittings. */
export const load: PageLoad = () => ({
  item: { title: "Confirming Appointments" },
})

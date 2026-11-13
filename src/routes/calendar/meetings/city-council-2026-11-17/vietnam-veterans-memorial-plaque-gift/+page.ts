import type { PageLoad } from "./$types"

/** The agenda's order is a sentence; the title names what is being given and where. */
export const load: PageLoad = () => ({
  item: { title: "Plaque Restoration at the Vietnam Veterans Memorial" },
})

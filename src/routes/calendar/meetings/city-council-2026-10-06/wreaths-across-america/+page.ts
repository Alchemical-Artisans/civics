import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name, so the title names
 * the programme the speaker is here about and where it is held.
 */
export const load: PageLoad = () => ({
  item: { title: "Wreaths Across America, Hilldale Cemetery" },
})

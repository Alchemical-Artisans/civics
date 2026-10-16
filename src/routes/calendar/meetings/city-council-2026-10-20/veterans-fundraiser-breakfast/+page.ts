import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name, so the title names
 * the event the speaker is here to invite the public to.
 */
export const load: PageLoad = () => ({
  item: { title: "Veterans Fundraiser Breakfast" },
})

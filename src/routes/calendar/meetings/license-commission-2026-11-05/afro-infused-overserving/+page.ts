import type { PageLoad } from "./$types"

/**
 * Four of this sitting's six show cause hearings are brought under the same
 * regulation, so the agenda's own wording for the item names no one matter;
 * the title is the allegation and the licensee instead.
 */
export const load: PageLoad = () => ({
  item: { title: "Afro-Infused Restaurant & Lounge – Possible Overserving" },
})

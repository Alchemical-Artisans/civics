import type { PageLoad } from "./$types"

/**
 * 5.2 is a bucket line -- "Mayor Barrett submits the following gift order:" --
 * and 5.2.1 is the matter, so this is one page for both and the outline's
 * numbered sub-item links to it. The title names the donor and what is being
 * accepted, cut from the order's own heading.
 */
export const load: PageLoad = () => ({
  item: { title: "Gift from Wingate Residences" },
})

import type { PageLoad } from "./$types"

/**
 * The agenda's line is a sentence; the Mayor's letter behind it is headed
 * "Re: Recognize Fire Chief Robert O'Brien", which is the item's own name.
 */
export const load: PageLoad = () => ({
  item: { title: "Recognize Fire Chief Robert O’Brien" },
})

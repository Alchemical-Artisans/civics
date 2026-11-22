import type { PageLoad } from "./$types"

/**
 * Item 22's own heading, title-cased. The agenda prints nothing under it; the
 * clerk's list is the packet's last page, and it is transcribed here as every
 * sitting's is.
 */
export const load: PageLoad = () => ({
  item: { title: "Documents Referred to Committee Study" },
  wide: true,
})

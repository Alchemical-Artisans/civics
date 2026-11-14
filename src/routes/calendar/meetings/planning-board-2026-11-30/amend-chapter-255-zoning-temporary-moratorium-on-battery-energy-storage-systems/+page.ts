import type { PageLoad } from "./$types"

/**
 * The agenda prints no underlined name for this hearing, only the sentence, so
 * the title is the matter itself. It is the Council's petition of 17 November
 * (item 12.1), which the Council's own page carries under the same title; the
 * board's other zoning hearings are the BESS overlay, a different matter.
 */
export const load: PageLoad = () => ({
  item: { title: "Temporary Moratorium on Battery Energy Storage Systems" },
})

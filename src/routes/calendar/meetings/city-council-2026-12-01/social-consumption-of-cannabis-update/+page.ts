import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title names what the councilors ask after. */
export const load: PageLoad = () => ({
  item: { title: "Social Consumption of Cannabis Update" },
})

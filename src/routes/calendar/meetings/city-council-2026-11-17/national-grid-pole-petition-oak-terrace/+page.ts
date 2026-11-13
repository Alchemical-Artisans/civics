import type { PageLoad } from "./$types"

/** Two pole petitions share a sitting, so each is named for its street; the agenda's WR number is on the page. Oak Terrace is a street the lookup resolves to no point on, so there is no map. */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, Oak Terrace" },
})

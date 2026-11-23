import type { PageLoad } from "./$types"

/**
 * The bucket heading, standing for its one sub-item, as `tag-days` is on other sittings.
 */
export const load: PageLoad = () => ({
  item: { title: "Tag Days" },
})

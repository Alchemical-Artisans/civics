import type { PageLoad } from "./$types"

/**
 * One of the two applications under the agenda's 12.3, each its own page.
 *
 * They were one page, the way earlier sittings' event applications are, and
 * the two have nothing to do with each other beyond the heading they are
 * filed under: a market on four winter Saturdays downtown and a dog show one
 * Saturday across the river, each with its own permit record, its own venue's
 * letter and its own place on the map. The agenda already linked them
 * separately.
 */
export const load: PageLoad = () => ({
  item: { title: "Winter Haverhill Farmers Market, Creative Haverhill" },
})

import type { PageLoad } from "./$types"

/**
 * The item's own title, marked as the strike-through: this page is the diff's
 * companion, one level beneath the item, and a reader arriving from a search
 * should be able to tell the two apart by their headings alone.
 */
export const load: PageLoad = () => ({
  item: { title: "Water Use Restriction Ordinance: Strike-Through" },
})

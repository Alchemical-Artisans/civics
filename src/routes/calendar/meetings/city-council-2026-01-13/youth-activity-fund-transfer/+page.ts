import type { PageLoad } from "./$types"

/**
 * The order's own subject. The agenda numbers it 16.1 and prints the order
 * itself as 5.5.1, the number it carried when the Mayor filed it.
 */
export const load: PageLoad = () => ({
  item: { title: "Youth Activity Fund Transfer" },
})

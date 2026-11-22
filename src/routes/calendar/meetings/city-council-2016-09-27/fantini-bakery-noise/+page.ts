import type { PageLoad } from "./$types"

/**
 * The agenda prints no name for this item, only the sentence; this names
 * what it is about. No map: Nominatim does not know Fantini Bakery by name.
 */
export const load: PageLoad = () => ({
  item: { title: "Noise at Fantini Bakery, Currier Square" },
})

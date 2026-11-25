import type { PageLoad } from "./$types"

/**
 * The title the same petition carries on 20 October, where the hearing was
 * set: the agenda again prints "North Boardway", and the petition, order and
 * plan all say North Broadway. The packet also holds the assessors' abutters
 * list, which names private owners and is not excerpted.
 */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, North Broadway" },
})

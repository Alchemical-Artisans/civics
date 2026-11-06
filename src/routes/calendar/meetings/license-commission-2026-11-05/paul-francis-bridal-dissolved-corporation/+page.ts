import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item is the statute it is brought under, which
 * every show cause hearing on this agenda shares; the title names what the
 * hearing is about instead.
 */
export const load: PageLoad = () => ({
  item: { title: "Paul Francis Bridal – Operating with a Dissolved Corporation" },
})

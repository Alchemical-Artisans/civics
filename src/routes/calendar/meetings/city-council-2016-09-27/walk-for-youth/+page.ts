import type { PageLoad } from "./$types"

/**
 * The agenda prints no name for 10.1; this is the event's own name and who
 * holds it.
 */
export const load: PageLoad = () => ({
  item: { title: "Walk for Youth, Boys & Girls Club" },
})

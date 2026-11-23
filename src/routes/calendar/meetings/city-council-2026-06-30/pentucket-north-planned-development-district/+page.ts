import type { PageLoad } from "./$types"

/**
 * The same matter the Council heard on August 25 and October 27, under the
 * title and slug those meetings give it. Tonight it was filed and referred, the
 * first step on the project's timeline.
 */
export const load: PageLoad = () => ({
  item: { title: "Pentucket North Planned Development District" },
})

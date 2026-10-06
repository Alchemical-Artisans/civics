import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence and puts three orders beneath it, one
 * per precinct moved. 8.2.1 to 8.2.3 are transcribed here and nowhere else, the
 * same as any sub-item whose parent has a page of its own.
 */
export const load: PageLoad = () => ({
  item: { title: "Polling Place Changes" },
})

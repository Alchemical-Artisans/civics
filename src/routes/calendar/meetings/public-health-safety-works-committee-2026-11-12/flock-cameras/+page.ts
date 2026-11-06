import type { PageLoad } from "./$types"

/**
 * The notice gives the item a document number and a motion rather than a
 * name. The title and the slug are the ones the same matter already carries
 * under the Council's sitting of 11 August 2026, where it was presented and
 * where this motion was made, so a reader following one to the other reads
 * the same words for it.
 */
export const load: PageLoad = () => ({
  item: { title: "Flock Cameras and License Plate Monitoring" },
})

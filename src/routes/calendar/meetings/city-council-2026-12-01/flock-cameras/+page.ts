import type { PageLoad } from "./$types"

/**
 * The title and slug the same matter carries on 11 August, where the Council
 * heard it, and at the Public Health, Safety and Works Committee on 12
 * November, so a reader following one to the next reads the same words.
 */
export const load: PageLoad = () => ({
  item: { title: "Flock Cameras and License Plate Monitoring" },
})

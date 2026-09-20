import type { PageLoad } from "./$types"

/**
 * The agenda's own heading for the bucket. All four appointees sit under one
 * sub-item, 11.1.1, and one mayor's letter names them together.
 */
export const load: PageLoad = () => ({
  item: { title: "Confirming Appointments" },
})

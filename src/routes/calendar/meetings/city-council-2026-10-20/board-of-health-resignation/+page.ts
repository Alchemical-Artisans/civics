import type { PageLoad } from "./$types"

/**
 * The Mayor's letter's own subject line. The agenda's 11.4.1 is the board, the
 * name and the date, under a bare "Resignation:" heading that names no body.
 */
export const load: PageLoad = () => ({
  item: { title: "Board of Health Resignation, Dr. Romie Mundy" },
})

import type { PageLoad } from "./$types"

/**
 * The Mayor's letter's own subject line, "Introduce Alison Gulubicki, Economic
 * Development Director"; the agenda line is the same sentence and names no
 * shorter matter.
 */
export const load: PageLoad = () => ({
  item: { title: "Introduce Alison Gulubicki, Economic Development Director" },
})

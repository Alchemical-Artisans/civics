import type { PageLoad } from "./$types"

/**
 * The agenda line is an introduction with no name of its own; the title is
 * the line's own closing phrase, which says what the three people have in
 * common.
 */
export const load: PageLoad = () => ({
  item: { title: "2025 Cogswell Club Grant Recipients" },
})

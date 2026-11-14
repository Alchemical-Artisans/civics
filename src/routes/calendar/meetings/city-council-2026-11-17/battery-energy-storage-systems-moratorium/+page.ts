import type { PageLoad } from "./$types"

/**
 * Not the Battery Energy Storage Systems overlay ordinance of 25 August and
 * after (Docs. 21-B and 41-B), which says where such systems may go: this is a
 * separate petition to stop them for a period, so it has its own page. The
 * title is the section the petition would add, 7.9, as the agenda prints it.
 */
export const load: PageLoad = () => ({
  item: { title: "Temporary Moratorium on Battery Energy Storage Systems" },
})

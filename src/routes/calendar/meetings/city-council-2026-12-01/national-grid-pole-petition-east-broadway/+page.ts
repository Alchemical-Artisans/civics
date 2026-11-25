import type { PageLoad } from "./$types"

/**
 * The street, as the agenda names it. The pole is to serve 309 East
 * Broadway, the well site of item 5.4, which the agenda line does not print,
 * so there is no map -- the form of the 17 November pole petitions. The
 * abutters list names private owners and is not excerpted.
 */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, East Broadway" },
})

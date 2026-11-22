import type { PageLoad } from "./$types"

/**
 * The section's own heading, title-cased. Twenty license classes with one
 * renewal under one of them, so the whole list is here and the outline carries
 * the heading alone. Black Tie Limousine's address has no map: the agenda
 * prints 5 Bond st and the application in the packet 25 Bond St.
 */
export const load: PageLoad = () => ({
  item: { title: "Annual License Renewals" },
})

import type { PageLoad } from "./$types"

/**
 * The agenda prints no name for 14.2; this names the order Documents 83 and
 * 83-B are about. The outline's link says the request to vacate instead, that
 * being what this sitting was asked. The packet's timeline for the owners
 * starts on its own page 2; the city's file carries no first page of it, and
 * the packet repeats three of these documents (pages 46, 47 and 49), which are
 * not cut twice.
 */
export const load: PageLoad = () => ({
  item: { title: "Demolition Order, 425 Washington St" },
})

import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence; the title names the document the
 * Clerk submits, the same as the November warrant's. It is a different
 * warrant, not the same one reissued: the polling places are the primary's,
 * printed before the Council's own orders above it took effect, and the
 * offices are the party primaries' rather than the election's.
 */
export const load: PageLoad = () => ({
  item: { title: "Election Warrant, 2026 State Primary" },
})

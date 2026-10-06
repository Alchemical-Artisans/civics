import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence; the title names the committee report
 * and the day it met. The committee's own sitting is a page of its own.
 */
export const load: PageLoad = () => ({
  item: { title: "Public Safety Committee Summary, July 29, 2026" },
})

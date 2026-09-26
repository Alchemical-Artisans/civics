import type { PageLoad } from "./$types"

/**
 * The committee and the date of the sitting reported on. Neither the covering
 * letter nor the minutes carries a subject line, and the agenda's own entry is
 * a sentence.
 */
export const load: PageLoad = () => ({
  item: { title: "Natural Resources and Public Property Committee Report, September 14, 2026" },
})

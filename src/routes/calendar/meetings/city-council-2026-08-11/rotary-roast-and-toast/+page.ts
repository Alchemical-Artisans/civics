import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name; the title names
 * the event. The agenda says Thursday, September 10th and the minutes say
 * September 12th; both are kept as printed.
 */
export const load: PageLoad = () => ({
  item: { title: "Roast & Toast of Peter Carbone, Haverhill Rotary Club" },
})

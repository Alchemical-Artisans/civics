import type { PageLoad } from "./$types"

/**
 * The agenda prints the commission and the name under the "Resignations"
 * heading; the title names what the item is. The agenda numbers it 11.4.1 and
 * the minutes 11.5; each is kept as its own document prints it.
 */
export const load: PageLoad = () => ({
  item: { title: "Resignation, Washington Street Shoe Historic District Commission" },
})

import type { PageLoad } from "./$types"

/**
 * Order 13.1, the Water Department's budget for fiscal 2027, continued to 16
 * June at the Mayor's request. The title is what the order does and for which
 * department. Both of the attachment's tables are transcribed cell for cell;
 * the first is printed upside down on its page and was read turned round.
 *
 * `wide` for the seven-column tables.
 */
export const load: PageLoad = () => ({
  item: { title: "FY2027 Water Department Appropriation" },
  wide: true,
})

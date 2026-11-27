import type { PageLoad } from "./$types"

/**
 * Order 13.2, the Wastewater Department's budget for fiscal 2027, continued to
 * 16 June at the Mayor's request. The attachment's revenue table heads one
 * column with nothing and prints "Availible"; both kept as printed.
 *
 * `wide` for the seven-column tables.
 */
export const load: PageLoad = () => ({
  item: { title: "FY2027 Wastewater Department Appropriation" },
  wide: true,
})

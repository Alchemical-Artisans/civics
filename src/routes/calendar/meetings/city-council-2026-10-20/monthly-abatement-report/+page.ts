import type { PageLoad } from "./$types"

/** `wide` for the report's thirteen columns. */
export const load: PageLoad = () => ({
  item: { title: "Monthly Abatement Report, September" },
  wide: true,
})

import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The memo's
 * RE line names the item -- "Request to Dispose of Surplus City Vehicles with
 * Estimated Value Exceeding $10,000" -- but that is a heading and a half, so
 * this is the middle of it.
 */
export const load: PageLoad = () => ({
  item: { title: "Surplus City Vehicles" },
})

import type { PageLoad } from "./$types"

/**
 * Stands for two agenda items: 5.4, the Mayor's request for support of Senate
 * Bill 3077, and 15.1, the councilors' request to discuss e-bikes and the Ride
 * Safe Act. The minutes record that the Clerk "called up 15.1 with this item",
 * so both were heard together. Each item's text is below under its own number.
 * The title is the bill's, cut to what it is about.
 */
export const load: PageLoad = () => ({
  item: { title: "Senate Bill 3077, Micromobility Devices" },
})

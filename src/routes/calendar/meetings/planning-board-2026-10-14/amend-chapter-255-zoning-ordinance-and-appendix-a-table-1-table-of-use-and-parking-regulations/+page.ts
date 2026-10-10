import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's: the phrase the agenda underlines, as printed, and here the
 * directory is that title slugged. Unlike the two hearings above it on this
 * agenda, the printed name does say which matter it is -- twelve sections of
 * the ordinance and the use table -- and the city gives the package no shorter
 * name anywhere.
 */
export const load: PageLoad = () => ({
  item: {
    title:
      "Amend Chapter 255 Zoning Ordinance and Appendix A Table 1: Table of Use and Parking Regulations",
  },
})

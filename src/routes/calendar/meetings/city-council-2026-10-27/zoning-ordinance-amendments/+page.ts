import type { PageLoad } from "./$types"

/**
 * The Planning Director's own subject line, cut to the matter: "Amend Chapter
 * 255 Zoning Ordinance and Appendix A Table 1: Table of Use and Parking
 * Regulations". The agenda's own line for the item is the whole of that
 * sentence plus the Doc number, and "Amend Chapter 255 Zoning Ordinance and
 * Zoning Map" is what the city calls every such petition, so the directory is
 * named for what this one actually does.
 *
 * `wide` for the diff, which lays today's text and the amended text side by
 * side by default, and for the fifteen-column use table under it.
 */
export const load: PageLoad = () => ({
  item: { title: "Amendments to Chapter 255, Zoning" },
  wide: true,
})

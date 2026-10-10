import type { PageLoad } from "./$types"

/**
 * The item's own title, as the board prints it: the underlined phrase plus the
 * dashed qualifier naming the overlay district, without which it would read
 * word for word the same as the Pentucket North hearing above it on this same
 * agenda.
 *
 * The directory is the slug the matter already carries on the City Council's
 * agendas of 14 July, 25 August and 15 September 2026, so a reader following
 * one board to the other gets the same word.
 */
export const load: PageLoad = () => ({
  item: {
    title:
      "Amend Chapter 255 Zoning Ordinance and Zoning Map – Battery Energy Storage Systems Overlay District (BESS)",
  },
})

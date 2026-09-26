import type { PageLoad } from "./$types"

/**
 * The Mayor's letter calls it "An Order Relating to the Amendment of the
 * All-Night Parking Ordinance"; this is what the ordinance itself is called,
 * the same shortening the water ordinance's item takes.
 *
 * No `wide` here, unlike the water ordinance: the packet does the comparison
 * itself. The order reprints § 240-24 with the words it adds emboldened and
 * the words it drops struck through, so there is one marked text to transcribe
 * rather than two unmarked ones to set against each other, and a marked text
 * is a reading column.
 */
export const load: PageLoad = () => ({
  item: { title: "All-Night Parking Ordinance" },
})

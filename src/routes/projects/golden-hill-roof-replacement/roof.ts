/**
 * The Golden Hill roof, as the documents filed for it state it.
 *
 * Here rather than in either page because two pages show the same facts: this
 * project's own front page, and the write-up of the loan order the Council
 * took up on 20 October, which quotes the order and the Schools' letter in
 * full. The election's `election.ts` is the same arrangement for the same
 * reason -- the warrant's item page renders the polling places from there, so
 * a precinct page and a transcription cannot disagree about where anybody
 * votes.
 *
 * Every figure below is printed in one of those documents. Nothing is
 * computed: the city's share is the Schools' own projection of it, not
 * 22.53% of the total worked out here, and it keeps the "approximately" the
 * letter puts in front of it.
 */

import { Router } from "$lib/router"

const MEETING = "city-council-2026-10-20"
const ITEM = "golden-hill-roof-replacement-bonds"

/**
 * The Schools' Chief Financial Officer's letter of 15 October 2026, as the
 * city filed it with the order. Both quotations on the project page come from
 * it, and both financing figures are read off it, so it is named once here
 * rather than built again by every page that points at it.
 */
export const SCHOOLS_LETTER = Router.excerpt(MEETING, `${ITEM}/schools-letter`)

/** One figure, as a card draws it. */
export interface Figure {
  /**
   * The label over it. Ours -- a letter states a sum in the middle of a
   * sentence and heads it with nothing -- so each is the plainest word for
   * what the document is saying, and nothing is claimed in it that the
   * `value` and `note` below do not say in the document's own words.
   *
   * **A condition has to be somewhere a reader cannot miss it**, not only in
   * the small type under the figure: a card is read as a settled fact, and
   * the two below are not settled at all -- no grant has been approved, and
   * the figure that depends on one is a projection. Where a whole set of them
   * shares the condition it goes in the heading over them, which is why
   * neither of these labels carries it.
   */
  label: string
  /** The figure exactly as the document prints it. */
  value: string
  /** What the document qualifies it with, in the document's own words. */
  note: string
  /**
   * The file the figure is read off, which the whole card links to. A figure
   * stated on a page of its own, away from the document it comes from, has to
   * carry the way back to it: the card is how a reader meets the number, so
   * the card is what has to be the citation.
   */
  href: string
}

/**
 * What the roof costs: the sum the order appropriates, and nothing beside it.
 *
 * It is the one figure here that is settled, and it is stated bare -- no
 * label of ours, no caveat, no note that $300,000 of it was voted in January.
 * All of that is true and all of it is in the order, which this project's
 * page links twice over; none of it is what a reader asking what the roof
 * costs is asking. The two figures below are a different question -- how much
 * of this the city expects to carry -- and neither is settled at all.
 */
export const APPROPRIATION = "$3,564,770"

/**
 * How much of it the city expects to carry: what the Schools' Chief Financial
 * Officer gives for the state's share and for what would be left.
 *
 * **Neither is settled.** Nothing has been granted. The order is blunt about
 * it -- the program is discretionary, a grant is capped at the lesser of
 * 77.47% and whatever the MSBA decides, and anything the grant does not cover
 * is the city's -- and the letter projects the $803,000 subject to costs not
 * yet final and an approval not yet given. So the reimbursement is "up to",
 * and the order's own sentence about who pays the rest is under the second.
 *
 * The condition itself is the subsection's heading -- "MSBA financing (if
 * approved)" -- rather than a clause on each label, which said it twice under
 * a heading that had just said it once.
 */
export const SHARES: Figure[] = [
  {
    label: "MSBA reimbursement",
    value: "up to 77.47%",
    note: "a non-entitlement, discretionary program based on need, as determined by the MSBA",
    href: SCHOOLS_LETTER,
  },
  {
    label: "The city's share",
    value: "$803,000",
    note: "a projection, subject to final eligible project costs and MSBA approval; project costs in excess of any grant are the sole responsibility of the City",
    href: SCHOOLS_LETTER,
  },
]

/**
 * The school, for the map on both pages. One copy, so the two cannot point at
 * different buildings; the point was looked up once by hand against
 * Nominatim, the way every `AddressMap` on the site is.
 */
export const SCHOOL = {
  address: "Golden Hill Elementary School, 140 Boardman Street, Haverhill, MA",
  lat: 42.7755343,
  lon: -71.0584354,
}

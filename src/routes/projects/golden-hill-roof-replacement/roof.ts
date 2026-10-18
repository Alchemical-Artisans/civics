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

/** One figure, as a card draws it. */
export interface Figure {
  /**
   * The label over it. Ours -- a letter states a sum in the middle of a
   * sentence and heads it with nothing -- so each is the plainest word for
   * what the document is saying, and nothing is claimed in it that the
   * `value` and `note` below do not say in the document's own words.
   *
   * **A condition belongs in the label**, not only in the small type under
   * the figure. A card is read as a settled fact, and two of these are not
   * settled at all: no grant has been approved, and the figure that depends
   * on one is a projection. A reader who takes in the label and the figure
   * and nothing else should still have been told that.
   */
  label: string
  /** The figure exactly as the document prints it. */
  value: string
  /** What the document qualifies it with, in the document's own words. */
  note: string
}

/**
 * What the roof costs and who pays for it: the order's appropriation, then
 * the two figures the Schools' Chief Financial Officer gives for how much of
 * it the city expects to carry itself.
 *
 * **Only the first of the three is settled.** The city is borrowing
 * $3,564,770; the other two cards say what it hopes to get back and what it
 * expects to be left with, and nothing has been granted. The order is blunt
 * about it -- the program is discretionary, a grant is capped at the lesser
 * of 77.47% and whatever the MSBA decides, and anything the grant does not
 * cover is the city's -- and the letter projects the $803,000 subject to
 * costs not yet final and an approval not yet given. So the reimbursement is
 * "up to", both labels carry their condition, and the order's own sentence
 * about who pays the rest is under the third.
 */
export const COST: Figure[] = [
  {
    label: "Appropriation",
    value: "$3,564,770",
    note: "borrowed, including $300,000 already appropriated January 13, 2026",
  },
  {
    label: "MSBA reimbursement, if approved",
    value: "up to 77.47%",
    note: "a non-entitlement, discretionary program based on need, as determined by the MSBA",
  },
  {
    label: "The city's share, if approved",
    value: "$803,000",
    note: "a projection, subject to final eligible project costs and MSBA approval; project costs in excess of any grant are the sole responsibility of the City",
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

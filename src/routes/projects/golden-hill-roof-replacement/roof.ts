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
 * What is here is the one figure the page states in its own right -- the sum
 * the order appropriates -- the letter its passages are quoted from, and the
 * school. Everything else the page says is a passage of a document, quoted in
 * the page itself where it is read.
 */

import { Router } from "$lib/router"

const MEETING = "city-council-2026-10-20"
const ITEM = "golden-hill-roof-replacement-bonds"

/**
 * The Schools' Chief Financial Officer's letter of 15 October 2026, as the
 * city filed it with the order. Every passage the project page quotes is from
 * it, so the file is named once here rather than built again beside each
 * citation.
 */
export const SCHOOLS_LETTER = Router.excerpt(MEETING, `${ITEM}/schools-letter`)

/**
 * What the roof costs: the sum the order appropriates, and nothing beside it.
 *
 * It is the one figure the page states as a figure, and it is stated bare --
 * no label of ours, no caveat, no note that $300,000 of it was voted in
 * January. All of that is true and all of it is in the order, which this
 * project's page links twice over; none of it is what a reader asking what
 * the roof costs is asking. What the city expects to get back, and to be left
 * with, is a different question and a less settled one, and the page answers
 * it the way it answers everything else: with the sentence the Schools' own
 * letter answers it in.
 */
export const APPROPRIATION = "$3,564,770"

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

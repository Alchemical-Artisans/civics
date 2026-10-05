import { error } from "@sveltejs/kit"
import type { EntryGenerator, PageLoad } from "./$types"
import { PRECINCTS } from "../../election"

/**
 * One page per precinct, prerendered: twenty-one of them, from the same
 * MassGIS file the project's map draws. A parameter route rather than
 * twenty-one directories because nothing on a precinct page is written by hand
 * -- every word is the warrant's or the shape's, and a directory per precinct
 * would be twenty-one copies of one template. `entries` names them so the
 * build fails if the data and the links ever disagree, the reason `[meeting]`
 * gives for doing the same.
 *
 * A sub-precinct has no page of its own: it is half of a precinct, drawn and
 * described on its parent's page, which is where a reader who knows only
 * "Ward 1, Precinct 2" is going to look.
 */
export const entries: EntryGenerator = () => PRECINCTS.map((p) => ({ precinct: p.id }))

export const load: PageLoad = ({ params }) => {
  const precinct = PRECINCTS.find((p) => p.id === params.precinct)
  if (!precinct) error(404, `No precinct ${params.precinct}`)
  return { precinct }
}

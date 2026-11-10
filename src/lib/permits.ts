import PERMITS from "./data/permits.json"
import { Router } from "./router"

/**
 * The city runs its permits and licences on OpenGov, and a record there holds
 * what the agenda packet leaves out: the application as filed, the departments'
 * memos, the abutters, the revisions, and the letters for and against.
 * `CCSP-26-7`'s record carries twenty-five files where the Council's packet for
 * the same hearing carries seven.
 *
 * An agenda names that record -- "Doc 21-J - CCSP-26-7" -- so the number
 * printed in a write-up is the join, and linking it is the whole of what this
 * does. The number is the city's own identifier and the link's own text, which
 * is why nothing here writes a label.
 *
 * **The number is not enough to build a URL from.** A record's address is
 * `/records/<id>` on an id of OpenGov's own (`CCSP-26-7` is 231770), and the
 * only way from one to the other is the portal's search, which is behind a
 * Cloudflare Turnstile challenge: every read of the portal's data service wants
 * an `x-turnstile-proof` header minted by passing that challenge, and without
 * one the service answers `403 {"errors":["forbidden"]}`. So the id is copied
 * by hand off the record's own page, once, the same bargain `AddressMap`'s
 * coordinates make with Nominatim. A number with no entry here is left as the
 * plain text the document printed rather than linked to a guess.
 *
 * Only the record page can be linked, never a file on it. The files are Azure
 * blob URLs carrying a read signature that starts when the page is drawn and
 * expires an hour later, minted fresh on every load -- committing one would
 * publish a link dead by the time anybody followed it. The record page is
 * stable, public, and mints them again for whoever opens it.
 */
const RECORDS: Record<string, number> = PERMITS

/**
 * The portal's page for a record the city has printed the number of, or `null`
 * where nobody has looked that number's id up yet -- which is the signal to
 * leave the number unlinked.
 */
export function permitRecord(number: string): string | null {
  const id = RECORDS[number]
  return id === undefined ? null : Router.permitRecord(id)
}

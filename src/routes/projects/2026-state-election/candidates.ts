/**
 * Who is on the ballot, for the races a Haverhill voter votes in.
 *
 * Transcribed from the Secretary of the Commonwealth's "2026 State Election
 * Candidates" page, saved on 6 October 2026 and committed beside the other
 * data as `$lib/data/2026-state-election-candidates.pdf`. By hand, because the
 * page sits behind bot protection that answers a script with an empty
 * challenge, so there is nothing to scrape; the PDF is what a person can check
 * this against. Names and parties are as the page prints them (a governor and
 * lieutenant governor are one ticket and print as one line, without addresses).
 *
 * `url` is the candidate's own campaign site, where one could be found and
 * loaded; the state's list carries none, so these came from Politics1's and
 * each was fetched to see that it is that candidate's. An incumbent's
 * government page is not a campaign site and is not used, and a candidate
 * with no `url` simply has none here -- it means not found, not none.
 *
 * Keyed by the warrant's office and district (`OFFICES`), so `ballotFor` can
 * look a line up with the same two strings it already matches on. The one race
 * the warrant names no row for -- the Fifteenth Essex House seat -- is keyed by
 * the same spelling `warrantDistrict` gives MassGIS's name for it.
 */
export interface Candidate {
  name: string
  party: string
  /** The candidate's own campaign site, where one was found. */
  url?: string
}

export const CANDIDATES_SOURCE = {
  name: "Secretary of the Commonwealth, 2026 State Election Candidates",
  url: "https://www.sec.state.ma.us/divisions/elections/research-and-statistics/2026-state-election-candidates.htm",
} as const

const key = (office: string, district: string) => `${office}|${district}`

const c = (name: string, party: string, url?: string): Candidate => ({ name, party, url })

export const CANDIDATES = new Map<string, Candidate[]>([
  [
    key("SENATOR IN CONGRESS", "For this Commonwealth"),
    [
      c("Edward J. Markey", "Democratic", "https://www.edmarkey.com"),
      c("John Deaton", "Republican", "https://johndeatonforsenate.com/"),
      c("Shiva Ayyadurai", "Independent", "https://shiva4senate.com"),
      c("Joe Tache", "Socialism and Liberation", "https://www.tache4ma.com"),
    ],
  ],
  [
    key("GOVERNOR and LIEUTENANT GOVERNOR", "For this Commonwealth"),
    [
      c("Healey and Driscoll", "Democratic"),
      c("Minogue and Oliver", "Republican", "https://minogueforma.com"),
      c("James and Kittredge", "Independent", "https://www.ajforma.com"),
    ],
  ],
  [
    key("ATTORNEY GENERAL", "For this Commonwealth"),
    [
      c("Andrea Joy Campbell", "Democratic"),
      c("Michael C. Walsh", "Republican", "https://mikewalshforag.com"),
    ],
  ],
  [
    key("SECRETARY OF STATE", "For this Commonwealth"),
    [
      c("William Francis Galvin", "Democratic"),
      c("Anne R. Brensley", "Republican", "https://www.anne2026.com"),
    ],
  ],
  [
    key("TREASURER", "For this Commonwealth"),
    [
      c("Deborah B. Goldberg", "Democratic", "https://www.debgoldberg.com"),
      c("Elizabeth Dionne", "Republican", "https://votedionne.com"),
    ],
  ],
  [
    key("AUDITOR", "For this Commonwealth"),
    [
      c("Diana DiZoglio", "Democratic", "https://www.dianadizoglio.com"),
      c("Al Ozonoff", "Libertarian", "https://ozonoff4auditor.com"),
    ],
  ],
  [
    key("REPRESENTATIVE IN CONGRESS", "THIRD DISTRICT"),
    [
      c("Lori Loureiro Trahan", "Democratic"),
      c("Gary J. Grossi", "Republican", "https://www.garygrossi.org"),
      c("Dennis R. Conlon", "Unenrolled"),
    ],
  ],
  [
    key("COUNCILLOR", "FIFTH DISTRICT"),
    [
      c("Eunice Delice Zeigler", "Democratic", "https://www.eunicezeigler.com/"),
      c("William Falcetano", "Republican"),
    ],
  ],
  [key("SENATOR IN GENERAL COURT", "FIRST ESSEX DISTRICT"), [c("Pavel M. Payano", "Democratic")]],
  [
    key("SENATOR IN GENERAL COURT", "SECOND ESSEX AND MIDDLESEX DISTRICT"),
    [c("Barry R. Finegold", "Democratic"), c("Theodore T. Semesnyei", "Republican")],
  ],
  [
    key("REPRESENTATIVE IN GENERAL COURT", "THIRD ESSEX DISTRICT"),
    [c("Andres Xavier Vargas", "Democratic")],
  ],
  [
    key("REPRESENTATIVE IN GENERAL COURT", "FIFTEENTH ESSEX DISTRICT"),
    [c("Ryan M. Hamilton", "Democratic"), c("Ronald L. Heiseler, III", "Republican")],
  ],
  [key("DISTRICT ATTORNEY", "EASTERN DISTRICT"), [c("Paul F. Tucker", "Democratic")]],
  [key("REGISTER OF PROBATE", "ESSEX COUNTY"), [c("Pamela Casey O'Brien", "Democratic")]],
])

export function candidatesFor(office: string, district: string): Candidate[] {
  return CANDIDATES.get(key(office, district)) ?? []
}

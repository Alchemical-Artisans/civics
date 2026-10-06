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
 * `url` is the candidate's own page, which the state's list does not carry:
 * most are campaign sites, found through Politics1's list and checked by
 * fetching each, the rest supplied by the site's owner, and a few of those are
 * a LinkedIn or Facebook page where that is all the candidate has. An
 * incumbent's government page is not used. Without a `url` there is none here.
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
      c("Healey and Driscoll", "Democratic", "https://maurahealey.com/"),
      c("Minogue and Oliver", "Republican", "https://minogueforma.com"),
      c("James and Kittredge", "Independent", "https://www.ajforma.com"),
    ],
  ],
  [
    key("ATTORNEY GENERAL", "For this Commonwealth"),
    [
      c("Andrea Joy Campbell", "Democratic", "https://andreacampbell.org/"),
      c("Michael C. Walsh", "Republican", "https://mikewalshforag.com"),
    ],
  ],
  [
    key("SECRETARY OF STATE", "For this Commonwealth"),
    [
      c("William Francis Galvin", "Democratic", "https://billgalvin.com/"),
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
      c("Lori Loureiro Trahan", "Democratic", "https://loritrahan.com/"),
      c("Gary J. Grossi", "Republican", "https://www.garygrossi.org"),
      c("Dennis R. Conlon", "Unenrolled", "https://www.linkedin.com/in/dennis-conlon-4ba8854/"),
    ],
  ],
  [
    key("COUNCILLOR", "FIFTH DISTRICT"),
    [
      c("Eunice Delice Zeigler", "Democratic", "https://www.eunicezeigler.com/"),
      c(
        "William Falcetano",
        "Republican",
        "https://www.facebook.com/p/William-Falcetano-for-Governors-Council-61593663411654/",
      ),
    ],
  ],
  [
    key("SENATOR IN GENERAL COURT", "FIRST ESSEX DISTRICT"),
    [c("Pavel M. Payano", "Democratic", "https://www.pavelpayano.com/")],
  ],
  [
    key("SENATOR IN GENERAL COURT", "SECOND ESSEX AND MIDDLESEX DISTRICT"),
    [
      c("Barry R. Finegold", "Democratic", "https://www.barryfinegold.com/"),
      c("Theodore T. Semesnyei", "Republican", "https://semesnyei.com/"),
    ],
  ],
  [
    key("REPRESENTATIVE IN GENERAL COURT", "THIRD ESSEX DISTRICT"),
    [c("Andres Xavier Vargas", "Democratic", "https://www.repandyvargas.com/")],
  ],
  [
    key("REPRESENTATIVE IN GENERAL COURT", "FIFTEENTH ESSEX DISTRICT"),
    [
      c("Ryan M. Hamilton", "Democratic", "https://hamilton4rep.com/index.html"),
      c("Ronald L. Heiseler, III", "Republican", "https://www.ronnieheiseler.com/"),
    ],
  ],
  [
    key("DISTRICT ATTORNEY", "EASTERN DISTRICT"),
    [c("Paul F. Tucker", "Democratic", "https://www.facebook.com/PaulTuckerSalem/")],
  ],
  [
    key("REGISTER OF PROBATE", "ESSEX COUNTY"),
    [
      c(
        "Pamela Casey O'Brien",
        "Democratic",
        "https://www.linkedin.com/in/pamela-casey-o-brien-51543aa3/",
      ),
    ],
  ],
])

export function candidatesFor(office: string, district: string): Candidate[] {
  return CANDIDATES.get(key(office, district)) ?? []
}

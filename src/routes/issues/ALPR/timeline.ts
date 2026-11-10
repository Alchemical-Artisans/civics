import type { TimelineEntry } from "$lib/timeline"
import { Router } from "$lib/router"

/** One of the records in `static/references/PublicSafetyLPR/`, opened at a page. */
const record = (file: string, page: number) =>
  `${Router.reference(`PublicSafetyLPR/${file}`)}#page=${page}`

/**
 * Haverhill's surveillance technology as a sequence of dated acts, for the
 * timeline beside the page. Each entry's `note` names the record and page it
 * rests on, so every date can be checked.
 */
export const ALPR_TIMELINE: TimelineEntry[] = [
  {
    id: "alpr-by-2010",
    // The year and no more. EFF's Atlas of Surveillance says the department
    // had readers before a 2010 grant for more; the grant PDF it cites is the
    // State Police's own application and does not name Haverhill, and its
    // other source (a MuckRock request) could not be read. Unconfirmed until
    // a city record is found.
    date: "2010-12-31",
    dateLabel: "By 2010",
    eyebrow: "Police Department",
    title: "License plate readers (ELSAG) in use (unconfirmed)",
    note: "Source: Atlas of Surveillance-Haverhill Police Department, MA-20261110.csv, row AOS008928. The 2010 grant record the Atlas cites is the Massachusetts State Police's own grant application, which does not name Haverhill. The Haverhill record from the same MuckRock request, the 2012 policy, does not mention 2010 either.",
  },
  {
    id: "alpr-policy-2012",
    date: "2012-11-08",
    eyebrow: "Police Department",
    title: "First license plate reader policy approved, for readers mounted on patrol cars",
    href: record("Licnese_Plate_Reader_Policy_Haverhill_MA_Police.pdf", 1),
    note: "Source: Licnese_Plate_Reader_Policy_Haverhill_MA_Police.pdf (MuckRock request 2171, file 5744), pages 1 to 2",
  },
  {
    id: "predpol-2014",
    date: "2014-01-06",
    eyebrow: "Police Department",
    title: "PredPol predictive policing subscription begins",
    href: "https://cdn.muckrock.com/foia_files/2018/11/19/HAVERHILL_PredPol_SaaS_Agreement_2016.12.08_-_renewal_contract.pdf",
    note: "Source: HAVERHILL_PredPol_SaaS_Agreement_2016.12.08_-_renewal_contract.pdf (MuckRock), page 1",
  },
  {
    id: "ring-onboarding",
    date: "2018-12-17",
    eyebrow: "Police Department",
    title: "Ring begins setting up a Neighbors Portal account for Haverhill Police",
    href: record("Ring_3of6.pdf", 1),
    note: "Source: Ring_3of6.pdf, pages 1 to 2",
  },
  {
    id: "ring-neighbors",
    date: "2019-04-17",
    eyebrow: "Police Department",
    title: "Haverhill Police announce they are joining Ring's Neighbors app",
    href: record("Ring_4of6.pdf", 1),
    note: "Source: Ring_4of6.pdf, page 1",
  },
  {
    id: "mccarthy-2020",
    // Massachusetts as a whole: a ruling of the state's highest court, not a
    // Haverhill act. On the timeline because it sets the limit any ALPR
    // network in the state, Haverhill's included, is measured against.
    date: "2020-04-16",
    eyebrow: "Supreme Judicial Court (statewide)",
    title: "Commonwealth v. McCarthy: enough ALPR cameras in enough places would be a search",
    href: "https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html",
    note: "Source: Commonwealth v. McCarthy, 484 Mass. 493 (2020). Applies across Massachusetts.",
  },
  {
    id: "flock-order-2022",
    // Signed by the Police Chief on Flock's order form, attached to the
    // 2025 contract as Exhibit A. No Council vote is attached for it.
    date: "2022-01-25",
    eyebrow: "Police Department",
    title: "Police Chief signs a Flock order form for 8 cameras, renewing automatically",
    href: record("FlockContractwithHaverhill.pdf", 20),
    note: "Source: FlockContractwithHaverhill.pdf, pages 20 to 22 and 33 (Exhibit A)",
  },
  {
    id: "flock-order-2024",
    date: "2024-01-24",
    eyebrow: "Police Department",
    title: "Police Chief signs a five-year Flock order form for 11 cameras ($137,500)",
    href: record("FlockContractwithHaverhill.pdf", 66),
    note: "Source: FlockContractwithHaverhill.pdf, pages 66 and 68 (Exhibit B)",
  },
  {
    id: "council-vote-2025",
    // The vote was on the contract's length under G.L. c. 30B, § 12(b), not
    // on how the cameras could be used.
    date: "2025-04-08",
    eyebrow: "City Council",
    title: "Council authorizes a Flock contract longer than three years (Document 23-F)",
    href: record("FlockContractwithHaverhill.pdf", 72),
    note: "Source: FlockContractwithHaverhill.pdf, page 72 (Exhibit C)",
  },
  {
    id: "flock-contract",
    date: "2025-06-24",
    eyebrow: "City of Haverhill",
    title: "Contract with Flock Group signed: $110,000 over four years, through 2029",
    href: record("FlockContractwithHaverhill.pdf", 1),
    note: "Source: FlockContractwithHaverhill.pdf, pages 1 to 3",
  },
  {
    id: "flock-cancelled",
    // "Initiated the cancelation", in the city's words: the announcement
    // gives no date for the cameras coming down, so neither does this.
    date: "2026-11-05",
    eyebrow: "City of Haverhill",
    title: "City announces it is canceling the Flock contract and asks Flock to remove its cameras",
    href: "https://www.haverhillma.gov/news/posts/city-of-haverhill-canceling-flock-safety-contract",
    note: "Source: City of Haverhill news post, November 5, 2026 (web page, not a PDF)",
  },
]

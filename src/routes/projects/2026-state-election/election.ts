/**
 * The 2026 State Election, as the warrant the City Clerk submitted to the
 * Council on 6 October 2026 states it: where each precinct votes, the offices
 * on the ballot, and the ten questions.
 *
 * Data rather than markup because three pages say it. The warrant's own item
 * page transcribes the document; the project page puts the polling places on a
 * map; each precinct's page says which of the offices and districts are on
 * *that* precinct's ballot. One copy, so the precinct pages cannot drift from
 * the transcription they are built out of -- the same reason a budget table
 * lives in a `tables.ts` beside the pages that draw it.
 *
 * Everything here is the warrant's, as printed, with two exceptions that are
 * ours and say so where they are declared: the coordinates of each polling
 * place, and the key that ties a warrant row to the precincts it names.
 */
import precinctData from "$lib/data/precincts.json"
import { PROJECTS, type Project } from "$lib/projects"
import type { CalendarEvent } from "$lib/ics"
import { Router } from "$lib/router"
import { COLOURS } from "$lib/chart-colours"
import { candidatesFor, type Candidate } from "./candidates"

/** The project this is, from the registry the meeting pages link back through. */
export const PROJECT = PROJECTS.find((p) => p.slug === "2026-state-election") as Project

/** The day and the hours, as the warrant prints the hours. */
export const ELECTION = { date: "2026-11-03", hours: "7:00 A.M. to 8:00 P.M." } as const

/**
 * The Secretary of the Commonwealth's "Information for Voters" for 2026: the
 * booklet mailed to every household, online. It carries each statewide
 * question's summary, the full text of the law, what a yes and a no vote do,
 * and the arguments for and against -- more than the warrant, and the state's
 * own account of it, so a precinct page links here rather than repeating the
 * warrant's copy. It covers the nine statewide questions only; Haverhill's own
 * Question 10 is in no state publication, and the warrant is its source.
 */
export const VOTER_INFORMATION =
  "https://www.sec.state.ma.us/divisions/elections/research-and-statistics/information-for-voters-2026.htm"

/** A precinct's shape and districts, from MassGIS by way of `npm run precincts:update`. */
export interface Precinct {
  id: string
  ward: number
  precinct: string
  population: number
  districts: Districts
  shape: Shape
  subprecincts: { id: string; districts: Districts; shape: Shape }[]
}

/** The district names MassGIS gives, e.g. `"3rd Essex"` or `"Fifth District"`. */
export interface Districts {
  congress: string
  council: string
  senate: string
  house: string
}

/** GeoJSON MultiPolygon coordinates: polygons of rings of `[lon, lat]`. */
export type Shape = number[][][][]

export const PRECINCTS = precinctData.precincts as Precinct[]
export const WARDS = precinctData.wards as { ward: number; shape: Shape }[]
export const PRECINCT_SOURCE = precinctData.source

/**
 * One row of the warrant's table of polling places.
 *
 * `label`, `name` and `address` are printed as the warrant prints them --
 * "Ward 2, Precinct, 2" with its stray comma, and "Citizen Center 10 Welcome
 * St" with the address run into the name for Ward 3 only. `serves` is ours:
 * the precincts and sub-precincts the label names, in the ids MassGIS uses,
 * which is what joins a row to a shape. `lat`/`lon` are ours too, looked up
 * once by hand against Nominatim, the way `AddressMap` pins an address; every
 * one resolved to the building itself rather than to the street.
 */
export interface PollingPlace {
  label: string
  name: string
  address: string
  serves: string[]
  lat: number
  lon: number
}

export const POLLING_PLACES: PollingPlace[] = [
  {
    label: "Ward 1, Precinct 1",
    name: "Somebody Cares",
    address: "358 Washington St",
    serves: ["1-1"],
    lat: 42.7706568,
    lon: -71.0931056,
  },
  {
    label: "Ward 1, Precinct 2/2A",
    name: "Citizen Center",
    address: "10 Welcome St",
    serves: ["1-2", "1-2A"],
    lat: 42.7766213,
    lon: -71.0788677,
  },
  {
    label: "Ward 1, Precinct 3/3A",
    name: "Haverhill High School",
    address: "137 Monument St",
    serves: ["1-3", "1-3A"],
    lat: 42.7851758,
    lon: -71.1063061,
  },
  {
    label: "Ward 2, Precinct 1",
    name: "Hunking Middle School",
    address: "480 South Main St",
    serves: ["2-1"],
    lat: 42.7609349,
    lon: -71.0865848,
  },
  {
    label: "Ward 2, Precinct, 2",
    name: "Bradford Elementary School",
    address: "118 Montvale St",
    serves: ["2-2"],
    lat: 42.7569486,
    lon: -71.069628,
  },
  {
    label: "Ward 2, Precinct 3",
    name: "Moody School",
    address: "59 Margin St",
    serves: ["2-3"],
    lat: 42.7652926,
    lon: -71.0966082,
  },
  {
    label: "Ward 3, Precinct 1",
    name: "Citizen Center 10 Welcome St",
    address: "10 Welcome St",
    serves: ["3-1"],
    lat: 42.7766213,
    lon: -71.0788677,
  },
  {
    label: "Ward 3, Precinct 2",
    name: "Haverhill City Hall – Early Voting Room",
    address: "4 Summer St",
    serves: ["3-2"],
    lat: 42.7781603,
    lon: -71.076848,
  },
  {
    label: "Ward 3, Precinct 3",
    name: "Unitarian Universalist Church",
    address: "16 Ashland St",
    serves: ["3-3"],
    lat: 42.7811943,
    lon: -71.0761499,
  },
  {
    label: "Ward 4, Precinct 1",
    name: "Nettle Middle School",
    address: "150 Boardman St",
    serves: ["4-1"],
    lat: 42.7742084,
    lon: -71.059093,
  },
  {
    label: "Ward 4, Precinct 2",
    name: "NECC, Tech Center",
    address: "100 Elliot St",
    serves: ["4-2"],
    lat: 42.7966929,
    lon: -71.0470029,
  },
  {
    label: "Ward 4, Precinct 3",
    name: "Kennedy Circle Community Room",
    address: "1 Kennedy Cir",
    serves: ["4-3"],
    lat: 42.7653203,
    lon: -71.0476589,
  },
  {
    label: "Ward 5, Precinct 1/1A",
    name: "Consentino Middle School",
    address: "685 Washington St",
    serves: ["5-1", "5-1A"],
    lat: 42.769824,
    lon: -71.1022659,
  },
  {
    label: "Ward 5, Precinct 2",
    name: "Julian Steele Community Room",
    address: "772 Washington St",
    serves: ["5-2"],
    lat: 42.7727745,
    lon: -71.1069865,
  },
  {
    label: "Ward 5, Precinct 3/3A",
    name: "West Congregational Church",
    address: "767 Broadway",
    serves: ["5-3", "5-3A"],
    lat: 42.787566,
    lon: -71.1331329,
  },
  {
    label: "Ward 6, Precinct 1",
    name: "Haverhill High School",
    address: "137 Monument St",
    serves: ["6-1"],
    lat: 42.7851758,
    lon: -71.1063061,
  },
  {
    label: "Ward 6, Precinct 2/2A",
    name: "John Greenleaf Whittier Middle School",
    address: "256 Concord St",
    serves: ["6-2", "6-2A"],
    lat: 42.7976383,
    lon: -71.0783048,
  },
  {
    label: "Ward 6, Precinct 3",
    name: "Pentucket Lake Elementary School",
    address: "252 Concord St",
    serves: ["6-3"],
    lat: 42.7990057,
    lon: -71.0789618,
  },
  {
    label: "Ward 7, Precinct 1",
    name: "Presidential Gardens Community Room",
    address: "140 Evergreen Dr",
    serves: ["7-1"],
    lat: 42.7576573,
    lon: -71.0912765,
  },
  {
    label: "Ward 7, Precinct 2",
    name: "Hunking Middle School",
    address: "480 South Main St",
    serves: ["7-2"],
    lat: 42.7609349,
    lon: -71.0865848,
  },
  {
    label: "Ward 7, Precinct 2A",
    name: "Consentino Middle School",
    address: "685 Washington St",
    serves: ["7-2A"],
    lat: 42.769824,
    lon: -71.1022659,
  },
  {
    label: "Ward 7, Precinct 3/3A",
    name: "Bradford Elementary School",
    address: "118 Montvale St",
    serves: ["7-3", "7-3A"],
    lat: 42.7569486,
    lon: -71.069628,
  },
]

/**
 * Which of a precinct's districts a warrant row's office is decided in.
 * `null` is an office the whole Commonwealth or the whole county votes for,
 * where the district column names no district a precinct could be outside.
 */
export type DistrictKind = keyof Districts | null

/** One row of the warrant's table of offices, as printed, with the district kind ours. */
export interface Office {
  office: string
  district: string
  kind: DistrictKind
}

export const OFFICES: Office[] = [
  { office: "SENATOR IN CONGRESS", district: "For this Commonwealth", kind: null },
  { office: "GOVERNOR and LIEUTENANT GOVERNOR", district: "For this Commonwealth", kind: null },
  { office: "ATTORNEY GENERAL", district: "For this Commonwealth", kind: null },
  { office: "SECRETARY OF STATE", district: "For this Commonwealth", kind: null },
  { office: "TREASURER", district: "For this Commonwealth", kind: null },
  { office: "AUDITOR", district: "For this Commonwealth", kind: null },
  { office: "REPRESENTATIVE IN CONGRESS", district: "THIRD DISTRICT", kind: "congress" },
  { office: "COUNCILLOR", district: "FIFTH DISTRICT", kind: "council" },
  { office: "SENATOR IN GENERAL COURT", district: "FIRST ESSEX DISTRICT", kind: "senate" },
  {
    office: "SENATOR IN GENERAL COURT",
    district: "SECOND ESSEX AND MIDDLESEX DISTRICT",
    kind: "senate",
  },
  { office: "REPRESENTATIVE IN GENERAL COURT", district: "THIRD ESSEX DISTRICT", kind: "house" },
  { office: "DISTRICT ATTORNEY", district: "EASTERN DISTRICT", kind: null },
  { office: "REGISTER OF PROBATE", district: "ESSEX COUNTY", kind: null },
]

/** One ballot question, as the warrant prints it. */
export interface Question {
  number: number
  /** The heading after the number; Question 10, the city's own, has none. */
  kind?: string
  /**
   * Haverhill's own question, put on the ballot by local petition, rather
   * than one of the Commonwealth's. The state's voter information covers only
   * its own, so a local question is the one a precinct page still quotes.
   */
  local?: true
  question: string
  summary: string[]
  yes?: string
  no?: string
}

export const QUESTIONS: Question[] = [
  {
    number: 1,
    kind: "LAW PROPOSED BY INITIATIVE PETITION",
    question:
      "Do you approve of a law summarized below, on which no vote was taken by the Senate or the House of Representatives before May 6, 2026?",
    summary: [
      "This proposed law would make most records held by the Legislature and the Office of the Governor public records under the Massachusetts Public Records Law. This proposed law would exempt documents related to the development of public policy and communications between legislators and their constituents, if those communications are reasonably related to a constituent’s request for assistance in obtaining government-provided benefits or services or interacting with a government agency.",
    ],
    yes: "would make most records held by the Legislature and the Office of the Governor public records under the Massachusetts Public Records Law.",
    no: "would make no change to the Massachusetts Public Records Law.",
  },
  {
    number: 2,
    kind: "LAW PROPOSED BY INITIATIVE PETITION",
    question:
      "Do you approve of a law summarized below, on which no vote was taken by the Senate or the House of Representatives before May 6, 2026?",
    summary: [
      "This proposed law would specify that employees of the Committee for Public Counsel Services (“CPCS”) are permitted to engage in collective bargaining with their employer. It would also require CPCS, after executing a collective bargaining agreement, to request the appropriation necessary to fund such agreement from the Governor.",
    ],
    yes: "would specify that Committee for Public Counsel Services employees may form a union to collectively bargain with their employer.",
    no: "would make no change to the law governing labor relations for Committee for Public Counsel Service employees.",
  },
  {
    number: 3,
    kind: "LAW PROPOSED BY INITIATIVE PETITION",
    question:
      "Do you approve of a law summarized below, on which no vote was taken by the Senate or the House of Representatives before May 6, 2026?",
    summary: [
      "This proposed law would eliminate political party primaries for state elections and instead establish a system where there would be a single, all-party primary in which all candidates, regardless of their party affiliation, would be listed on one ballot, and voters could vote for any candidate on the ballot. The two candidates receiving the most votes in the primary would advance to the general election ballot.",
      "This proposed law would require candidates for governor and lieutenant governor to run and be listed jointly on the ballot in the primary.",
      "This proposed law would provide political party status to any group whose candidates for any statewide office received at least 3% of the ballots cast in the state primary.",
    ],
    yes: "would eliminate separate party primaries for state elections and require a single primary in which all candidates appear on one ballot, voters could vote for any candidate, and the top two candidates would advance to the general election.",
    no: "would make no change to the laws governing primary elections.",
  },
  {
    number: 4,
    kind: "LAW PROPOSED BY INITIATIVE PETITION",
    question:
      "Do you approve of a law summarized below, on which no vote was taken by the Senate or the House of Representatives before May 6, 2026?",
    summary: [
      "This proposed law would permit eligible individuals to register to vote or update their voter registration address on Election Day.",
      "An individual who is eligible to vote could register to vote on Election Day by going to the polling place in the precinct where they live during voting hours and presenting proof of residency and signing a written oath. Proof of residency could be a valid photo identification, or documentation showing the individual’s name and the address where the individual resides, such as a current utility bill, bank statement, government check, residential lease, wireless telephone statement, paycheck, current student fee statement or other document from a post-secondary school, or another government document or correspondence. The written oath would require the individual to certify that they are a citizen of the United States, are at least 18 years old, are not legally prohibited from voting, and have not and will not vote in the same election at another location. The oath would require the individual to acknowledge that providing false information is a felony punishable by not more than 5 years imprisonment or a fine of not more than $10,000, or both.",
      "If an individual did not present proof of residency, they would be allowed to cast a provisional ballot, which would be counted only if the individual returned to provide the required information before the close of polls for a municipal election; within two days after a state primary; or within six days after a state election.",
      "Individuals who register to vote on Election Day would be registered to vote in future elections as well as in the election taking place that day.",
      "Individuals who are already registered to vote would not be able to change their political party affiliation on Election Day.",
      "The proposed law would take effect on January 1, 2028.",
    ],
    yes: "would permit eligible citizens to register to vote or to update their voter registration address at their polling place on Election Day.",
    no: "would make no change to the laws governing voter registration.",
  },
  {
    number: 5,
    kind: "LAW PROPOSED BY INITIATIVE PETITION",
    question:
      "Do you approve of a law summarized below, on which no vote was taken by the Senate or the House of Representatives before May 6, 2026?",
    summary: [
      "This proposed law would change the limit on how much revenue the state can collect in a given year. The proposal would limit state revenue in a given year to the net amount of state revenue from the year before, increased by a rate equal to the average growth of wages and salaries in Massachusetts over the most recent three years. If revenue collected by the state in a given year exceeds the limit, the excess amount would be refunded to taxpayers the following year. The proposed law would include all revenue from the surtax on incomes over $1 million when calculating the revenue limit and when determining whether state revenue exceeds the limit.",
      "The provisions of the proposed law would all be effective as of July 1, 2027.",
      "The proposed law states that, if any of its parts were declared invalid, the other parts would stay in effect.",
    ],
    yes: "would change the limit on state revenue collection, tying it to prior year collections plus average wage and salary growth, and provide for a rebate of revenue exceeding that limit.",
    no: "would make no change in the law relative to state revenue collection.",
  },
  {
    number: 6,
    kind: "LAW PROPOSED BY INITIATIVE PETITION",
    question:
      "Do you approve of a law summarized below, on which no vote was taken by the Senate or the House of Representatives before May 6, 2026?",
    summary: [
      "This proposed law would establish a Nature for All Fund that, subject to appropriation by the Legislature, would receive 50% of state taxes collected from the sale and use of sporting goods, recreational vehicles, and golf courses for the first year of its operation. After July 1, 2028, the Nature for All Fund would begin receiving, subject to appropriation by the Legislature, 100% of state taxes collected on the sale and use of sporting goods, recreational vehicles, and golf courses. The sales tax revenue received by the Nature for All Fund would exclude sales tax revenue transferred to the Massachusetts Bay Transportation Authority State and Local Contribution Fund and the School Modernization and Reconstruction Trust Fund. The proposed law would allow the state Executive Office of Energy and Environmental Affairs to spend the money in the Nature for All Fund for natural resource conservation.",
      "The proposed law would allow public and private donations to the Nature for All Fund. The proposed law would prevent the state comptroller from transferring surplus funds in the Nature for All Fund at the end of the fiscal year. It would also allow state agencies, municipalities, public charities involved in natural resource conservation, tribal governments, and other regional public entities to receive money from the Nature for All Fund.",
      "Natural resource conservation would include the conservation or restoration of land to protect drinking water, streams, rivers, lakes, coasts, farms, forests, connectivity between open spaces, and lands and natural resources of indigenous cultural significance. Natural resource conservation would also include the creation, improvement, and management of parks, trails, greenspaces or outdoor recreation access.",
      "The proposed law would establish a 15-member Nature for All Board that consists of five state officials and ten members of the public appointed by the Governor. The proposed law would require the ten members of the public to include representatives of underserved communities and indigenous peoples and at least one person with expertise or experience in natural resource conservation. The proposed law would allow the state Executive Office of Energy and Environmental Affairs to spend money from the Nature for All Fund to hire staff to manage the fund. The proposed law would also require the Nature for All Board to establish rules about how the money in the Nature for All Fund should be spent, including rules regarding alignment with environmental justice principles, access to and restoration of lands and natural resources of indigenous cultural significance, promotion of affordable housing development, and other matters regarding spending and bond issuance.",
      "The proposed law would require the state Executive Office of Energy and Environmental Affairs to submit an annual report to various state committees regarding the funds spent to buy or improve land in cities and towns containing environmental justice populations.",
      "The proposed law would take effect on July 1, 2027.",
    ],
    yes: "would create a fund that could be utilized for natural resource conservation that would receive some state taxes collected on the sale and use of sporting goods and recreational vehicles, and the use of golf courses.",
    no: "would not create this natural resource conservation fund or change how sales and use taxes are spent.",
  },
  {
    number: 7,
    kind: "LAW PROPOSED BY INITIATIVE PETITION",
    question:
      "Do you approve of a law summarized below, on which no vote was taken by the Senate or the House of Representatives before May 6, 2026?",
    summary: [
      "This proposed law would allow single-family homes to be built in a residentially zoned area as long as the land on which it is to be constructed is at least 5,000 square feet, has at least 50 feet of land bordering the street, road, or public way that it faces, and has access to public sewer and water services.",
      "The proposed law would allow cities and towns to reasonably regulate certain aspects of those single-family homes, including their height, distance from neighboring buildings, open space, parking requirements, and whether they can be rented out on a short-term basis. The proposed law would also allow the Executive Office of Housing and Livable Communities to issue guidance or regulations to administer the proposed law.",
    ],
    yes: "would allow single-family homes to be built on lots of 5,000 square feet or more in residential areas, subject to reasonable local regulation of certain aspects of those homes.",
    no: "would make no change to the law relative to building single-family homes.",
  },
  {
    number: 8,
    kind: "LAW PROPOSED BY INITIATIVE PETITION",
    question:
      "Do you approve of a law summarized below, on which no vote was taken by the Senate or the House of Representatives before May 6, 2026?",
    summary: [
      "The proposed law would change the type and amount of marijuana that may legally be possessed in Massachusetts by repealing the laws that legalize, regulate, and tax the retail sale of adult recreational use marijuana in Massachusetts. The proposed law would also permit persons 21 years of age and older to possess 1 ounce or less of marijuana including no more than 5 grams in the form of concentrate, and to gift or transfer to another person 21 years of age and older 1 ounce or less of marijuana including no more than 5 grams in the form of concentrate. The proposed law would also impose a civil penalty of $100 and forfeiture of the marijuana for the possession of marijuana between the weight of 1 and 2 ounces.",
      "For persons 21 years of age and younger, the proposed law would make the possession of 2 ounces or less of marijuana a civil infraction subject to a $100 fine, forfeiture of the marijuana, completion of a drug awareness program and community service, and notification to their parents or legal guardian of the offense and penalties.",
      "The proposed law would allow currently licensed adult recreational marijuana businesses to apply on an expedited basis to become a licensed medical marijuana dispensary and to sell their remaining inventory of adult recreational marijuana to medical marijuana dispensaries. The proposed law would retain the Cannabis Control Commission but modify its authority so it would regulate only the medical marijuana market.",
      "The proposed law states that, if any of its parts were declared invalid, the other parts would stay in effect.",
      "The proposed law would take effect on January 1, 2028.",
    ],
    yes: "would prohibit the legalization, regulation, and taxation of the retail sale of adult recreational use marijuana, and change the penalties for possession of marijuana.",
    no: "would make no change to the law relative to marijuana.",
  },
  {
    number: 9,
    kind: "REFERENDUM ON AN EXISTING LAW",
    question:
      "Do you approve of a law summarized below, which was approved by the House of Representatives on July 18, 2024 by a vote of 124 to 33, and approved by the Senate on July 18, 2024 by a vote of 35 to 5?",
    summary: [
      "This law makes a number of changes to Massachusetts laws governing firearms.",
      "The law adds school administrators and licensed healthcare providers as parties permitted to ask a court to issue an Extreme Risk Protection Order – requiring an individual to surrender or relinquish their firearm licenses, permits, and firearms - if an individual is a present danger to self or others. The law also provides that, when issuing an Harassment Prevention Order, a court may also order the surrender of firearms licenses, permits, and firearms.",
      "The law imposes penalties for possessing, creating, and transferring untraceable “ghost gun” firearms and requires all firearms except antiques and relics, including unfinished frames and receivers that can be readily made into a finished product, to have serial numbers. The law includes privately-made guns like 3D-printed guns within the provisions governing untraceable “ghost gun” firearms.",
      "The law changes firearms licensing requirements to: (1) allow local licensing authorities to request prior license and permit information from the state, as well as access petitions for involuntary mental health commitments denied by a court in addition to prior involuntary commitments, as a part of their review of applications for licenses to carry firearms, firearm ID cards, and licenses to sell firearms; (2) require an individual to be 21 years of age to own semiautomatic rifles or shotguns; (3) add the possibility of incarceration of up to six months for a second offense of failing to report a firearm loss or theft; and (4) enable 12-15 year olds to apply for a self-defense spray permit with parental permission, and 15 to 18 year olds to apply independently.",
      "The law allows local firearm licensing authorities to transfer the responsibility to inspect firearm dealers to the State Police. The law requires local licensing authorities to attend statewide training regarding those inspections. It requires dealers to confiscate expired or suspended licenses and report them to the state and to local licensing authorities.",
      "The law changes the definition of “machine gun” to include bump stocks, trigger cranks, Glock switches and auto sears among the devices whose possession and use are subject to penalties. It expands the definition of “silencer” to include the parts used to construct a silencer.",
      "The law clarifies how to determine whether a firearm is an assault-style weapon and the circumstances under which a person may continue to possess assault-style weapons and large capacity feeding devices they already own.",
      "The law requires the state Firearm Control Advisory Board and the state Secretary of Public Safety and Security to review and update the rosters of prohibited assault-style firearms, approved firearms, and approved firearms sold for target shooting.",
      "The law clarifies requirements relating to the carry and transport of firearms in motor vehicles and ATVs. It prohibits the carrying of firearms in government buildings, polling locations, and schools, with certain exceptions.",
      "The law expands data compilation and reporting requirements to and from the state, and creates a publicly-accessible dashboard of anonymized aggregate firearm data, along with a commission to study that data.",
      "The law requires the State Police to provide training and a test for new applicants for licenses to carry or Firearm ID cards.",
      "The law establishes two special legislative commissions – one to examine funding for violence prevention services, and one to study emerging firearms technology.",
      "The law criminalizes discharging a firearm and striking a building in use.",
    ],
    yes: "would keep in place the law, which increases the regulation of firearms, including ghost guns, machine guns, and assault-style weapons.",
    no: "would repeal this law.",
  },
  {
    number: 10,
    local: true,
    question:
      "Shall the City of Haverhill allow the sale of marijuana and marijuana products, as those terms are defined in section 1 of chapter 94G of the General Laws, for consumption on the premises where sold, a summary of which appears below?",
    summary: [
      "Section 3(b)(2) of Chapter 94G of the General Laws of Massachusetts establishes a process for petitioning a city to allow on-site consumption of marijuana within the limits of the City. Upon certification of the petition, the City must place the question on the ballot for the next regularly occurring municipal or state election in the form prescribed by the statute. The above question, if voted in the affirmative, would allow consumption of marijuana and marijuana products on the premises where sold, subject to the reasonable limitations established by the City.",
    ],
  },
]

const ORDINALS = [
  "",
  "FIRST",
  "SECOND",
  "THIRD",
  "FOURTH",
  "FIFTH",
  "SIXTH",
  "SEVENTH",
  "EIGHTH",
  "NINTH",
  "TENTH",
  "ELEVENTH",
  "TWELFTH",
  "THIRTEENTH",
  "FOURTEENTH",
  "FIFTEENTH",
  "SIXTEENTH",
  "SEVENTEENTH",
  "EIGHTEENTH",
]

/**
 * A MassGIS district name in the warrant's spelling: `"3rd Essex"` to `"THIRD
 * ESSEX DISTRICT"`, `"3rd Congressional District"` to `"THIRD DISTRICT"`. The
 * two name the same districts in different hands, and this is the whole of
 * the translation; a name it cannot spell matches no row, which is reported
 * rather than guessed at.
 */
export function warrantDistrict(name: string): string {
  const spelled = name
    .replace(/\b(\d+)(st|nd|rd|th)\b/i, (_, n: string) => ORDINALS[Number(n)] ?? n)
    .replace(/\s+Congressional\b/i, "")
    .toUpperCase()
  return spelled.endsWith(" DISTRICT") ? spelled : `${spelled} DISTRICT`
}

/** One line of a precinct's ballot. */
export interface BallotLine {
  office: string
  /** The warrant's district, or MassGIS's spelling of it where the warrant has no row. */
  district: string
  /**
   * False where the precinct lies in a district the warrant names no race for.
   * See `ballotFor`.
   */
  onWarrant: boolean
  /** Who is running, from the Secretary of the Commonwealth's list: `candidates.ts`. */
  candidates: Candidate[]
}

/**
 * The offices on the ballot of a precinct with these districts, in the
 * warrant's order.
 *
 * An office the whole city votes on is on every ballot. An office decided by
 * district appears once per district the warrant names it for, and a precinct
 * votes in exactly one of them, so it keeps that row and drops the others.
 *
 * Where a precinct's district is one the warrant names no row for, the office
 * is still listed, with `onWarrant` false, rather than dropped. That is not a
 * hypothetical: the warrant names the Third Essex House district and no
 * other, while MassGIS puts ten of Haverhill's precincts and sub-precincts in
 * the Fifteenth Essex -- and every House seat is elected every two years. A
 * page that quietly left their representative off would be saying something
 * the city never said; one that names the district and marks it is the record
 * as it stands.
 */
export function ballotFor(districts: Districts): BallotLine[] {
  const lines: BallotLine[] = []
  const seen = new Set<string>()
  for (const row of OFFICES) {
    if (!row.kind) {
      lines.push({
        office: row.office,
        district: row.district,
        onWarrant: true,
        candidates: candidatesFor(row.office, row.district),
      })
      continue
    }
    if (seen.has(row.office)) continue
    seen.add(row.office)
    const ours = warrantDistrict(districts[row.kind])
    const match = OFFICES.find((r) => r.office === row.office && r.district === ours)
    lines.push(
      match
        ? {
            office: row.office,
            district: match.district,
            onWarrant: true,
            candidates: candidatesFor(row.office, match.district),
          }
        : {
            office: row.office,
            district: ours,
            onWarrant: false,
            candidates: candidatesFor(row.office, ours),
          },
    )
  }
  return lines
}

/** The warrant row naming a precinct or sub-precinct id, if any does. */
export function pollingPlaceFor(id: string): PollingPlace | undefined {
  return POLLING_PLACES.find((place) => place.serves.includes(id))
}

/**
 * Polling places grouped by building, in the warrant's order. Haverhill High,
 * Hunking, Consentino, Bradford Elementary and the Citizen Center each serve
 * two rows of the warrant, and a map with a pin per row would stack a second
 * pin on the first and hide its name.
 */
export function buildings(places: PollingPlace[] = POLLING_PLACES): PollingPlace[][] {
  const groups = new Map<string, PollingPlace[]>()
  for (const place of places)
    groups.set(place.address, [...(groups.get(place.address) ?? []), place])
  return [...groups.values()]
}

/**
 * Election Day as a calendar event: the polls' hours from the warrant, and,
 * for one precinct, the building it votes in as the location. A precinct
 * whose halves vote in two buildings gets no location -- which one is the
 * reader's depends on which side of the line they live, which the event
 * cannot know -- and its description names both.
 */
export function electionEvent(precinct?: string): CalendarEvent {
  const page = precinct
    ? Router.absolute(`/projects/${PROJECT.slug}/precincts/${precinct}`)
    : Router.absolute(`/projects/${PROJECT.slug}`)
  const parent = PRECINCTS.find((p) => p.id === precinct)
  const places = parent
    ? buildings(
        [parent.id, ...parent.subprecincts.map((s) => s.id)].flatMap((id) => {
          const place = pollingPlaceFor(id)
          return place ? [place] : []
        }),
      ).map(([place]) => place)
    : []
  const day = ELECTION.date.replace(/-/g, "")
  return {
    uid: `${PROJECT.slug}${precinct ? `-${precinct}` : ""}@haverhill.alchemicalartisans.com`,
    title: `${PROJECT.title}${precinct ? ` (${precinctName(precinct)})` : ""}`,
    start: `${day}T070000`,
    end: `${day}T200000`,
    allDay: false,
    location:
      places.length === 1 ? `${places[0].name}, ${places[0].address}, Haverhill, MA` : undefined,
    description: [
      `Polls are open ${ELECTION.hours}`,
      ...places.map((p) => `Polling place: ${p.name}, ${p.address}`),
      `Where to vote and what is on the ballot: ${page}`,
    ].join("\n"),
    url: page,
  }
}

/**
 * A colour per ward, so the precincts read as seven groups before a reader
 * has found a single number on the map. The chart sequence, since it is the
 * one set of colours on the site already checked for telling apart.
 *
 * Not simply the first seven: the seventh is a second blue, and Ward 7 shares
 * a long border with Ward 1's. Ochre is the sequence's furthest from all six
 * of its neighbours' colours. Here rather than beside one map because the
 * project's map and the front page's card draw the same city and should not
 * colour it two ways.
 */
const WARD_COLOURS = [0, 1, 2, 3, 4, 5, 11].map((i) => COLOURS[i])
export const wardColour = (ward: number) => WARD_COLOURS[ward - 1]

/** "Ward 1, Precinct 2", for a precinct id. */
export function precinctName(id: string): string {
  const [ward, precinct] = id.split("-")
  return `Ward ${ward}, Precinct ${precinct}`
}

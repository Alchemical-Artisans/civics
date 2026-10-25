import type { TimelineEntry } from "$lib/timeline"
import { Router } from "$lib/router"

/**
 * The record for the battery storage ordinance, as two lists: how the hearing
 * got here, and what the neighbours asked for against what the ordinance itself
 * says about it.
 *
 * The same arrangement as the two special permits: the letters are set down
 * only as the sentence of each that raises something, beside the words of the
 * provision that answers it, and the full letters are a click away. Every line
 * below is somebody's own words, and `source` names whose.
 *
 * **The answers here are the ordinance's, not the applicant's**: this matter has
 * no applicant before the Council, and the Planning Director's petition is the
 * text the Council would pass. A section number is given wherever a quote is
 * taken from the ordinance, so a reader can find it in the proposed ordinance
 * PDF.
 *
 * `subject` is ours. `note` is ours too, and is used where the ordinance does
 * not answer a concern, so the empty column says so rather than going blank.
 */

const MEETING = "city-council-2026-10-27"
const ITEM = "battery-energy-storage-systems-ordinance"

const excerpt = (name: string) => Router.excerpt(MEETING, `${ITEM}/${name}`)

/** Joe Walsh, 26 Dawn Circle, August 26, 2026. */
const WALSH = excerpt("walsh-opposition")
/** Joe Walsh, 26 Dawn Circle, September 14, 2026, asking for amendments. */
const WALSH_AMENDMENT = excerpt("walsh-amendment-request")
/** Pamela J. Carr, 60 Atlanta Street: her email of 31 August, forwarded 14 September. */
const CARR = excerpt("carr-communication")
/** Diane Desjardins, 28 Country Meadow Road: her email of 14 September, with her 31 August letter. */
const DESJARDINS = excerpt("desjardins-communication")
/** The petition's text, the ordinance the Council is asked to pass. */
const ORDINANCE = excerpt("proposed-ordinance")

export interface Passage {
  /** Who said it and when, named as the document names them. */
  source: string
  /** The file the words are in. */
  href: string
  /**
   * Their words, one entry per paragraph quoted. **Never one passage cut into
   * two:** the entries are drawn as separate paragraphs.
   */
  quotes: string[]
}

export interface Concern {
  /** Our handle for the pair; nothing in the record titles these. */
  subject: string
  raised: Passage[]
  answered: Passage[]
  /** Said in our voice when `answered` is empty, so the column is not blank. */
  note?: string
}

/**
 * The Council's own record of the ordinance, off the back of Document # 21-B:
 * the referral, then one line per continuance with its count. Planning Board
 * sittings are on the timeline too, since they are the steps the ordinance took
 * between Council sittings.
 */
export const HEARING: TimelineEntry[] = [
  {
    date: "2026-03-24",
    title: "Filed for 14 days, with a Council hearing set for May 19",
    note: "9 yeas, 0 nays, 1 absent, 1 abstention",
  },
  {
    date: "2026-05-19",
    title: "Continue to July 14, and send to the Planning and Development Committee",
    note: "10 yeas, 0 nays, 1 absent",
  },
  {
    date: "2026-07-14",
    title: "Continue to August 25",
    note: "9 yeas, 0 nays, 2 absent",
    href: Router.meetingItem("city-council-2026-07-14", ITEM),
  },
  {
    date: "2026-08-25",
    title: "Continue to September 15",
    note: "10 yeas, 0 nays, 1 absent",
    href: Router.meetingItem("city-council-2026-08-25", ITEM),
  },
  {
    date: "2026-09-15",
    title: "Continue to October 27",
    note: "11 yeas, 0 nays, 0 absent",
    href: Router.meetingItem("city-council-2026-09-15", ITEM),
  },
  {
    date: "2026-10-14",
    title: "Planning Board public hearing",
    href: Router.meetingItem("planning-board-2026-10-14", ITEM),
  },
  { date: "2026-10-27", title: "This sitting" },
]

export const CONCERNS: Concern[] = [
  {
    // The one concern no provision of the ordinance can answer, because the
    // ordinance is silent on where the overlay goes. The Hilldale Avenue
    // location is Doc. 41-B's question, so the note points there rather than
    // answering it here.
    subject: "Where the overlay district goes",
    raised: [
      {
        source: "Joe Walsh, 26 Dawn Circle, August 26, 2026",
        href: WALSH,
        quotes: [
          "During the upcoming September 15 public hearing, I strongly urge the City Council to restrict the BESS overlay district strictly to isolated locations in Haverhill - or none at all. Please do not establish secondary zones or expand definitions that allow these industrial utility installations near established residential areas like Hilldale Avenue and Dawn Circle. Our neighborhood has already given enough.",
        ],
      },
      {
        source: "Pamela J. Carr, 60 Atlanta Street, August 31, 2026, forwarded September 14, 2026",
        href: CARR,
        quotes: [
          "My first question is, why does Haverhill need to allow a Battery Farm in our city?",
          "How was it determined that Hilldale Ave ranked the highest?",
        ],
      },
      {
        source: "Diane Desjardins, 28 Country Meadow Road, September 14, 2026",
        href: DESJARDINS,
        quotes: [
          "This facility was first proposed on land where Dutton Airport was once located, a spot which was fairly remote from houses and businesses.",
          "A site in Bradford was also proposed. It was decided that since there is farmland nearby, it would not be a good place for this facility. Then Hilldale Ave was proposed.",
        ],
      },
    ],
    answered: [],
    note: "Nothing in the ordinance says where the overlay goes. It allows Tier 2 and Tier 3 BESS in the BESS Overlay District and in no other district in the table of uses. The Hilldale Avenue location is Doc. 41-B, linked above.",
  },
  {
    subject: "Noise",
    raised: [
      {
        source: "Joe Walsh, 26 Dawn Circle, August 26, 2026",
        href: WALSH,
        quotes: [
          "BESS installations rely on heavy-duty, continuous HVAC cooling systems and inverters that generate a persistent, low-frequency hum. Introducing a BESS facility or expanded industrial utility footprint right around the corner from our homes will make the noise levels in our neighborhood completely unbearable.",
        ],
      },
      {
        source: "Joe Walsh, 26 Dawn Circle, September 14, 2026, asking for amendments",
        href: WALSH_AMENDMENT,
        quotes: [
          "Require a mandatory, continuous 7-day sound monitoring study—including specialized nighttime metrics (L90 tracking between 1:00 AM and 4:00 AM)—at the nearest residential property lines before a site plan can be approved.",
        ],
      },
    ],
    answered: [
      {
        source: "Proposed ordinance, § 7.9.6.2 O, Acoustical Impacts",
        href: ORDINANCE,
        quotes: [
          "No system shall cause an increase in acoustical levels over ambient at the Property line. An acoustical study prepared by a Massachusetts Registered Acoustical Engineer shall be provided.",
        ],
      },
      {
        source: "Proposed ordinance, § 7.9.6.3 B, the special permit criteria",
        href: ORDINANCE,
        quotes: [
          "The project appropriately attenuates sound intrusion beyond the property lines onto adjacent properties so that there is no change in ambient sound after construction and during operations of the system.",
        ],
      },
      {
        source: "Proposed ordinance, § 7.9.7 G, Operation and Maintenance Manual",
        href: ORDINANCE,
        quotes: [
          "There shall be an annual; acoustical review to assure ongoing compliance with the requirement of no change from ambient at the property line and fire department inspection.",
        ],
      },
    ],
  },
  {
    subject: "Traffic",
    raised: [
      {
        source: "Joe Walsh, 26 Dawn Circle, August 26, 2026",
        href: WALSH,
        quotes: [
          'The existing industrial operations, the massive solar farm right behind my house, heavy traffic - including truck "Jake braking"- noises from the trucking school, are already directly impacting my daily quality of life.',
        ],
      },
      {
        source: "Pamela J. Carr, 60 Atlanta Street, August 31, 2026, forwarded September 14, 2026",
        href: CARR,
        quotes: [
          "Our roads in this area are taking a beating.",
          "I not only have to deal with the traffic issues these tractor trailer trucks cause during all hours of the day, but I also deal with police, ambulance and fire coming to my neighborhood on a fairly frequent basis",
        ],
      },
      {
        source: "Diane Desjardins, 28 Country Meadow Road, September 14, 2026",
        href: DESJARDINS,
        quotes: [
          "Upper Hilldale already has a plethora of industrial and commercial businesses, causing high levels of truck traffic, with NETTS trucks, Republic waste trucks, and numerous tractor trailer trucks parking trailers in large paved lots.",
        ],
      },
    ],
    answered: [
      {
        source: "Proposed ordinance, § 7.9.7 K.2 k, Traffic impact",
        href: ORDINANCE,
        quotes: [
          "A report on existing street capacities, estimated average daily traffic generation, composition, peak hour levels and directional flows resulting from the proposed development, proposed methods to mitigate the estimated traffic impact and methodology and sources used to derive existing data and estimations.",
        ],
      },
    ],
  },
  {
    subject: "Fire",
    raised: [
      {
        source: "Pamela J. Carr, 60 Atlanta Street, August 31, 2026, forwarded September 14, 2026",
        href: CARR,
        quotes: [
          "Does Haverhill have the manpower or equipment to handle a battery fire if that should occur?",
        ],
      },
      {
        source: "Diane Desjardins, 28 Country Meadow Road, September 14, 2026",
        href: DESJARDINS,
        quotes: [
          "Does our fire department have the equipment needed should this facility have a fire? Are our firefighters trained in fighting this type of fire? Do we even have enough equipment and personnel?",
        ],
      },
    ],
    answered: [
      {
        source: "Proposed ordinance, § 7.9.7 F, Fire Safety Compliance Plan",
        href: ORDINANCE,
        quotes: [
          "Such plan shall document and verify that the system and its associated controls and safety systems are in compliance with state codes, including documentation that BESS components comply with the safety standards set forth in subsection 7.9.9. Such plan shall also include a detailed training plan for public safety personnel.",
        ],
      },
      {
        source: "Proposed ordinance, § 7.9.7 J, Emergency Operations Plan",
        href: ORDINANCE,
        quotes: [
          "An Emergency Operations Plan compliant with NFPA 855 is required. A copy of the approved Emergency Operations Plan shall be given to the system operator, the local fire department, local fire code official and police department.",
        ],
      },
      {
        source: "Proposed ordinance, § 7.9.6.2 P, Water Source",
        href: ORDINANCE,
        quotes: [
          "The Applicant shall present evidence including a hydraulic analysis in accordance to the City standard to support that there is adequate volume and pressure for fire suppression on the Property and not have a detrimental impact on the surrounding neighborhood.",
        ],
      },
    ],
  },
  {
    subject: "Groundwater, spills and decommissioning",
    raised: [
      {
        source: "Pamela J. Carr, 60 Atlanta Street, August 31, 2026, forwarded September 14, 2026",
        href: CARR,
        quotes: ["Are there any setbacks to prevent pollution if a catastrophe should occur?"],
      },
      {
        source:
          "Diane Desjardins, 28 Country Meadow Road, August 31, 2026, forwarded September 14, 2026",
        href: DESJARDINS,
        quotes: [
          "I do not believe that enough research has been done with regard to storage of such volatile material, as well as impact to groundwater, Little River, and our natural resources.",
        ],
      },
      {
        source: "Diane Desjardins, 28 Country Meadow Road, September 14, 2026",
        href: DESJARDINS,
        quotes: [
          "If they are just going to be large metal containers placed on a cement pad what is to stop this from perhaps becoming a Superfund Site in the future due to inadequate knowledge of long term effects or lack of proper maintenance.",
        ],
      },
    ],
    answered: [
      {
        source: "Proposed ordinance, § 7.9.6.2 L, Failure Protection",
        href: ORDINANCE,
        quotes: [
          "All Tier 2 and Tier 3 BESS shall include an impenetrable layer beneath the surface and no closer than four (4) feet to the closest water table which will cause any discharge to flow into a basin located on site which will then capture and/or treat any runoff as a result of a failed battery or fire or other destruction.",
        ],
      },
      {
        source: "Proposed ordinance, § 7.9.6.3 A, the special permit criteria",
        href: ORDINANCE,
        quotes: [
          "The project protects the ground water and surrounding properties from catastrophic failure of one or more of the batteries or cells by implementing appropriate catchment and filtration systems for water run off or run off from the system.",
        ],
      },
      {
        source: "Proposed ordinance, § 7.9.6.2 S, Decommissioning Fund",
        href: ORDINANCE,
        quotes: [
          "The owner and/or operator of the energy storage system, shall continuously maintain a fund or other surety acceptable to the City, in a form approved by the City Council and City Solicitor, for the removal of the BESS, in an amount to be determined by the City, and which includes the City as loss payee, for the period of the life of the facility.",
        ],
      },
    ],
  },
  {
    subject: "Size of the site and distance from homes",
    raised: [
      {
        source: "Pamela J. Carr, 60 Atlanta Street, August 31, 2026, forwarded September 14, 2026",
        href: CARR,
        quotes: [
          "Now, learning that I may have a 14+ acre battery farm in my back yard is more than I want to think about.",
        ],
      },
      {
        source: "Diane Desjardins, 28 Country Meadow Road, September 14, 2026",
        href: DESJARDINS,
        quotes: [
          "This site is not large enough for the proposed facility, it needing 20 acres where there are only 14 acres.",
        ],
      },
    ],
    answered: [
      {
        source: "Proposed ordinance, § 7.9.6.2 F, Setbacks",
        href: ORDINANCE,
        quotes: [
          "Tier 2 and Tier 3 BESS shall be set back a minimum of 150 feet from all side, rear, and front lot lines; except that Tier 2 and Tier 3 BESS shall be set back a minimum of 300 feet from side, rear, and front lot lines that abut or are across a street from residential zoning districts or existing single, two-family, or multi-family structures.",
        ],
      },
      {
        source: "Proposed ordinance, § 7.9.6.2 H, Lot Size",
        href: ORDINANCE,
        quotes: [
          "The minimum lot size for Tier 1 BESS shall not be less than 1 acre. The minimum lot size for a Tier 2 BESS shall be not less than 10 acres and the minimum lot size for a Tier 3 BESS shall be no less than 20.",
        ],
      },
    ],
  },
  {
    // The purpose clause is the ordinance's aim rather than a measure taken to
    // meet it, and the pair reads that way: it is quoted as the purpose it is.
    subject: "Farmland and wetlands",
    raised: [
      {
        source: "Diane Desjardins, 28 Country Meadow Road, September 14, 2026",
        href: DESJARDINS,
        quotes: [
          "I believe that the proposed site on Hilldale Avenue is detrimental to existing farmland",
        ],
      },
      {
        source: "Pamela J. Carr, 60 Atlanta Street, August 31, 2026, forwarded September 14, 2026",
        href: CARR,
        quotes: [
          "Councilor Dan Diodati opposed having it in the Ward 2 area because of the agricultural land.",
        ],
      },
    ],
    answered: [
      {
        source: "Proposed ordinance, § 7.9.1 C, the purpose of the section",
        href: ORDINANCE,
        quotes: [
          "To mitigate the impacts of BESS on environmental resources such as agricultural lands, forests, wildlife, wetlands and other natural resources.",
        ],
      },
    ],
  },
]

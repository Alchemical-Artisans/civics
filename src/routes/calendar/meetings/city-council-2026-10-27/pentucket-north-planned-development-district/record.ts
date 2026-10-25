import type { TimelineEntry } from "$lib/timeline"
import { Router } from "$lib/router"

/**
 * The record for 931 Boston Road, as two lists: how the petition got here, and
 * what the neighbours and the city asked for against what the applicant and
 * the Planning Board answered.
 *
 * The same arrangement as 27 Marshland Street on 20 October: the letters are
 * set down only as the sentence of each that answers something, beside the
 * words of the concern it answers, and the full letters are a click away.
 * Every line below is somebody's own words, and `source` names whose.
 *
 * `subject` is ours -- a handle so a reader can find the pair again. `note` is
 * ours too, and is said in our voice where nothing in the packet answers a
 * concern, so the empty column is explained rather than left blank.
 */

const MEETING = "city-council-2026-10-27"
const ITEM = "pentucket-north-planned-development-district"

const excerpt = (name: string) => Router.excerpt(MEETING, `${ITEM}/${name}`)

/** Christine Mahoney, 59 I Street, as her letter signs itself, October 21, 2026. */
const MAHONEY = excerpt("mahoney-communication")
/** Patti Neals, Executor of 37 I Street, October 22, 2026. */
const NEALS = excerpt("neals-communication")
/** Russell S. Channen for the applicant, October 22, 2026: the impact statement. */
const IMPACT = excerpt("impact-statement")
/** Jacki Byerley, AICP, Planning Director, October 15, 2026. */
const DIRECTOR = excerpt("planning-directors-letter")

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
 * The Council's own record of the petition, off the back of Document # 21-G:
 * the referral, then one line per continuance with its count. The Planning
 * Board's recommendation is on the timeline too, since it is the step the
 * petition took between the two Council sittings it was continued from.
 */
export const HEARING: TimelineEntry[] = [
  {
    date: "2026-06-30",
    title: "Referred to the Planning Board, with a hearing set for August 25, 2026",
    note: "11 yeas, 0 nays, 0 absent",
  },
  {
    date: "2026-08-25",
    title: "Continue to October 27, 2026",
    note: "10 yeas, 0 nays, 1 absent",
    href: Router.meetingItem("city-council-2026-08-25", ITEM),
  },
  {
    date: "2026-10-14",
    title: "Planning Board recommends approval, with conditions",
    href: Router.meetingItem("planning-board-2026-10-14", ITEM),
  },
  { date: "2026-10-27", title: "This sitting" },
]

export const CONCERNS: Concern[] = [
  {
    // The street is the one thing every letter comes back to, and the only
    // pair where the Planning Director's own letter names a problem and the
    // applicant's answer is a remedy with a price on it: the widening is the
    // applicant's offer, and the Board's conditions make it a requirement.
    subject: "I Street's width and condition",
    raised: [
      {
        source: "Christine Mahoney, 59 I Street resident & homeowner, October 21, 2026",
        href: MAHONEY,
        quotes: [
          "I Street is a narrow, dead-end residential road that was never designed to accommodate the traffic associated with a development of this size.",
          "Without sidewalks or infrastructure designed to support this additional activity, I worry about pedestrian safety, emergency vehicle access, road conditions, and, most importantly, the safety of the children and families who live here.",
        ],
      },
      {
        source: "Jacki Byerley, AICP, Planning Director, October 15, 2026",
        href: DIRECTOR,
        quotes: [
          "Based upon the review of the application and comments received during the hearing process, improvements to I Street are necessary to provide adequate and safe access to the proposed development and to address the impacts associated with the proposed project.",
        ],
      },
      {
        source: "McClure Engineering Co., City peer review, as Russell S. Channen restates it",
        href: IMPACT,
        quotes: [
          "McClure further recommended plans depicting the turnaround for fire apparatus and widening and fixing I Street.",
        ],
      },
    ],
    answered: [
      {
        source: "Russell S. Channen, Phillips, Gerstein & Channen, LLP, October 22, 2026",
        href: IMPACT,
        quotes: [
          "Pentucket North has agreed to widen I Street to 24 feet and to mill and overlay I Street post construction. Such work would be coordinated with the required City Departments.",
        ],
      },
      {
        source: "Jacki Byerley, AICP, Planning Director, October 15, 2026",
        href: DIRECTOR,
        quotes: [
          "The applicant has proposed improvements to I Street to be reviewed by Engineering and Police prior to construction of the improvement.",
        ],
      },
    ],
  },
  {
    subject: "Traffic",
    raised: [
      {
        source: "Christine Mahoney, 59 I Street resident & homeowner, October 21, 2026",
        href: MAHONEY,
        quotes: [
          "The addition of 14 residential units would bring a significant increase in vehicles, along with construction traffic, deliveries, and service vehicles.",
        ],
      },
    ],
    answered: [
      {
        source: "Russell S. Channen, Phillips, Gerstein & Channen, LLP, October 22, 2026",
        href: IMPACT,
        quotes: [
          "Traffic-volume increases related to the Project, external to the Study, are anticipated to range from 1 to 4 vehicles or 0.4 to 2.3 percent, during peak periods",
        ],
      },
      {
        source: "Russell S. Channen, Phillips, Gerstein & Channen, LLP, October 22, 2026",
        href: IMPACT,
        quotes: [
          "The City's peer report, performed by McClure Engineering Co. (\"McClure\"), determined that VAI's methodologies were consistent with accepted MassDOT practices, and the findings were reasonable.",
        ],
      },
    ],
  },
  {
    // Nothing in the packet answers the Y Street letter, which is the one
    // neighbour's concern that is about a parcel rather than the street. The
    // Planning Board's own record is not in the packet, so the note says what
    // this packet holds and no more.
    subject: "Y Street and the drainage outfall",
    raised: [
      {
        source: "Patti Neals, Executor of 37 I Street, October 22, 2026",
        href: NEALS,
        quotes: [
          'Of particular concern is the proposed alteration of Y Street, an undeveloped public right-of-way, commonly referred to as a "paper street."',
          "According to the submitted plans, the proposed regrading of the western half of the Y Street right-of-way would raise existing elevations by as much as seven feet in certain areas.",
          "Additionally, the proposed drainage outflow pipe and associated riprap splash pad appear to extend approximately 10 to 15 feet into the Y Street right-of-way.",
        ],
      },
    ],
    answered: [],
    note: "Nothing in the Council's packet answers this letter.",
  },
  {
    subject: "Density and the character of the street",
    raised: [
      {
        source: "Patti Neals, Executor of 37 I Street, October 22, 2026",
        href: NEALS,
        quotes: [
          "Currently, I Street serves 15 residential units spread across roughly four to five acres of land. The proposed development would introduce an additional 14 residential units on just 1.5 acres, nearly doubling the number of households relying on this single dead-end street for access.",
          "Adding nearly as many residential units on 1.5 acres as currently exist throughout the surrounding neighborhood represents a significant and disproportionate increase in density.",
        ],
      },
    ],
    answered: [
      {
        source: "Russell S. Channen, Phillips, Gerstein & Channen, LLP, October 22, 2026",
        href: IMPACT,
        quotes: [
          "Change is never easy. Mr. Mailloux understands this and is sympathetic to the older generation currently residing in the area. However, Pentucket North beliefs that the Project's benefits outweigh the acknowledged inconveniences to the neighbors.",
        ],
      },
    ],
  },
  {
    // The impact statement restates a neighbour's Planning Board comment in its
    // own section, so the concern is quoted from the applicant's account of it
    // rather than from anything the neighbour wrote to the Council.
    subject: "Rental",
    raised: [
      {
        source: "A neighbour at the Planning Board hearing, as Russell S. Channen restates it",
        href: IMPACT,
        quotes: [
          "During a Planning Board hearing, a neighbor expressed her concern that the Developments would become rental property.",
        ],
      },
    ],
    answered: [
      {
        source: "Russell S. Channen, Phillips, Gerstein & Channen, LLP, October 22, 2026",
        href: IMPACT,
        quotes: [
          'Pentucket North has agreed to create a Home Owner\'s Association ("HOA") which will include among other things, a restriction prohibiting the rental of any units.',
        ],
      },
    ],
  },
  {
    subject: "Fire protection and water",
    raised: [
      {
        source: "Fire Department, as Russell S. Channen restates it",
        href: IMPACT,
        quotes: [
          "The Fire Department is satisfied with the plans and layout of the Development and their only request was for Pentucket North to install an additional fire hydrant at the Development's entrance.",
        ],
      },
    ],
    answered: [
      {
        source: "Russell S. Channen, Phillips, Gerstein & Channen, LLP, October 22, 2026",
        href: IMPACT,
        quotes: ["Pentucket North has no issue with this request."],
      },
      {
        source: "Jacki Byerley, AICP, Planning Director, October 15, 2026",
        href: DIRECTOR,
        quotes: [
          "The applicant has also agreed to place additional hydrants within the site and will place sprinklers in all the units.",
        ],
      },
    ],
  },
]

import type { TimelineEntry } from "$lib/timeline"
import { Router } from "$lib/router"

/**
 * The permit record for 27 Marshland Street, as two lists: how the hearing got
 * here, and what the departments and the neighbours asked for against what the
 * applicant has filed in answer.
 *
 * The page used to set both of this packet's letters down in full -- the
 * attorney's four sections and the engineer's six numbered responses, some
 * eleven hundred words -- which is the whole of the packet's prose and far more
 * than a reader needs to see what is being decided. The letters are scans with
 * no text layer, so they could not simply be left to the PDF viewer either.
 * What is here instead is the sentence of each that answers something, beside
 * the words of the comment it answers, and the full letters a click away.
 *
 * **The two sides come from two different packets, which is the point.** The
 * comments are in the thirty-page departmental review record the Council had on
 * 6 October; the answers are in the letters filed for 20 October, where the
 * comments survive only as the applicant's own restatement of them ("City
 * comments have been restated below"). Quoting the department beside the answer
 * is the one thing neither packet does, and it is arrangement rather than
 * prose: every line below is somebody's own words, and `source` names whose and
 * links the file.
 *
 * `subject` is ours -- a handle so a reader can find the pair again, and so the
 * two halves stay together when the columns stack on a phone. Nothing in the
 * record titles these.
 */

const THIS_PACKET = "city-council-2026-10-20"
const OCTOBER_6 = "city-council-2026-10-06"
const ITEM = "marshland-st-special-permit"

const excerpt = (meeting: string, name: string) => Router.excerpt(meeting, `${ITEM}/${name}`)

/** The departmental review record, printed 8 September 2026, in the 6 October packet. */
const REVIEWS = excerpt(OCTOBER_6, "departmental-reviews")
/** Jonathan R. Stark-Sachs, Johnson & Borenstein, LLC, 15 October 2026. */
const ATTORNEY = excerpt(THIS_PACKET, "revisions-letter")
/** Daniel Dragani, P.E., Engineering Solutions Group, 13 October 2026. */
const ENGINEER = excerpt(THIS_PACKET, "engineering-response")
/** The revised sheet filed with those two letters. */
const PLAN = excerpt(THIS_PACKET, "civil-site-plan")

export interface Passage {
  /** Who said it and when, named as the document names them. */
  source: string
  /** The file the words are in. */
  href: string
  /** Their words, one entry per paragraph. */
  quotes: string[]
}

export interface Concern {
  /** Our handle for the pair; nothing in the record titles these. */
  subject: string
  raised: Passage[]
  answered: Passage[]
}

/**
 * The back of Document # 21-J, which is where the Council records what it did
 * with a hearing: the vote setting it, then one line per continuance, each with
 * its own count. The last entry is the sitting this page is from, which the
 * document cannot carry yet.
 */
export const HEARING: TimelineEntry[] = [
  {
    date: "2026-07-28",
    title: "Hearing for September 15, 2026",
    note: "10 yeas, 0 nays, 1 absent",
  },
  {
    date: "2026-09-15",
    title: "Continue to October 6, 2026",
    note: "11 yeas, 0 nays, 0 absent",
    href: Router.meetingItem("city-council-2026-09-15", ITEM),
  },
  {
    date: "2026-10-06",
    title: "Continue to October 20, 2026",
    note: "10 yeas, 0 nays, 1 absent",
    href: Router.meetingItem(OCTOBER_6, ITEM),
  },
  { date: "2026-10-20", title: "This sitting" },
]

export const CONCERNS: Concern[] = [
  {
    subject: "Driveway spacing and front-yard coverage",
    raised: [
      {
        source: "Lisa Demeo, Engineering Department, July 24, 2026",
        href: REVIEWS,
        quotes: [
          "The alignment of the townhouses, and subsequent driveways is prohibited by Section 6.1.11.3. The proposed driveways take almost 100% of the front yard. Per code they cannot exceed 50% of the front yard,",
          "Any two driveways leading to or from a street to or from a single lot shall not be within 30 feet of each other at their intersections with the front lot line.",
        ],
      },
    ],
    answered: [
      {
        source: "Jonathan R. Stark-Sachs, Johnson & Borenstein, LLC, October 15, 2026",
        href: ATTORNEY,
        quotes: [
          "Should the Council grant the special permit, the Applicant therefore plans to seek a variance from the Haverhill Zoning Board of Appeals to allow for greater driveway coverage and closer spacing than normally allowed by the Ordinance.",
        ],
      },
    ],
  },
  {
    subject: "On-street parking",
    raised: [
      {
        source: "Lisa Demeo, Engineering Department, July 24, 2026",
        href: REVIEWS,
        quotes: ["The proposed driveways are taking on street parking away from all abutters."],
      },
      {
        source: "Neighbours, as the applicant reports them, October 15, 2026",
        href: ATTORNEY,
        quotes: [
          "Most were overall supportive of the project, but concerns about the availability of on-street parking were also communicated.",
        ],
      },
    ],
    answered: [
      {
        source: "Jonathan R. Stark-Sachs, Johnson & Borenstein, LLC, October 15, 2026",
        href: ATTORNEY,
        quotes: [
          "The Project provides for three separate driveways and two-car garages to serve each proposed townhome, supporting up to four parking spaces for residents and guests of each unit.",
          "The Applicant believes that the ample off-street parking provided, which will not result in any additional on-street parking demand, addresses this concern.",
        ],
      },
    ],
  },
  {
    subject: "Stormwater",
    raised: [
      {
        source: "Robert Moore, Storm Water Review, July 21, 2026",
        href: REVIEWS,
        quotes: [
          "Could you please provide a civil plan demonstrating compliance with the design standards found under C. 255, s. 6.3.3. I particularly review for compliance with 6.3.3.3, .4, and .5.",
        ],
      },
      {
        source: "City comments, as the applicant’s engineer restates them",
        href: ENGINEER,
        quotes: ['1/2" Storm Requirements', "Driveway Drainage Concerns"],
      },
    ],
    answered: [
      {
        source: "Jonathan R. Stark-Sachs, Johnson & Borenstein, LLC, October 15, 2026",
        href: ATTORNEY,
        quotes: [
          "Each townhome will be provided with separate stormwater management infrastructure, and pavement in both the front and rear has been reduced and pitched to provide for managed stormwater runoff, along with other minor changes to utility placement.",
        ],
      },
      {
        source: "Daniel Dragani, P.E., Engineering Solutions Group, October 13, 2026",
        href: ENGINEER,
        quotes: [
          "Please see attached plan which shows drainage calculations for the 1/2-inch storm.",
          "The proposed driveways are to be crowned draining towards 12”x24” french drains that will run along both edges of the driveway to mitigate storm runoff.",
        ],
      },
    ],
  },
  {
    subject: "Depth to the seasonal high water table",
    raised: [
      {
        source: "City comments, as the applicant’s engineer restates them",
        href: ENGINEER,
        quotes: ["ESGHWT Concern"],
      },
    ],
    answered: [
      {
        source: "Daniel Dragani, P.E., Engineering Solutions Group, October 13, 2026",
        href: ENGINEER,
        quotes: [
          "The plan has been revised to now show the test pit data along with additional grading. Subsequently, the proposed stormtech systems each have a minimum of 2ft separation from ESGHWT to bottom of stone.",
        ],
      },
    ],
  },
  {
    subject: "Impervious coverage",
    raised: [
      {
        source: "City comments, as the applicant’s engineer restates them",
        href: ENGINEER,
        quotes: ["Zoning Impervious Coverage"],
      },
    ],
    answered: [
      {
        source: "Daniel Dragani, P.E., Engineering Solutions Group, October 13, 2026",
        href: ENGINEER,
        quotes: [
          "Engineering Solutions Group does not perform zoning related work. Nonetheless, we have reduced the impervious coverage to alleviate this concern.",
        ],
      },
    ],
  },
  {
    subject: "Utilities and service connections",
    raised: [
      {
        source: "Lisa Demeo, Engineering Department, July 24, 2026",
        href: REVIEWS,
        quotes: [
          "Utilities are not shown. Separate sewer and water service connections are required for each unit.",
        ],
      },
    ],
    answered: [
      {
        source: "Revised conceptual civil site plan, sheet 3, October 13, 2026",
        href: PLAN,
        quotes: [
          "NEW 1” COPPER WATER, TYP.",
          "NEW 6” SDR 35 PVC, TYP.",
          "CUT AND CAP EX. SEWER SERVICE AT MAIN",
          "CUT AND CAP EX. WATER SERVICE AT CORP",
        ],
      },
    ],
  },
  {
    subject: "Conflict with an existing tree",
    raised: [
      {
        source: "City comments, as the applicant’s engineer restates them",
        href: ENGINEER,
        quotes: ["Tree Conflict"],
      },
    ],
    answered: [
      {
        source: "Daniel Dragani, P.E., Engineering Solutions Group, October 13, 2026",
        href: ENGINEER,
        quotes: [
          "The proposed utilities have been relocated away from the tree to avoid any potential conflicts.",
        ],
      },
    ],
  },
  {
    subject: "Erosion control",
    raised: [
      {
        source: "City comments, as the applicant’s engineer restates them",
        href: ENGINEER,
        quotes: ["Erosion Control Measures"],
      },
    ],
    answered: [
      {
        source: "Daniel Dragani, P.E., Engineering Solutions Group, October 13, 2026",
        href: ENGINEER,
        quotes: [
          "The erosion control limits have been added to the plan along with details. The additional details and notes will protect the construction area appropriately.",
        ],
      },
    ],
  },
  {
    subject: "Landscaping",
    raised: [
      {
        // The departments' own landscaping comments are not in either packet
        // as text; this is the applicant's own account of what was raised, and
        // the elision is the driveway half of the same sentence, which is the
        // first pair above.
        source: "City comments, as the applicant’s attorney restates them, October 15, 2026",
        href: ATTORNEY,
        quotes: [
          "comments were received from the various city departments regarding … compliance with stormwater and landscaping requirements in Section 6.3 of the Haverhill Zoning Ordinance",
        ],
      },
    ],
    answered: [
      {
        source: "Jonathan R. Stark-Sachs, Johnson & Borenstein, LLC, October 15, 2026",
        href: ATTORNEY,
        quotes: [
          "The Applicant will plant four street trees along the frontage of the property along with additional landscaping, as well as additional tree plantings in the rear yard to provide shade and attractive vegetation in association with the Project.",
        ],
      },
    ],
  },
  {
    subject: "Fire protection",
    raised: [
      {
        source: "Robert Irvine, Fire Department, July 21, 2026",
        href: REVIEWS,
        quotes: [
          "An NFPA 13 compliant sprinkler system shall be required for this project. Each unit is to have its own feed.",
        ],
      },
    ],
    answered: [
      {
        source: "Matt Silva, the applicant, July 22, 2026",
        href: REVIEWS,
        quotes: [
          "The project will comply with all applicable provisions of the Massachusetts State Building Code (780 CMR), the Massachusetts Comprehensive Fire Safety Code (527 CMR), M.G.L. Chapter 148, and all conditions of the Haverhill Fire Department, including the installation of an NFPA 13 automatic sprinkler system.",
        ],
      },
    ],
  },
]

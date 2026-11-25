import type { TimelineEntry } from "$lib/timeline"
import { Router } from "$lib/router"
import {
  CONCERNS as EARLIER,
  type Concern,
  type Passage,
} from "../../city-council-2026-10-27/pentucket-north-planned-development-district/record"

export type { Concern, Passage }

/**
 * The record for 931 Boston Road as the Council has it on 1 December: the
 * pairs written up for 27 October, which this packet carries again page for
 * page, plus the two documents new to it -- a third I Street resident's letter
 * against the project, and the applicant's engineer's letter on I Street.
 *
 * The earlier pairs still cite the 27 October excerpts: they are the same
 * letters, and one copy of each is enough. What is new cites this packet.
 */

const MEETING = "city-council-2026-12-01"
const ITEM = "pentucket-north-planned-development-district"

const excerpt = (name: string) => Router.excerpt(MEETING, `${ITEM}/${name}`)

/** Marianne Abate'-Day, 72 I Street, by email of October 25, 2026, forwarded by Councilor Ferreira. */
const ABATE_DAY = excerpt("abate-day-communication")
/** William A. Schkuta, P.E., The Morin-Cameron Group, October 8, 2026. */
const MORIN_CAMERON = excerpt("engineers-letter")

/**
 * The Council's own record of the petition, off the back of Document # 21-G:
 * the referral, one line per continuance with its count, and the Planning
 * Board's recommendation between them.
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
  {
    date: "2026-10-27",
    title: "Continue to December 1, 2026",
    note: "10 yeas, 0 nays, 1 absent",
    href: Router.meetingItem("city-council-2026-10-27", ITEM),
  },
  { date: "2026-12-01", title: "This sitting" },
]

const abateDay: Passage = {
  source: "Marianne Abate'-Day, 72 I Street, October 25, 2026",
  href: ABATE_DAY,
  quotes: [
    "Furthermore, I strongly object to any plans utilizing I Street as an access road for this project.",
  ],
}

const morinCameron: Passage = {
  source: "William A. Schkuta, P.E., The Morin-Cameron Group, Inc., October 8, 2026",
  href: MORIN_CAMERON,
  quotes: [
    "At this time we are actively working with the City for solutions for I Street improvements including the widening of the paved roadway width to a standard 24' width for the entirety.",
    "PND has agreed to mill/overlay the entire length of I Street post construction if the project moves forward.",
  ],
}

/**
 * The 27 October pairs, with the new letter added to the concern it raises --
 * I Street as the access -- and the engineer's letter beside the answers to
 * it. Nothing new answers any other concern.
 */
export const CONCERNS: Concern[] = EARLIER.map((concern, i) =>
  i === 0
    ? {
        ...concern,
        raised: [abateDay, ...concern.raised],
        answered: [...concern.answered, morinCameron],
      }
    : concern,
)

import type { Redline } from "$lib/redline"

/**
 * Chapter 222, Article XI, Recreational Motorized Vehicles, as the Mayor's
 * ordinance would amend it, transcribed from the marked-up copy in the packet
 * -- "the deletions struck through and the additions in italic" -- mark for
 * mark. Unlike the water ordinance's, this order amends the article in place
 * and the city published its own strike-through, so nothing here is derived:
 * a `struck` passage is one the copy strikes, an `added` one is one it sets in
 * italic, and both versions of the article are read back out of the marks.
 *
 * The packet's other copy, `ordinance.pdf`, is not a clean copy of the
 * amended article but this same document with the formatting taken off,
 * struck words still in it, so it cannot settle anything the marks leave open.
 *
 * One place the marks are not followed. § 222-65, the parent-or-guardian
 * section, is printed plain -- neither struck nor italic -- yet the copy also
 * renumbers "Violations and penalties" from § 222-65 to § 222-66, which only
 * makes sense if § 222-65 is new: today's article cannot carry two of them.
 * It is entered here as added, and `ordinance.spec.ts` pins that, so the
 * reading is stated rather than buried in the data.
 *
 * Sources, both in `static/excerpts/city-council-2026-09-22/` and again in
 * the 6 October packet: `ordinance-amendments-marked.pdf`, the marked copy.
 * The enacting clause above the article ("BE IT ORDAINED ...") is the order's,
 * not the article's, and stays on the item page.
 */

export const HEADING = {
  chapter: "Chapter 222",
  article: "Article XI",
  title: "Recreational Motorized Vehicles",
}

export const REDLINE: Redline = [
  { kind: "heading", text: ["§ 222-62 Definitions."] },
  { text: ["As used in this article, the following terms shall have the meanings indicated:"] },
  { kind: "term", text: ["RECREATIONAL MOTORIZED VEHICLES"] },
  {
    text: [
      "Recreational motorized vehicles are described as the following: motorized scooter",
      {
        struck:
          ", unregistered, two wheels, with handle grips, powered by a gasoline two-stroke or four-stroke engine",
      },
      { added: " or motorized bicycles, or class 1 or class 2 electric bicycles, all" },
      { struck: ". A motorized bicycle or motorcycle," },
      " as defined in M.G.L. c. 90, § 1",
      { struck: ", is not a motorized scooter" },
      ".",
      {
        added:
          " Electric scooters, electric unicycles, electric skateboards, any other electrically powered personal transportation device not otherwise regulated as a motor vehicle under the General Laws.",
      },
    ],
  },

  { kind: "heading", text: ["§ 222-63 Operating restrictions."] },
  {
    text: [
      "It shall be unlawful for any person to operate or permit to operate ",
      { struck: "the defined motorized scooter " },
      { added: "recreational motorized vehicles" },
      " within the City of Haverhill under any of the following circumstances:",
    ],
  },
  { indent: 1, text: ["A. On public sidewalks."] },
  {
    indent: 1,
    text: [
      "B. On public ",
      {
        struck:
          "and private roadways by a person not possessing a valid driver's license or learner's permit ",
      },
      { added: "bike paths, bikeways or natural surface trails" },
      ".",
    ],
  },
  {
    indent: 1,
    text: ["C. In public parks and ", { added: "public conservation and " }, "recreational areas."],
  },
  { indent: 1, text: ["D. On public ", { added: "playgrounds or " }, "school property."] },
  {
    indent: 1,
    text: [
      "E. On private property without the prior written consent of the owner or occupant of said property. No written consent shall be required for operation of any ",
      { added: "recreational " },
      "motorized ",
      { struck: "scooter " },
      { added: "vehicle" },
      " upon the property of any private club or other organization that permits the use of similar recreational vehicles by the club members.",
    ],
  },
  {
    indent: 1,
    text: [
      "F. ",
      {
        struck:
          "In such a manner as to create loud or unnecessary noise as to unreasonably disturb or interfere with persons in the peaceful and quiet enjoyment of their property. To this end, no person shall operate a scooter before the hour of 9:00 a.m. and after the hour of 7:00 p.m.",
      },
      {
        added:
          " person shall operate a motorized scooter upon any way at any time after sunset or before sunrise.",
      },
    ],
  },
  { indent: 1, text: ["G. To have a second rider on the same scooter."] },
  {
    indent: 1,
    text: [
      "H. Failing to wear protective headgear conforming to Registry of Motor Vehicles standards and/or noncompliance with the helmet requirements of MGL c. 85, § 11B",
      { struck: " 1/2" },
      { added: ", as may be amended from time to time" },
      ".",
    ],
  },
  {
    indent: 1,
    text: [
      "I. ",
      { struck: "Children age 12 and under shall not be allowed to drive motorized scooters " },
      {
        added:
          "Recreational motorized vehicles, excluding electric bicycles, shall not be operated on any Way, as defined by M.G.L. Chapter 90, Section 1, by a person under sixteen years of age, nor a person not possessing a valid driver’s license or learner’s permit, nor shall any operator permit any other person to ride as a passenger, and shall not operate at a speed in excess of the limit established by M.G.L. c. 90.",
      },
    ],
  },

  { kind: "heading", text: ["§ 222-64 Legal operation to conform with traffic regulations."] },
  {
    text: [
      "Any person legally entitled to operate a recreational motorized vehicle, as set forth herein, must conform with all traffic laws and regulations of the Commonwealth.",
    ],
  },

  // Printed plain in the marked copy; see the note at the top of this file.
  {
    text: [
      {
        added:
          "§ 222-65 The parent or guardian of a person under 18 years of age shall not authorize or knowingly permit that person to violate this ordinance. A violation by a person under 18 years of age shall not affect any civil right or liability nor shall the violation be a criminal offense.",
      },
    ],
  },

  {
    kind: "heading",
    text: ["§ 222-6", { added: "6" }, { struck: "5" }, " Violations and penalties."],
  },
  {
    text: [
      { added: "1. " },
      "Any violation of said article shall be subject to a fine of $",
      { added: "2" },
      "5",
      { struck: "0" },
      " for the first offense and no more than a fine of $50 for subsequent offenses.",
      {
        added:
          " Ticketing procedures for traffic violations shall be issued in accordance with M.G.L. c. 90C. All fines collected by a city or town pursuant to Section 11E of M.G.L. c. 85 shall be used by the City for the development and implementation of bicycle safety programs.",
      },
    ],
  },
  {
    text: [
      {
        added:
          "2. If the offender is under 16 years of age, the officer may give notice to the parent or guardian of the offender and may immediately seize and impound any Recreational Motorized Vehicle where the juvenile offender:",
      },
    ],
  },
  ...[
    "A. Fails to wear a properly fitted helmet as required by Massachusetts law and this ordinance.",
    "B. Fails to obey any traffic control device, sign, signal, crosswalk law, or other rule of the road.",
    "C. Operates the device recklessly, negligently, or in a manner that endangers any person or property.",
    "D. Operates the device on a sidewalk, recreational path, park, school property, conservation area, or other location where operation is prohibited.",
    "E. Fails to stop upon the lawful order of a police officer.",
    "F. Participates in racing, speed contests, stunt riding, wheelies in traffic, or similar hazardous conduct.",
    "G. Operates a modified device that exceeds manufacturer specifications or lawful speed limitations.",
    "H. Operates the device during the commission of any criminal offense or municipal ordinance violation.",
  ].map((added) => ({ indent: 1, text: [{ added }] })),
  {
    text: [
      {
        added:
          "3. A seized Recreational Motorized Vehicle shall not be released to the juvenile operator. Release shall be made only to a parent, legal guardian, or lawful owner, other than the juvenile, upon:",
      },
    ],
  },
  ...[
    "1. Proof of ownership;",
    "2. Proof of the juvenile's identity;",
    "3. Payment of all applicable fines and impoundment fees; and",
    "4. A written acknowledgment of receipt and notice of future penalties.",
  ].map((added) => ({ indent: 1, text: [{ added }] })),
  {
    text: [
      {
        added:
          "4. In addition to the Penalties set forth in section 222-66.1 above, as to juvenile offenders:",
      },
    ],
  },
  ...[
    "1. First Violation: Device may be impounded for up to seven (7) days.",
    "2. Second Violation within twelve (12) months: Device may be impounded for up to thirty (30) days.",
    "3. Third or Subsequent Violation within twelve (12) months: Device may be impounded for up to ninety (90) days.",
  ].map((added) => ({ indent: 1, text: [{ added }] })),
]

/**
 * The Water Use Restriction ordinance, as the Code prints it today and as the
 * Mayor's order would rewrite it.
 *
 * Order 5.2.1 repeals and replaces Chapter 250, Article VI "in its entirety",
 * and the packet attaches the current article "for reference" -- seven pages
 * of new ordinance beside five pages of old, both of them scans with no text
 * layer, and nothing anywhere saying which words actually moved. Both are
 * transcribed here so the page can set them against each other.
 *
 * The pairing is editorial, the words are the city's. The proposed article
 * renumbers most of what it keeps -- today's § 250-25 becomes § 250-25.1,
 * § 250-28 becomes § 250-27.1 -- so a section cannot be matched to its
 * counterpart by its number, and `key` below is what says which provision is
 * which. Where only one version has a provision at all, its side is simply
 * absent.
 *
 * `rewritten` says the two are not the same sentence with words changed but
 * two different sentences about the same subject: the drought table's actions,
 * the exemption list. A word-level diff of those marks almost every word,
 * which tells a reader nothing, so the page shows them plain and side by side
 * instead. `ordinances.spec.ts` pins that judgement against the measured
 * similarity, so a transcription corrected later cannot leave a rewritten
 * provision drawn as an amended one.
 *
 * Sources, both in `static/excerpts/`: `order.pdf`, the order as filed, and
 * `current-ordinance.pdf`, the article as eCode360 prints it.
 */

/** One provision, as each version states it. */
export type Row = {
  key: string
  /** The provision's own letter, number or defined term, where it has one. */
  label?: string
  /** What today's article says, or nothing where it has no such provision. */
  now?: string[]
  /** What the order would say, or nothing where it drops the provision. */
  proposed?: string[]
  /** Two different sentences rather than one sentence amended. */
  rewritten?: boolean
}

/** A section of the article, under each version's own number and title. */
export type Part = {
  key: string
  now?: { number: string; title: string }
  proposed?: { number: string; title: string }
  rows: Row[]
}

export const HEADING = {
  article: "Article VI",
  title: "Water Use Restriction",
  adopted: "[Adopted 2-3-1998 by Doc. 31; amended in its entirety 8-23-2016 by Doc. 92-B]",
}

export const COMPARISON: Part[] = [
  {
    key: "authority",
    now: { number: "§ 250-22", title: "Authority." },
    proposed: { number: "§ 250-22", title: "Authority." },
    rows: [
      {
        key: "text",
        now: [
          "This article is adopted by the City under its police powers to protect public health and welfare and its powers under MGL c. 40, § 21 et seq., and implements the City's authority to regulate water use pursuant to MGL c. 41, § 69B. This article also implements the City's authority under MGL c. 40, § 41A, conditioned upon a declaration of water supply emergency issued by the Commonwealth of Massachusetts Department of Environmental Protection (MassDEP).",
        ],
        proposed: [
          "This ordinance is adopted by the City under its police powers to protect public health and welfare and its powers under M.G.L. c. 40, § 21 et seq. This ordinance also implements the City's authority under M.G.L. c. 40, § 41A, conditioned upon a declaration of water supply emergency issued by the Commonwealth of Massachusetts Department of Environmental Protection (MassDEP). This ordinance is also intended to implement other water conservation requirements of M.G.L. c. 21G, the “Massachusetts Water Management Act” and its regulations promulgated under 310 CMR 36.00.",
        ],
      },
    ],
  },

  {
    key: "purpose",
    now: { number: "§ 250-23", title: "Purpose." },
    proposed: { number: "§ 250-23", title: "Purpose." },
    rows: [
      {
        key: "text",
        now: [
          "The purpose of this article is to protect, preserve and maintain the public health, safety and welfare whenever there is in force a State of Water Supply Conservation or State of Water Supply Emergency by providing for enforcement of any duly imposed restrictions, requirements, provisions or conditions imposed by the City or by the Department of Environmental Protection.",
        ],
        proposed: [
          "The purpose of this ordinance is to protect, preserve and maintain the public health, safety and welfare whenever there is in force a State of Water Supply Conservation or State of Water Supply Emergency by providing for enforcement of any duly imposed restrictions, requirements, provisions or conditions imposed by the City or by the Massachusetts Department of Environmental Protection.",
        ],
      },
    ],
  },

  {
    key: "applicability",
    proposed: { number: "§ 250-23.1", title: "Applicability." },
    rows: [
      {
        key: "text",
        proposed: [
          "All Water Customers and Water Users shall be subject to this ordinance, which shall be in effect year-round.",
        ],
      },
    ],
  },

  {
    key: "definitions",
    now: { number: "§ 250-24", title: "Definitions." },
    proposed: { number: "§ 250-24", title: "Definitions." },
    rows: [
      {
        key: "preamble",
        now: ["As used in this article, the following terms shall have the meanings indicated:"],
        proposed: [
          "As used in this ordinance, the following terms shall have the meanings indicated:",
        ],
      },
      {
        key: "agriculture",
        label: "AGRICULTURE",
        now: ["Farming in all its branches as defined at MGL c. 128, § 1A."],
        proposed: ["Farming in all its branches as defined at M.G.L. c. 128, § 1A."],
      },
      {
        key: "sprinkler",
        label: "AUTOMATIC SPRINKLER SYSTEM",
        now: ["Any system for watering vegetation other than a hand-held hose or a bucket."],
      },
      {
        key: "irrigation-system",
        label: "AUTOMATIC IRRIGATION SYSTEM",
        proposed: [
          "Any system, including sprinklers, for watering vegetation other than a hand-held hose or a bucket.",
        ],
      },
      {
        key: "director",
        label: "DIRECTOR",
        proposed: [
          "means the position responsible for oversight of the water division and may be the Director of Public Works, Deputy Director of Public Works, or the head of the water division.",
        ],
      },
      {
        key: "nonessential",
        label: "NONESSENTIAL OUTDOOR WATER USE",
        rewritten: true,
        now: [
          "Those uses that are not required:",
          "A. For health or safety reasons;",
          "B. By regulation;",
          "C. For the production of food and fiber;",
          "D. For the maintenance of livestock; or",
          "E. To meet the core functions of a business (for example, irrigation by golf courses as necessary to maintain tees and greens, and limited fairway watering, or irrigation by plant nurseries or agricultural operations as necessary to maintain stock or establish new plantings, wash equipment to prevent damage and/or maintain performance, pest management and plant cooling).",
        ],
        proposed: [
          "means any outdoor water use that is not specified in 310 CMR 36.03, as may be amended by § 250-26, as an exempted outdoor water use.",
        ],
      },
      {
        key: "person",
        label: "PERSON",
        now: ["Any individual, corporation, trust, partnership or association, or other entity."],
        proposed: [
          "Any individual, corporation, trust, partnership or association, or other entity.",
        ],
      },
      {
        key: "conservation",
        label: "STATE OF WATER SUPPLY CONSERVATION",
        now: [
          "A State of Water Supply Conservation declared by the City pursuant to § 250-25 of this article.",
        ],
        proposed: [
          "A State of Water Supply Conservation declared by the City pursuant to § 250-25 of this ordinance.",
        ],
      },
      {
        key: "emergency",
        label: "STATE OF WATER SUPPLY EMERGENCY",
        now: [
          "A state of water supply emergency declared by the Department of Environmental Protection under MGL c. 21G, §§ 15 through 17.",
        ],
        proposed: [
          "A state of water supply emergency declared by the Massachusetts Department of Environmental Protection under M.G.L. c. 21G, §§ 15 through 17.",
        ],
      },
      {
        key: "supply-capacity",
        label: "SUPPLY CAPACITY",
        now: [
          "A specific relationship between a reservoir's level and storage capacity expressed in percent.",
        ],
        proposed: [
          "A specific relationship between a reservoir's level and storage capacity expressed in percent.",
        ],
      },
      {
        key: "water-consumers",
        label: "WATER CONSUMERS",
        now: [
          "All public and private users of the City's public water system, irrespective of any person's responsibility for billing purposes for water used at any particular facility.",
        ],
      },
      {
        key: "water-customers",
        label: "WATER CUSTOMERS",
        proposed: [
          "All persons using the public water supply, irrespective of that person's responsibility for payment for use of the water.",
        ],
      },
      {
        key: "water-users",
        label: "WATER USERS",
        proposed: [
          "All persons using water from the City's public water supply or using privately-owned wells within the City's boundaries.",
        ],
      },
    ],
  },

  {
    key: "irrigation-requirements",
    proposed: { number: "§ 250-24.1", title: "Irrigation System Requirements." },
    rows: [
      {
        key: "A",
        label: "A.",
        proposed: [
          "All in-ground irrigation systems installed after the date of effect of this ordinance shall be equipped with a soil moisture sensor and rain sensor to prevent the system from starting automatically when not needed, and a flow sensor for leak detection.",
        ],
      },
      {
        key: "B",
        label: "B.",
        proposed: [
          "Any service or repair to an existing in-ground irrigation system shall include the installation of an approved moisture sensor, rain sensor, and flow sensor, if the same is not already installed and in good working condition.",
        ],
      },
      {
        key: "C",
        label: "C.",
        proposed: [
          "All in-ground irrigation systems shall be plumbed so that a shutoff valve is located outside the building and situated so that it may be shut off if found to be in violation of this ordinance. For the purposes of this section only, Police Officers of the City and/or Agents of the Board of Water Commissioners may enter upon any property to enforce this section.",
        ],
      },
    ],
  },

  {
    key: "baseline",
    proposed: { number: "§ 250-25", title: "Baseline Seasonal Conservation." },
    rows: [
      {
        key: "text",
        proposed: [
          "From May 15 through September 30, nonessential outdoor water use shall be limited to before 9:00 a.m. and after 5:00 p.m., unless otherwise modified by the City. The City may further restrict such use in accordance with § 250-25.1 and § 250-25.2.",
        ],
      },
    ],
  },

  {
    key: "declaration",
    now: { number: "§ 250-25", title: "Declaration of State of Water Supply Conservation." },
    proposed: {
      number: "§ 250-25.1",
      title: "Declaration of State of Water Supply Conservation.",
    },
    rows: [
      {
        key: "text",
        now: [
          "The City, through its Water Division, may declare a State of Water Supply Conservation upon a determination by the Director or Deputy Director of Public Works that a shortage of water exists and conservation measures are appropriate to ensure an adequate supply of water to all water consumers and to ensure compliance with the City's obligation under the Water Management Act. Public notice of a State of Water Supply Conservation shall be given under § 250-27 of this article before it may be enforced.",
        ],
        proposed: [
          "The City, through its Water Division, shall declare a State of Water Supply Conservation upon a determination by the Director that a shortage of water exists and conservation measures are appropriate to ensure an adequate supply of water to all water consumers and to ensure compliance with the City's obligations under the Water Management Act. Public notice of a State of Water Supply Conservation shall be given under § 250-27 of this ordinance before it may be enforced.",
        ],
      },
    ],
  },

  {
    key: "method",
    now: {
      number: "§ 250-25.1",
      title: "Method of determining a State of Water Supply Conservation.",
    },
    proposed: {
      number: "§ 250-25.2",
      title: "Method of Determining a State of Water Supply Conservation.",
    },
    rows: [
      {
        key: "A",
        label: "A.",
        now: [
          "The City, through its Water Division, shall monitor the state of water supply. The City shall implement water conservation measures in stages based on trigger levels as set forth below.",
        ],
        proposed: [
          "The City, through its Water Division, shall monitor the state of the City's water supply. From May 15th through September 30th the City shall implement a State of Water Supply Conservation in stages based on trigger levels as set forth below and in accordance with 310 CMR 36.07 as applicable which shall be applicable to all Water Users.",
        ],
      },
      {
        key: "trigger-5",
        label: "5% reduction in Kenoza Lake supply capacity",
        rewritten: true,
        now: [
          "Watch",
          "Notice may be issued to all water consumers of the drought watch condition in accordance with § 250-27.",
        ],
        proposed: [
          "Drought Watch",
          "From May 15 through September 30, nonessential outdoor water use may be limited to before 9:00 a.m. and after 5:00 p.m",
        ],
      },
      {
        key: "trigger-10",
        label: "10% reduction in Kenoza Lake supply capacity",
        rewritten: true,
        now: [
          "Warning",
          "Notice shall be issued to all water consumers of the drought warning status in accordance with § 250-27. All water consumers may be requested to enact water conservation measures as described in § 250-26 on a voluntary basis.",
        ],
        proposed: [
          "Level 1 Mild Drought",
          "All nonessential outdoor water uses are restricted to no more than one day per week, before 9 a.m. and after 5 p.m., except the watering of ornamentals and flower gardens with drip irrigation, hand-held hose, or watering cans.",
        ],
      },
      {
        key: "trigger-20",
        label: "20% reduction in Kenoza Lake supply capacity",
        rewritten: true,
        now: [
          "Emergency",
          "Notice shall be issued to all water consumers of the drought emergency status in accordance with § 250-27. All water consumers shall be required to comply with mandatory water conservation measures as described in § 250-26. All water consumers shall also be required to comply with any additional mandatory water conservation measures as may be mandated by the city through its Water Division.",
        ],
        proposed: [
          "Level 2 Significant Drought",
          "All nonessential outdoor water uses are banned, except that watering of ornamentals and flower gardens with drip irrigation, hand-held hose, or watering can.",
        ],
      },
      {
        key: "trigger-35",
        label: "35% reduction in Kenoza Lake supply capacity",
        rewritten: true,
        now: [
          "Critical",
          "Notice shall be issued to all water consumers of the critical drought status in accordance with § 250-27. All water consumers shall be required to comply with mandatory water conservation measures as described in § 250-26 in addition to those additional measures enacted to preserve the public water supply.",
        ],
        proposed: ["Level 3 Critical Drought", "All nonessential outdoor water uses are banned."],
      },
      {
        key: "trigger-over-35",
        label: ">35% reduction in Kenoza Lake supply capacity",
        proposed: ["Level 4 Drought Emergency", "All nonessential outdoor water uses are banned."],
      },
      {
        key: "B",
        label: "B.",
        now: [
          "In the event that the trend of the City's water supply is declining at a rate, as monitored and forecast by the Water Division, the City may elect to enact any one of the above drought status conditions to preserve the condition of the water supply.",
        ],
        proposed: [
          "In the event that the trend of the City's water supply is declining at a rate the Water Division deems concerning based on monitoring and forecasting by the Water Division, the City may elect to enact any one of the above drought status conditions at any time to preserve the condition of the water supply by providing notice as described in § 250-27.",
        ],
      },
      {
        key: "C",
        label: "C.",
        proposed: [
          "Upon declaration of a Level 3 Critical Drought or Level 4 Emergency Drought, no participating individuals or businesses shall be eligible to receive a deduct-meter credit, adjustment, or reduction to their sewer bill for water used through the deduct meter, regardless of meter readings or previous eligibility. This suspension shall apply to all outdoor irrigation systems, including inground sprinkler systems, automatic irrigation systems, hose bibs, and any metered device used to exclude outdoor water use from sewer billing. Deduct meter credits shall be reinstated once the Director terminates the Level 3 or Level 4 drought condition in accordance with § 250-27.1. Deduct-meter credits shall resume on the first billing cycle following public notice of termination. The suspension of deduct-meter credits shall be included in the public notice required under § 250-27 for a State of Water Supply Conservation and § 250-28 for a State of Water Supply Emergency.",
        ],
      },
    ],
  },

  {
    key: "restrictions",
    now: { number: "§ 250-26", title: "Restricted nonessential outdoor water uses." },
    rows: [
      {
        key: "preamble",
        now: [
          "A declaration of a State of Water Supply Conservation shall include one or more of the following restrictions, conditions, or requirements limiting the use of water as necessary to protect the water supply. The applicable restrictions, conditions or requirements, as determined by the Director or Deputy Director of Public Works, shall be included in the public notice required under § 250-27.",
        ],
      },
      {
        key: "A",
        label: "A.",
        now: [
          "Nonessential outdoor water use days. Nonessential outdoor water use, by water users, is permitted only on the days per week specified in the State of Water Supply Conservation or State of Water Supply Emergency and public notice thereof.",
        ],
      },
      {
        key: "B",
        label: "B.",
        now: [
          "Nonessential outdoor water use ban. Nonessential outdoor water use is prohibited at all times.",
        ],
      },
      {
        key: "C",
        label: "C.",
        now: [
          "Nonessential outdoor water use hours. Nonessential outdoor water use is permitted only during the hourly periods specified in the declaration of a State of Water Supply Conservation and public notice thereof.",
        ],
      },
      {
        key: "D",
        label: "D.",
        now: [
          "Automatic sprinkler use. The irrigation of lawns via sprinklers or automatic irrigation systems is prohibited.",
        ],
      },
      {
        key: "E",
        label: "E.",
        now: [
          "All other nonessential outdoor water use not specifically mentioned above as specified in the State of Water Supply Conservation or State of Water Supply Emergency and public notice thereof.",
        ],
      },
    ],
  },

  {
    key: "exemptions",
    now: { number: "§ 250-26.1", title: "Exceptions to nonessential outdoor water use." },
    proposed: { number: "§ 250-26", title: "Nonessential Outdoor Water Use." },
    rows: [
      // No labels down this section. Each version letters its own exemptions
      // and the two letterings do not correspond -- today's B(1) is the
      // proposal's G and H -- so a shared label would have to be a word of
      // mine over the city's. Each side keeps its own numbering in its own
      // text instead, and the pairing is carried by `key`, which nothing draws.
      {
        key: "preamble",
        rewritten: true,
        now: [
          "A. Unless the drought status reaches emergency or critical, as certified by the Water Division and the Director of Public Works or Deputy Director of Public Works, then the following items may be exempted as nonessential outdoor water use.",
        ],
        proposed: ["Nonessential outdoor water use means a use that is not required:"],
      },
      {
        key: "health",
        proposed: [
          "A. for health or safety reasons, including public facilities used for cooling such as splash pads and swimming pools, and for washing of boats, engines, or marine equipment to prevent negative saltwater impacts or the transfer of invasive aquatic species;",
        ],
      },
      {
        key: "regulation",
        proposed: ["B. by permit, license, statute or regulation;"],
      },
      {
        key: "food",
        proposed: ["C. for the production of food, including vegetable gardens, and fiber;"],
      },
      {
        key: "livestock",
        proposed: ["D. for the maintenance of livestock;"],
      },
      {
        key: "stormwater",
        now: ["(1) Irrigation with harvested and stored stormwater runoff;"],
        proposed: ["E. Irrigation with harvested and stored stormwater runoff;"],
      },
      {
        key: "agriculture",
        now: ["(2) Water use for the purposes of agriculture;"],
      },
      {
        key: "core-functions",
        rewritten: true,
        now: [
          "(3) To meet the core functions of a business (for example, irrigation by golf courses as necessary to maintain tees and greens, and limited fairway watering, or irrigation by plant nurseries or agricultural operations as necessary to maintain stock or establish new plantings, wash equipment to prevent damage and/or maintain performance, pest management and plant cooling).",
        ],
        proposed: [
          "F. to meet the core functions (those functions essential to the commercial operations) of a business, including but not limited to:",
          "(1) plant nurseries as necessary to maintain stock;",
          "(2) golf courses as necessary to maintain greens and tees, and limited fairway watering per 310 CMR 36.07(2)(c)2.a. through c.;",
          "(3) venues used for weddings or similar special events that limit watering to hand-held hose or drip irrigation as necessary to maintain gardens, flowers and ornamental plants;",
          "(4) professional washing of exterior building surfaces, parking lots, driveways and/or sidewalks as necessary to apply surface treatments such as paint, preservatives, stucco, pavement, or cement in the course of construction, reconstruction or renovation work;",
        ],
      },
      {
        key: "review",
        now: [
          "B. The following outdoor water uses are subject to review and approval by the City, through its Water Division:",
        ],
      },
      {
        key: "parks",
        rewritten: true,
        now: [
          "(1) Irrigation of public parks and recreation fields by automatic sprinkler before 7:00 a.m. and after 7:00 p.m.;",
        ],
        proposed: [
          "G. for irrigation of public parks before 9:00 A.M. and after 5:00 P.M.,",
          "H. for irrigation of public and private recreation fields, including those operated by schools, colleges, universities and athletic associations, before 9:00 A.M. and after 5:00 P.M.,",
        ],
      },
      {
        key: "replanted",
        now: [
          "(2) Irrigation to establish replanted or resodded lawn or plantings during the months of May and September;",
        ],
      },
      {
        key: "new-lawns",
        rewritten: true,
        now: [
          "(3) Irrigation of newly planted lawns (seeded or sodded) in the current calendar year for homes or businesses newly constructed in the previous 12 months;",
        ],
        proposed: [
          "J. to establish a new lawn as necessary to stabilize soil in response to new construction or following the repair or replacement of a Title 5 system.",
        ],
      },
      {
        key: "gardens",
        now: [
          "(4) Irrigation of gardens, flowers and ornamental plants by means of hand-held hose or drip irrigation systems; and",
        ],
      },
      {
        key: "established-lawns",
        now: ["(5) Irrigation of established lawns by means of a hand-held hose only."],
      },
      {
        key: "shade-trees",
        proposed: [
          "I. for irrigation of publicly-funded shade trees and trees in the public right-of-way; or",
        ],
      },
    ],
  },

  {
    key: "notification",
    now: {
      number: "§ 250-27",
      title: "Public notification of State of Water Supply Conservation; notification of MassDEP.",
    },
    proposed: {
      number: "§ 250-27",
      title: "Public notification of State of Water Supply Conservation; notification of MassDEP.",
    },
    rows: [
      {
        key: "A",
        label: "A.",
        now: [
          "Notification of any provisions, restrictions, requirements or conditions imposed by the City as part of a State of Water Supply Conservation shall be published in a newspaper of general circulation within the City, or by such other means reasonably calculated to reach and inform all users of water of the State of Water Supply Conservation. Any restriction imposed under this section shall not be effective until such notification is provided, but no later than 48 hours after the declaration of a State of Water Supply Conservation. The City may also notify the public using other means determined to be appropriate. Notification may also include e-mail, websites, public service announcements on local media or other such means.",
        ],
        proposed: [
          "Notification of any provisions, restrictions, requirements or conditions imposed by the City as part of a State of Water Supply Conservation shall be published in a newspaper of general circulation within the City, or by such other means reasonably calculated to reach and inform all users of water of the State of Water Supply Conservation. Any restriction imposed under this section shall not be effective until such notification is provided, but no later than 48 hours after the declaration of a State of Water Supply Conservation. The City may also notify the public using other means determined to be appropriate. Notification may also include e-mail, websites, public service announcements on local media, or other such means.",
        ],
      },
      {
        key: "B",
        label: "B.",
        now: [
          'Submittal of MassDEP\'s form "Notification of Water Use Restriction" shall be provided to the Massachusetts Department of Environmental Protection per MassDEP regulations [310 CMR 22.15(8)].',
        ],
        proposed: [
          'Submittal of MassDEP\'s form "Notification of Water Use Restriction" shall be provided to the Massachusetts Department of Environmental Protection per MassDEP regulations [310 CMR 22.15(8)].',
        ],
      },
    ],
  },

  {
    key: "termination-conservation",
    now: {
      number: "§ 250-28",
      title: "Termination of State of Water Supply Conservation; notice.",
    },
    proposed: {
      number: "§ 250-27.1",
      title: "Termination of State of Water Supply Conservation; notice.",
    },
    rows: [
      {
        key: "text",
        now: [
          "A State of Water Supply Conservation may be terminated by the Director or Deputy Director of Public Works of the Water Division upon a determination that the water supply shortage no longer exists. Public notification of the termination of a State of Water Supply Conservation shall be given in the same manner required by § 250-27 for notice of its imposition.",
        ],
        proposed: [
          "A State of Water Supply Conservation may be terminated by the Director or Deputy Director of Public Works of the Water Division upon a determination that the water supply shortage no longer exists. Public notification of the termination of a State of Water Supply Conservation shall be given in the same manner required by § 250-27 for notice of its imposition.",
        ],
      },
    ],
  },

  {
    key: "emergency",
    now: {
      number: "§ 250-29",
      title: "State of Water Supply Emergency; compliance with MassDEP orders.",
    },
    proposed: {
      number: "§ 250-28",
      title: "State of Water Supply Emergency; compliance with MassDEP orders.",
    },
    rows: [
      {
        key: "A",
        label: "A.",
        now: [
          "Upon notification to the public that a declaration of a State of Water Supply Emergency has been issued by the Department of Environmental Protection, no person shall violate any provision, restriction, requirement, condition of any order approved or issued by the Department intended to bring about an end to the state of emergency.",
        ],
        proposed: [
          "Upon notification to the public that a declaration of a State of Water Supply Emergency has been issued by MassDEP, no person shall violate any provision, restriction, requirement, or condition of any order approved or issued by MassDEP intended to bring about an end to the state of emergency.",
        ],
      },
      {
        key: "B",
        label: "B.",
        now: [
          "Notification of any provisions, restrictions, requirements or conditions imposed by the declaration of a State of Water Supply Emergency shall be published in a newspaper of general circulation within the City, or by such other means reasonably calculated to reach and inform all users of water of the State of Water Supply Emergency. Any restriction imposed under this section shall not be effective until such notification is provided, but no later than 48 hours after the declaration of a State of Water Supply Emergency. The City may also notify the public using other means determined to be appropriate. Notification may also include e-mail, websites, public service announcements on local media or other such means.",
        ],
        proposed: [
          "Notification of any provisions, restrictions, requirements or conditions imposed by the declaration of a State of Water Supply Emergency shall be published in a newspaper of general circulation within the City, or by such other means reasonably calculated to reach and inform all users of water of the State of Water Supply Emergency as soon as possible but not later than 48 hours after the City receives notice of such declaration. The City may also notify the public using other means determined to be appropriate. Notification may also include e-mail, websites, public service announcements on local media or other such means.",
        ],
      },
    ],
  },

  {
    key: "termination-emergency",
    now: {
      number: "§ 250-29.1",
      title: "Termination of State of Water Supply Emergency; compliance with MassDEP orders.",
    },
    proposed: {
      number: "§ 250-28.1",
      title: "Termination of State of Water Supply Emergency; compliance with MassDEP orders.",
    },
    rows: [
      {
        key: "text",
        now: [
          "Upon notification to the City that the declaration of a State of Water Supply Emergency has been terminated by the Department of Environmental Protection, the public will be notified of the termination in the same manner as is required by § 250-29 for notice of its imposition.",
        ],
        proposed: [
          "Upon notification to the City that the declaration of a State of Water Supply Emergency has been terminated by MassDEP, the public will be notified of the termination in the same manner as is required by § 250-28 for notice of its imposition.",
        ],
      },
    ],
  },

  {
    key: "violations",
    now: { number: "§ 250-30", title: "Violations and penalties." },
    proposed: { number: "§ 250-29", title: "Violations and penalties." },
    rows: [
      {
        key: "A",
        label: "A.",
        now: [
          "Any person violating this article shall be liable to the City in the amount listed below:",
        ],
        proposed: [
          "Any person violating this ordinance shall be liable to the City in the amount listed below:",
        ],
      },
      {
        key: "first",
        label: "(1)",
        now: ["First violation: warning."],
        proposed: ["First violation: warning."],
      },
      {
        key: "second",
        label: "(2)",
        now: ["Second violation: $50."],
        proposed: ["Second violation: $100."],
      },
      {
        key: "third",
        label: "(3)",
        // Rewritten rather than amended: the order does not change a figure
        // here, it splits the provision -- today's third step is also the last
        // one and carries the cut-off, and the order's third step is a step in
        // the middle, the cut-off having moved to the fourth below.
        rewritten: true,
        now: [
          "Third and subsequent violations: $100 and may be subject to termination of water service.",
        ],
        proposed: ["Third violation: $200."],
      },
      {
        key: "fourth",
        label: "(4)",
        proposed: [
          "Fourth violation and subsequent violations: $300 and may be subject to termination of water service.",
        ],
      },
      {
        key: "B",
        label: "B.",
        now: [
          "Fines shall inure to the City for such uses as the Director or Deputy Director of Public Works may direct. Each day of violation shall constitute a separate offense. Fines shall be recovered by indictment, or by complaint before the District Court, or by noncriminal disposition in accordance with MGL c. 40, § 21D. For purposes of noncriminal disposition, the enforcing person shall be any police officer of the City or the Director or Deputy Director of Public Works or their designee. If a State of Water Supply Emergency has been declared, the Water Division may, in accordance with MGL c. 40, § 41A, shut off the water at the meter or the curb stop.",
        ],
        proposed: [
          "Fines shall inure to the City for such uses as the Director or Deputy Director of Public Works may direct. Each day of violation shall constitute a separate offense. Fines shall be recovered by indictment, or by complaint before the District Court, or by noncriminal disposition in accordance with M.G.L. c. 40, § 21D. For purposes of noncriminal disposition, the enforcing person shall be any police officer of the City or the Director or Deputy Director of Public Works or their designee. If a State of Water Supply Emergency has been declared, the Water Division may, in accordance with M.G.L. c. 40, § 41A, shut off the water at the meter or the curb stop.",
        ],
      },
    ],
  },

  {
    key: "severability",
    now: { number: "§ 250-30.1", title: "Severability." },
    proposed: { number: "§ 250-30", title: "Severability." },
    rows: [
      {
        key: "text",
        now: [
          "The invalidity of any portion or provision of this article shall not invalidate any other portion or provision thereof.",
        ],
        proposed: [
          "The invalidity of any portion or provision of this ordinance shall not invalidate any other portion or provision thereof.",
        ],
      },
    ],
  },
]

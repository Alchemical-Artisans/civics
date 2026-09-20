/**
 * The city's own drought and water-conservation figures, and the pure
 * arithmetic the `/water` calculator runs on them.
 *
 * Everything the rest of this site draws on comes off `meetings.json` or
 * `budget.json`, both committed by a scraper that reads a specific,
 * versioned page. Nothing scrapes haverhillma.gov's general pages, so these
 * figures are transcribed by hand, each with the exact page it came off and
 * the date it was read -- the same role a page-number comment plays in
 * `budget/fy2027/*\/tables.ts`, done here because there is no scraper to keep
 * it honest automatically. See `docs/water-pages.md`.
 */
import type { BudgetTableData } from "./budget-table"

export interface Source {
  /** What the page is called, for the footer's Sources list. */
  label: string
  /** A path under `haverhillma.gov` -- completed with `Router.cityPage`. */
  path: string
  /** The date this page's figures were read off it. */
  accessed: string
}

export const SOURCES: Source[] = [
  {
    label: "Water Supply/Drought Information",
    path: "/living-here/waterwastewater-services/water-supplydrought-information",
    accessed: "September 16, 2026",
  },
  {
    label: "Water Conservation",
    path: "/living-here/waterwastewater-services/water-conservation/",
    accessed: "September 16, 2026",
  },
]

/**
 * The city's own drought-emergency declaration, March 19, 2025 -- the
 * primary source for what a `DROUGHT_ZONES` percentage actually measures
 * (see the comment on it): the one place found that quotes the Water Use
 * Restriction Ordinance's own numeric threshold, rather than just the
 * chart's legend restating it.
 */
export const ORDINANCE_SOURCE: Source = {
  label: "The City of Haverhill Water Division Declares Drought Emergency",
  path: "/media/400jr2tq/public-notice-drought-emergency-declaration-march-2025.pdf",
  accessed: "September 17, 2026",
}

/**
 * The meeting the Council heard the Water/Wastewater director's drought
 * update at, and the item under it -- where the Kenoza Lake chart below was
 * published, and where a reader can see the rest of that briefing.
 */
export const DROUGHT_MEETING = "city-council-2026-09-15"
export const DROUGHT_ITEM = "drought-emergency-update"

/**
 * "The City of Haverhill water supply remains in the Emergency Drought
 * stage" -- Water Supply/Drought Information, updated August 27, 2026 and
 * unchanged as of the date above.
 */
export const DROUGHT_STAGE = "Emergency Drought"

/**
 * Kenoza Lake's level on the chart the Water/Wastewater director showed the
 * Council on September 15, 2026 -- inside the "20% - 35% Emergency Zone"
 * band the chart draws, against a 36-year average of roughly 108 feet at
 * that point in the year. Read off the chart itself
 * (`Router.excerpt(DROUGHT_MEETING, `${DROUGHT_ITEM}/drought-chart`)`)
 * rather than re-plotted here: a curve estimated back off an image would be
 * this site inventing data points the city never published as numbers.
 */
export const KENOZA_LAKE_LEVEL_FEET = 100.3

export interface DroughtZone {
  /** The zone's own name, as the chart's legend prints it: "Emergency". */
  name: string
  /** The deficit the zone covers, exactly as the legend states it. */
  range: string
  /** The same deficit, compacted for a label under a scale too narrow for `range`: "20-35%". */
  percent: string
}

/**
 * The drought-chart's own legend, mild to severe -- the chart lists them
 * critical-first; this site reads them the other way because a scale a
 * reader steps up feels more like a scale than one that counts down. Every
 * word is the chart's own; the ordering is this site's.
 *
 * The percentage is Kenoza Lake's deficit against its own average reservoir
 * *capacity* for that day of year -- not the "36-Year Average Level" line
 * the chart plots in feet, which is a related but different figure (level
 * and capacity move together but not linearly, for a reservoir with sloped
 * banks). This is confirmed for Emergency specifically, not inferred from
 * the chart's shape: the city's drought-emergency declaration states,
 * citing Water Use Restriction Ordinance section 250-25.1, "Haverhill's
 * drought emergency status is determined when Kenoza Lake ... is between
 * 20% and 35% below the average reservoir capacity on any particular day" --
 * which is exactly what the chart's own "20% - 35% Emergency Zone" band
 * states. Watch, Warning and Critical are the chart's own legend on the
 * same schema, not independently confirmed the same way; no other city
 * document found states their thresholds in percentage terms (one Drought
 * Watch announcement described that stage in feet instead). See
 * `ORDINANCE_SOURCE`.
 *
 * `percent` carries the same figure `range` does -- a scale without it reads
 * as four colored bands with names, not a measurement.
 */
export const DROUGHT_ZONES: DroughtZone[] = [
  { name: "Watch", range: "5% - 10% Watch Zone", percent: "5-10%" },
  { name: "Warning", range: "10% - 20% Warning Zone", percent: "10-20%" },
  { name: "Emergency", range: "20% - 35% Emergency Zone", percent: "20-35%" },
  { name: "Critical", range: "> 35% Critical Zone", percent: ">35%" },
]

/** Which of `DROUGHT_ZONES` the current-level line sits inside, on the same chart. */
export const CURRENT_DROUGHT_ZONE = "Emergency"

/** "Emergency Zone" -- for a sentence, rather than the bare name a scale marks. */
export const KENOZA_LAKE_ZONE = `${CURRENT_DROUGHT_ZONE} Zone`

/** Average treated drinking water produced per day, in million gallons. */
export const AVERAGE_PRODUCTION_MGD = 6.0

/**
 * "Typically 68% of Haverhill's water use is residential" -- Water
 * Conservation. The remaining 32% is arithmetic, not a second figure the
 * city states.
 */
export const USE_SPLIT: { label: string; amount: number }[] = [
  { label: "Residential", amount: 68 },
  { label: "Non-residential", amount: 32 },
]

/**
 * `USE_SPLIT` applied to `AVERAGE_PRODUCTION_MGD`, in million gallons a day
 * -- arithmetic on two cited figures, not a third one the city prints. The
 * chart draws this rather than the bare percentages above: `BudgetStack`
 * already reports a segment's share of its bar on hover, and a segment whose
 * own amount *is* a percentage would show the same number twice.
 */
export const USE_SPLIT_MGD: { label: string; amount: number }[] = USE_SPLIT.map((part) => ({
  label: part.label,
  amount: Math.round(((part.amount / 100) * AVERAGE_PRODUCTION_MGD + Number.EPSILON) * 100) / 100,
}))

/**
 * "Under the city's Water Management Act permit it is required to work to
 * achieve and maintain a residential gallons per capita day demand of no
 * more than 65 gal per person per day. This statistic is referred to as
 * RGPCD. Since 2009 Haverhill's RGPCD has been below the goal of 65." --
 * Water Conservation.
 *
 * The page states the permit's ceiling and that the city has stayed under it
 * since 2009; it does not publish a specific current-year RGPCD figure, so
 * only the target is carried here rather than a number invented to fill
 * that gap.
 */
export const RGPCD_TARGET = 65

/**
 * "If everybody in Haverhill reduces their water use by one gallon a day, it
 * would save over 22,000,000 gallons of water in a year." -- Water
 * Conservation.
 */
export const ANNUAL_GALLONS_PER_CAPITA_GALLON = 22_000_000

/**
 * Currently prohibited, exempt, and time-restricted outdoor water uses under
 * Chapter 250, transcribed from Water Supply/Drought Information. "Status"
 * is this site's own classification -- which of the page's three headed
 * lists a use appears under -- not a phrase the city prints; "Use" is the
 * city's own wording, verbatim.
 *
 * This is what answers the golf-course/car-wash/new-construction question
 * the city has an actual position on: not a volume of water each uses, which
 * nothing here publishes, but whether that use is allowed at all during the
 * drought -- exempt, restricted to before 7 a.m. or after 7 p.m., or
 * prohibited outright.
 */
export const RESTRICTED_USES: BudgetTableData = {
  columns: ["Use", "Status"],
  rows: [
    { label: "Irrigation using automatic sprinklers", cells: ["Prohibited"] },
    { label: "Washing vehicles (except commercial car washes)", cells: ["Prohibited"] },
    {
      label: "Washing driveways, sidewalks, patios, decks, and most building surfaces",
      cells: ["Prohibited"],
    },
    { label: "Filling pools, hot tubs, and wading pools", cells: ["Prohibited"] },
    { label: "Decorative fountains", cells: ["Prohibited"] },
    { label: "Nonessential construction-related water use", cells: ["Prohibited"] },
    { label: "Irrigation using harvested and stored stormwater runoff.", cells: ["Exempt"] },
    { label: "Water use for agricultural purposes.", cells: ["Exempt"] },
    // Missing spaces ("fairwaywatering", "stock orestablish") are the city's
    // page as published, not a transcription slip -- verbatim keeps them.
    {
      label:
        "Golf course irrigation necessary to maintain tees, greens, and limited fairwaywatering.",
      cells: ["Exempt"],
    },
    {
      label:
        "Plant nursery or agricultural operation irrigation to maintain stock orestablish new plantings.",
      cells: ["Exempt"],
    },
    {
      label: "Equipment washing to prevent damage and/or maintain performance.",
      cells: ["Exempt"],
    },
    { label: "Pest management and plant cooling activities", cells: ["Exempt"] },
    {
      label: "Irrigation of recently planted trees with a tree watering bag.",
      cells: ["Exempt"],
    },
    {
      label: "Public facilities for cooling such as splash pads and swimming pools",
      cells: ["Exempt"],
    },
    {
      label: "Irrigation of public parks and recreation fields by automatic sprinkler.",
      cells: ["Restricted — before 7 a.m. or after 7 p.m."],
    },
    {
      label:
        "Irrigation to establish only the areas of replanted or resodded lawns or plantings byhand-held hose only — only during May and September.",
      cells: ["Restricted — before 7 a.m. or after 7 p.m."],
    },
    {
      label:
        "Irrigation of newly planted lawns (seeded or sodded) by hand-held wateringcontainer or hose only for homes or businesses newly constructed within theprevious 12 months, within the current calendar year.",
      cells: ["Restricted — before 7 a.m. or after 7 p.m."],
    },
    {
      label:
        "Irrigation of gardens, flowers, and ornamental plants by hand-held wateringcontainer or hose or drip irrigation systems only.",
      cells: ["Restricted — before 7 a.m. or after 7 p.m."],
    },
    {
      label: "Irrigation of established lawns by hand-held hose only.",
      cells: ["Restricted — before 7 a.m. or after 7 p.m."],
    },
    {
      label: "Newly planted trees, shrubs and perennials",
      cells: ["Restricted — before 7 a.m. or after 7 p.m."],
    },
  ],
}

/**
 * "Indoor Water Conservation" -- Water Supply/Drought Information's own
 * short list of what the emergency asks of every household, verbatim.
 */
export const CONSERVATION_TIPS: string[] = [
  "Fix leaks promptly",
  "Run full dishwasher and laundry loads",
  "Take shorter showers",
  "Install water-efficient fixtures",
]

/**
 * "How Much Do You Use?" -- Water Conservation's own table, transcribed
 * verbatim. Empty cells are the book's own: the page prints no "With
 * Conservation" figure for the dishwasher or the laundry load.
 */
export const WATER_USE_CHART: BudgetTableData = {
  columns: ["Example", "Without Conservation", "With Conservation"],
  rows: [
    { label: "Flush the toilet (per flush)", cells: ["3.5 to 7 gallons", "1.6 gallons"] },
    {
      label: "Run tap two minutes while brushing teeth",
      cells: ["5 gallons", "2 gallons"],
    },
    { label: "Take a shower (per minute)", cells: ["5 gallons", "1.8 gallons"] },
    { label: "Use the dishwasher", cells: ["20 gallons", ""] },
    { label: "Do a full load of laundry", cells: ["50 gallons", ""] },
    {
      label: "Wash the car for 20 minutes, with hose running",
      cells: ["90 gallons", "25 gallons"],
    },
    {
      label: "Ignore a slowly leaking faucet for a month",
      cells: ["35 gallons", "0 gallons"],
    },
    {
      label: "Ignore a leaking toilet for 1 months",
      cells: ["7500 gallons", "0 gallons"],
    },
  ],
}

/**
 * A household's own gallons per person per day, the figure the city's
 * RGPCD permit target is stated in -- so a resident's water-bill reading
 * compares against the same unit rather than one this site invents.
 *
 * `gallons` is total household use over `days`; both non-positive return
 * `null` rather than `Infinity` or `NaN`; a calculator with nothing entered
 * yet has nothing to compare.
 */
export function gallonsPerPersonPerDay(
  gallons: number,
  people: number,
  days: number,
): number | null {
  if (!(gallons >= 0) || !(people > 0) || !(days > 0)) return null
  return gallons / people / days
}

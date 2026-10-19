import type { Redline } from "$lib/redline"

/**
 * The order to amend Document 94-O of 2025, as the city's marked-up copy
 * prints it: the rate schedule, and the seven conditions under it.
 *
 * Data rather than markup because the page draws the order as a diff -- the
 * figures the order strikes in red and the ones it puts in their place in
 * green, the way every other amendment on the site is drawn -- and a diff
 * needs to know which of the two sides each figure is on. The marked copy
 * prints both in the one cell, the old struck through and the new emboldened;
 * that is what a `Rate` is.
 *
 * The schedule is not a `Redline`, which the conditions below are. A redline
 * is a run of paragraphs, and this is a four-column table: flattened to
 * "7,001 to 9,000 lbs. GVWR $91 $5 $96" a row would lose which column each
 * figure sits in, which is the whole of what the schedule says. So the table
 * keeps its own shape and its rows are the diff's lines.
 */

/** A cell of the schedule: a figure the order leaves alone, or one it replaces. */
export type Cell = string | { was: string; now: string }

/** A line of the schedule: a group's own heading, or a rate and its three columns. */
export type Line = { heading: string } | { label: string; cells: [Cell, Cell, Cell] }

export const isHeading = (line: Line): line is { heading: string } => "heading" in line

/** Whether the order touches this line at all. */
export const amended = (line: Line) =>
  !isHeading(line) && line.cells.some((cell) => typeof cell !== "string")

/** The table's own caption, "Sow" and all. */
export const CAPTION = "Rates For Plowing, Clearing, and Hauling Sow"

/** The three headed columns, as the copy prints them. */
export const COLUMNS = ["Base Hourly Rate", "Early Sign-up Bonus", "Base Hourly with Sign-up Bonus"]

export const SCHEDULE: Line[] = [
  { heading: "Vehicles" },
  {
    label: "7,001 to 9,000 lbs. GVWR",
    cells: [{ was: "$91", now: "$96" }, "$5", { was: "$96", now: "$101" }],
  },
  {
    label: "9,001 to 11,000 lbs. GVWR",
    cells: [{ was: "$105", now: "$110" }, "$5", { was: "$110", now: "$115" }],
  },
  {
    label: "11,001 to 16,000 lbs. GVWR",
    cells: [
      { was: "$119", now: "$124" },
      { was: "$7", now: "$5" },
      { was: "$126", now: "$129" },
    ],
  },
  {
    label: "16,001 to 25,800 lbs. GVWR",
    cells: [
      { was: "$125", now: "$130" },
      { was: "$7", now: "$5" },
      { was: "$132", now: "$135" },
    ],
  },
  {
    label: "25,801 to 36,000 lbs. GVWR",
    cells: [
      { was: "$131", now: "$136" },
      { was: "$7", now: "$5" },
      { was: "$138", now: "$141" },
    ],
  },
  { heading: "Tractor" },
  {
    label: "Plow size under 10 feet",
    cells: [
      { was: "$137", now: "$142" },
      { was: "$7", now: "$5" },
      { was: "$144", now: "$147" },
    ],
  },
  {
    label: "Plow size 10 feet and greater",
    cells: [
      { was: "$144", now: "$149" },
      { was: "$7", now: "$5" },
      { was: "$151", now: "$154" },
    ],
  },
  { heading: "Front end loaders and backhoes" },
  { label: "Backhoe", cells: [{ was: "$137", now: "$142" }, "", ""] },
  { label: "Less than 2 CY", cells: [{ was: "$137", now: "$142" }, "", ""] },
  { label: "2-3.99 CY", cells: [{ was: "$137", now: "$142" }, "", ""] },
  { label: "4 CY and greater", cells: [{ was: "$149", now: "$154" }, "", ""] },
  { heading: "Special Equipment" },
  { label: "Skid steer with AWD", cells: [{ was: "$110", now: "$115" }, "", ""] },
  {
    label: "Skid steer with snowblower attachment",
    cells: [{ was: "$118", now: "$123" }, "", ""],
  },
  { label: "Bombardier with snowblower", cells: [{ was: "$105", now: "$110" }, "", ""] },
  { label: "Other Special Equipment", cells: [{ was: "$161", now: "$166" }, "", ""] },
  { heading: "Spreaders" },
  { label: "2 to 5.99 CY", cells: [{ was: "$10", now: "$15" }, "", ""] },
  { label: "6 to 9.99 CY", cells: [{ was: "$15", now: "$20" }, "", ""] },
  { label: "10 CY and greater", cells: [{ was: "$20", now: "$25" }, "", ""] },
  { heading: "Snow Hauling" },
  {
    label: "10-Wheeler, Tri-axle, and Dump Trailer",
    cells: [{ was: "$120", now: "$125" }, "", ""],
  },
  { heading: "Wing Plows" },
  { label: "Wing Plows", cells: [{ was: "$25", now: "$30" }, "", ""] },
]

/**
 * The seven conditions the order prints under the schedule, with the copy's
 * own marks: the fourth hands "Special" equipment to a different officer and
 * raises its ceiling, the sixth moves the sign-up deadline a year on.
 *
 * Each carries its own number, as the order prints them in a numbered list,
 * so the gutter beside them counts lines and the text says which condition.
 *
 * Two places where the mark here is a character narrower than the city's. The
 * copy strikes "14, 2025." in the sixth and prints the amended date's own full
 * stop after the emboldened words; struck and added read as sentences here
 * only if the stop they share is struck by neither. The fourth's trailing
 * comma is the order's, not a slip of this transcription.
 */
export const NOTES: Redline = [
  { text: ["1. Owner must furnish frame, pump and ram, plow and cutting edges."] },
  {
    text: [
      "2. If ballast is supplied to contractor by the City, it shall be returned at the end of each storm.",
    ],
  },
  { text: ["3. Haverhill contractors will be given first consideration when being called."] },
  {
    text: [
      "4. Other Special Equipment - Equipment defined as “Special” will be determined by the ",
      { struck: "Highway Superintendent" },
      { added: "Director of the Department of Public Works - Highway/Park and Tree" },
      " or his agents. The hourly wage for said special equipment will be negotiated at the time of hire. This equipment is to be determined “Special” because it is not specified in this Order. Rates are not to exceed ",
      { struck: "$161.00" },
      { added: "$166.00" },
      " per hour for hiring of said Special Equipment unless directed by the City Council,",
    ],
  },
  {
    text: [
      "5. Snow plow contractors shall be guaranteed a minimum of four (4) hour time allotment for each call out by the City.",
    ],
  },
  {
    text: [
      "6. Early Sign-up Bonus is only available to Vendors that submit all required documents and completed the vehicle inspection by November ",
      { struck: "14, 2025" },
      { added: "20, 2026" },
      ".",
    ],
  },
  { text: ["7. The spreader rate and wing plow rate is added to the vehicle base hourly rate."] },
]

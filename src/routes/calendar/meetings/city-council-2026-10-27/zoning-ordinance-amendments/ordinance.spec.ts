import { describe, it, expect } from "vitest"
import { amended, isHeading, type TableLine } from "$lib/diff"
import { after, before } from "$lib/redline"
import { COLUMNS, REDLINE, TABLE_TEXT, USE_TABLE } from "./ordinance"

/** The paragraph of a redline a version opens with these words, or undefined. */
const open =
  (redline: typeof REDLINE) => (version: (b: (typeof REDLINE)[number]) => string, start: string) =>
    redline.map(version).find((t) => t.startsWith(start))

const find = open(REDLINE)
const findInTable = open(TABLE_TEXT)

const row = (label: string) =>
  USE_TABLE.find((l): l is Extract<TableLine, { label: string }> =>
    isHeading(l) ? false : l.label.startsWith(label),
  )

/**
 * Transcribed by eye off a scan, so these pin the marks a misread would get
 * wrong and nothing else would catch: the numbers the order moves, the one
 * table row that is wholly new, and the districts each amended row touches.
 */
describe("what the ordinance changes", () => {
  it("lengthens the special permit lapse from 24 months to 36", () => {
    expect(find(before, "Special permits shall lapse")).toContain("within 24 months following")
    expect(find(after, "Special permits shall lapse")).toContain("within 36 months following")
  })

  it("doubles the abandonment period for a nonconforming use from two years to four", () => {
    expect(find(before, "A nonconforming use")).toContain("a period of two years")
    expect(find(after, "A nonconforming use")).toContain("a period of four years")
  })

  it("allows a second wall sign where today's text allows one per frontage", () => {
    expect(find(before, "Wall Signs")).toContain("One wall sign for each building frontage")
    expect(find(after, "Wall Signs")).toContain("A maximum of two wall signs shall be permitted")
  })

  it("drops the $850 floor under the PDD rezoning fee", () => {
    expect(find(before, "Submission Fee")).toContain("In no case shall the fee be less than $850")
    expect(find(after, "Submission Fee")).not.toContain("$850")
  })

  it("adds the Data Center definition and prohibits the use in every district", () => {
    expect(find(before, "Data Center")).toBeUndefined()
    expect(find(after, "Data Center")).toContain("A physical facility or building use to house")

    const data = row("21. Data Center")
    expect(data?.cells).toHaveLength(COLUMNS.length)
    expect(data?.cells.every((c) => typeof c !== "string" && c.was === "" && c.now === "N")).toBe(
      true,
    )
  })

  /**
   * Four rows and no more. The attached table is the whole use table, fifteen
   * pages of it; a row transcribed here that the copy does not mark would read
   * as a change the Council is not being asked to make.
   */
  it("marks four rows of the use table and nothing else", () => {
    expect(USE_TABLE.filter((l) => !isHeading(l)).map((l) => amended(l))).toEqual([
      true,
      true,
      true,
      true,
    ])
  })

  it("frees a three-family in the RU district alone from a Council special permit", () => {
    const three = row("3. Three-family dwelling")
    const changed = COLUMNS.filter((_, i) => typeof three?.cells[i] !== "string")
    expect(changed).toEqual(["RU"])
    expect(three?.cells[COLUMNS.indexOf("RU")]).toEqual({ was: "CC", now: "Y" })
    // The CG column keeps its Council special permit; only RU moves.
    expect(three?.cells[COLUMNS.indexOf("CG")]).toBe("CC")
  })

  it("allows a large family day-care home outright wherever the table reached it", () => {
    const large = row("5. Family day-care home, large")
    // Every district column moves to Y; only the parking column is untouched.
    expect(large?.cells.filter((c) => typeof c === "string")).toEqual(["None"])
    expect(large?.cells[COLUMNS.indexOf("CM")]).toEqual({ was: "N", now: "Y" })
  })

  it("allows accessory storage in the six residential districts and leaves the rest alone", () => {
    const storage = row("12. Accessory storage")
    const changed = COLUMNS.filter((_, i) => typeof storage?.cells[i] !== "string")
    expect(changed).toEqual(["RS", "RR", "RL", "RM", "RH", "RU"])
  })

  /**
   * The row's own label is amended too, and a `TableLine` label has nowhere to
   * put a mark, so the change is a paragraph instead. This pins that the
   * paragraph and the row agree about what the label becomes.
   */
  it("cross-references § 3.2.2.2 in place of the accessory storage row's own wording", () => {
    expect(findInTable(after, "12. Accessory storage")).toBe(
      "12. Accessory storage, see section 3.2.2.2 a. and b. for limitations.",
    )
    expect(row("12. Accessory storage")?.label).toBe(findInTable(after, "12. Accessory storage"))
    expect(findInTable(before, "12. Accessory storage")).toContain(
      "of 1 trailer for/or 1 unregistered",
    )
  })

  it("takes the S and I districts out of three of the table's nine notes", () => {
    const marked = TABLE_TEXT.filter((b) => before(b) !== after(b)).map((b) => after(b))
    expect(marked).toHaveLength(4)
    expect(marked.slice(1)).toEqual([
      "C. Access from any R Zoning District to an existing roadway which must pass through or into any other R Zoning or through any C District is permitted.",
      "D. Access from any C Zoning District to an existing roadway which must pass through or into any other C Zoning District is permitted.",
      "E. Access from any C Zoning District to an existing roadway which must pass through an R Zoning District may be permitted by a special permit issued by the Board of Appeals.",
    ])
  })
})

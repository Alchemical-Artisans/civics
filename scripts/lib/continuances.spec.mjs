import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import {
  PORTAL_ORIGIN,
  permitItems,
  recordUrl,
  sittingDate,
  soonest,
  toCheck,
  upcoming,
  validate,
} from "./continuances.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")
const read = (path) => readFileSync(join(root, path), "utf8")

const page = (meeting, item, source) => ({
  path: `src/routes/calendar/meetings/${meeting}/${item}/+page.svelte`,
  source,
})

const PERMIT = '<strong><PermitRecord number="CCSP-26-7" /></strong>'

describe("permitItems", () => {
  it("names the meeting, the item and the permit a page carries", () => {
    const items = permitItems([
      page("city-council-2026-10-20", "marshland-st-special-permit", PERMIT),
    ])

    expect(items).toEqual([
      {
        meeting: "city-council-2026-10-20",
        item: "marshland-st-special-permit",
        number: "CCSP-26-7",
      },
    ])
  })

  /** Almost every item page is this one, so it must cost nothing and yield nothing. */
  it("ignores a page with no permit on it", () => {
    expect(
      permitItems([page("city-council-2026-10-20", "snow-plowing-rates", "<p>rates</p>")]),
    ).toEqual([])
  })

  /**
   * The component takes other props and may be written across lines by
   * Prettier, so the number is matched inside the tag rather than by assuming
   * it is the only attribute or that the tag is on one line.
   */
  it("reads the number whatever else is on the tag", () => {
    const items = permitItems([
      page("city-council-2026-10-20", "a", '<PermitRecord class="x" number="PBFW-26-2" />'),
    ])

    expect(items.map((i) => i.number)).toEqual(["PBFW-26-2"])
  })

  /** A page may print the number twice -- in the agenda line and in a memo. */
  it("names a permit once however often the page prints it", () => {
    const items = permitItems([page("city-council-2026-10-20", "a", PERMIT + PERMIT)])

    expect(items.length).toBe(1)
  })

  /**
   * The meeting page itself carries the agenda outline and no `PermitRecord`;
   * were it ever to, the path has no item segment to file it under, and a
   * guess would send somebody to a page that does not exist.
   */
  it("skips a path with no item directory", () => {
    const items = permitItems([
      { path: "src/routes/calendar/meetings/city-council-2026-10-20/+page.svelte", source: PERMIT },
    ])

    expect(items).toEqual([])
  })

  it("orders by sitting, so the soonest is asked about first", () => {
    const items = permitItems([
      page("city-council-2026-11-17", "b", '<PermitRecord number="B-1" />'),
      page("city-council-2026-11-10", "a", '<PermitRecord number="A-1" />'),
    ])

    expect(items.map((i) => i.number)).toEqual(["A-1", "B-1"])
  })
})

describe("sittingDate", () => {
  it("is the tail of the meeting id", () => {
    expect(sittingDate("city-council-2026-10-20")).toBe("2026-10-20")
  })

  /** A board whose name ends in digits must not eat into the date. */
  it("reads a board whose name carries numbers", () => {
    expect(sittingDate("hunking-school-site-council-2027-04-06")).toBe("2027-04-06")
  })
})

describe("upcoming", () => {
  const items = [
    { meeting: "city-council-2026-10-20", item: "a", number: "A-1" },
    { meeting: "city-council-2026-11-17", item: "b", number: "B-1" },
  ]

  it("drops a sitting that has happened", () => {
    expect(upcoming(items, "2026-11-12").map((i) => i.number)).toEqual(["B-1"])
  })

  /**
   * The sitting is this evening and the continuance was filed yesterday --
   * the case the whole run exists for, so today is never behind the reader.
   */
  it("keeps a sitting today", () => {
    expect(upcoming(items, "2026-10-20").map((i) => i.number)).toEqual(["A-1", "B-1"])
  })
})

describe("recordUrl", () => {
  it("builds the portal's address for a permit somebody has looked up", () => {
    expect(recordUrl("CCSP-26-7", { "CCSP-26-7": 231770 })).toBe(
      "https://haverhillma.portal.opengov.com/records/231770",
    )
  })

  it("has no address for a permit nobody has looked up", () => {
    expect(recordUrl("PBFW-26-2", { "CCSP-26-7": 231770 })).toBeNull()
  })
})

describe("toCheck", () => {
  /**
   * A permit with no id cannot be checked, and must not be quietly dropped:
   * silence would read as "nothing has been continued" when what happened is
   * that nobody could look.
   */
  it("reports a permit with no id apart from the ones it can ask about", () => {
    const items = [
      { meeting: "city-council-2026-11-17", item: "a", number: "CCSP-26-7" },
      { meeting: "city-council-2026-11-17", item: "b", number: "PBFW-26-2" },
    ]

    const { checkable, unknown } = toCheck(items, { "CCSP-26-7": 231770 })

    expect(checkable.map((i) => i.number)).toEqual(["CCSP-26-7"])
    expect(checkable[0].url).toContain("/records/231770")
    expect(unknown.map((i) => i.number)).toEqual(["PBFW-26-2"])
  })
})

/**
 * The portal's address is written twice, and nothing at run time reconciles
 * them: the site needs it in TypeScript to bake a link into a prerendered
 * page, and this script needs it in JavaScript to print a link for a person
 * to open. The same bargain `excerpt-store.spec.mjs` makes about the bucket,
 * and the same protection -- a move that reaches only one of the two fails
 * here rather than sending somebody to a dead portal.
 */
describe("the portal's origin", () => {
  it("is the origin the site builds its permit links against", () => {
    const router = read("src/lib/router.ts")
    const [, origin] = router.match(/https:\/\/haverhillma\.portal\.opengov\.com/) ?? []

    expect(router).toContain(PORTAL_ORIGIN)
    expect(PORTAL_ORIGIN.endsWith("/")).toBe(false)
    expect(origin ?? PORTAL_ORIGIN).toBe(PORTAL_ORIGIN)
  })
})

describe("soonest", () => {
  /**
   * The case the real record produced: one permit continued twice is on three
   * item pages, and on the day the first agenda went out all three were still
   * to come. Asked once, about the hearing somebody is about to attend.
   */
  it("asks once per permit, about the sitting that is next", () => {
    const items = permitItems([
      page("city-council-2026-09-15", "marshland-st-special-permit", PERMIT),
      page("city-council-2026-10-06", "marshland-st-special-permit", PERMIT),
      page("city-council-2026-10-20", "marshland-st-special-permit", PERMIT),
    ])

    const next = soonest(items)

    expect(next.length).toBe(1)
    expect(next[0].meeting).toBe("city-council-2026-09-15")
  })

  it("keeps each permit where several are pending", () => {
    const items = permitItems([
      page("city-council-2026-11-17", "a", '<PermitRecord number="A-1" />'),
      page("city-council-2026-11-10", "b", '<PermitRecord number="B-1" />'),
    ])

    expect(soonest(items).map((i) => i.number)).toEqual(["B-1", "A-1"])
  })
})

describe("validate", () => {
  const item = { meeting: "city-council-2026-09-15", item: "a", number: "CCSP-26-7" }

  it("records a later date with a file that is there", () => {
    const got = validate({ item, date: "2026-10-06", file: "/tmp/letter.pdf", exists: true })

    expect(got.ok).toBe(true)
    expect(got.continuance).toEqual({ ...item, date: "2026-10-06", file: "/tmp/letter.pdf" })
  })

  /** The date alone is allowed; the prompt is told it is unverified. */
  it("records a date with no file at all", () => {
    const got = validate({ item, date: "2026-10-06", file: "", exists: false })

    expect(got.ok).toBe(true)
    expect(got.continuance.file).toBeNull()
  })

  it("passes over a permit answered with nothing", () => {
    expect(validate({ item, date: "", file: "", exists: false }).ok).toBe(false)
  })

  it("refuses a date it cannot read", () => {
    const got = validate({ item, date: "October 6", file: "", exists: false })

    expect(got.ok).toBe(false)
    expect(got.reason).toMatch(/YYYY-MM-DD/)
  })

  /**
   * The typo that would otherwise put a hearing in the past: last month's
   * sitting entered out of habit. A continuance only ever moves a hearing
   * later, so this is knowably wrong rather than merely suspect.
   */
  it("refuses a date no later than the sitting it was given for", () => {
    expect(validate({ item, date: "2026-09-15", file: "", exists: false }).ok).toBe(false)
    expect(validate({ item, date: "2026-08-01", file: "", exists: false }).ok).toBe(false)
  })

  /** A mistyped path must not be recorded as though a document backed it. */
  it("refuses a file that is not on disk", () => {
    const got = validate({ item, date: "2026-10-06", file: "/tmp/typo.pdf", exists: false })

    expect(got.ok).toBe(false)
    expect(got.reason).toMatch(/No file there/)
  })
})

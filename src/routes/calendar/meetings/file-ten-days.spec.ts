import { describe, expect, it } from "vitest"
import type { MeetingDetails } from "$lib/calendar"

/**
 * An item the Council stamps "File 10 Days" is read and placed on file, and
 * the vote comes at a later sitting. The Golden Hill roof bonds of 20 October
 * 2026 were highlighted as that evening's business and filed without
 * discussion, so two rules follow from the stamp, and this file holds every
 * write-up to both:
 *
 * - such an item is never a highlight, and
 * - the agenda's outline says so beside the item (`FileTenDays.svelte`),
 *   unless the section heading it sits under already does.
 *
 * Only the agenda's own stamp counts: the right-aligned line under the order.
 * A plain "File 10 Days" after "IN CITY COUNCIL:" is the clerk's record of an
 * earlier sitting's first reading, and means the item is back for its vote.
 */

const STAMP = /<p class="text-right">(?:<[^>]+>)*\s*File (?:for )?10 days/i

const items = import.meta.glob<string>("./*/*/+page.svelte", {
  query: "?raw",
  import: "default",
  eager: true,
})

const meetings = import.meta.glob<string>("./*/+page.svelte", {
  query: "?raw",
  import: "default",
  eager: true,
})

const loads = import.meta.glob<{ load: () => { details?: MeetingDetails } }>("./*/+page.ts", {
  eager: true,
})

/** Every `[meeting, item]` whose page carries the agenda's own stamp. */
const stamped = Object.entries(items)
  .filter(([, source]) => STAMP.test(source))
  .map(([path]) => path.split("/").slice(1, 3) as [string, string])

describe("File 10 Days", () => {
  it("finds the stamped items", () => {
    expect(stamped).toContainEqual([
      "city-council-2026-10-20",
      "golden-hill-roof-replacement-bonds",
    ])
  })

  it.each(stamped)("%s/%s is not a highlight", (meeting, item) => {
    const highlights = loads[`./${meeting}/+page.ts`]?.load().details?.highlights ?? []
    expect(highlights.map((h) => h.item)).not.toContain(item)
  })

  it.each(stamped)("%s/%s is marked on the agenda", (meeting, item) => {
    const source = meetings[`./${meeting}/+page.svelte`]
    const at = source.indexOf(`"${item}"`)
    expect(at, "the agenda links the item").toBeGreaterThan(-1)
    const heading =
      source
        .slice(0, at)
        .match(/<h2>[^<]*<\/h2>/g)
        ?.at(-1) ?? ""
    const entry = source.slice(at, source.indexOf("</li>", at))
    expect(/File 10 days/i.test(heading) || entry.includes("<FileTenDays")).toBe(true)
  })
})

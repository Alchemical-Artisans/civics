import { describe, expect, it } from "vitest"
import {
  agendaItems,
  highlightSlugs,
  longDate,
  meetingUrl,
  nextSitting,
  pickItems,
  statedTime,
  storyHtml,
} from "./story.mjs"

const PAGE = `
<h2>10. Public Hearings and Related Orders</h2>
<ul>
  <li>
    <strong>10.1</strong>
    <a href={Router.meetingItem(MEETING, "marshland-st-special-permit")}>
      Special Permit, 27 Marshland St
    </a>
  </li>
</ul>
<h2>12. Petitions</h2>
<ul>
  <li><strong>12.1 Applications Handicap Parking Sign:</strong></li>
  <li>
    <strong>12.6</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}> Annual License Renewals </a>
  </li>
</ul>
<h2>16. Unfinished Business of Preceding Meeting</h2>
<ul>
  <li>
    <strong>16.2</strong>
    <a href={agendaHref(MEETING, "water-use-restriction-ordinance")}>
      Water Use Restriction Ordinance
    </a>
  </li>
</ul>
<h2>
  <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
    19. Documents referred to committee study
  </a>
</h2>`

describe("agendaItems", () => {
  const items = agendaItems(PAGE)

  it("reads linked list items and linked headings, in order", () => {
    expect(items.map((i) => i.number)).toEqual(["10.1", "12.6", "16.2", "19"])
  })

  it("keeps the city's title and files it under its section", () => {
    expect(items[0]).toMatchObject({
      slug: "marshland-st-special-permit",
      title: "Special Permit, 27 Marshland St",
      section: "Public Hearings and Related Orders",
    })
  })

  it("ignores items with no page of their own", () => {
    expect(items.some((i) => i.title.includes("Handicap"))).toBe(false)
  })
})

describe("pickItems", () => {
  const items = agendaItems(PAGE)

  it("puts highlights first, then business that binds the city before routine business", () => {
    const picked = pickItems(items, { highlights: ["annual-license-renewals"], max: 2 })
    expect(picked.map((i) => i.number)).toEqual(["10.1", "12.6"])
  })

  it("returns the cut in agenda order", () => {
    const picked = pickItems(items, { max: 3 })
    expect(picked.map((i) => i.number)).toEqual(["10.1", "16.2", "19"])
  })

  it("lets a person choose, and says when a number is not on the agenda", () => {
    expect(pickItems(items, { only: ["16.2", "10.1"] }).map((i) => i.number)).toEqual([
      "16.2",
      "10.1",
    ])
    expect(() => pickItems(items, { only: ["99.9"] })).toThrow(/99\.9/)
  })
})

describe("page details", () => {
  it("reads highlight slugs and the stated hour", () => {
    const ts = `details: {
    time: "7:00 PM",
    highlights: [
      {
        item: "water-use-restriction-ordinance",
        title: "Water Use Restriction Ordinance",
        reasons: [],
      },
    ],
    location: {}`
    expect(statedTime(ts)).toBe("7:00 PM")
    expect(highlightSlugs(ts)).toEqual(["water-use-restriction-ordinance"])
  })
})

describe("nextSitting", () => {
  const ids = [
    "city-council-2026-10-06",
    "city-council-2026-10-13",
    "city-council-2026-10-20",
    "city-council-committee-2026-10-12",
    "planning-board-2026-10-12",
  ]

  it("takes the first sitting of the board on or after today", () => {
    expect(nextSitting(ids, "City Council", "2026-10-10").id).toBe("city-council-2026-10-13")
    expect(nextSitting(ids, "City Council", "2026-10-13").id).toBe("city-council-2026-10-13")
  })

  it("does not mistake another board sharing the prefix", () => {
    expect(nextSitting(ids, "City Council", "2026-10-14").id).toBe("city-council-2026-10-20")
    expect(nextSitting(ids, "City Council", "2026-10-21")).toBeNull()
  })
})

describe("the card", () => {
  it("names the day without sliding it", () => {
    expect(longDate("2026-10-13")).toBe("Tuesday, October 13")
  })

  it("escapes what it prints", () => {
    const html = storyHtml({
      board: "City Council",
      date: "2026-10-13",
      time: "7:00 PM",
      items: [{ number: "1.1", title: "Fees & <Charges>" }],
    })
    expect(html).toContain("Fees &amp; &lt;Charges&gt;")
  })

  it("links the sitting's own page", () => {
    expect(meetingUrl("city-council-2026-10-13")).toBe(
      "https://haverhill.alchemicalartisans.com/calendar/meetings/city-council-2026-10-13",
    )
  })
})

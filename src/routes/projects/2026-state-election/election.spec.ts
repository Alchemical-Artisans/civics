import { describe, expect, it } from "vitest"
import { contains } from "$lib/map"
import {
  OFFICES,
  POLLING_PLACES,
  PRECINCTS,
  QUESTIONS,
  WARDS,
  ballotFor,
  electionEvent,
  pollingPlaceFor,
  warrantDistrict,
} from "./election"

const allIds = PRECINCTS.flatMap((p) => [p.id, ...p.subprecincts.map((s) => s.id)])

describe("warrantDistrict", () => {
  it("spells MassGIS's names the way the warrant does", () => {
    expect(warrantDistrict("3rd Congressional District")).toBe("THIRD DISTRICT")
    expect(warrantDistrict("Fifth District")).toBe("FIFTH DISTRICT")
    expect(warrantDistrict("First Essex")).toBe("FIRST ESSEX DISTRICT")
    expect(warrantDistrict("Second Essex and Middlesex")).toBe(
      "SECOND ESSEX AND MIDDLESEX DISTRICT",
    )
    expect(warrantDistrict("3rd Essex")).toBe("THIRD ESSEX DISTRICT")
    expect(warrantDistrict("15th Essex")).toBe("FIFTEENTH ESSEX DISTRICT")
  })
})

describe("the precinct file", () => {
  it("has the city's twenty-one precincts in seven wards", () => {
    expect(PRECINCTS).toHaveLength(21)
    expect(WARDS.map((w) => w.ward)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
})

describe("POLLING_PLACES", () => {
  it("names only precincts that exist", () => {
    for (const place of POLLING_PLACES) for (const id of place.serves) expect(allIds).toContain(id)
  })

  it("gives every precinct exactly one place, except the one the warrant omits", () => {
    // 3-2A is in MassGIS's sub-precincts and on no row of the warrant; the
    // precinct page says so rather than guessing a room for it.
    const missing = allIds.filter((id) => !pollingPlaceFor(id))
    expect(missing).toEqual(["3-2A"])
    const named = POLLING_PLACES.flatMap((p) => p.serves)
    expect(new Set(named).size).toBe(named.length)
  })

  it("pins every place inside the city", () => {
    for (const place of POLLING_PLACES) {
      const inside = WARDS.some((w) => contains(w.shape, [place.lon, place.lat]))
      expect(inside, place.name).toBe(true)
    }
  })
})

describe("ballotFor", () => {
  it("finds every precinct's Congress, Council and Senate race on the warrant", () => {
    for (const p of [...PRECINCTS, ...PRECINCTS.flatMap((p) => p.subprecincts)]) {
      const lines = ballotFor(p.districts).filter(
        (l) => l.office !== "REPRESENTATIVE IN GENERAL COURT",
      )
      expect(
        lines.every((l) => l.onWarrant),
        p.id,
      ).toBe(true)
    }
  })

  it("lists each office once, in the warrant's order", () => {
    const offices = ballotFor(PRECINCTS[0].districts).map((l) => l.office)
    expect(offices).toEqual([...new Set(OFFICES.map((o) => o.office))])
  })

  it("marks the House race the warrant leaves out, and only that one", () => {
    // The warrant names the Third Essex House district and no other. Pinned so
    // that a corrected warrant -- or a redrawn map -- is noticed here.
    const off = [...PRECINCTS, ...PRECINCTS.flatMap((p) => p.subprecincts)]
      .filter((p) => ballotFor(p.districts).some((l) => !l.onWarrant))
      .map((p) => p.id)
      .sort()
    expect(off).toEqual(["2-1", "2-2", "5-1", "5-1A", "5-2", "5-3", "7-1", "7-2", "7-2A", "7-3A"])
    for (const id of off) {
      const p = [...PRECINCTS, ...PRECINCTS.flatMap((p) => p.subprecincts)].find(
        (p) => p.id === id,
      )!
      const line = ballotFor(p.districts).find((l) => !l.onWarrant)!
      expect(line).toEqual({
        office: "REPRESENTATIVE IN GENERAL COURT",
        district: "FIFTEENTH ESSEX DISTRICT",
        onWarrant: false,
        candidates: [
          {
            name: "Ryan M. Hamilton",
            party: "Democratic",
            url: "https://hamilton4rep.com/index.html",
          },
          {
            name: "Ronald L. Heiseler, III",
            party: "Republican",
            url: "https://www.ronnieheiseler.com/",
          },
        ],
      })
    }
  })
})

describe("candidates", () => {
  it("name someone for every office on every precinct's ballot", () => {
    for (const p of [...PRECINCTS, ...PRECINCTS.flatMap((p) => p.subprecincts)]) {
      for (const line of ballotFor(p.districts)) {
        expect(line.candidates.length, `${p.id} ${line.office} ${line.district}`).toBeGreaterThan(0)
      }
    }
  })
})

describe("QUESTIONS", () => {
  it("numbers the ten questions in order", () => {
    expect(QUESTIONS.map((q) => q.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})

describe("electionEvent", () => {
  it("runs from the polls' opening to their close", () => {
    const event = electionEvent()
    expect([event.start, event.end, event.allDay]).toEqual([
      "20261103T070000",
      "20261103T200000",
      false,
    ])
    expect(event.location).toBeUndefined()
  })

  it("puts a precinct's polling place in its event", () => {
    // 5-3 and its A half vote in one building, so it is still one location.
    expect(electionEvent("5-3").location).toBe(
      "West Congregational Church, 767 Broadway, Haverhill, MA",
    )
  })

  it("leaves the location off where the halves vote apart, and names both", () => {
    const event = electionEvent("7-2")
    expect(event.location).toBeUndefined()
    expect(event.description).toContain("Hunking Middle School")
    expect(event.description).toContain("Consentino Middle School")
  })
})

describe("the local question", () => {
  it("is Question 10 and no other", () => {
    expect(QUESTIONS.filter((q) => q.local).map((q) => q.number)).toEqual([10])
  })
})

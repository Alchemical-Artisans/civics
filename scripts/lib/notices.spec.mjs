import { describe, it, expect } from "vitest"
import {
  BODIES,
  classifyNotice,
  isCalledOff,
  monthUrl,
  monthsToFetch,
  normaliseTitle,
  parseNoticeTime,
  parseNotices,
} from "./notices.mjs"

/**
 * The month view's own shape, cut down to one week.
 *
 * Two spans and a link per entry, the date in the link's path; a day carrying
 * two entries; a `12:00 am` all-day posting; an `Events` entry, which is not a
 * meeting; and a day from the next month, which the grid pads its last row
 * with.
 */
const month = `
<div id="week-2-day-3" class="day ">
  <span class="day__number">8</span>
  <div class="day__event">
    <div class="calendar-bar-color-0"></div>
    <div class="day__event-meta">
      <span> 9:00 am </span>
      <span>Meetings</span>
      <a href="/default/Detail/2026-09-08-0900-Haverhill-Retirement-Board-Meeting"
         aria-label="View Haverhill Retirement Board Meeting on Sep 8, 2026 9:00 am">
        Haverhill Retirement Board Meeting
      </a>
    </div>
  </div>
  <div class="day__event">
    <div class="day__event-meta">
      <span> 12:00 am </span>
      <span>Meetings</span>
      <a href="/default/Detail/2026-09-08-0000-Legal-Notice-Release-of-Funds">
        Legal Notice - Release of Funds
      </a>
    </div>
  </div>
</div>
<div id="week-2-day-4" class="day ">
  <span class="day__number">9</span>
  <div class="day__event">
    <div class="day__event-meta">
      <span> 7:00 pm </span>
      <span>Meetings</span>
      <a href="/default/Detail/2026-09-09-1900-Planning-Board-Meeting">Planning Board Meeting</a>
    </div>
  </div>
</div>
<div id="week-5-day-6" class="day ">
  <span class="day__number">26</span>
  <div class="day__event">
    <div class="day__event-meta">
      <span> 8:30 am </span>
      <span>Events</span>
      <a href="/default/Detail/2026-09-26-0830-Shoreline-Cleanup">Shoreline Cleanup</a>
    </div>
  </div>
</div>
<div id="week-6-day-1" class="day day--other-month">
  <span class="day__number">1</span>
  <div class="day__event">
    <div class="day__event-meta">
      <span> 7:00 pm </span>
      <span>Meetings</span>
      <a href="/default/Detail/2026-10-01-1900-City-Council-Meeting2">City Council Meeting</a>
    </div>
  </div>
</div>
`

describe("parseNotices", () => {
  it("reads the date off the link's own path, not the cell it sits in", () => {
    // The cell numbers the day and nothing more; the path states the date.
    expect(parseNotices(month).map((n) => n.date)).toEqual([
      "2026-09-08",
      "2026-09-08",
      "2026-09-09",
      "2026-09-26",
      "2026-10-01",
    ])
  })

  it("keeps the category, which is the only sorting the calendar itself does", () => {
    const kinds = new Set(parseNotices(month).map((n) => n.category))
    expect(kinds).toEqual(new Set(["Meetings", "Events"]))
  })

  it("takes the title from the link rather than the slug, which is truncated", () => {
    expect(parseNotices(month)[2]).toMatchObject({
      title: "Planning Board Meeting",
      time: "7:00 PM",
      url: "https://events.haverhillma.gov/default/Detail/2026-09-09-1900-Planning-Board-Meeting",
    })
  })

  it("returns the days of neighbouring months the grid pads its rows with", () => {
    // Dropping them is the caller's job -- it knows which month it asked for,
    // and each of those days is fetched under its own month anyway.
    expect(parseNotices(month).at(-1)?.date).toBe("2026-10-01")
  })
})

describe("parseNoticeTime", () => {
  it("normalises to the form a meeting page prints", () => {
    expect(parseNoticeTime("7:00 pm")).toBe("7:00 PM")
    expect(parseNoticeTime(" 9:05 am ")).toBe("9:05 AM")
  })

  it("refuses midnight, which is the calendar's all-day posting", () => {
    // No board sits at midnight. A legal notice, a road closure and a week of
    // early voting all carry it, and an hour nobody stated is better left off
    // than invented.
    expect(parseNoticeTime("12:00 am")).toBeNull()
    expect(parseNotices(month)[1].time).toBeNull()
  })

  it("refuses anything that is not an hour", () => {
    expect(parseNoticeTime("All day")).toBeNull()
    expect(parseNoticeTime("")).toBeNull()
  })
})

describe("normaliseTitle", () => {
  it("keeps the & and / two bodies are named with", () => {
    expect(normaliseTitle("Budget &amp; Finance Subcommittee")).toBe(
      "budget & finance subcommittee",
    )
    expect(normaliseTitle("Water/Wastewater Rating Board")).toBe("water/wastewater rating board")
  })

  it("drops the apostrophes the city is inconsistent about", () => {
    expect(normaliseTitle("Board of Assessor's Meeting")).toBe("board of assessor s meeting")
  })
})

describe("classifyNotice", () => {
  it("reads one board through every spelling the city gives it", () => {
    for (const title of [
      "Board of Assessors",
      "Haverhill Board of Assessors Mtg",
      "Board of Assessor's Meeting",
      "Board of Assessors Public Meeting",
    ]) {
      expect(classifyNotice(title)).toBe("Board of Assessors")
    }
  })

  it("keeps a board's spelling as meetings.json has it, not as the notice does", () => {
    // The identity a sitting and its documents are matched on is the board
    // name, so a notice for a day the city later publishes an agenda for has
    // to arrive under the name the document listing gave that board.
    expect(classifyNotice("Board of Health Monthly Meeting")).toBe("Health Department")
    expect(classifyNotice("WATER/ WATERWASTE ABATEMENT BOARD MEETING")).toBe("Water Department")
  })

  it("separates the water abatement board from the rate-setting one", () => {
    // Two bodies, and the city writes the second's name three ways -- once as
    // bare "Water/ Wastewater".
    expect(classifyNotice("Water/Wastewater Rating Board Joint Meeting")).toBe(
      "Water/Wastewater Rating Board",
    )
    expect(classifyNotice("Water/ Wastewater")).toBe("Water/Wastewater Rating Board")
  })

  it("names the School Committee's subcommittees apart from the committee", () => {
    // They sit on the same evening most weeks, an hour apart, and a sitting is
    // identified by board and date -- so one name would drop one of the two.
    expect(classifyNotice("Haverhill School Committee Meeting")).toBe("School Committee")
    expect(classifyNotice("Haverhill School Committee Negotiating Team for Custodians")).toBe(
      "School Committee Negotiating Subcommittee",
    )
    expect(classifyNotice("Haverhill School Committee Policy Subcommittee Meeting")).toBe(
      "School Committee Policy Subcommittee",
    )
  })

  it("names each school's site council for its own school", () => {
    expect(classifyNotice("Caleb Duston Hunking Site Council Meeting")).toBe(
      "Hunking School Site Council",
    )
    expect(classifyNotice("Consentino Middle School Site Counci Meeting")).toBe(
      "Consentino Middle School Site Council",
    )
    expect(classifyNotice("Consentino School Building Commitee Mtg")).toBe(
      "Consentino School Building Committee",
    )
  })

  it("refuses everything that is not a Haverhill body", () => {
    // The city posts these to the same calendar, and none of them is Haverhill
    // sitting. They land in the run's unrecognised report instead.
    for (const title of [
      "Department of Public Utilities/National Grid Public Hearing",
      "Merrimack Valley Planning Commission Meeting",
      "MASSHIRE Merrimack Valley Workforce Board Meeting",
      "Essex County Commission on the Status of Women Meeting",
      "CREST Board of Directors Meeting",
      "NEMMC District Board of Commissioner's Meeting",
      "Early Voting for State Primary Election",
      "Legal Notice - Combined Notice of No Significant Impant",
      "MBTA Focus 2050",
    ]) {
      expect(classifyNotice(title)).toBeNull()
    }
  })

  it("refuses a budget hearing that does not say whose it is", () => {
    // "FY27 Budget Hearing" is the Council's or the School Committee's, and the
    // notice does not say which. Both hold them. A guess here would put a
    // sitting on the wrong board's calendar, so it goes to the report.
    expect(classifyNotice("FY27 Budget Hearing 2nd Revision")).toBeNull()
    // Named, it is read.
    expect(classifyNotice("FY26 City Council Departments Budget Hearings")).toBe("City Council")
  })
})

describe("BODIES", () => {
  it("names every board once", () => {
    const names = BODIES.map((b) => b.board)
    expect(names).toHaveLength(new Set(names).size)
  })

  it("puts each board's own pattern before any broader one that would claim it", () => {
    // Every subcommittee title contains "school committee" too, so the order of
    // this list is load-bearing: `classifyNotice` takes the first match.
    const at = (board) => BODIES.findIndex((b) => b.board === board)
    expect(at("School Committee Negotiating Subcommittee")).toBeLessThan(at("School Committee"))
    expect(at("School Committee Policy Subcommittee")).toBeLessThan(at("School Committee"))
    expect(at("Cultural Council Multicultural Festival Committee")).toBeLessThan(
      at("Cultural Council"),
    )
    expect(at("Water Department")).toBeLessThan(at("Water/Wastewater Rating Board"))
  })

  it("lets only a declared fallback stand behind a body's own pattern", () => {
    // Two patterns matching one title is how this list is meant to work in
    // exactly two places: every subcommittee title contains "school committee"
    // too, and the festival committee's contains "cultural council". Those two
    // broad patterns sit last and are declared here. Any *other* overlap means
    // a pattern is too loose, and which board won would then depend on the
    // order of this list rather than on what the notice says.
    const FALLBACKS = new Set(["School Committee", "Cultural Council"])
    const cases = {
      "Haverhill School Committee Budget & Finance Subcommittee Mtg":
        "School Committee Budget & Finance Subcommittee",
      "Haverhill School Committee Meeting": "School Committee",
      "Consentino School Building Committee Meeting": "Consentino School Building Committee",
      "John Greenleaf Whittier Middle School Site Council Meeting":
        "John Greenleaf Whittier Middle School Site Council",
      "Haverhill Conservation Commission Meeting": "Conservation Commission",
      "Planning and Development Committee Meeting": "Planning and Development Committee",
      "Haverhill Cultural Council Multicultural Festival Meeting":
        "Cultural Council Multicultural Festival Committee",
      "Central Business District Parking Commission Meeting":
        "Central Business District Parking Commission",
      "Bradford Common Historic District Commission (BCHDC)":
        "Bradford Common Historic District Commission",
      "WATER/ WATERWASTE ABATEMENT BOARD MEETING": "Water Department",
    }
    for (const [title, board] of Object.entries(cases)) {
      const hit = BODIES.filter((b) => b.match.test(normaliseTitle(title))).map((b) => b.board)
      expect(hit[0], title).toBe(board)
      expect(
        hit.slice(1).filter((b) => !FALLBACKS.has(b)),
        title,
      ).toEqual([])
    }
  })
})

describe("isCalledOff", () => {
  it("takes the city's own word for it, written into the title", () => {
    for (const title of [
      "CANCELED-Haverhill School Committee & High School Student Council Mtg",
      "CANCELLED-Haverhill School Committee Negotiating Team for Custodians",
      "CANCELLATION...School Committee Negotiating Team For Custodians",
      "Haverhill Conservation Commission Mtg-POSTPONED",
    ]) {
      expect(isCalledOff(title)).toBe(true)
    }
  })

  it("does not read a reissued notice as a cancelled one", () => {
    // "Revised" means the notice was posted again, not that the sitting is off.
    expect(isCalledOff("Haverhill School Committee Meeting - Revised")).toBe(false)
    expect(isCalledOff("MASSHIRE - Merrimack Valley Workforce Board Meeting, 2nd Revision")).toBe(
      false,
    )
  })
})

describe("monthsToFetch", () => {
  it("runs from this month to the end of this year, and no further", () => {
    // The same horizon the Council's rule is projected to. Nothing before this
    // month is fetched: no expected sitting is ever shown for a day that has
    // already happened.
    expect(monthsToFetch("2026-09-10")).toEqual([
      { year: 2026, month: 9 },
      { year: 2026, month: 10 },
      { year: 2026, month: 11 },
      { year: 2026, month: 12 },
    ])
    expect(monthsToFetch("2026-12-31")).toEqual([{ year: 2026, month: 12 }])
  })
})

describe("monthUrl", () => {
  it("asks for the month by its first day, zero-padded", () => {
    expect(monthUrl(2026, 9)).toBe(
      "https://events.haverhillma.gov/default/Month?StartDate=09/01/2026",
    )
  })
})

import { describe, it, expect } from "vitest"
import { Router } from "./router"

// `base` is "" under test, as it is in dev, preview and the e2e suite; only the
// deploy workflow sets BASE_PATH. What is worth pinning here is the spelling of
// each route, since the router is now the only place it appears.
describe("Router", () => {
  it("builds the site's routes", () => {
    expect(Router.home()).toBe("/")
    expect(Router.calendar()).toBe("/calendar")
    expect(Router.demo()).toBe("/demo")
    expect(Router.demoPlaywright()).toBe("/demo/playwright")
  })

  it("builds a meeting page from a meeting id", () => {
    expect(Router.meeting("city-council-2026-08-25")).toBe(
      "/calendar/meetings/city-council-2026-08-25",
    )
  })

  it("builds an item page beneath its meeting", () => {
    expect(Router.meetingItem("city-council-2026-08-25", "south-mill-street-loan-order")).toBe(
      "/calendar/meetings/city-council-2026-08-25/south-mill-street-loan-order",
    )
  })

  it("builds an excerpt path beneath its meeting", () => {
    expect(Router.excerpt("city-council-2026-08-25", "surplus-city-vehicles/order")).toBe(
      "/excerpts/city-council-2026-08-25/surplus-city-vehicles/order.pdf",
    )
  })

  it("sends records with no document to the city's own page", () => {
    expect(Router.cityPage("/document-manager/media-pages/agenda-and-minutes-5/")).toBe(
      "https://www.haverhillma.gov/document-manager/media-pages/agenda-and-minutes-5/",
    )
  })

  it("builds a budget book and a section of one", () => {
    expect(Router.budgetBook("fy2027")).toBe("/budget/fy2027")
    expect(Router.budgetSection("fy2027", "fiscal-reserves")).toBe("/budget/fy2027/fiscal-reserves")
  })

  it("builds a link to a term in the glossary", () => {
    expect(Router.glossaryTerm("fy2027", "free-cash")).toBe("/budget/fy2027/glossary#free-cash")
  })

  it("opens an outside PDF at a page", () => {
    expect(Router.pdfPage("https://cdn.example/budget.pdf", 17)).toBe(
      "https://cdn.example/budget.pdf#page=17",
    )
  })

  it("builds a full URL on the canonical domain", () => {
    expect(Router.absolute("/calendar/meetings/city-council-2026-08-25")).toBe(
      "https://haverhill.alchemicalartisans.com/calendar/meetings/city-council-2026-08-25",
    )
  })

  it("prefills a Google Calendar event, with the city's timezone for a timed one", () => {
    const url = new URL(
      Router.googleCalendar({
        title: "Haverhill Conservation Commission",
        start: "20260917T191500",
        end: "20260917T211500",
        details: "Agenda: https://haverhill.alchemicalartisans.com/calendar/meetings/x",
        location: "4 Summer Street, Haverhill, MA 01830",
        allDay: false,
      }),
    )
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render")
    expect(url.searchParams.get("action")).toBe("TEMPLATE")
    expect(url.searchParams.get("dates")).toBe("20260917T191500/20260917T211500")
    expect(url.searchParams.get("ctz")).toBe("America/New_York")
  })

  it("leaves the timezone off an all-day Google Calendar event", () => {
    const url = new URL(
      Router.googleCalendar({
        title: "Haverhill Conservation Commission",
        start: "20260917",
        end: "20260918",
        details: "",
        allDay: true,
      }),
    )
    expect(url.searchParams.get("dates")).toBe("20260917/20260918")
    expect(url.searchParams.has("ctz")).toBe(false)
  })
})

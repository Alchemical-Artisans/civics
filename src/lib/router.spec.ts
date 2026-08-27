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

  it("builds a document page from a docId", () => {
    expect(Router.document("2026-08-06-conservation-commission-agenda-cb247b9a")).toBe(
      "/calendar/documents/2026-08-06-conservation-commission-agenda-cb247b9a",
    )
  })

  it("sends records with no document to the city's own page", () => {
    expect(Router.cityPage("/document-manager/media-pages/agenda-and-minutes-5/")).toBe(
      "https://www.haverhillma.gov/document-manager/media-pages/agenda-and-minutes-5/",
    )
  })
})

import { describe, it, expect } from "vitest"
import {
  HPS_PAGE,
  sectionDate,
  kindOf,
  isContinuation,
  sectionDocuments,
  parseSections,
  pickAgenda,
  fetchSchoolCommitteeDocuments,
} from "./hps.mjs"

/** The newer component: a document list with posted dates and aria-labels. */
const newer = `
<div class="ss-component-header container"><h2 class="ss-component-header-title">September 10, 2026</h2></div>
<ul class="ss-document-list">
  <li class="ss-document-item">
    <a class="ss-document-link" href="https://files.smartsites.parentsquare.com/10015/city_clerk_posting_with_agenda_091026.pdf" aria-label="Download 2026.09.10 City Clerk Posting with Agenda, PDF file, added 2026-09-08">
      <div class="ss-document-download"><span class="ss-document-type-badge">.pdf</span></div>
      <div class="ss-document-date">2026-09-08</div>
      <div class="ss-document-title">2026.09.10 City Clerk Posting with Agenda</div>
    </a>
  </li>
  <li class="ss-document-item">
    <a class="ss-document-link" href="https://files.smartsites.parentsquare.com/10015/updated_090926_agenda_091026.pdf" aria-label="Download UPDATED, PDF file, added 2026-09-09">
      <div class="ss-document-date">2026-09-09</div>
      <div class="ss-document-title">UPDATED 09.09.26 Final for Posting Hybrid Regular Meeting Agenda 09.10.26</div>
    </a>
  </li>
  <li class="ss-document-item">
    <a class="ss-document-link" href="https://files.smartsites.parentsquare.com/10015/hsc_portfolio_091026.pdf">
      <div class="ss-document-date">2026-09-09</div>
      <div class="ss-document-title">Haverhill School Committee Portfolio 09.10.26</div>
    </a>
  </li>
  <li class="ss-document-item">
    <a href="https://docs.google.com/forms/d/abc/edit"><div class="ss-document-title">Register for the hearing</div></a>
  </li>
</ul>
<div class="ss-component-header container"><h2 class="ss-component-header-title">August 13, 2026</h2></div>
<ul class="ss-document-list">
  <li class="ss-document-item">
    <a class="ss-document-link" href="https://files.smartsites.parentsquare.com/10015/minutes_081326.pdf">
      <div class="ss-document-date">2026-08-28</div>
      <div class="ss-document-title">Haverhill School Committee Hybrid Regular Meeting Minutes 08.13.26</div>
    </a>
  </li>
</ul>
`

/** The older component: bare anchor text, no dates. */
const older = `
<div class="ss-component-header container"><h2 class="ss-component-header-title">March 26, 2026</h2></div>
<ul class="stack-links-container">
  <li class="stack-link-container"><div class="stack-link-text-container">
    <a href="https://files.smartsites.parentsquare.com/10015/city-clerk-posting-032626.pdf">2026.03.26 City Clerk Posting School Committee Hybrid Regular Meeting</a>
  </div></li>
  <li class="stack-link-container"><div class="stack-link-text-container">
    <a href="https://files.smartsites.parentsquare.com/10015/binder-032626.pdf">2026.03.26 Haverhill School Committee Meeting Portfolio Binder</a>
  </div></li>
</ul>
`

describe("sectionDate", () => {
  it("reads a plain date heading", () => {
    expect(sectionDate("September 10, 2026")).toBe("2026-09-10")
  })

  it("normalises the full-stop-for-comma typo", () => {
    expect(sectionDate("November 20. 2025")).toBe("2025-11-20")
  })

  it("reads a heading that carries the date mid-sentence", () => {
    expect(sectionDate("Hybrid Regular Meeting 05.22.25 following public hearing")).toBe(
      "2025-05-22",
    )
  })

  it("refuses a heading that names no single day", () => {
    for (const h of [
      "Public Hearing on FY26 Budget",
      "School Committee Links",
      "2023",
      "Week of February 23-27, 2026",
    ]) {
      expect(sectionDate(h)).toBeNull()
    }
  })
})

describe("kindOf", () => {
  it("classifies from the label, with the packet landing as other", () => {
    expect(kindOf("Final for Posting Hybrid Regular Meeting Agenda 09.10.26")).toBe("agenda")
    expect(kindOf("City Clerk Posting with Agenda")).toBe("agenda")
    expect(kindOf("Hybrid Regular Meeting Minutes 08.13.26")).toBe("minutes")
    expect(kindOf("Haverhill School Committee Portfolio 09.10.26")).toBe("other")
    expect(kindOf("Detailed Warrant EV20260410")).toBe("other")
  })
})

describe("isContinuation", () => {
  it("is true only for the page's spillover phrasings", () => {
    expect(
      isContinuation(
        "Due to the volume of materials, the meeting materials have been attached as separate documents",
      ),
    ).toBe(true)
    expect(isContinuation("Presentations at the meeting")).toBe(true)
    expect(isContinuation("Public Hearing on FY26 Budget")).toBe(false)
  })
})

describe("sectionDocuments", () => {
  const [sept] = parseSections(newer)

  it("takes only the PDF links on the file host", () => {
    const urls = sectionDocuments(sept.body).map((d) => d.fileUrl)
    expect(urls.every((u) => u.includes("files.smartsites.parentsquare.com"))).toBe(true)
    expect(urls.some((u) => u.includes("google"))).toBe(false)
  })

  it("reads the title and posted date from the newer markup", () => {
    const doc = sectionDocuments(sept.body)[0]
    expect(doc.label).toBe("2026.09.10 City Clerk Posting with Agenda")
    expect(doc.posted).toBe("2026-09-08")
  })

  it("reads the bare anchor text from the older markup", () => {
    const [march] = parseSections(older)
    expect(sectionDocuments(march.body).map((d) => d.label)).toEqual([
      "2026.03.26 City Clerk Posting School Committee Hybrid Regular Meeting",
      "2026.03.26 Haverhill School Committee Meeting Portfolio Binder",
    ])
  })
})

describe("pickAgenda", () => {
  it("keeps one agenda -- Final for Posting, then most recently posted -- and all else", () => {
    const docs = sectionDocuments(parseSections(newer)[0].body)
    const { kept, dropped } = pickAgenda(docs)
    const agendas = kept.filter((d) => kindOf(d.label) === "agenda")
    expect(agendas).toHaveLength(1)
    expect(agendas[0].label).toMatch(/UPDATED 09\.09\.26 Final for Posting/)
    expect(dropped.map((d) => d.label)).toEqual(["2026.09.10 City Clerk Posting with Agenda"])
    // The portfolio is not an agenda and is untouched.
    expect(kept.some((d) => d.label.includes("Portfolio"))).toBe(true)
  })
})

describe("fetchSchoolCommitteeDocuments", () => {
  const page = `${newer}
    <div class="ss-component-header container"><h2 class="ss-component-header-title">Presentations at the July 2, 2026 Meeting</h2></div>
    <div class="ss-component-header container"><h2 class="ss-component-header-title">Due to the volume of materials, the meeting materials have been attached as separate documents</h2></div>
    <ul class="ss-document-list"><li class="ss-document-item">
      <a class="ss-document-link" href="https://files.smartsites.parentsquare.com/10015/spillover.pdf"><div class="ss-document-title">Extra packet</div></a>
    </li></ul>
    <div class="ss-component-header container"><h2 class="ss-component-header-title">Some Prose Heading</h2></div>
    <ul class="ss-document-list"><li class="ss-document-item">
      <a class="ss-document-link" href="https://files.smartsites.parentsquare.com/10015/orphan.pdf"><div class="ss-document-title">Nowhere to file this</div></a>
    </li></ul>`

  it("builds records with the heading date as the authority", async () => {
    const { documents } = await fetchSchoolCommitteeDocuments({ fetchPage: async () => page })
    const sept = documents.filter((d) => d.date === "2026-09-10")
    expect(sept).not.toHaveLength(0)
    for (const d of sept) {
      expect(d).toMatchObject({
        board: "School Committee",
        pageUrl: HPS_PAGE,
        source: HPS_PAGE,
        dateSource: "schedule-page",
        needsReview: false,
      })
      expect(d.description).toMatch(/\.pdf$/)
    }
    expect(sept.filter((d) => d.kind === "agenda")).toHaveLength(1)
    expect(sept.some((d) => d.kind === "other" && d.title.includes("Portfolio"))).toBe(true)
  })

  it("carries a spillover block onto the sitting above it, and skips a prose heading", async () => {
    const { documents, skippedHeadings, carriedHeadings } = await fetchSchoolCommitteeDocuments({
      fetchPage: async () => page,
    })
    expect(carriedHeadings).toHaveLength(1)
    expect(documents.some((d) => d.date === "2026-07-02" && d.title === "Extra packet")).toBe(true)
    expect(skippedHeadings.map((s) => s.heading)).toContain("Some Prose Heading")
    expect(documents.some((d) => d.title === "Nowhere to file this")).toBe(false)
  })

  it("de-duplicates a PDF listed under two headings, keeping the one its filename dates", async () => {
    const twice = `
      <div class="ss-component-header container"><h2 class="ss-component-header-title">April 9, 2026</h2></div>
      <ul class="ss-document-list"><li class="ss-document-item">
        <a class="ss-document-link" href="https://files.smartsites.parentsquare.com/10015/agenda_043026.pdf"><div class="ss-document-title">Final for Posting Hybrid Regular Meeting Agenda 04.30.26</div></a>
      </li></ul>
      <div class="ss-component-header container"><h2 class="ss-component-header-title">April 30, 2026</h2></div>
      <ul class="ss-document-list"><li class="ss-document-item">
        <a class="ss-document-link" href="https://files.smartsites.parentsquare.com/10015/agenda_043026.pdf"><div class="ss-document-title">Final for Posting Hybrid Regular Meeting Agenda 04.30.26</div></a>
      </li></ul>`
    const { documents } = await fetchSchoolCommitteeDocuments({ fetchPage: async () => twice })
    const agenda = documents.filter((d) => d.fileUrl.endsWith("agenda_043026.pdf"))
    expect(agenda).toHaveLength(1)
    expect(agenda[0].date).toBe("2026-04-30")
    expect(agenda[0].dateConflict).toBe(false)
  })

  it("throws rather than writing nothing when the markup changes shape", async () => {
    await expect(
      fetchSchoolCommitteeDocuments({ fetchPage: async () => "<p>nothing</p>" }),
    ).rejects.toThrow()
  })
})

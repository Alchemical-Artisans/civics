import { describe, it, expect } from "vitest"
import { classifyRecording, parseRecordingList, recordingDate } from "./recordings.mjs"

describe("classifyRecording", () => {
  it("places the three bodies HC Media records", () => {
    expect(classifyRecording("Haverhill City Council Meeting – August 25, 2026")).toBe(
      "City Council",
    )
    expect(classifyRecording("Haverhill School Committee Meeting – August 27, 2026")).toBe(
      "School Committee",
    )
    expect(classifyRecording("Emergency Haverhill School Committee Meeting – June 30, 2026")).toBe(
      "School Committee",
    )
    expect(classifyRecording("Haverhill License Commission – January 9, 2026")).toBe(
      "License Commission",
    )
    expect(
      classifyRecording("Haverhill Special License Commission Meeting – November 20, 2024"),
    ).toBe("License Commission")
  })

  it("reads a council committee off its own title, not as the council", () => {
    expect(
      classifyRecording("Haverhill City Council Planning & Development Meeting – July 7"),
    ).toBe("Planning and Development Committee")
    expect(
      classifyRecording("Haverhill City Council Administrative & Finance Meeting – April 6, 2026"),
    ).toBe("Administration & Finance Committee")
    expect(
      classifyRecording("Haverhill City Council Public Safety Committee Meeting on E-Bikes"),
    ).toBe("Public Health, Safety & Works Committee")
  })

  it("keeps a budget hearing and an emergency meeting as the council itself", () => {
    expect(classifyRecording("Haverhill City Council Budget Hearing – June 08, 2026")).toBe(
      "City Council",
    )
    // One year the "Council" fell out of the title entirely.
    expect(classifyRecording("Haverhill City Budget Hearing - May 22, 2023")).toBe("City Council")
    expect(classifyRecording("Haverhill City Council Emergency Meeting – May 8, 2026")).toBe(
      "City Council",
    )
  })

  it("returns null for a title that names no board", () => {
    expect(classifyRecording("Haverhill Inauguration Ceremony 2026")).toBeNull()
    expect(classifyRecording("Minute with the Mayor – September 2026")).toBeNull()
  })
})

describe("recordingDate", () => {
  it("reads the date out of the slug, where the shown title is trimmed", () => {
    expect(
      recordingDate("haverhill-city-council-planning-development-meeting-august-24-2026"),
    ).toBe("2026-08-24")
    expect(recordingDate("haverhill-license-commission-meeting-july-02-2026")).toBe("2026-07-02")
    expect(recordingDate("haverhill-school-committee-meeting-january-8-2026")).toBe("2026-01-08")
  })

  it("is null for a slug with no date in it", () => {
    expect(recordingDate("haverhill-inauguration-ceremony-2026")).toBeNull()
  })
})

describe("parseRecordingList", () => {
  const html = `
    <article class="post-1 video type-video category-school-committee">
      <header class="entry-header"><h1 class="entry-title">
        <a href="http://haverhillcommunitytv.org/video/haverhill-school-committee-meeting-august-27-2026" rel="bookmark">Haverhill School Committee Meeting &#8211; August 27, 2026</a>
      </h1></header>
    </article>
    <article class="post-2 video">
      <header class="entry-header"><h1 class="entry-title">
        <a href="http://haverhillcommunitytv.org/video/haverhill-city-council-planning-development-meeting-august-24-2026" rel="bookmark">Haverhill City Council Planning &amp; Development Meeting &#8211; Augus&#8230;</a>
      </h1></header>
    </article>
    <h1 class="entry-title"><a href="http://haverhillcommunitytv.org/video/channel-8-live-stream">Channel 8 Government</a></h1>
  `

  it("takes each /video/ post, its slug, and a clean title", () => {
    const out = parseRecordingList(html)
    expect(out).toEqual([
      {
        url: "http://haverhillcommunitytv.org/video/haverhill-school-committee-meeting-august-27-2026",
        slug: "haverhill-school-committee-meeting-august-27-2026",
        title: "Haverhill School Committee Meeting - August 27, 2026",
      },
      {
        url: "http://haverhillcommunitytv.org/video/haverhill-city-council-planning-development-meeting-august-24-2026",
        slug: "haverhill-city-council-planning-development-meeting-august-24-2026",
        // The ellipsis WordPress appends when it trims a long title is dropped.
        title: "Haverhill City Council Planning & Development Meeting - Augus",
      },
    ])
  })

  it("drops the live-stream cards in the page furniture", () => {
    expect(parseRecordingList(html).some((r) => r.slug.includes("live-stream"))).toBe(false)
  })
})

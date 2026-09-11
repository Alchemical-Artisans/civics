import { describe, it, expect } from "vitest"
import { meetingDateOf, withoutStream } from "./streams.mjs"

describe("meetingDateOf", () => {
  it("reads the date off the end of a meeting id", () => {
    expect(meetingDateOf("school-committee-2026-09-10")).toBe("2026-09-10")
  })

  it("returns undefined for an id with no trailing date", () => {
    expect(meetingDateOf("school-committee")).toBeUndefined()
  })
})

describe("withoutStream", () => {
  it("removes the stream property and its own comment", () => {
    const before = [
      "    remote: {",
      "      // Haverhill Community Television's channel 8.",
      '      stream: "http://haverhillcommunitytv.org/video/channel-8-live-stream",',
      "      how: [",
      '        "Register ahead of time.",',
      "      ],",
      "    },",
    ].join("\n")
    const after = withoutStream(before)
    expect(after).not.toMatch(/stream:/)
    expect(after).not.toMatch(/channel 8/)
    expect(after).toMatch(/how: \[/)
  })

  it("collapses remote when stream was its only field", () => {
    const before = ["    remote: {", '      stream: "http://example.com/live",', "    },"].join(
      "\n",
    )
    const after = withoutStream(before)
    expect(after).not.toMatch(/remote:/)
    expect(after).not.toMatch(/stream:/)
  })

  it("leaves a file with no stream property untouched", () => {
    const before = ['    remote: {\n      url: "https://meet.google.com/x",\n    },'].join("\n")
    expect(withoutStream(before)).toBe(before)
  })
})

import { describe, it, expect } from "vitest"
import { qrPath } from "./qr"

describe("qrPath", () => {
  it("draws a square symbol with a quiet zone, and a longer address needs a bigger one", () => {
    const short = qrPath("https://example.com/a")
    const long = qrPath("https://example.com/" + "a".repeat(200))
    expect(short.size).toBeGreaterThanOrEqual(21 + 8)
    expect(long.size).toBeGreaterThan(short.size)
    expect(short.d.startsWith("M")).toBe(true)
  })
})

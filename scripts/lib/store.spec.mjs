import { describe, expect, it } from "vitest"
import { withoutFutureMinutes } from "./store.mjs"

const doc = (kind, date) => ({ title: "t", kind, date })

describe("withoutFutureMinutes", () => {
  it("demotes minutes dated today or later to other", () => {
    const out = withoutFutureMinutes(
      [doc("minutes", "2026-10-08"), doc("minutes", "2026-12-01")],
      "2026-10-08",
    )
    expect(out.map((m) => m.kind)).toEqual(["other", "other"])
  })

  it("leaves past minutes and every other kind alone", () => {
    const input = [doc("minutes", "2026-10-07"), doc("agenda", "2026-12-01"), doc("minutes", null)]
    expect(withoutFutureMinutes(input, "2026-10-08")).toEqual(input)
  })
})

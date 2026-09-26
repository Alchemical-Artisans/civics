import { describe, it, expect } from "vitest"
import { bar, progress, remaining } from "./progress.mjs"

describe("bar", () => {
  it("fills in proportion to what is done", () => {
    expect(bar(5, 10, 10)).toBe("█████░░░░░")
  })

  it("is empty at the start and full at the end", () => {
    expect(bar(0, 10, 4)).toBe("░░░░")
    expect(bar(10, 10, 4)).toBe("████")
  })

  it("draws an empty rail when the total is not known yet", () => {
    // A WordPress category prints its page count from page two on, so the
    // first page of every listing has nothing to draw a proportion against.
    expect(bar(1, null, 6)).toBe("░░░░░░")
  })

  it("does not overflow when more is done than the total said", () => {
    expect(bar(12, 10, 4)).toBe("████")
  })
})

describe("remaining", () => {
  it("reads as seconds under a minute", () => {
    expect(remaining(45)).toBe("45s")
  })

  it("reads as minutes and seconds above one", () => {
    expect(remaining(81)).toBe("1m 21s")
  })

  it("rounds up, so a bar still working never says no time at all", () => {
    expect(remaining(0.4)).toBe("1s")
  })

  it("names no time for an estimate there is no basis for", () => {
    expect(remaining(null)).toBe(null)
    expect(remaining(0)).toBe(null)
    expect(remaining(Infinity)).toBe(null)
  })
})

describe("progress", () => {
  const fake = (isTTY) => {
    const written = []
    return { out: { isTTY, write: (s) => written.push(s) }, written }
  }

  it("redraws in place, padding out the tail of a longer line", () => {
    const { out, written } = fake(true)
    const ui = progress(out)
    ui.update("a longer line")
    ui.update("short")
    expect(written).toEqual(["\ra longer line", "\rshort        "])
  })

  it("keeps a settled line and starts measuring again", () => {
    const { out, written } = fake(true)
    const ui = progress(out)
    ui.update("drawing")
    ui.settle("done")
    ui.update("next")
    expect(written).toEqual(["\rdrawing", "\rdone   \n", "\rnext"])
  })

  it("animates nothing when nothing is watching", () => {
    // A run redirected to a file gets the settled lines and no carriage
    // returns, the same bargain the rest of the output makes.
    const { out, written } = fake(false)
    const ui = progress(out)
    ui.update("drawing")
    ui.settle("done")
    expect(written).toEqual(["done\n"])
  })
})

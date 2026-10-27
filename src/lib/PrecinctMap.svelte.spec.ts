import { describe, expect, it } from "vitest"
import { tick } from "svelte"
import { render } from "vitest-browser-svelte"
import PrecinctMap from "./PrecinctMap.svelte"
import type { Bounds, Shape } from "./map"

/** Two squares far enough apart that nothing about them is ambiguous. */
const square = (lon: number, lat: number): Shape => [
  [
    [
      [lon, lat],
      [lon + 0.01, lat],
      [lon + 0.01, lat + 0.01],
      [lon, lat + 0.01],
      [lon, lat],
    ],
  ],
]

const BOUNDS: Bounds = [-71.1, 42.75, -71.0, 42.82]

const areas = [
  { id: "a", shape: square(-71.08, 42.77), name: "Kenoza Lake", fill: "#0369a1", opacity: 0.5 },
  { id: "b", shape: square(-71.04, 42.79), name: "Round Pond", fill: "#0369a1", opacity: 0.5 },
]

const base = { title: "Two waters", bounds: BOUNDS, areas }

/**
 * Drives the hover directly rather than through `.focus()`, and waits for the
 * update.
 *
 * Two things the first version of these tests got wrong against working code.
 * `.focus()` does not take on an SVG path the harness has given no layout, so
 * the event is dispatched instead -- Svelte attaches `pointerenter`,
 * `pointerleave`, `focus` and `blur` as plain listeners, none of them being in
 * its delegated set, so dispatching on the element calls the handler. And
 * Svelte 5 flushes state to the DOM in a microtask, so a synchronous read
 * straight after the dispatch sees the DOM as it was: hence the `tick`.
 */
const fire = async (el: Element, type: string) => {
  el.dispatchEvent(new Event(type, { bubbles: false }))
  await tick()
}

describe("PrecinctMap.svelte", () => {
  it("draws a shape per area", async () => {
    const { container } = render(PrecinctMap, base)

    // The accessible name is on the <svg role="group">, not on the <figure>.
    const svg = container.querySelector("svg")!
    expect(svg.getAttribute("role")).toBe("group")
    expect(svg.getAttribute("aria-label")).toBe("Two waters")
    expect([...container.querySelectorAll("path.area")].length).toBe(2)
  })

  /**
   * The rule is that a map is interactive, so the default is, and the prop
   * appears at a call site only where a map departs from it -- which is the
   * landing page's own card and nowhere else.
   */
  describe("interactive", () => {
    it("is on by default", async () => {
      const { container } = render(PrecinctMap, base)

      expect(container.querySelector("figure")?.className).toContain("h-full")
      expect(container.querySelector("svg")?.getAttribute("class")).toContain("absolute")
    })

    it("can be turned off for a map that cannot have it", async () => {
      const { container } = render(PrecinctMap, { ...base, interactive: false })

      expect(container.querySelector("figure")?.className).not.toContain("h-full")
      expect(container.querySelector("svg")?.getAttribute("class")).not.toContain("absolute")
    })

    /** Either way the shapes are drawn before anything hydrates. */
    it("draws the shapes either way", async () => {
      for (const interactive of [true, false]) {
        const { container } = render(PrecinctMap, { ...base, interactive })
        expect([...container.querySelectorAll("path.area")].length).toBe(2)
      }
    })
  })

  /**
   * Every area already carries a `<title>`, which is the browser's own tooltip.
   * `hoverLabel` is about drawing the name on the map instead; the title stays
   * either way.
   */
  it("names every area for the browser's own tooltip", async () => {
    const { container } = render(PrecinctMap, base)

    const titles = [...container.querySelectorAll("title")].map((t) => t.textContent)
    expect(titles).toContain("Kenoza Lake")
    expect(titles).toContain("Round Pond")
  })

  describe("without hoverLabel", () => {
    /**
     * The default, and what every map on the site but the drought one uses.
     * A plain area that goes nowhere is not focusable, so a keyboard user is
     * not made to tab through twenty-one precincts to reach the page.
     */
    it("leaves a plain area out of the tab order", async () => {
      const { container } = render(PrecinctMap, base)

      for (const path of container.querySelectorAll("path.area")) {
        expect(path.getAttribute("tabindex")).toBeNull()
      }
    })

    it("draws no name on the map", async () => {
      const { container } = render(PrecinctMap, base)

      expect(container.querySelector(".hover-name")).toBeNull()
    })
  })

  describe("with hoverLabel", () => {
    const props = { ...base, hoverLabel: true }

    /** The names have to be reachable without a pointer, so the shapes focus. */
    it("puts each area in the tab order", async () => {
      const { container } = render(PrecinctMap, props)

      for (const path of container.querySelectorAll("path.area")) {
        expect(path.getAttribute("tabindex")).toBe("0")
        expect(path.getAttribute("aria-label")).toBeTruthy()
      }
    })

    it("names the area that takes keyboard focus too, not only the pointer", async () => {
      const { container } = render(PrecinctMap, props)

      const [first] = [...container.querySelectorAll<SVGPathElement>("path.area")]
      await fire(first, "focus")
      expect(container.querySelector(".hover-name")).not.toBeNull()

      await fire(first, "blur")
      expect(container.querySelector(".hover-name")).toBeNull()
    })

    it("draws nothing until something is hovered or focused", async () => {
      const { container } = render(PrecinctMap, props)

      expect(container.querySelector(".hover-name")).toBeNull()
    })

    it("names the area that takes focus, and only that one", async () => {
      const { container } = render(PrecinctMap, props)

      const [first] = [...container.querySelectorAll<SVGPathElement>("path.area")]
      await fire(first, "pointerenter")

      const drawn = [...container.querySelectorAll(".hover-name text")].map((t) =>
        t.textContent?.trim(),
      )
      // Two text elements, a white casing under the dark one, both the same name.
      expect(new Set(drawn)).toEqual(new Set(["Kenoza Lake"]))
    })

    it("stops naming it once focus leaves", async () => {
      const { container } = render(PrecinctMap, props)

      const [first] = [...container.querySelectorAll<SVGPathElement>("path.area")]
      await fire(first, "pointerenter")
      expect(container.querySelector(".hover-name")).not.toBeNull()

      await fire(first, "pointerleave")
      expect(container.querySelector(".hover-name")).toBeNull()
    })

    /**
     * The label must never eat the hover that produced it, or the name would
     * flicker as the pointer crossed its own text.
     */
    it("lets the pointer through the name to the shape under it", async () => {
      const { container } = render(PrecinctMap, props)

      const [first] = [...container.querySelectorAll<SVGPathElement>("path.area")]
      await fire(first, "pointerenter")
      const name = container.querySelector(".hover-name")!
      expect(getComputedStyle(name).pointerEvents).toBe("none")
    })

    /** A shorter `label` is what a reader wants where one is given. */
    it("prefers a short label over the long accessible name", async () => {
      const { container } = render(PrecinctMap, {
        ...base,
        hoverLabel: true,
        areas: [{ ...areas[0], name: "Kenoza Lake — 0.972 square kilometres", label: "Kenoza" }],
      })

      const [first] = [...container.querySelectorAll<SVGPathElement>("path.area")]
      await fire(first, "pointerenter")
      const drawn = [...container.querySelectorAll(".hover-name text")].map((t) =>
        t.textContent?.trim(),
      )
      expect(new Set(drawn)).toEqual(new Set(["Kenoza"]))
    })
  })
})

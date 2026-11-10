import { page } from "vitest/browser"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-svelte"
import RainfallChart from "./RainfallChart.svelte"
import { MONTH_NAMES, type PrecipitationMonth, type PrecipitationYear } from "./precipitation"

const months = (values: number[], partialLast = false): PrecipitationMonth[] => {
  let running = 0
  return values.map((inches, i) => {
    running += inches
    const partial = partialLast && i === values.length - 1
    return {
      month: i + 1,
      label: MONTH_NAMES[i],
      inches,
      cumulativeInches: Math.round(running * 100) / 100,
      days: partial ? 12 : 31,
      partial,
      cityDays: partial ? 12 : 31,
      filledDays: 0,
      unreadDays: 0,
    }
  })
}

/**
 * A finished year: its record runs to December 31st, and `totalInches` is
 * the whole of it. `toDateInches` is the same year read only to the day the
 * running year stops, which is what the baseline's remainder is built from.
 */
const year = (
  y: number,
  total: number,
  toDate = total,
  extra: Partial<PrecipitationYear> = {},
): PrecipitationYear => ({
  year: y,
  months: months([1, 2, 3]),
  totalInches: total,
  toDateInches: toDate,
  cityOnlyToDateInches: toDate,
  throughDate: `${y}-12-31`,
  cityDays: 365,
  filledDays: 0,
  unreadDays: 0,
  ...extra,
})

/** A year still running: its record stops short, so `totalInches` is partial. */
const running = (y: number, soFar: number, extra: Partial<PrecipitationYear> = {}) =>
  year(y, soFar, soFar, { throughDate: `${y}-10-26`, cityDays: 300, ...extra })

/** The real shape of the finding: wet years, then a run of dry ones. */
const YEARS = [
  year(2023, 64.87, 53.71),
  year(2024, 43.71, 35.55),
  year(2025, 38.57, 31.96),
  running(2026, 30.52, { filledDays: 36 }),
]

const BASELINE = {
  fullYearInches: 47.49,
  remainderInches: 10.0,
  from: 2016,
  to: 2025,
  years: 10,
}

/** The public face of the service the daily records are queried from. */
const SOURCE = { href: "https://xmacis.rcc-acis.org/", name: "xmACIS2" }

const props = { years: YEARS, baseline: BASELINE, source: SOURCE }

describe("RainfallChart.svelte", () => {
  const labels = () =>
    page
      .getByRole("img")
      .elements()
      .map((el) => el.getAttribute("aria-label") ?? "")

  /**
   * Years only. The average had a bar beside them and is the dashed rule
   * alone now: at ten bars the rule already crosses everything it is meant
   * to be compared with, and a bar standing for the average of its own
   * neighbours reads as one more year.
   */
  it("draws a bar per year and none for the average", async () => {
    const { container } = render(RainfallChart, props)

    await expect.element(page.getByRole("img").nth(0)).toBeInTheDocument()
    // Five rects for four years: the unfinished one carries a ghost as well,
    // which is the dashed outline and the only rect with a dash pattern.
    // Scoped to the chart itself: the legend below it draws its own swatches
    // as miniature SVGs, and a container-wide query counts those too.
    const rects = [...container.querySelectorAll('svg[role="group"] rect')]
    expect(rects.length).toBe(5)
    expect(rects.filter((r) => !r.getAttribute("stroke-dasharray")).length).toBe(4)
  })

  it("puts the earliest year on the left and the current year last", async () => {
    const { container } = render(RainfallChart, props)

    const order = [...container.querySelectorAll("svg g[role='img']")].map((g) => {
      const x = Number(g.querySelector("rect")!.getAttribute("x"))
      return { x, label: g.getAttribute("aria-label") ?? "" }
    })
    expect(order.map((o) => o.x)).toEqual([...order.map((o) => o.x)].sort((a, b) => a - b))
    expect(order[0].label).toMatch(/^2023:/)
    expect(order.at(-1)!.label).toMatch(/^2026:/)
  })

  /**
   * The comparison the chart exists to get right. The current year is ten
   * months old, so a bar drawn against whole years would read as a
   * catastrophe in any month -- every bar, the average included, is summed
   * to the same day, and the caption has to say which day.
   */
  /**
   * The bars are whole calendar years now, so the chart's old safeguard --
   * every bar read to the same day -- is gone. What keeps the unfinished
   * year from reading as a dry one is that it says so, in its own label and
   * in the caption, and carries a ghost of what a typical year still adds.
   */
  it("says the current year is not over, in its label and the caption", async () => {
    render(RainfallChart, props)

    const label = labels().find((l) => l.startsWith("2026:"))!
    expect(label).toContain("so far, to Oct 26")
    expect(label).toContain("the year is not over")
    await expect.element(page.getByText(/is not over/)).toBeInTheDocument()
  })

  it("leaves a finished year's label free of any such hedge", async () => {
    render(RainfallChart, props)

    const label = labels().find((l) => l.startsWith("2025:"))!
    expect(label).toContain("over the year")
    expect(label).not.toContain("so far")
  })

  it("names the span the average is taken over, and its figure", async () => {
    const { container } = render(RainfallChart, props)

    // Whitespace-collapsed: the caption wraps across lines, and a regex
    // against the raw text does not normalise it.
    const caption = container.querySelector("figcaption")!.textContent!.replace(/\s+/g, " ")
    expect(caption).toContain("10-year average, 2016–2025, at 47.49 inches")
  })

  /**
   * The ghost is the one quantity on this chart nobody measured, so the
   * caption has to name it as an expectation rather than as rain.
   */
  it("names the ghost as an expectation rather than as rainfall", async () => {
    const { container } = render(RainfallChart, props)

    const caption = container.querySelector("figcaption")!.textContent!.replace(/\s+/g, " ")
    expect(caption).toContain("10 inches")
    expect(caption).toContain("an expectation, not rainfall")
  })

  /** Bars compare badly end to end, so the average crosses them as a rule. */
  it("draws the average as a dashed rule", async () => {
    const { container } = render(RainfallChart, props)

    const dashed = [...container.querySelectorAll('svg[role="group"] line[stroke-dasharray]')]
    expect(dashed.length).toBe(1)
  })

  /**
   * The caption is `sr-only` and a legend stands in its place, so the two
   * must not drift: a swatch that decodes a mark for a sighted reader has to
   * have a sentence behind it for one who cannot see it.
   */
  describe("the legend and the caption", () => {
    it("decodes both unlabelled marks visually", async () => {
      const { container } = render(RainfallChart, props)

      const legend = [...container.querySelectorAll("ul li")].map((l) =>
        l.textContent?.replace(/\s+/g, " ").trim(),
      )
      expect(legend).toEqual(['10-yr average 47.49"', "predicted rest of year"])
    })

    it("hides the legend from a screen reader, which gets the caption instead", async () => {
      const { container } = render(RainfallChart, props)

      expect(container.querySelector("ul")?.getAttribute("aria-hidden")).toBe("true")
      expect(container.querySelector("figcaption")?.className).toContain("sr-only")
    })

    /** No ghost, no ghost legend: a finished span needs neither. */
    it("drops the ghost's legend entry when every year is complete", async () => {
      const { container } = render(RainfallChart, {
        years: [year(2024, 43.71), year(2025, 38.57)],
        baseline: BASELINE,
        source: SOURCE,
      })

      const legend = [...container.querySelectorAll("ul li")].map((l) => l.textContent?.trim())
      expect(legend.length).toBe(1)
      expect(container.querySelectorAll('svg[role="group"] rect[stroke-dasharray]').length).toBe(0)
      expect(container.querySelector("figcaption")!.textContent).not.toContain("not over")
    })
  })

  /** Zero-based: a seven-inch shortfall must not be drawn as a cliff. */
  it("scales from zero, rounded out to whole tens", async () => {
    const { container } = render(RainfallChart, props)

    const ticks = [...container.querySelectorAll('svg[role="group"] text')]
      .map((t) => t.textContent?.trim() ?? "")
      .filter((t) => /^\d+"$/.test(t))
    expect(ticks).toEqual(['10"', '20"', '30"', '40"', '50"', '60"', '70"'])
  })

  /** Each bar prints its own figure: nothing here is visible only to a mouse. */
  it("prints every figure on the chart without a hover", async () => {
    render(RainfallChart, props)

    for (const value of ['64.87"', '43.71"', '38.57"', '30.52"']) {
      await expect.element(page.getByText(value, { exact: true }).first()).toBeInTheDocument()
    }
  })

  /** The drought hue belongs to the current year whatever the span's length. */
  it("gives the current year the drought colour, picked by name not position", async () => {
    const { container } = render(RainfallChart, props)

    const bars = [...container.querySelectorAll("svg g[role='img'] rect")]
    const current = bars.find((r) =>
      r.closest("g")!.getAttribute("aria-label")!.startsWith("2026:"),
    )!
    expect(current.getAttribute("fill")).toBe("#ea580c")
  })

  it("states how each year stands against the average", async () => {
    render(RainfallChart, props)

    expect(labels().find((l) => l.startsWith("2023:"))).toContain(
      "17.38 inches above the 10-year average",
    )
    expect(labels().find((l) => l.startsWith("2025:"))).toContain(
      "8.92 inches below the 10-year average",
    )
  })

  /**
   * Not "filled from a neighbouring gauge": every day is an average of
   * whatever read it, so what these days lack is the city's own reading.
   */
  it("says how many of the current year's days carry no city reading", async () => {
    render(RainfallChart, props)

    expect(labels().find((l) => l.startsWith("2026:"))).toContain(
      "36 days carry no reading from the city's own gauge",
    )
  })

  /** "1 day carry" read as a typo in the accessible name for every year with one. */
  it("agrees the verb with a single unread day", async () => {
    render(RainfallChart, {
      ...props,
      years: [YEARS[0], YEARS[1], YEARS[2], { ...YEARS[3], filledDays: 1 }],
    })

    expect(labels().find((l) => l.startsWith("2026:"))).toContain("1 day carries no reading")
  })

  /**
   * The span has gone from four years to six to ten without the geometry
   * being touched, so this pins what growing it costs: slots narrow, and the
   * figure printed over each bar is the thing that runs out of room first.
   */
  it("still lays ten years out without bars touching", async () => {
    const ten = [
      year(2017, 47.44),
      year(2018, 57.3),
      year(2019, 51.45),
      year(2020, 41.29),
      year(2021, 56.0),
      year(2022, 38.87),
      year(2023, 64.87),
      year(2024, 43.71),
      year(2025, 38.57),
      running(2026, 30.52, { filledDays: 36 }),
    ]
    const { container } = render(RainfallChart, {
      years: ten,
      baseline: BASELINE,
      source: SOURCE,
    })

    const bars = [...container.querySelectorAll("svg g[role='img'] rect")]
      .filter((r) => !r.getAttribute("stroke-dasharray")) // exclude the ghost
      .map((r) => ({ x: Number(r.getAttribute("x")), w: Number(r.getAttribute("width")) }))
    expect(bars.length).toBe(10)
    for (let i = 1; i < bars.length; i++) {
      expect(bars[i].x).toBeGreaterThan(bars[i - 1].x + bars[i - 1].w)
    }
    // Room for a five-character figure over each bar at 11px: roughly 33 units.
    const gaps = bars.slice(1).map((b, i) => b.x - (bars[i].x + bars[i].w))
    expect(Math.min(...bars.map((b) => b.w)) + Math.min(...gaps)).toBeGreaterThan(33)
  })

  /**
   * The chart is the citation: it is the one figure on `/issues/drought` built out
   * of a dataset rather than quoted off a city document, and it named no
   * source at all before the whole drawing became a link to one.
   */
  describe("the link to the source", () => {
    it("makes the whole drawing a link to the records it is summed from", async () => {
      const { container } = render(RainfallChart, props)

      const link = container.querySelector("a")!
      expect(link.getAttribute("href")).toBe("https://xmacis.rcc-acis.org/")
      // The drawing and its legend are both inside it, so there is no strip
      // of the figure that looks like the chart and does not navigate.
      expect(link.querySelector('svg[role="group"]')).not.toBeNull()
      expect(link.querySelector("ul")).not.toBeNull()
    })

    /** The site's rule for anything leaving it. */
    it("opens the source in a new tab, on the site's outbound terms", async () => {
      const { container } = render(RainfallChart, props)

      const link = container.querySelector("a")!
      expect(link.getAttribute("target")).toBe("_blank")
      expect(link.getAttribute("rel")).toBe("external noopener noreferrer")
    })

    /**
     * Without a name of its own the link would be announced as the chart's
     * own label joined to every bar's -- a sentence that says what is drawn
     * and never that clicking it leaves the site.
     */
    it("names where it goes, and that it leaves the page", async () => {
      render(RainfallChart, props)

      await expect
        .element(page.getByRole("link", { name: /xmACIS2.*opens in a new tab/ }))
        .toBeInTheDocument()
    })
  })

  it("carries every year and the average in a table", async () => {
    render(RainfallChart, props)

    await expect
      .element(page.getByRole("table", { name: /Rainfall in inches by year/ }))
      .toBeInTheDocument()
    await expect.element(page.getByRole("rowheader", { name: "2026" })).toBeInTheDocument()
    // The average has no bar any more, but the table must still state it:
    // the dashed rule gives it to anyone looking at the drawing.
    await expect
      .element(page.getByRole("rowheader", { name: "10-yr avg (2016–2025)" }))
      .toBeInTheDocument()
  })
})

import { describe, it, expect, afterEach } from "vitest"
import { mkdtemp, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { buildTrainingRows, FEATURE_NAMES, readSeries } from "./water-model.mjs"

// [date, maxt, mint, avgt, obst, pcpn, snow, snwd] -- weather.mjs's own column order.
const weatherRow = (date, { avgt, pcpn, snwd }) => [
  date,
  String(avgt + 5),
  String(avgt - 5),
  String(avgt),
  String(avgt - 2),
  String(pcpn),
  "0.0",
  String(snwd),
]

describe("buildTrainingRows", () => {
  it("builds one row per consecutive day, with the right target and features", () => {
    const weather = {
      rows: [
        weatherRow("2023-01-01", { avgt: 30, pcpn: 0.1, snwd: 2 }),
        weatherRow("2023-01-02", { avgt: 40, pcpn: 0.2, snwd: 1 }),
        weatherRow("2023-01-03", { avgt: 35, pcpn: 0, snwd: 0 }),
      ],
    }
    const production = {
      rows: [
        ["2023-01-02", 6.1],
        ["2023-01-03", 5.9],
      ],
    }
    const lakeLevel = {
      rows: [
        ["2023-01-01", 100],
        ["2023-01-02", 100.5],
        ["2023-01-03", 100.2],
      ],
    }

    const result = buildTrainingRows({ weather, production, lakeLevel })

    expect(result.rows).toHaveLength(2)
    expect(result.skippedGap).toBe(1) // Jan 1 has no day before it in the fixture

    const [jan2, jan3] = result.rows
    expect(jan2.date).toBe("2023-01-02")
    // snowmeltProxy = yesterday's snow depth (2) * max(0, today's avgt (40) - 32) = 16
    expect(jan2.features).toEqual([0.2, 16, 40, 6.1])
    expect(jan2.target).toBeCloseTo(0.5, 10) // 100.5 - 100

    expect(jan3.date).toBe("2023-01-03")
    // yesterday's snow depth is 1, today's avgt (35) is only 3 above freezing
    expect(jan3.features).toEqual([0, 3, 35, 5.9])
    expect(jan3.target).toBeCloseTo(-0.3, 10) // 100.2 - 100.5
  })

  it("skips a day whose calendar predecessor is missing from the lake-level series", () => {
    const weather = {
      rows: [
        weatherRow("2023-01-01", { avgt: 30, pcpn: 0, snwd: 0 }),
        weatherRow("2023-01-02", { avgt: 30, pcpn: 0, snwd: 0 }),
        weatherRow("2023-01-04", { avgt: 30, pcpn: 0, snwd: 0 }),
      ],
    }
    const production = {
      rows: [
        ["2023-01-02", 6],
        ["2023-01-04", 6],
      ],
    }
    // Jan 3 is missing entirely, so Jan 4 has no reading for the day before
    // it; Jan 1 is also, unavoidably, its own gap -- nothing stands in for
    // whatever came before the series starts.
    const lakeLevel = {
      rows: [
        ["2023-01-01", 100],
        ["2023-01-02", 100.5],
        ["2023-01-04", 99],
      ],
    }

    const result = buildTrainingRows({ weather, production, lakeLevel })
    expect(result.rows).toHaveLength(1) // only Jan 2, whose predecessor Jan 1 exists
    expect(result.rows[0].date).toBe("2023-01-02")
    expect(result.skippedGap).toBe(2) // Jan 1 (series start) and Jan 4 (Jan 3 missing)
  })

  it("skips a day with no production figure, without guessing one", () => {
    const weather = {
      rows: [
        weatherRow("2023-01-01", { avgt: 30, pcpn: 0, snwd: 0 }),
        weatherRow("2023-01-02", { avgt: 30, pcpn: 0, snwd: 0 }),
      ],
    }
    const production = { rows: [] }
    const lakeLevel = {
      rows: [
        ["2023-01-01", 100],
        ["2023-01-02", 99.8],
      ],
    }

    const result = buildTrainingRows({ weather, production, lakeLevel })
    expect(result.rows).toHaveLength(0)
    expect(result.skippedMissingProduction).toBe(1)
  })

  it("skips a day with a flagged-missing weather reading rather than treating it as zero", () => {
    const weather = {
      rows: [
        weatherRow("2023-01-01", { avgt: 30, pcpn: 0, snwd: 0 }),
        ["2023-01-02", "40", "30", "35", "33", "M", "0.0", "0"], // pcpn flagged missing
      ],
    }
    const production = { rows: [["2023-01-02", 6]] }
    const lakeLevel = {
      rows: [
        ["2023-01-01", 100],
        ["2023-01-02", 99.8],
      ],
    }

    const result = buildTrainingRows({ weather, production, lakeLevel })
    expect(result.rows).toHaveLength(0)
    expect(result.skippedMissingWeather).toBe(1)
  })

  it("names four features, matching what each row's own feature array carries", () => {
    expect(FEATURE_NAMES).toEqual(["pcpn", "snowmeltProxy", "avgt", "production"])
  })
})

describe("readSeries", () => {
  let dir

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true })
  })

  it("prefers a real file over the placeholder when both exist", async () => {
    dir = await mkdtemp(path.join(tmpdir(), "water-model-"))
    const real = path.join(dir, "real.json")
    const placeholder = path.join(dir, "placeholder.json")
    await writeFile(real, JSON.stringify({ data: [["2024-01-01", 1]] }))
    await writeFile(placeholder, JSON.stringify({ data: [["2024-01-01", 2]] }))

    const result = await readSeries({ real, placeholder })
    expect(result.synthetic).toBe(false)
    expect(result.path).toBe(real)
    expect(result.rows).toEqual([["2024-01-01", 1]])
  })

  it("falls back to the placeholder, flagged synthetic, when no real file exists yet", async () => {
    dir = await mkdtemp(path.join(tmpdir(), "water-model-"))
    const real = path.join(dir, "real.json") // never written
    const placeholder = path.join(dir, "placeholder.json")
    await writeFile(placeholder, JSON.stringify({ data: [["2024-01-01", 2]] }))

    const result = await readSeries({ real, placeholder })
    expect(result.synthetic).toBe(true)
    expect(result.path).toBe(placeholder)
    expect(result.rows).toEqual([["2024-01-01", 2]])
  })

  it("throws when neither path exists, rather than training on nothing", async () => {
    dir = await mkdtemp(path.join(tmpdir(), "water-model-"))
    const real = path.join(dir, "real.json")
    const placeholder = path.join(dir, "placeholder.json")

    await expect(readSeries({ real, placeholder })).rejects.toThrow()
  })
})

import { describe, it, expect } from "vitest"
import { after, before } from "$lib/redline"
import { REDLINE } from "./ordinance"

/** The paragraph a version opens with these words, or undefined. */
const find = (version: (b: (typeof REDLINE)[number]) => string, start: string) =>
  REDLINE.map(version).find((t) => t.startsWith(start))

/**
 * Transcribed by eye off a scan, so these pin the marks a misread would get
 * wrong and nothing else would catch: a struck digit, a struck fraction, the
 * one section number the copy changes.
 */
describe("what the ordinance changes", () => {
  it("widens the definition from gasoline scooters to e-bikes and electric devices", () => {
    expect(find(before, "Recreational motorized vehicles are")).toContain(
      "motorized scooter, unregistered, two wheels",
    )
    expect(find(after, "Recreational motorized vehicles are")).toContain(
      "motorized scooter or motorized bicycles, or class 1 or class 2 electric bicycles, all as defined in M.G.L. c. 90, § 1. Electric scooters,",
    )
  })

  it("cuts the first-offense fine from $50 to $25", () => {
    expect(find(before, "Any violation")).toContain("a fine of $50 for the first offense")
    expect(find(after, "1. Any violation")).toContain("a fine of $25 for the first offense")
  })

  it("renumbers Violations and penalties from § 222-65 to § 222-66", () => {
    expect(REDLINE.map(before)).toContain("§ 222-65 Violations and penalties.")
    expect(REDLINE.map(after)).toContain("§ 222-66 Violations and penalties.")
  })

  /**
   * The one reading the marks do not state: the copy prints § 222-65 plain,
   * but today's article already has a § 222-65 -- the section the copy itself
   * renumbers -- so this one has to be new.
   */
  it("reads the parent-or-guardian section as new, the marks notwithstanding", () => {
    expect(find(before, "§ 222-65 The parent")).toBeUndefined()
    expect(find(after, "§ 222-65 The parent")).toBeDefined()
    expect(REDLINE.map(before).filter((t) => t.startsWith("§ 222-65"))).toHaveLength(1)
  })

  it("replaces the 9-to-7 curfew with sunset to sunrise", () => {
    expect(find(before, "F.")).toContain("before the hour of 9:00 a.m.")
    expect(find(after, "F.")).toBe(
      "F. person shall operate a motorized scooter upon any way at any time after sunset or before sunrise.",
    )
  })

  it("strikes the half from the helmet law's section number", () => {
    expect(find(before, "H.")).toContain("§ 11B 1/2.")
    expect(find(after, "H.")).toContain("§ 11B, as may be amended from time to time.")
  })

  it("raises the age from 12 and under to under sixteen", () => {
    expect(find(before, "I.")).toBe(
      "I. Children age 12 and under shall not be allowed to drive motorized scooters",
    )
    expect(find(after, "I.")).toContain("by a person under sixteen years of age")
  })
})

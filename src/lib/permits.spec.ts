import { describe, it, expect } from "vitest"
import { permitRecord } from "./permits"

// What is worth pinning is the two answers a caller has to tell apart: a number
// somebody has looked the record up for, and one nobody has. The second is not
// an error -- `PermitRecord.svelte` leaves such a number as the plain text the
// document printed -- so a wrong answer there would quietly link every
// unlooked-up number somewhere, which is the failure this guards.
describe("permitRecord", () => {
  it("builds the portal's address for a record the map carries", () => {
    // CCSP-26-7 is the Marshland Street special permit, the number the
    // Council's agenda of 20 October prints; 231770 is the id read off the
    // record's own page.
    expect(permitRecord("CCSP-26-7")).toBe("https://haverhillma.portal.opengov.com/records/231770")
  })

  it("has no address for a number nobody has looked up", () => {
    // PBFW-26-2 is a real number, printed on the Planning Board's agenda of 9
    // September -- real, and not yet looked up, which is exactly the case that
    // must come back empty rather than guessed at.
    expect(permitRecord("PBFW-26-2")).toBeNull()
    expect(permitRecord("not a record number")).toBeNull()
  })
})

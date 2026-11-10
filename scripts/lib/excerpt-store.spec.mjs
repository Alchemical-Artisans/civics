import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { BUCKET, ORIGIN, PREFIX } from "./excerpt-store.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")
const read = (path) => readFileSync(join(root, path), "utf8")

/**
 * The excerpt store's name is written in three languages, and nothing at run
 * time can reconcile them.
 *
 * The scripts that upload need it as JavaScript, OpenTofu needs it as HCL to
 * create the bucket, and the site needs it baked into a prerendered page as a
 * URL -- a build that never reads `infra/`, and a bucket created long before
 * the build runs. Deriving any one from another would mean the site build
 * shelling out to `tofu output`, or OpenTofu parsing TypeScript.
 *
 * So they are three copies, and this is what makes them safe: a rename that
 * reaches only two of the three fails here rather than on the deployed site,
 * where the symptom is every excerpt link on every meeting page returning 404
 * with nothing in the build log.
 */
describe("the excerpt store's name", () => {
  it("is the bucket infra/ creates", () => {
    const tf = read("infra/variables.tf")
    const [, name] = tf.match(/variable "bucket_name"[\s\S]*?default\s*=\s*"([^"]+)"/) ?? []

    expect(name).toBe(BUCKET)
  })

  it("is the origin the site builds its excerpt links against", () => {
    const router = read("src/lib/router.ts")
    const [, origin] = router.match(/const EXCERPT_ORIGIN = "([^"]+)"/) ?? []

    expect(origin).toBe(ORIGIN)
  })

  /**
   * A trailing slash on either would double in the middle of every URL. The
   * prefix carries none at either end for the same reason: both are joined
   * with an explicit `/`.
   */
  it("joins without a doubled or missing slash", () => {
    expect(ORIGIN.endsWith("/")).toBe(false)
    expect(PREFIX).not.toMatch(/^\/|\/$/)
  })
})

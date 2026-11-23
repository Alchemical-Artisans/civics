import { dev } from "$app/environment"
import { error, fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import type { AttentionGroup, AttentionLead, AttentionSource } from "./types"

/**
 * The dev-only attention page's data and its answers. See `+layout.server.ts`
 * for why this cannot be reached in a build, and `scripts/lib/attention.mjs`
 * for what is gathered and what each answer writes.
 *
 * The scripts are imported inside each function rather than at the top: this
 * module is loaded while a production build analyses the site, and nothing
 * from `scripts/` -- which reads and writes the repository -- should be
 * evaluated then.
 */
const scripts = async () => {
  if (!dev) error(404, "Not found")
  const [attention, marks] = await Promise.all([
    import("../../../scripts/lib/attention.mjs"),
    import("../../../scripts/lib/issue-marks.mjs"),
  ])
  return { ...attention, ...marks }
}

export const load: PageServerLoad = async () => {
  const { attentionReport, ATTENTION_URL } = await scripts()
  const { groups, leads, sources, linkStatus } = await attentionReport()
  return {
    groups: groups as AttentionGroup[],
    leads: leads as AttentionLead[],
    sources: sources as AttentionSource[],
    linksCheckedAt: (linkStatus?.checkedAt as string | undefined) ?? null,
    url: ATTENTION_URL,
  }
}

const text = (data: FormData, name: string) => {
  const value = data.get(name)
  return typeof value === "string" ? value.trim() : ""
}

export const actions: Actions = {
  /** A record's date or standing: one of `RECORD_ANSWERS`. */
  record: async ({ request }) => {
    const { resolveRecord } = await scripts()
    const data = await request.formData()
    const key = text(data, "key")
    const answer = text(data, "answer")
    try {
      await resolveRecord(key, answer, { date: text(data, "date") })
      return { ok: true, message: `${answer} -- ${key}` }
    } catch (err) {
      return fail(400, { ok: false, message: err instanceof Error ? err.message : String(err) })
    }
  },

  /** An issue page's lead or cited source: what `npm run issues:mark` does. */
  issue: async ({ request }) => {
    const { markIssueItems } = await scripts()
    const data = await request.formData()
    const id = text(data, "id")
    const answer = text(data, "answer")
    if (!["incorporated", "irrelevant", "accept", "ignore"].includes(answer))
      return fail(400, { ok: false, message: `no such answer "${answer}"` })
    const { done, missing } = await markIssueItems([id], {
      status: answer === "irrelevant" ? "irrelevant" : "incorporated",
      ignore: answer === "ignore",
    })
    if (missing.length) return fail(404, { ok: false, message: `${id}: no such lead or source` })
    return { ok: true, message: `${done[0].kind} ${done[0].now} -- ${done[0].label}` }
  },
}

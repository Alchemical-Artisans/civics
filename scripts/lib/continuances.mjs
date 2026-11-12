/**
 * Which permits are on a sitting still to come, so a person can be asked
 * whether any of them has been continued.
 *
 * The city publishes an agenda, and then a hearing on it is continued -- and
 * the continuance appears on the permit's record in the OpenGov portal and
 * nowhere else. The Council does not reissue the agenda: 23 of its 1,362
 * records back to 2020 are amended or revised agendas, three or four a year,
 * against hearings continued far more often than that (this one permit was
 * continued twice in two months). So a reader working from the published
 * agenda turns up to a hearing that is not going to happen, and the only
 * notice of it is behind a Cloudflare Turnstile challenge that no script of
 * ours may pass -- see `src/lib/permits.ts`.
 *
 * What is automatable, then, is everything except the looking: work out which
 * permits could have been continued, hand a person the links, and take down
 * what they find. That is `update-continuances.mjs`; this file is the part
 * that is a pure function of the pages, which is what makes it testable.
 *
 * **The pages are the index.** A permit reaches a sitting by a transcriber
 * writing `<PermitRecord number="..." />` into that sitting's item page, so
 * the component's own uses are the list of which permits are on which agenda.
 * A separate registry would be a second copy to keep in step, and the failure
 * would be silent in the direction that matters -- a permit missing from it
 * is a permit nobody is asked about.
 */

/** Where the portal serves a record. Pinned against `router.ts` by the spec. */
export const PORTAL_ORIGIN = "https://haverhillma.portal.opengov.com"

/**
 * Every `<PermitRecord>` on an item page, as the permit numbers it names.
 *
 * `pages` is `{ path, source }` for each `+page.svelte` under
 * `src/routes/calendar/meetings/`. The meeting id and the item directory are
 * the two path segments above the file -- the same identity `projects.ts`
 * uses for a timeline step, and the same one the meeting layout reads off a
 * URL.
 *
 * A page with no `<PermitRecord>` yields nothing, which is almost all of
 * them. A meeting page rather than an item page yields nothing too: the
 * component is written into the item's own page, and a path with no item
 * segment is skipped rather than guessed at.
 */
export function permitItems(pages) {
  const found = []
  for (const { path, source } of pages) {
    const [, meeting, item] =
      path.match(/calendar\/meetings\/([^/]+)\/([^/]+)\/\+page\.svelte$/) ?? []
    if (!meeting || !item) continue

    const numbers = [...source.matchAll(/<PermitRecord\s[^>]*number="([^"]+)"/g)].map(
      ([, number]) => number,
    )
    for (const number of [...new Set(numbers)]) found.push({ meeting, item, number })
  }
  return found.sort(
    (a, b) =>
      sittingDate(a.meeting).localeCompare(sittingDate(b.meeting)) ||
      a.number.localeCompare(b.number),
  )
}

/** A sitting's date is the tail of its meeting id -- `entryDate` in projects.ts. */
export function sittingDate(meeting) {
  return meeting.slice(-10)
}

/**
 * The permits worth asking about: those on a sitting that has not happened.
 *
 * Today counts as upcoming. A continuance is published before the sitting and
 * is still the news on the morning of it, and a sitting this evening is the
 * one it matters most to have right.
 *
 * Dates are `YYYY-MM-DD` strings compared as strings, the same bargain the
 * rest of the site makes: that is what stops one sliding a day.
 */
export function upcoming(items, today) {
  return items.filter((item) => sittingDate(item.meeting) >= today)
}

/**
 * One entry per permit: the soonest sitting still to come that it is on.
 *
 * A permit continued twice is on three item pages, and all three are upcoming
 * on the day the first agenda is published -- so without this a person is
 * handed the same record link three times and asked the same question about
 * it. Only the soonest sitting is at risk: that is the hearing somebody is
 * about to turn up to, and if it is continued again the next one becomes the
 * soonest in its turn.
 *
 * `permitItems` has already ordered by date, so the first of each number is
 * the one to keep.
 */
export function soonest(items) {
  const byNumber = new Map()
  for (const item of items) if (!byNumber.has(item.number)) byNumber.set(item.number, item)
  return [...byNumber.values()]
}

/**
 * The record page for a printed permit number, or null where nobody has
 * looked its id up.
 *
 * `permits` is `src/lib/data/permits.json`. A number with no id is not an
 * error -- it is a permit the transcriber met and nobody has opened the
 * portal for -- but it cannot be checked for a continuance either, so the
 * caller reports those apart rather than dropping them silently.
 */
export function recordUrl(number, permits) {
  const id = permits[number]
  return id === undefined ? null : `${PORTAL_ORIGIN}/records/${id}`
}

/**
 * Whether what a person typed can be recorded, and why not where it cannot.
 *
 * Separated from the prompting so it can be tested without a terminal: the
 * readline half is a dumb reader of two strings, and every judgement about
 * them is here. `exists` is the caller's answer to whether the file is on
 * disk, passed in rather than checked here so this stays a pure function.
 *
 * The date is refused where it is not later than the sitting it was given
 * for. A continuance moves a hearing forward, so an earlier date is a typo --
 * most likely last month's sitting entered by habit -- and recording it would
 * put a hearing on the calendar in the past and tell nobody anything.
 */
export function validate({ item, date, file, exists }) {
  if (!date) return { ok: false, reason: "skipped" }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, reason: "Not a date in YYYY-MM-DD; skipped. Run again to record it." }
  }
  if (date <= sittingDate(item.meeting)) {
    return {
      ok: false,
      reason: "A continuance moves a hearing later than the sitting it was on; skipped.",
    }
  }
  if (file && !exists) {
    return { ok: false, reason: "No file there; skipped. Run again once it is downloaded." }
  }
  return { ok: true, continuance: { ...item, date, file: file || null } }
}

/**
 * What a run has to ask about, split by whether it can be asked.
 *
 * `checkable` carries the link to open; `unknown` names the permits whose id
 * nobody has copied, which is a job for a person and is reported as one.
 */
export function toCheck(items, permits) {
  const checkable = []
  const unknown = []
  for (const item of items) {
    const url = recordUrl(item.number, permits)
    if (url) checkable.push({ ...item, url })
    else unknown.push(item)
  }
  return { checkable, unknown }
}

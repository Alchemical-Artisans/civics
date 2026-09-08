/**
 * The meeting rules printed on the "Agendas and Minutes" page itself.
 *
 * Above the document listing, the page carries a short standing rule for the
 * City Council in ordinary HTML: a heading naming the board, a sentence saying
 * when it sits, and a list of the exceptions. It is not a document in the
 * listing and no PDF anywhere says it -- it is prose on the page, which is why
 * the calendar could not see it while it only read the listing.
 *
 * That prose is what lets the calendar show a sitting before an agenda exists:
 * it describes every Tuesday the Council intends to meet, for any year, where
 * the documents only describe sittings that have already been written up.
 *
 * Only the words are taken here. Turning "the second Tuesday after Labor Day"
 * into a date is `src/lib/schedule.ts`, on the site side, and the two are kept
 * honest by a test that pins the exact wording the code was written against --
 * so a reworded rule fails the build rather than being quietly misread.
 */
import { LISTING_URL, USER_AGENT, retrying } from "./haverhill.mjs"

export { LISTING_URL }

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/g, " ")

const text = (s) =>
  decode(s.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()

/**
 * Every board rule on the page, in the order it prints them.
 *
 * Anchored on the `usn_cmp_text` blocks rather than on the whole page, because
 * the site's own navigation carries an `<h2>` or two of its own and the section
 * class is what marks this as editorial content. A block with a heading but no
 * list is skipped: the rule is the list, and a heading over a paragraph of
 * something else is not one.
 */
export function parseMeetingRules(html) {
  const rules = []
  const blocks = html.match(/<section[^>]*usn_cmp_text[\s\S]*?<\/section>/g) ?? []
  for (const block of blocks) {
    const board = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1]
    const intro = block.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1]
    const items = block.match(/<li[^>]*>[\s\S]*?<\/li>/g) ?? []
    if (!board || !intro || !items.length) continue
    const exceptions = items.map(text).filter(Boolean)
    if (!exceptions.length) continue
    rules.push({ board: text(board), intro: text(intro), exceptions })
  }
  return rules
}

/** Fetch the listing page and read its rules. One request, no session needed. */
export async function fetchMeetingRules() {
  const html = await retrying("fetch listing page", async () => {
    const res = await fetch(LISTING_URL, { headers: { "User-Agent": USER_AGENT } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  })
  return parseMeetingRules(html)
}

/**
 * Drop `remote.stream` from a meeting write-up once its sitting is over.
 *
 * Pulled out of `prune-live-streams.mjs` so the text surgery is unit-tested
 * against a string rather than a file on disk. `+page.ts` files are
 * hand-written, not scraped, so this edits source rather than a record in
 * `meetings.json` -- see `MeetingDetails` in `src/lib/calendar.ts` for what
 * `stream` is and why it exists at all.
 */

const MEETING_DATE_RE = /-(\d{4}-\d{2}-\d{2})$/
const STREAM_LINE_RE = /^\s*stream:\s*".*",?\s*$/

/** The date a meeting id ends in, or `undefined` if it does not carry one. */
export function meetingDateOf(id) {
  return id.match(MEETING_DATE_RE)?.[1]
}

/**
 * Remove the `stream` property from a `+page.ts`'s source, returning the file
 * unchanged if it has none.
 *
 * Takes the comment directly above `stream` with it: this codebase writes one
 * comment per field, immediately above it, so a comment left behind would sit
 * over whatever field happens to follow and describe a link that is no longer
 * there. And where `stream` was `remote`'s only field, collapses the object
 * rather than leaving `remote: {},` behind.
 */
export function withoutStream(content) {
  const lines = content.split("\n")
  const streamIdx = lines.findIndex((l) => STREAM_LINE_RE.test(l))
  if (streamIdx === -1) return content

  let start = streamIdx
  while (start > 0 && /^\s*\/\//.test(lines[start - 1])) start--

  lines.splice(start, streamIdx - start + 1)

  const openIdx = start - 1
  if (openIdx >= 0 && /\{\s*$/.test(lines[openIdx]) && /^\s*\},?\s*$/.test(lines[start] ?? "")) {
    lines.splice(openIdx, 2)
  }

  return lines.join("\n")
}

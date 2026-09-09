/**
 * Picking the sitting to transcribe, and describing it to Claude Code.
 *
 * `scripts/transcribe-meeting.mjs` is the part that touches the network, the
 * filesystem and another process; everything here is a pure function of the
 * scraped record, which is what makes it testable. The prompt itself is
 * `scripts/prompts/transcribe-meeting.md` and is durable prose -- this file
 * appends the one section that changes per run.
 */
import { meetingIdOf } from "./documents.mjs"

/** Agendas first, then minutes, then anything else -- `KIND_ORDER` in calendar.ts. */
const KIND_ORDER = { agenda: 0, minutes: 1, other: 2 }

/**
 * Collapse the scraped documents into the sittings they belong to, keyed by the
 * meeting id, which is also the directory a page is written under.
 *
 * Undated records are dropped for the same reason the site drops them: a
 * document that cannot be placed on a calendar has no sitting to be part of.
 */
export function sittings(documents) {
  const byId = new Map()
  for (const document of documents) {
    const { record } = document
    if (!record.date) continue
    const id = meetingIdOf(record)
    if (!byId.has(id)) {
      byId.set(id, { id, board: record.board, date: record.date, documents: [] })
    }
    byId.get(id).documents.push(document)
  }
  for (const sitting of byId.values()) {
    sitting.documents.sort(
      (a, b) => (KIND_ORDER[a.record.kind] ?? 3) - (KIND_ORDER[b.record.kind] ?? 3),
    )
  }
  return byId
}

/**
 * The sittings a command-line argument asks for.
 *
 * Three ways of naming one, because three are what you actually have to hand: a
 * meeting id copied out of a URL, a date ("what met on the 9th?"), or a piece of
 * a board's name. A date or a board name can match several, which is not an
 * error -- the caller lists them and asks which.
 */
export function select(all, target) {
  if (all.has(target)) return [all.get(target)]
  const wanted = target.toLowerCase()
  const isDate = /^\d{4}-\d{2}-\d{2}$/.test(target)
  const matches = [...all.values()].filter((sitting) =>
    isDate ? sitting.date === target : sitting.id.includes(wanted),
  )
  return matches.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
}

/**
 * Whether a PDF's extracted text is worth reading, or the document is a scan.
 *
 * Most of what the city publishes comes off a department copier with no text
 * layer at all: `pdftotext` returns a couple of bytes for a two-page agenda, and
 * the pages have to be rendered and read by eye. The threshold is per page and
 * deliberately low -- a page of real text runs to thousands of characters, so
 * anything near the line is a scan whatever we decide, and the prompt tells
 * Claude to check the text against a rendered page before trusting it.
 */
export const TEXT_PER_PAGE = 100

export function hasTextLayer(text, pages) {
  return text.replace(/\s+/g, "").length >= TEXT_PER_PAGE * Math.max(pages, 1)
}

/** "Wednesday, 9 September 2026", from a `YYYY-MM-DD` string parsed as UTC. */
export function readableDate(date) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/**
 * The section appended to the prompt: which sitting, and what has been put where
 * for it.
 *
 * `prepared` is one entry per document, as `prepareDocument` in the runner
 * returns it. Written as markdown because that is what the rest of the prompt
 * is, and because a person reading `--prompt-only` output is one of the people
 * this has to serve.
 */
export function material(sitting, prepared, { written }) {
  const lines = [
    "",
    "---",
    "",
    "## The sitting to transcribe",
    "",
    `- **Meeting id:** \`${sitting.id}\` — this is the directory name`,
    `- **Board:** ${sitting.board}`,
    `- **Date:** ${readableDate(sitting.date)} (\`${sitting.date}\`)`,
    `- **Page directory:** \`src/routes/calendar/meetings/${sitting.id}/\``,
    `- **Status:** ${
      written
        ? "a page is already written here — you are amending it, so read what is there first"
        : "nothing written yet"
    }`,
    "",
    `### The ${sitting.documents.length === 1 ? "document" : `${prepared.length} documents`}`,
    "",
  ]

  prepared.forEach((document, i) => {
    lines.push(`${i + 1}. **${document.title}** (${document.kind})`)
    lines.push(`   - The city's file: ${document.fileUrl}`)
    if (!document.cached) {
      lines.push(`   - **Not cached:** ${document.problem}. Fetch it yourself before writing.`)
    } else {
      lines.push(
        `   - Cached at \`${document.cached}\`` +
          (document.pages ? ` (${document.pages} page${document.pages === 1 ? "" : "s"})` : ""),
      )
      if (document.textPath) {
        lines.push(`   - Text layer extracted to \`${document.textPath}\` — read it, then check it`)
      }
      if (document.imageDir) {
        lines.push(
          `   - **No text layer.** Read these by eye: \`${document.imageDir}/page-*.png\`` +
            (document.imagesTruncated
              ? ` (first ${document.imagesRendered} pages only; render the rest yourself if the outline runs past them)`
              : ""),
        )
      }
    }
    lines.push("")
  })

  return lines.join("\n")
}

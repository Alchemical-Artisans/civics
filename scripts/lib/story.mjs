/**
 * The Instagram story for a City Council sitting, as pure functions.
 *
 * `scripts/make-story.mjs` is the part that touches the filesystem and a
 * browser; everything here is a function of a meeting page's source, which is
 * what makes it testable. A story is posted by hand -- the Graph API cannot
 * attach the link sticker that makes a story worth posting -- so what this
 * produces is a picture and a line to paste, nothing that publishes.
 *
 * **The words on the card are the city's.** Item titles are read out of the
 * write-up exactly as transcribed, and the card writes no sentence of its own
 * beyond the labels it is itself (the board, the day, "Agenda").
 */

export const SITE = "https://haverhill.alchemicalartisans.com"

/** A story is 9:16. */
export const WIDTH = 1080
export const HEIGHT = 1920

/** More than this does not fit a story at a size a phone can read. */
export const MAX_ITEMS = 6

/**
 * The agenda's sections in the order a reader would care about them: the ones
 * where the Council decides something that binds the city, then the rest.
 * Hand-kept, like `BODIES` -- a judgement about the Council's order of
 * business, not something the agenda states. Lower sorts first; a heading
 * matching nothing is 5, so routine business (petitions, proclamations,
 * committee reports) falls behind without being dropped.
 */
const SECTION_WEIGHT = [
  [/hearing/i, 0],
  [/ordinance/i, 1],
  [/unfinished business/i, 1],
  [/motions and orders/i, 1],
  [/communications.*(mayor|officers)/i, 2],
  [/appointments/i, 3],
  [/petitions|resolutions|proclamations|committee reports/i, 6],
]

/** HTML entities the write-ups actually use. */
function decode(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&lbrace;/g, "{")
    .replace(/&rbrace;/g, "}")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&rsquo;/g, "’")
}

const clean = (text) =>
  decode(text.replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim()

/**
 * The agenda items a write-up links, in agenda order.
 *
 * Only linked items: the transcriber links an item when it has a page of its
 * own, which is the substantive business. A bare "Opening Prayer" or an empty
 * "Petitions" heading is the agenda's furniture. Two shapes carry a link, a
 * list item (`<strong>16.2</strong> <a ...>Title</a>`) and a heading that is
 * itself the link (`<h2><a ...>19. Title</a></h2>`).
 */
export function agendaItems(svelte) {
  const items = []
  let section = ""
  const token =
    /<h2>([\s\S]*?)<\/h2>|<li>\s*<strong>\s*([\d.]+)\s*<\/strong>\s*<a\s+href=\{[^}]*?"([^"]+)"\)?\}[^>]*>([\s\S]*?)<\/a>/g
  for (const match of svelte.matchAll(token)) {
    if (match[1] !== undefined) {
      const heading = match[1]
      const text = clean(heading)
      section = text.replace(/^\d+\.\s*/, "")
      const link = heading.match(/<a\s+href=\{[^}]*?"([^"]+)"\)?\}/)
      if (link) {
        items.push({
          slug: link[1],
          number: text.match(/^(\d+)\./)?.[1] ?? "",
          title: section,
          section,
        })
      }
    } else {
      items.push({ slug: match[3], number: match[2], title: clean(match[4]), section })
    }
  }
  return items
}

/** The item slugs a page's `+page.ts` names as highlights, in the order written. */
export function highlightSlugs(pageTs) {
  const block = pageTs.match(/highlights:\s*\[([\s\S]*?)\n\s{4}\],/)?.[1] ?? ""
  return [...block.matchAll(/\bitem:\s*"([^"]+)"/g)].map((m) => m[1])
}

/** The hour the page states, as printed ("7:00 PM"), or null. */
export function statedTime(pageTs) {
  return pageTs.match(/\btime:\s*"([^"]+)"/)?.[1] ?? null
}

const weightOf = (section) => SECTION_WEIGHT.find(([pattern]) => pattern.test(section))?.[1] ?? 5

/**
 * The items to put on the card.
 *
 * `only` is a person's choice -- agenda numbers, in the order given -- and
 * wins outright. Otherwise highlights, which a transcriber has already
 * justified from the minutes, come first; then the rest by section weight,
 * agenda order breaking ties. The result is trimmed to `MAX_ITEMS` and put
 * back in agenda order, since a reader scanning a card expects the order the
 * Council will take things in.
 */
export function pickItems(items, { highlights = [], only = null, max = MAX_ITEMS } = {}) {
  if (only) {
    const chosen = only.map((number) => items.find((item) => item.number === number))
    const missing = only.filter((_, i) => !chosen[i])
    if (missing.length) throw new Error(`No linked agenda item numbered ${missing.join(", ")}`)
    return chosen
  }
  const rank = (item, index) => [
    highlights.includes(item.slug) ? 0 : 1,
    weightOf(item.section),
    index,
  ]
  const ranked = items
    .map((item, index) => ({ item, key: rank(item, index) }))
    .sort((a, b) => a.key[0] - b.key[0] || a.key[1] - b.key[1] || a.key[2] - b.key[2])
    .slice(0, max)
    .map(({ item }) => item)
  return ranked.sort((a, b) => items.indexOf(a) - items.indexOf(b))
}

/** "Tuesday, October 13" from a `YYYY-MM-DD`, UTC-parsed so it cannot slide a day. */
export function longDate(date) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** The page a story's link sticker points at. */
export const meetingUrl = (id) => `${SITE}/calendar/meetings/${id}`

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/**
 * The card, as a standalone HTML page sized to the story.
 *
 * The bottom ~250px is left clear: Instagram draws its reply bar there, and the
 * link sticker the poster places by hand wants somewhere to sit.
 */
export function storyHtml({ board, date, time, items }) {
  const rows = items
    .map(
      (item) => `
      <li>
        <span class="n">${escape(item.number)}</span>
        <span class="t">${escape(item.title)}</span>
      </li>`,
    )
    .join("")
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px; padding: 150px 80px 280px;
    background: #0f2742; color: #f8fafc;
    font-family: "Helvetica Neue", Arial, "Liberation Sans", sans-serif;
    display: flex; flex-direction: column;
  }
  .board { font-size: 44px; letter-spacing: 0.12em; text-transform: uppercase; color: #fcd34d; font-weight: 700; }
  .date { font-size: 78px; white-space: nowrap; line-height: 1.05; font-weight: 800; margin-top: 24px; }
  .time { font-size: 52px; margin-top: 16px; color: #cbd5e1; }
  h2 { font-size: 40px; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin: 90px 0 28px; font-weight: 700; }
  ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 22px; }
  li { display: flex; gap: 28px; align-items: baseline; background: #17365a; border-radius: 20px; padding: 26px 32px; }
  .n { font-size: 38px; font-weight: 700; color: #fcd34d; min-width: 92px; }
  .t { font-size: 44px; line-height: 1.2; font-weight: 600; }
  footer { margin-top: auto; padding-top: 40px; font-size: 34px; color: #94a3b8; }
</style>
</head>
<body>
  <div class="board">${escape(board)}</div>
  <div class="date">${escape(longDate(date))}</div>
  ${time ? `<div class="time">${escape(time)}</div>` : ""}
  <h2>On the agenda</h2>
  <ul>${rows}</ul>
  <footer>haverhill.alchemicalartisans.com</footer>
</body>
</html>
`
}

/** The id of the next sitting of `board` on or after `today`, from the ids that have write-ups. */
export function nextSitting(ids, board, today) {
  const prefix = `${board.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-`
  return (
    ids
      .filter((id) => id.startsWith(prefix) && /^\d{4}-\d{2}-\d{2}$/.test(id.slice(prefix.length)))
      .map((id) => ({ id, date: id.slice(prefix.length) }))
      .filter((sitting) => sitting.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
  )
}

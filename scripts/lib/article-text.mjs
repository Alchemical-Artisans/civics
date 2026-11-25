/**
 * An issue guide's words, lifted out of its Svelte source, for the page
 * history (`scripts/snapshot-issue.mjs`).
 *
 * **What counts is what a reader reads.** A heading, a paragraph, a list item
 * or a table row, with the links inside it kept as `[label](address)` -- the
 * addresses are half of what a revision changes, and a diff that could not see
 * a link move would miss exactly the edits this page is most often given. The
 * charts, maps and figures are components and images, not words, and are left
 * out.
 *
 * **A block is an element with no `class`.** That is the site's own rule for
 * authored prose (`layout.css` styles `:not([class])`), and here it is what
 * separates the article from the page's furniture: the "Published" line, the
 * print-only address and the share button all carry classes, and the article's
 * paragraphs never do.
 *
 * A tokenizer rather than a parser, deliberately: the source is hand-written
 * HTML with a handful of Svelte expressions, and a parser that understood all
 * of Svelte would be a dependency for the sake of one page. `article-text.spec.mjs`
 * runs it over the real page and fails if anything but words comes out.
 */

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  lbrace: "{",
  rbrace: "}",
}

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name) => {
    if (name[0] === "#") {
      const code =
        name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : Number(name.slice(1))
      return String.fromCodePoint(code)
    }
    return ENTITIES[name.toLowerCase()] ?? whole
  })
}

const BLOCKS = new Set(["h1", "h2", "h3", "h4", "p", "li", "tr"])
const CELLS = new Set(["td", "th"])
const VOID = new Set(["img", "br", "hr", "input", "path", "meta", "link"])
/** Elements whose whole content is not the article's words. */
const SKIPPED = new Set(["figure", "svg", "script", "style", "svelte:head"])

/**
 * An `href` as it should be stored. A literal is kept; the one expression the
 * page uses, `{Router.reference("file")}`, becomes `ref:file` so the history
 * page can resolve it against the site's own base the way the article does.
 */
function hrefOf(attributes) {
  const literal = attributes.match(/\shref\s*=\s*"([^"]*)"/)
  if (literal) return decode(literal[1])
  const reference = attributes.match(/\shref\s*=\s*\{\s*Router\.reference\(\s*"([^"]+)"\s*\)\s*\}/)
  return reference ? `ref:${reference[1]}` : null
}

const collapse = (text) => text.replace(/\s+/g, " ").trim()

/** `[label](href)` with the label's edge spaces moved outside the brackets. */
function link(label, href) {
  const lead = /^\s/.test(label) ? " " : ""
  const trail = /\s$/.test(label) ? " " : ""
  const inner = label.trim()
  return inner ? `${lead}[${inner}](${href})${trail}` : lead + trail
}

/**
 * `const NAME = Router.reference(...)` in the page's script, as each name's
 * `ref:` address. The ALPR guide names its records once at the top and links
 * them as `href={PACKET}` or `href="{PACKET}#page=46"`; without this the
 * history would keep the label and lose which record it was.
 */
function referenceConstants(script) {
  const out = new Map()
  const pattern =
    /const\s+([A-Z][A-Z0-9_]*)\s*=\s*Router\.reference\(\s*(?:"([^"]+)"|`([^`$]*)\$\{encodeURIComponent\(\s*"([^"]+)"\s*\)\}`)\s*,?\s*\)/g
  for (const m of script.matchAll(pattern)) {
    out.set(m[1], `ref:${m[2] ?? m[3] + encodeURIComponent(m[4])}`)
  }
  return out
}

/** The literal text of `const NAME = [...]` in the script, brackets matched outside strings. */
function arrayLiteral(script, name) {
  const start = new RegExp(`const\\s+${name}\\s*(?::[^=]+)?=\\s*\\[`).exec(script)
  if (!start) return null
  const from = start.index + start[0].length - 1
  let depth = 0
  let quote = null
  for (let i = from; i < script.length; i++) {
    const c = script[i]
    if (quote) {
      if (c === "\\") i++
      else if (c === quote) quote = null
    } else if (c === '"' || c === "'" || c === "`") quote = c
    else if (c === "[") depth++
    else if (c === "]" && --depth === 0) return script.slice(from, i + 1)
  }
  return null
}

const escapeText = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\{/g, "&lbrace;")
    .replace(/\}/g, "&rbrace;")

/**
 * `{#each NAME as row}` over an array of literals in the script, written out
 * once per row, so words a page keeps as data -- the ALPR guide's comparison
 * of the three ordinances -- are in its history like any paragraph.
 *
 * **Classes are taken off what is expanded.** The rows are drawn as boxes, so
 * every element in them carries a class, and the no-class rule would read the
 * whole comparison as furniture; inside a row, every word is the article's.
 * A loop over anything but a literal array (one that cannot be evaluated on
 * its own) is left alone, and its expressions drop out as before.
 */
function expandLoops(markup, script) {
  return markup.replace(
    /\{#each\s+([A-Z][A-Z0-9_]*)\s+as\s+(\w+)(?:\s*\([^)]*\))?\s*\}([\s\S]*?)\{\/each\}/g,
    (whole, name, row, body) => {
      const literal = arrayLiteral(script, name)
      if (!literal) return whole
      let rows
      try {
        rows = new Function(`return ${literal}`)()
      } catch {
        return whole
      }
      const field = new RegExp(`\\{${row}\\.(\\w+)\\}`, "g")
      const condition = new RegExp(`\\{#if\\s+${row}\\.(\\w+)\\s*\\}([\\s\\S]*?)\\{\\/if\\}`, "g")
      return rows
        .map((values) =>
          body
            .replace(condition, (_, key, inner) => (values[key] ? inner : ""))
            .replace(field, (_, key) => escapeText(values[key]))
            .replace(/\sclass\s*=\s*"[^"]*"/g, ""),
        )
        .join("")
    },
  )
}

/**
 * The article's blocks, in order: `{ tag, text }`, a table row's cells joined
 * by ` | `.
 */
export function articleBlocks(source) {
  const script = source.match(/^\s*<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? ""
  const references = referenceConstants(script)
  let markup = source
    .replace(/^\s*<script\b[^>]*>[\s\S]*?<\/script>/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
  markup = expandLoops(markup, script)
    .replace(/(\shref\s*=\s*)\{([A-Z][A-Z0-9_]*)\}/g, (whole, lead, name) =>
      references.has(name) ? `${lead}"${references.get(name)}"` : whole,
    )
    .replace(/\{([A-Z][A-Z0-9_]*)\}/g, (whole, name) => references.get(name) ?? whole)

  const blocks = []
  const tag = /<(\/?)([a-zA-Z][\w:.-]*)((?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>"'{])*?)(\/?)>/g
  // Open elements, innermost last: what to do when each closes.
  const stack = []
  let skipDepth = 0
  let current = null
  let cell = null
  let anchor = null
  let last = 0

  const text = (raw) => {
    if (skipDepth || !current) return
    // Svelte expressions in a text position are not words.
    const words = decode(raw.replace(/\{[^}]*\}/g, ""))
    if (anchor) anchor.label += words
    else if (cell) cell.text += words
    else current.text += words
  }

  for (let m; (m = tag.exec(markup));) {
    text(markup.slice(last, m.index))
    last = tag.lastIndex
    const [, closing, name, attributes, selfClosing] = m

    if (closing) {
      const open = stack.pop()
      if (!open) continue
      if (open.skip) skipDepth--
      if (skipDepth) continue
      if (open.name === "a" && anchor) {
        const href = anchor.href
        const label = anchor.label
        anchor = null
        const out = href ? link(label, href) : label
        if (cell) cell.text += out
        else if (current) current.text += out
      } else if (CELLS.has(open.name) && cell && current) {
        current.cells.push(collapse(cell.text))
        cell = null
      } else if (open.block && current) {
        const text = open.name === "tr" ? current.cells.join(" | ") : collapse(current.text)
        if (text.replace(/[\s|]/g, "")) blocks.push({ tag: open.name, text })
        current = null
      }
      continue
    }

    const void_ = selfClosing || VOID.has(name)
    // Components (`<ShapeMap … />`) and the figures, scripts and drawings
    // that are not prose: skipped with everything inside them.
    const skip = SKIPPED.has(name) || /^[A-Z]/.test(name)
    if (void_) continue
    if (skipDepth || skip) {
      stack.push({ name, skip: true })
      skipDepth++
      continue
    }

    const hasClass = /\sclass\s*=/.test(attributes)
    if (BLOCKS.has(name) && !current && !hasClass) {
      current = { text: "", cells: [] }
      stack.push({ name, block: true })
    } else if (CELLS.has(name) && current) {
      cell = { text: "" }
      stack.push({ name })
    } else if (name === "a" && current) {
      anchor = { label: "", href: hrefOf(attributes) }
      stack.push({ name })
    } else {
      stack.push({ name })
    }
  }
  return blocks
}

/**
 * An issue timeline's entries as the same kind of blocks, so a revision
 * that adds, moves or retitles a step shows up in the same diff as a
 * paragraph does. Read from `timeline.ts` by pattern: the file is a literal
 * array of literals, and importing it would pull in the whole of `$lib`.
 */
export function timelineBlocks(source) {
  const code = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .join("\n")

  // The ALPR timeline's `record("file", page)`: a committed reference opened at a page.
  const recordHelper =
    /const record = \([^)]*\) =>\s*`\$\{Router\.reference\(`([^`$]*)\$\{(encodeURIComponent\(file\)|file)\}`\)\}#page=\$\{page\}`/.exec(
      source,
    )
  const recordHref = (entry) => {
    if (!recordHelper) return null
    const m = entry.match(/\bhref:\s*record\(\s*"([^"]+)"\s*,\s*(\d+)\s*\)/)
    if (!m) return null
    const file = recordHelper[2] === "file" ? m[1] : encodeURIComponent(m[1])
    return `ref:${recordHelper[1]}${file}#page=${m[2]}`
  }
  const video = /const video = \(slug: string\) => `([^`$]*)\$\{slug\}`/.exec(source)
  const videoBase = video ? video[1] : "http://haverhillcommunitytv.org/video/"
  const field = (entry, key) => {
    const m = entry.match(new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`))
    return m ? m[1].replace(/\\(.)/g, "$1") : null
  }

  const out = []
  for (const [entry] of code.matchAll(/\{\s*(?:id|date|title)\s*:[\s\S]*?\n {2}\}/g)) {
    // An entry's `links` carry hrefs of their own; read the title's from
    // what is left once they are taken out.
    const linksBlock = entry.match(/\blinks:\s*\[([\s\S]*?)\]/)
    const own = linksBlock ? entry.replace(linksBlock[0], "") : entry
    const title = field(own, "title")
    if (!title) continue
    const slug = own.match(/\bhref:\s*video\(\s*"([^"]+)"\s*\)/)
    const href = slug ? `${videoBase}${slug[1]}` : (recordHref(own) ?? field(own, "href"))
    const extras = linksBlock
      ? [...linksBlock[1].matchAll(/\{[^}]*\}/g)]
          .map(([link]) => [field(link, "label"), field(link, "href")])
          .filter(([label, to]) => label && to)
          .map(([label, to]) => ` ([${label}](${to}))`)
          .join("")
      : ""
    const when = field(entry, "dateLabel") ?? field(entry, "date") ?? "undated"
    const eyebrow = field(entry, "eyebrow")
    out.push({
      tag: "li",
      text:
        [when, eyebrow, href ? link(title, href).trim() : title].filter(Boolean).join(" · ") +
        extras,
    })
  }
  return out
}

/**
 * The "Published" date a revision printed, where it printed one: inline, as
 * the drought guide did, or as the ALPR guide's `PUBLISHED` constant.
 */
export function printedDate(source) {
  return (
    source.match(/formatLongDate\(\s*"(\d{4}-\d{2}-\d{2})"\s*\)/)?.[1] ??
    source.match(/const PUBLISHED(?::\s*string)?\s*=\s*"(\d{4}-\d{2}-\d{2})"/)?.[1] ??
    null
  )
}

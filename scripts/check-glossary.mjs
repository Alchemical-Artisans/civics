#!/usr/bin/env node
/**
 * Every term the budget book defines should be defined for the reader wherever
 * the book's prose uses it. This finds the ones that are not, and with `--fix`
 * wraps them in `GlossaryTerm`.
 *
 * Every use, not the first: a reader who arrives at a page halfway down, from a
 * link or a search, has not passed the paragraph where the word happened to be
 * introduced. The wrapper is a link rather than a control, so the cost of that
 * is a dotted underline and an entry in the page's list of links, which is what
 * a reference to a definition should be.
 *
 * What counts as prose is everything a reader reads except the parts where a
 * wrapper cannot go or does not belong: `<script>` blocks, comments, tables (a
 * cell is a figure, not a sentence), and headings (the book's own words as a
 * title, where a definition would be chrome on a chrome).
 *
 * Run by `npm run glossary:check`, which `npm run lint` calls, so a page that
 * uses a defined term without defining it fails the same way a formatting slip
 * does.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { globSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, relative } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const { terms } = JSON.parse(readFileSync(join(root, "src/lib/data/glossary.json"), "utf8"))

/** Longest first, so "Levy Limit" is matched before "Levy". */
const names = terms.map((t) => t.term).sort((a, b) => b.length - a.length)

/**
 * Whether a match is part of a name rather than a use of the term.
 *
 * The book defines "Department" and also writes "Water Department", "School
 * Department", "Department of Revenue" -- none of which is the glossary's
 * "principal, functional and administrative entity created by the manager". The
 * same goes for "Fund" in "Stabilization Fund" and "Grant" in a grant
 * programme's name. A capitalised word on either side, or "of" and a
 * capitalised word after, is what tells them apart.
 */
const partOfAName = (prose, at, text) => {
  const before = prose.slice(Math.max(0, at - 40), at)
  const after = prose.slice(at + text.length, at + text.length + 40)

  return (
    /(^|\s)[A-Z][\w'’-]*\s*$/.test(before) ||
    /^\s*[A-Z][\w'’-]*/.test(after) ||
    /^\s*of\s+[A-Z]/.test(after)
  )
}

/** The pages the rule applies to: the book's transcriptions. */
const pages = globSync("src/routes/budget/*/**/+page.svelte", { cwd: root })

/**
 * The regions of a page a term should not be wrapped in, blanked out so that
 * offsets still line up with the source.
 */
const blanked = (source) =>
  source
    .replace(/<script[\s\S]*?<\/script>/g, (m) => " ".repeat(m.length))
    .replace(/<!--[\s\S]*?-->/g, (m) => " ".repeat(m.length))
    .replace(/<table[\s\S]*?<\/table>/g, (m) => " ".repeat(m.length))
    .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g, (m) => " ".repeat(m.length))
    // `</GlossaryTerm\n>` as well as `</GlossaryTerm>`: prettier hangs the
    // closing bracket on its own line when the tag is long, and a wrapper this
    // did not recognise would be wrapped a second time.
    .replace(/<GlossaryTerm[\s\S]*?<\/GlossaryTerm\s*>/g, (m) => " ".repeat(m.length))
    // Tag names and attributes are not prose either: "Fund" in a component name
    // or a class is not the book using the word.
    .replace(/<[^>]+>/g, (m) => " ".repeat(m.length))

const escaped = (term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Every use of a term in a page's prose that is not part of a name. */
const usesOf = (prose, term) => {
  const pattern = new RegExp(`\\b${escaped(term).replace(/\s+/g, "\\s+")}\\b`, "gi")

  return [...prose.matchAll(pattern)]
    .map((m) => ({ at: m.index, text: m[0] }))
    .filter((use) => !partOfAName(prose, use.at, use.text))
}

let missing = 0
let fixed = 0
const fix = process.argv.includes("--fix")

for (const page of pages) {
  const file = join(root, page)
  let source = readFileSync(file, "utf8")

  // One term at a time, and one use at a time within it: blanking is redone
  // after every wrap so that the offsets of the next one are still true, and so
  // that a use inside a wrapper already added is not wrapped again.
  for (const term of names) {
    for (;;) {
      const use = usesOf(blanked(source), term)[0]
      if (!use) break

      if (!fix) {
        missing += 1
        console.log(`${relative(root, file)}: "${use.text}" is not linked (${term})`)
        break
      }

      source =
        source.slice(0, use.at) +
        `<GlossaryTerm term="${term}">${use.text}</GlossaryTerm>` +
        source.slice(use.at + use.text.length)
      fixed += 1
    }
  }

  // The import goes after the ones a page already has, or opens a script block
  // for a page that had none -- a transcription only carries a script when
  // something on it is data, and now a defined term is one of those things.
  if (fix && !/import GlossaryTerm/.test(source) && /<GlossaryTerm/.test(source)) {
    const line = `import GlossaryTerm from "$lib/GlossaryTerm.svelte"`
    const imports = [...source.matchAll(/^ *import .*$/gm)]

    if (imports.length) {
      const last = imports.at(-1)
      const indent = last[0].match(/^ */)[0]
      const end = last.index + last[0].length
      source = `${source.slice(0, end)}\n${indent}${line}${source.slice(end)}`
    } else {
      source = `<script lang="ts">\n  ${line}\n</script>\n\n${source}`
    }
  }

  // The component builds a link out of the term it is given and looks nothing
  // up, so a name that is not the glossary's would be a dead anchor. This is
  // the only thing that would notice.
  for (const [, named] of source.matchAll(/<GlossaryTerm\s+term="([^"]+)"/g)) {
    if (names.includes(named)) continue
    console.log(`${relative(root, file)}: "${named}" is not a term the book defines`)
    missing += 1
  }

  if (fix) writeFileSync(file, source)
}

if (fix) {
  console.log(`wrapped ${fixed} uses`)
} else if (missing) {
  console.log(`\n${missing} problem(s); run with --fix to wrap what can be wrapped`)
  process.exit(1)
} else {
  console.log(`every use of a defined term links to its definition`)
}

#!/usr/bin/env node
/**
 * Every term the budget book defines should be defined for the reader where the
 * book's prose first uses it. This finds the ones that are not, and with
 * `--fix` wraps them.
 *
 * The rule is the first occurrence in a page, not every occurrence: "levy"
 * appears thirty-one times on the revenue page, and thirty-one dotted
 * underlines in one page of prose is a page nobody can read. The first one
 * answers the question; the rest are the same word.
 *
 * What counts as prose is everything a reader reads except the parts where a
 * wrapper cannot go or does not belong: `<script>` blocks, comments, tables
 * (a cell is a figure, not a sentence), and headings (the book's own words as
 * a title, where a tooltip would be chrome on a chrome).
 *
 * Run by `npm run glossary:check`, which `npm run lint` calls, so a page that
 * introduces a term without defining it fails the same way a formatting slip
 * does.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { globSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, relative } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const { terms } = JSON.parse(readFileSync(join(root, "src/lib/data/glossary.json"), "utf8"))

/**
 * Terms the book defines but also uses as ordinary English, which are not worth
 * a dotted line under: nobody reading "the Water Department" wants "a principal,
 * functional and administrative entity created by the manager", and "fund"
 * inside "the fund used to account for" is the same word as everywhere else.
 * They stay in the glossary; they are not required in the prose.
 */
const GENERIC = new Set([
  "Audit",
  "Deficit",
  "Department",
  "Expenditures",
  "Fund",
  "Grant",
  "Revenues",
  "Valuation",
])

/** Longest first, so "Levy Limit" is matched before "Levy". */
const names = terms
  .map((t) => t.term)
  .filter((term) => !GENERIC.has(term))
  .sort((a, b) => b.length - a.length)

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

/** Where a term is first used in a page's prose, or null. */
const firstUse = (prose, term) => {
  const pattern = new RegExp(`\\b${escaped(term).replace(/\s+/g, "\\s+")}\\b`, "i")
  const at = prose.search(pattern)
  if (at < 0) return null
  return { at, text: prose.slice(at).match(pattern)[0] }
}

let missing = 0
let fixed = 0
const fix = process.argv.includes("--fix")

for (const page of pages) {
  const file = join(root, page)
  let source = readFileSync(file, "utf8")

  // One term at a time, re-blanking after each fix so offsets stay true.
  for (const term of names) {
    // Already answered on this page. A page needs one wrapper per term, not one
    // per use, so a later mention of the same word is not a second failure.
    // `\\s+` between the tag and the attribute: prettier breaks a long tag over
    // two lines, and a wrapper this did not recognise would be added twice.
    if (new RegExp(`<GlossaryTerm\\s+term="${escaped(term)}"`).test(source)) continue

    const prose = blanked(source)
    const use = firstUse(prose, term)
    if (!use) continue

    if (!fix) {
      missing += 1
      console.log(`${relative(root, file)}: "${use.text}" is not wrapped (${term})`)
      continue
    }

    source =
      source.slice(0, use.at) +
      `<GlossaryTerm term="${term}">${use.text}</GlossaryTerm>` +
      source.slice(use.at + use.text.length)
    fixed += 1
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

  if (fix) writeFileSync(file, source)
}

if (fix) {
  console.log(`wrapped ${fixed} first uses`)
} else if (missing) {
  console.log(`\n${missing} first use(s) of a defined term are not wrapped; run with --fix`)
  process.exit(1)
} else {
  console.log(`every defined term the pages use is defined where it is first used`)
}

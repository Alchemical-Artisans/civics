#!/usr/bin/env node
/**
 * Draw the Instagram story for the next City Council sitting.
 *
 *   npm run story                       # the next sitting that has a write-up
 *   npm run story -- city-council-2026-10-13
 *   npm run story -- --items 8.1,10.1,16.2   # choose the agenda items yourself
 *
 * Writes `.cache/stories/<meeting id>/story.png` and prints the link to paste
 * into the sticker. **Nothing is published**: a story is posted by hand because
 * the Instagram API cannot attach a link sticker, and the sticker is the point.
 * The intended rhythm is the day before the sitting, once `npm run transcribe`
 * has written the agenda up.
 */
import { chromium } from "playwright"
import { mkdirSync, readFileSync, readdirSync, existsSync } from "node:fs"
import path from "node:path"
import {
  HEIGHT,
  WIDTH,
  agendaItems,
  highlightSlugs,
  meetingUrl,
  nextSitting,
  pickItems,
  statedTime,
  storyHtml,
} from "./lib/story.mjs"

const BOARD = "City Council"
const MEETINGS = path.resolve("src/routes/calendar/meetings")

/** Today in Haverhill -- `easternDate` in calendar.ts, which a script cannot import. */
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date())

const args = process.argv.slice(2)
const flag = args.indexOf("--items")
const only = flag === -1 ? null : args[flag + 1]?.split(",").map((n) => n.trim())
const positional = args.filter((arg, i) => !arg.startsWith("--") && (flag === -1 || i !== flag + 1))

const written = readdirSync(MEETINGS).filter((id) =>
  existsSync(path.join(MEETINGS, id, "+page.svelte")),
)
const sitting = positional[0]
  ? { id: positional[0], date: positional[0].slice(-10) }
  : nextSitting(written, BOARD, today)

if (!sitting) {
  console.error(`No ${BOARD} sitting on or after ${today} has been written up yet.`)
  console.error(
    "Run `npm run transcribe -- city-council` once the agenda is posted, then try again.",
  )
  process.exit(1)
}
if (!written.includes(sitting.id)) {
  console.error(`${sitting.id} has no write-up. Run \`npm run transcribe -- ${sitting.id}\` first.`)
  process.exit(1)
}

const dir = path.join(MEETINGS, sitting.id)
const svelte = readFileSync(path.join(dir, "+page.svelte"), "utf8")
const pageTs = existsSync(path.join(dir, "+page.ts"))
  ? readFileSync(path.join(dir, "+page.ts"), "utf8")
  : ""

const items = pickItems(agendaItems(svelte), { highlights: highlightSlugs(pageTs), only })
if (!items.length) {
  console.error(`${sitting.id} links no agenda items to put on a card.`)
  process.exit(1)
}

const out = path.resolve(".cache/stories", sitting.id)
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH })
try {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } })
  await page.setContent(
    storyHtml({ board: BOARD, date: sitting.date, time: statedTime(pageTs), items }),
  )
  await page.screenshot({ path: path.join(out, "story.png") })
} finally {
  await browser.close()
}

console.log(`${sitting.id}: ${items.length} items`)
for (const item of items) console.log(`  ${item.number.padEnd(5)} ${item.title}`)
console.log(`\nImage:  ${path.join(out, "story.png")}`)
console.log(`Link:   ${meetingUrl(sitting.id)}`)
console.log("Post it as a story and paste the link into a link sticker.")

import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { articleBlocks, timelineBlocks } from "./article-text.mjs"

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8")

describe("articleBlocks", () => {
  it("keeps links inline, with the edge spaces outside the brackets", () => {
    const [block] = articleBlocks(
      `<p>See <a href="http://x.example" target="_blank"> the page</a\n  >, then go.</p>`,
    )
    expect(block).toEqual({ tag: "p", text: "See [the page](http://x.example), then go." })
  })

  it("ignores anything with a class, components, figures and comments", () => {
    const blocks = articleBlocks(
      `<script lang="ts">let a = 1</script>
       <!-- <p>commentary</p> -->
       <p class="m-0">Published</p>
       <Chart years={data.years} />
       <figure><p>caption</p></figure>
       <h2>Heading</h2>
       <p>Words &amp; &lbrace;braces&rbrace;.</p>`,
    )
    expect(blocks).toEqual([
      { tag: "h2", text: "Heading" },
      { tag: "p", text: "Words & {braces}." },
    ])
  })

  it("joins a table row's cells", () => {
    const blocks = articleBlocks(`<table><tr><td>A</td><td>B</td></tr></table>`)
    expect(blocks).toEqual([{ tag: "tr", text: "A | B" }])
  })

  it("resolves the one reference expression the page uses", () => {
    const [block] = articleBlocks(`<p><a href={Router.reference("a.xlsx")}>sheet</a></p>`)
    expect(block.text).toBe("[sheet](ref:a.xlsx)")
  })

  it("resolves a record named once in the script, bare or with a page", () => {
    const blocks = articleBlocks(`<script lang="ts">
  const PACKET = Router.reference("dir/packet.pdf")
  const NOTICE = Router.reference(
    \`dir/\${encodeURIComponent("A & B.pdf")}\`,
  )
</script>
<p><a href={NOTICE}>notice</a>, <a href="{PACKET}#page=4">page 4</a></p>`)
    expect(blocks[0].text).toBe(
      "[notice](ref:dir/A%20%26%20B.pdf), [page 4](ref:dir/packet.pdf#page=4)",
    )
  })

  it("writes out a loop over a literal array, classes and all", () => {
    const blocks = articleBlocks(`<script lang="ts">
  const ROWS = [
    { topic: "One", text: "First", note: "" },
    { topic: "Two", text: 'Second {x}', note: "Noted" },
  ]
</script>
{#each ROWS as row (row.topic)}
  <h3>{row.topic}</h3>
  <p class="m-0">{row.text}</p>
  {#if row.note}<p class="mt-3">{row.note}</p>{/if}
{/each}`)
    expect(blocks).toEqual([
      { tag: "h3", text: "One" },
      { tag: "p", text: "First" },
      { tag: "h3", text: "Two" },
      { tag: "p", text: "Second {x}" },
      { tag: "p", text: "Noted" },
    ])
  })

  it("reads the ALPR guide's comparison and records", () => {
    const blocks = articleBlocks(read("src/routes/issues/ALPR/+page.svelte"))
    expect(
      blocks.some((b) => b.tag === "h3" && b.text === "What counts as a license plate reader"),
    ).toBe(true)
    for (const { text } of blocks) {
      expect(text).not.toMatch(/[<>]|\{[#@:/]|\{\w+\.|\{[A-Z_]+\}/)
      expect(text).not.toMatch(/\]\(\)/)
    }
  })

  it("reads only words out of the real page", () => {
    const blocks = articleBlocks(read("src/routes/issues/drought/+page.svelte"))
    expect(blocks.length).toBeGreaterThan(30)
    for (const { text } of blocks) {
      // Markup or Svelte syntax leaking out means the tokenizer lost its place.
      expect(text).not.toMatch(/[<>]|\{[#@:/]|\{\w+\.|\$derived/)
      expect(text.length).toBeGreaterThan(0)
    }
    // Every link carries an address.
    expect(blocks.some((b) => /\]\(\)/.test(b.text))).toBe(false)
  })
})

describe("timelineBlocks", () => {
  it("reads every entry of the real timeline, with its address", () => {
    const entries = timelineBlocks(read("src/routes/issues/drought/timeline.ts"))
    expect(entries.length).toBeGreaterThanOrEqual(9)
    expect(entries.some((e) => e.text.includes("](http://haverhillcommunitytv.org/video/"))).toBe(
      true,
    )
  })

  it("reads the ALPR timeline's records as references at a page", () => {
    const entries = timelineBlocks(read("src/routes/issues/ALPR/timeline.ts"))
    expect(
      entries.some((e) =>
        e.text.includes(
          "](ref:PublicSafetyLPR/Haverhill%20-%20Flock%20Termination%20Letter%20-%2010.21.2026.pdf#page=1)",
        ),
      ),
    ).toBe(true)
  })

  it("keeps an entry's own link apart from the documents beside it", () => {
    const [entry] = timelineBlocks(`[
  {
    date: "2026-09-15",
    title: "Drought update",
    href: video("a-sitting"),
    links: [
      {
        label: "Slideshow",
        href: "https://x.example/deck.pptx",
      },
    ],
  },
]`)
    expect(entry.text).toBe(
      "2026-09-15 · [Drought update](http://haverhillcommunitytv.org/video/a-sitting) ([Slideshow](https://x.example/deck.pptx))",
    )
  })
})

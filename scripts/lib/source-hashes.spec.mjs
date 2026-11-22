import { describe, it, expect } from "vitest"
import {
  acceptSource,
  hashBody,
  linkedUrls,
  mergeSources,
  nameWords,
  readableText,
  sourceId,
} from "./source-hashes.mjs"
import { leadId } from "./issue-watch.mjs"

describe("linkedUrls", () => {
  it("takes each outside address once, without its fragment", () => {
    const source = `<a href="https://x.gov/a.pdf#page=3">a</a> <a href="https://x.gov/a.pdf#page=9">b</a>
      const video = (slug) => \`http://haverhillcommunitytv.org/video/\${slug}\`
      "https://schema.org" "https://haverhill.alchemicalartisans.com/issues/drought"`
    expect(linkedUrls(source)).toEqual(["https://x.gov/a.pdf"])
  })
})

describe("nameWords", () => {
  it("splits CSS-module, camelCase, hyphenated and underscored names", () => {
    const words = nameWords("TeasersBlockSidebar_teaserBlock__wUrKC site-footer")
    expect(words).toEqual(expect.arrayContaining(["teasers", "sidebar", "teaser", "footer"]))
    expect(nameWords("shareholder adoption")).toEqual(["shareholder", "adoption"])
  })
})

describe("readableText", () => {
  it("takes the largest article, not every article on the page", () => {
    const html = `<body><article>Short teaser.</article>
      <article><p>The story itself, which is long enough to be the largest.</p></article></body>`
    expect(readableText(html)).toBe("The story itself, which is long enough to be the largest.")
  })

  it("strips a page's furniture where it has no semantic element", () => {
    const html = `<body><div class="site-header">Menu</div>
      <div class="content"><p>What the page says.</p>
        <div class="TrendingRail_list__x1"><div>Hurricane odds lowered</div></div>
        <img class="ad-slot" src="x.png"><p>And more.</p></div>
      <footer>© 2026</footer></body>`
    expect(readableText(html)).toBe("What the page says. And more.")
  })

  it("keeps a wrapper that only names itself after furniture", () => {
    const html = `<body><div class="page has-sidebar"><p>Nearly everything on the page is in here.</p>
      <div class="sidebar">Links</div></div></body>`
    expect(readableText(html)).toBe("Nearly everything on the page is in here.")
  })
})

describe("hashBody", () => {
  it("hashes a page's words, so a change of markup alone is not a change", () => {
    const a = hashBody("text/html", Buffer.from('<body><p class="a">Same words.</p></body>'))
    const b = hashBody(
      "text/html",
      Buffer.from('<body><div><p class="b">Same words.</p></div></body>'),
    )
    expect(a.hash).toBe(b.hash)
  })

  it("hashes a file whole", () => {
    expect(hashBody("application/pdf", Buffer.from("%PDF")).text).toBeUndefined()
  })
})

describe("mergeSources", () => {
  const url = "https://x.gov/page"
  const id = sourceId("s", url)
  const run = (stored, result, today = "2026-11-22") =>
    mergeSources("s", stored, [url], new Map([[url, result]]), today)

  it("takes the first version seen as the baseline", () => {
    expect(run({}, { hash: "a" })[id]).toMatchObject({ md5: "a", status: "ok" })
  })

  it("reports a change only once it holds for two runs", () => {
    const once = run(run({}, { hash: "a" }), { hash: "b" })
    expect(once[id]).toMatchObject({ status: "ok", pending: "b" })
    expect(run(once, { hash: "b" })[id]).toMatchObject({ status: "changed", current: "b" })
  })

  it("never reports a page flickering between two versions", () => {
    let s = run({}, { hash: "a" })
    for (const h of ["b", "a", "b", "a"]) s = run(s, { hash: h })
    expect(s[id].status).toBe("ok")
  })

  it("keeps the last good hash through a failed fetch", () => {
    const s = run(run({}, { hash: "a" }), { error: "HTTP 403" })
    expect(s[id]).toMatchObject({ status: "unreachable", md5: "a" })
    expect(run(s, { hash: "a" })[id].status).toBe("ok")
  })

  it("keeps a link dead from the start reported until it is accepted", () => {
    const s = run(run({}, { gone: 404 }), { gone: 404 })
    expect(s[id].status).toBe("gone")
    const accepted = { [id]: acceptSource(s[id]) }
    expect(run(accepted, { gone: 404 })[id].status).toBe("ok")
  })

  it("accepting a change makes the new version the baseline", () => {
    const changed = run(run(run({}, { hash: "a" }), { hash: "b" }), { hash: "b" })
    const accepted = acceptSource(changed[id])
    expect(accepted).toMatchObject({ status: "ok", md5: "b" })
    expect(accepted.current).toBeUndefined()
  })

  it("does not fetch or touch an ignored source", () => {
    const stored = { [id]: { url, status: "ignored", md5: "a" } }
    expect(mergeSources("s", stored, [url], new Map(), "2026-11-22")[id].status).toBe("ignored")
  })
})

describe("sourceId", () => {
  it("never collides with a lead for the same address", () => {
    expect(sourceId("s", "https://x.gov/a")).not.toBe(leadId("s", "https://x.gov/a"))
  })
})

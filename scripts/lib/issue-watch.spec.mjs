import { describe, it, expect } from "vitest"
import {
  isCited,
  leadId,
  mergeLeads,
  newsDate,
  normalizeUrl,
  parseGoogleNews,
  parseNewsListing,
  termPattern,
} from "./issue-watch.mjs"

describe("normalizeUrl", () => {
  it("treats scheme, www, trailing slash and tracking parameters as the same address", () => {
    expect(normalizeUrl("https://www.haverhillma.gov/news/posts/x/?utm_source=fb#top")).toBe(
      normalizeUrl("http://haverhillma.gov/news/posts/x"),
    )
  })
})

describe("termPattern", () => {
  it("matches whole words in any case, across line breaks", () => {
    const p = termPattern(["water supply", "Flock"])
    expect(p.test("the WATER\n supply emergency")).toBe(true)
    expect(p.test("Flocking")).toBe(false)
  })
})

describe("newsDate", () => {
  it("reads the city's listing dates", () => {
    expect(newsDate("Sep 21, 2026")).toBe("2026-09-21")
    expect(newsDate("nonsense")).toBeNull()
  })
})

describe("parseNewsListing", () => {
  it("takes each release's address, title and date", () => {
    const html = `<a href="/news/posts/drought-update/" title="x" class="gs-feed-list-title ">Drought Update</a>
      <div><span class="gs-feed-list-date">Sep 21, 2026</span></div>`
    expect(parseNewsListing(html)).toEqual([
      {
        url: "https://www.haverhillma.gov/news/posts/drought-update/",
        title: "Drought Update",
        date: "2026-09-21",
      },
    ])
  })
})

describe("parseGoogleNews", () => {
  it("reads headline, link, publisher and day", () => {
    const xml = `<rss><channel><item><title>Haverhill water - WHAV</title><link>https://news.google.com/rss/articles/abc</link><pubDate>Mon, 16 Nov 2026 22:50:57 GMT</pubDate><source url="https://whav.net">WHAV</source></item></channel></rss>`
    expect(parseGoogleNews(xml)).toEqual([
      {
        url: "https://news.google.com/rss/articles/abc",
        title: "Haverhill water - WHAV",
        publisher: "WHAV",
        date: "2026-11-16",
        source: "news",
        excerpt: null,
      },
    ])
  })
})

describe("isCited", () => {
  it("recognises an address the page already links, however spelled", () => {
    const source = `<a href="https://www.haverhillma.gov/news/posts/x/">release</a>`
    expect(isCited({ url: "https://haverhillma.gov/news/posts/x" }, source)).toBe(true)
    expect(isCited({ url: "https://haverhillma.gov/news/posts/y" }, source)).toBe(false)
  })

  it("recognises a meeting page by its route", () => {
    const lead = { url: "…", sitePath: "/calendar/meetings/city-council-2026-09-15/drought" }
    expect(isCited(lead, `Router.item("city-council-2026-09-15/drought")`)).toBe(true)
  })
})

describe("mergeLeads", () => {
  const options = { since: "2026-11-01", source: "cites https://a.org/old", today: "2026-11-20" }
  const hit = (url, extra = {}) => ({
    url,
    title: url,
    date: "2026-11-10",
    source: "web",
    ...extra,
  })

  it("drops what is older than since, and keeps what has no date", () => {
    const { leads } = mergeLeads(
      "x",
      {},
      [hit("https://a.org/1", { date: "2026-10-01" }), hit("https://a.org/2", { date: null })],
      options,
    )
    expect(Object.values(leads).map((l) => l.url)).toEqual(["https://a.org/2"])
  })

  it("never overwrites a decision a person has made", () => {
    const id = leadId("x", "https://a.org/1")
    const stored = {
      [id]: { status: "irrelevant", url: "https://a.org/1", title: "t", found: "2026-11-11" },
    }
    const { leads, added } = mergeLeads("x", stored, [hit("https://a.org/1")], options)
    expect(added).toEqual([])
    expect(leads[id].status).toBe("irrelevant")
  })

  it("marks a lead the page already links as cited", () => {
    const { leads } = mergeLeads("x", {}, [hit("https://a.org/old")], options)
    expect(Object.values(leads)[0].status).toBe("cited")
  })

  it("keeps one lead per news headline however many redirects reach it", () => {
    const { added } = mergeLeads(
      "x",
      {},
      [
        hit("https://news.google.com/1", { source: "news", title: "Same story - WHAV" }),
        hit("https://news.google.com/2", { source: "news", title: "Same story - WHAV" }),
      ],
      options,
    )
    expect(added).toHaveLength(1)
  })
})

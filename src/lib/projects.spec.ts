import { describe, expect, it } from "vitest"
import { PROJECTS, agendaHref, entryDate, entryId, projectsOf, timeline } from "./projects"

// Every item page that exists, by its meeting id and directory name.
const itemPages = new Set(
  Object.keys(import.meta.glob("/src/routes/calendar/meetings/*/*/+page.svelte")).map((file) => {
    const [meeting, item] = file.split("/").slice(-3, -1)
    return `${meeting}/${item}`
  }),
)
// A project's front page may sit inside a route group, `(tabs)` -- matched
// here rather than in the glob, where parentheses are pattern syntax.
const projectPages = new Set(
  Object.keys(import.meta.glob("/src/routes/projects/**/+page.svelte"))
    .map(
      (file) =>
        file.match(/^\/src\/routes\/projects\/([^/]+)\/(?:\(tabs\)\/)?\+page\.svelte$/)?.[1],
    )
    .filter(Boolean),
)

describe("PROJECTS", () => {
  it("has a page for every project", () => {
    for (const project of PROJECTS) expect(projectPages).toContain(project.slug)
  })

  it("names only agenda items that have been written up", () => {
    for (const project of PROJECTS) {
      for (const entry of project.entries) {
        const item = entry.kind === "item" ? entry : entry.from
        expect(itemPages).toContain(`${item.meeting}/${item.item}`)
      }
    }
  })

  it("gives every entry its own fragment", () => {
    for (const project of PROJECTS) {
      const ids = project.entries.map(entryId)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})

describe("timeline", () => {
  it("runs in date order, a sitting ahead of a date it shares a day with", () => {
    const project = {
      slug: "x",
      kind: "election" as const,
      title: "X",
      entries: [
        {
          kind: "date" as const,
          date: "2026-10-06",
          title: "A deadline",
          from: { meeting: "m", item: "i" },
        },
        {
          kind: "date" as const,
          date: "2026-10-01",
          title: "Earlier",
          from: { meeting: "m", item: "i" },
        },
        {
          kind: "item" as const,
          meeting: "city-council-2026-10-06",
          item: "i",
          board: "City Council",
          number: "1",
          title: "An item",
        },
      ],
    }
    expect(timeline(project).map((e) => [entryDate(e), e.kind])).toEqual([
      ["2026-10-01", "date"],
      ["2026-10-06", "item"],
      ["2026-10-06", "date"],
    ])
  })
})

describe("projectsOf", () => {
  it("finds the election from its warrant, and nothing from an unrelated item", () => {
    const found = projectsOf("city-council-2026-10-06", "election-warrant")
    expect(found.map((f) => f.project.slug)).toEqual(["2026-state-election"])
    expect(entryId(found[0].entry)).toBe("city-council-2026-10-06-election-warrant")
    expect(projectsOf("city-council-2026-10-06", "white-cane-awareness-day")).toEqual([])
  })
})

describe("agendaHref", () => {
  it("sends an item on a project to its entry on the project page", () => {
    expect(agendaHref("city-council-2026-10-06", "election-warrant")).toBe(
      "/projects/2026-state-election#city-council-2026-10-06-election-warrant",
    )
  })

  it("sends any other item to its own page", () => {
    expect(agendaHref("city-council-2026-10-06", "white-cane-awareness-day")).toBe(
      "/calendar/meetings/city-council-2026-10-06/white-cane-awareness-day",
    )
  })
})

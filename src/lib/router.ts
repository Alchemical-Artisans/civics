/**
 * Every internal URL the site can produce, in one place.
 *
 * SvelteKit's `resolve()` from `$app/paths` does the same job, but it has been
 * unreliable in practice — most sharply when the site moved onto a `/<repo>`
 * base path for GitHub Pages, where a path that already carried the base got it
 * prepended a second time. A single class means there is exactly one place that
 * knows how a URL is spelled, callers name a route instead of retyping it, and
 * `base` is applied once, here.
 *
 * `base` is read at call time rather than captured at module load: with
 * `paths.relative` on (SvelteKit's default) it is a relative prefix that
 * changes per page during prerendering, so a cached copy would be wrong for
 * every page but the one that populated it.
 */
import { base } from "$app/paths"
import { TIMEZONE, easternDate } from "./calendar"

/** Join the base path to a root-relative path, e.g. `/calendar`. */
const path = (route: `/${string}`): string => `${base}${route}`

export class Router {
  /** The landing page. */
  static home(): string {
    return path("/")
  }

  /**
   * The month calendar of agendas and minutes, on whichever month is current.
   *
   * There is no bare `/calendar` page any more, the same way there is no bare
   * `/budget` — a reader wants a month, not an index, and the one worth
   * landing on by default is this one. `now` defaults to the real clock and
   * exists only so a test can pin a date rather than mocking the global one,
   * the same reason `easternDate` itself takes it.
   */
  static calendar(now: Date = new Date()): string {
    return Router.calendarMonth(easternDate(now).slice(0, 7))
  }

  /**
   * One month of the calendar. `key` is `monthKey`'s `YYYY-MM`, the format
   * every date helper in `calendar.ts` already uses — split into the two path
   * segments here rather than carried as a dash all the way through the app.
   */
  static calendarMonth(key: string): string {
    const [year, month] = key.split("-")
    return path(`/calendar/${year}/${month}`)
  }

  /**
   * One sitting of one board: the page a calendar entry opens, and where a
   * write-up lives when somebody has made one. `id` is a `Meeting`'s id from
   * `$lib/calendar` -- the board slugged, then the date.
   *
   * A meeting with a hand-written page has a static route directory of that
   * name; every other meeting falls through to `[meeting]`, which lists the
   * city's own files. Same URL either way, which is the point.
   */
  static meeting(id: string): string {
    return path(`/calendar/meetings/${id}`)
  }

  /**
   * One item on a meeting's agenda, written up on a page of its own beneath
   * the meeting. `item` is the page's directory name.
   */
  static meetingItem(id: string, item: string): string {
    return path(`/calendar/meetings/${id}/${item}`)
  }

  /**
   * A project: one undertaking of the city's followed across every sitting
   * that touched it, rather than one sitting's worth of agenda. `slug` is the
   * project's directory name under `projects/`.
   *
   * `entry` is the id of one entry on the project's timeline -- what an agenda
   * item links back with, so the project opens on that item and highlights
   * it. A fragment rather than a query string, because the page is
   * prerendered and a fragment is the one part of a URL a static page can
   * answer to without a script: `:target` does the highlighting.
   */
  static project(slug: string, entry?: string): string {
    return path(`/projects/${slug}`) + (entry ? `#${entry}` : "")
  }

  /** One precinct of an election project -- `id` is MassGIS's `"1-2"`. */
  static precinct(slug: string, id: string): string {
    return path(`/projects/${slug}/precincts/${id}`)
  }

  /**
   * A few pages lifted out of a document's PDF and published beside it, so an
   * item that rests on a letter or a plan can link to just that letter rather
   * than to a 200-page packet the reader then has to search.
   *
   * Committed under `static/excerpts/<meeting id>/`, so this is a path on this
   * site rather than one of the city's -- and it takes the base path, which is
   * why it belongs here rather than being written out in a template.
   *
   * `name` may carry a directory of its own, `<item>/<document>`, for an item
   * whose packet is several separate documents rather than one.
   */
  static excerpt(id: string, name: string): string {
    return path(`/excerpts/${id}/${name}.pdf`)
  }

  /**
   * One fiscal year's budget book, written up here. `id` is a `FiscalYear`'s
   * id from `$lib/budget` -- `fy2027`.
   *
   * Only years somebody has written up have this page; a year that is still
   * just a PDF is linked straight to the city's copy from the header's menu of
   * years, so there is no generated route behind this the way `[meeting]` sits
   * behind a meeting. `/budget` itself is not a page -- the menu is the list.
   */
  static budgetBook(id: string): string {
    return path(`/budget/${id}`)
  }

  /**
   * One section of a budget book -- the unit its own table of contents is
   * built out of. `section` is the page's directory name.
   */
  static budgetSection(id: string, section: string): string {
    return path(`/budget/${id}/${section}`)
  }

  /**
   * One topic of the spending section -- Goals, Capital Planning and the
   * rest, each its own route under `spending/` now rather than a tab a
   * script switched, so one can be linked or bookmarked on its own. `slug` is
   * the topic's directory name; there is no bare `/spending` page at all,
   * since nothing but this method's own callers ever pointed at it.
   */
  static spendingTab(id: string, slug: string): string {
    return path(`/budget/${id}/spending/${slug}`)
  }

  /**
   * One topic of the revenue section -- Revenue Sources, State Aid and the
   * rest, the same split as `spendingTab` for the same reason: each its own
   * route under `revenue/` rather than a tab a script switched, so one can be
   * linked or bookmarked on its own. `slug` is the topic's directory name;
   * there is no bare `/revenue` page, since nothing but this method's own
   * callers ever pointed at it.
   */
  static revenueTab(id: string, slug: string): string {
    return path(`/budget/${id}/revenue/${slug}`)
  }

  /**
   * One capital project's own request -- its case, urgency and dollar
   * figure from pages 36 to 45, on a page of its own beneath Capital
   * Planning rather than run together with the seven category tables above
   * it. `slug` is the item's directory name, derived from the table row's
   * own label rather than the write-up's -- the two occasionally spell a
   * project differently, and the table row is what a reader actually clicks.
   */
  static capitalRequestItem(id: string, slug: string): string {
    return path(`/budget/${id}/spending/capital-planning/${slug}`)
  }

  /**
   * One term in a book's glossary, which is where a defined word in the city's
   * prose leads. The fragment is the term slugged, and the page puts that id on
   * every entry.
   */
  static glossaryTerm(id: string, slug: string): string {
    return path(`/budget/${id}/glossary#${slug}`)
  }

  /**
   * A route on this site as a full URL on the canonical domain, for the few
   * places that need one a reader can carry elsewhere -- the `URL` and body of
   * an "add to calendar" event, say. `base` is deliberately not applied: this
   * is the public address, and the production deploy serves from the domain
   * root (`static/CNAME`), so a base path would only ever be a local build's.
   */
  static absolute(route: `/${string}`): string {
    return `${SITE}${route}`
  }

  /**
   * Google Calendar's "create event" screen, prefilled. Not a route here; it
   * sits with the other outbound URL builders for the same reason `map` does.
   * Times are floating `YYYYMMDDTHHMMSS` with `ctz` naming the zone, or bare
   * `YYYYMMDD/YYYYMMDD` for an all-day sitting.
   */
  static googleCalendar(event: {
    title: string
    start: string
    end: string
    details: string
    location?: string
    allDay: boolean
  }): string {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${event.start}/${event.end}`,
      details: event.details,
    })
    if (event.location) params.set("location", event.location)
    if (!event.allDay) params.set("ctz", TIMEZONE)
    return `https://calendar.google.com/calendar/render?${params}`
  }

  /** Scaffolding from `sv create`, kept because the e2e suite drives it. */
  static demo(): string {
    return path("/demo")
  }

  /** As above. */
  static demoPlaywright(): string {
    return path("/demo/playwright")
  }

  /**
   * The city's own media page for a document. Not a route on this site, but it
   * is where a meeting page sends a document the city published but nobody has
   * transcribed, so it belongs with the other link builders rather than inline
   * in a template.
   *
   * A record's `pageUrl` is a path on the city's main site for everything the
   * listing and the board pages produce, and that is what `CITY` completes. An
   * agenda read off a meeting notice carries the notice's own URL instead --
   * the events calendar is a different host, `events.haverhillma.gov` -- so an
   * absolute one is already finished and is passed through. Prefixing it would
   * build a link to a page that does not exist.
   */
  static cityPage(pageUrl: string): string {
    return /^https?:\/\//.test(pageUrl) ? pageUrl : `${CITY}${pageUrl}`
  }

  /**
   * A page inside a PDF somewhere else -- a budget section's place in the book
   * it was transcribed from.
   *
   * `#page=` is a PDF Open Parameter, honoured by Chrome, Firefox, Safari and
   * Acrobat and ignored by anything that does not understand it, which lands
   * the reader on page one rather than nowhere. Not a route here, and it is in
   * this class for the same reason `cityPage` is: it is a URL, and URLs are
   * spelled in one place.
   */
  static pdfPage(url: string, page: number): string {
    return `${url}#page=${page}`
  }

  /**
   * A place on a map. Also not a route here, and for the same reason as
   * `cityPage`: a document page links out to where its meeting is held, and
   * the spelling of that URL belongs with the rest of them.
   *
   * The `api=1` form is Google's documented, stable one -- the URLs a browser
   * ends up on after searching are not.
   */
  static map(query: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  }

  /**
   * OpenStreetMap's own embeddable widget for one point -- an address named
   * inside an agenda item, rather than the meeting's own location, which
   * `map` above already links out to. The widget takes a bounding box, not an
   * address, so the caller hands it coordinates rather than a query string;
   * `AddressMap.svelte` is where those get looked up once, by hand, and pinned
   * beside the transcription.
   *
   * The box is a fixed ~0.2 km on a side around the point -- tight enough to
   * read as one building or block, the scale an agenda item is usually about,
   * without a caller having to pick a zoom.
   */
  static osmEmbed(lat: number, lon: number): string {
    const delta = 0.0018
    // Floating-point subtraction on typical geocoded coordinates (7ish decimal
    // places) can spill into a trailing .99999... digit; rounding to the same
    // precision keeps the URL as clean as the inputs.
    const round = (n: number) => Math.round(n * 1e7) / 1e7
    const bbox = [
      round(lon - delta),
      round(lat - delta),
      round(lon + delta),
      round(lat + delta),
    ].join(",")
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
  }

  /** The same point on OpenStreetMap's own site, full-size, for `osmEmbed`'s "larger map" link. */
  static osmView(lat: number, lon: number): string {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`
  }

  /**
   * One raster tile of OpenStreetMap's standard map, for the street map under
   * `PrecinctMap`'s shapes. Fetched by the reader's browser, never the build.
   */
  static osmTile(z: number, x: number, y: number): string {
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
  }

  /** OpenStreetMap's copyright page, which its tiles' licence requires a map to link. */
  static osmCopyright(): string {
    return "https://www.openstreetmap.org/copyright"
  }
}

/** Origin of the City of Haverhill's site, where every source document lives. */
const CITY = "https://www.haverhillma.gov"

/** This site's own canonical origin -- the custom domain in `static/CNAME`. */
const SITE = "https://haverhill.alchemicalartisans.com"

/** The city's timezone lives in `calendar.ts`; re-exported here for `ctz`. */
export { TIMEZONE }

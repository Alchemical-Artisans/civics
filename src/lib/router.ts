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

/** Join the base path to a root-relative path, e.g. `/calendar`. */
const path = (route: `/${string}`): string => `${base}${route}`

export class Router {
  /** The landing page. */
  static home(): string {
    return path("/")
  }

  /** The month calendar of agendas and minutes. */
  static calendar(): string {
    return path("/calendar")
  }

  /**
   * A single meeting document, written up by hand. `id` is a record's `docId`
   * from `meetings.json`, and is also the route directory the write-up lives in;
   * documents nobody has written up have no page here and link to the city
   * instead — see `Router.cityPage`.
   */
  static document(id: string): string {
    return path(`/calendar/documents/${id}`)
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
   * is the fallback a calendar entry links to when a record has no `docId`, so
   * it belongs with the other link builders rather than inline in a template.
   */
  static cityPage(pageUrl: string): string {
    return `${CITY}${pageUrl}`
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
}

/** Origin of the City of Haverhill's site, where every source document lives. */
const CITY = "https://www.haverhillma.gov"

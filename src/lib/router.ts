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

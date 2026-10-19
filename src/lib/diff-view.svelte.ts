/**
 * Split or unified, for every diff on the page and every diff the reader
 * opens after it.
 *
 * It was `OrdinanceDiff`'s own state, read from `localStorage` on mount by
 * whichever instance was drawing. That is a reader's preference about how to
 * read a diff rather than anything about one document, so it lives here now:
 * two diffs on one page agree, and the rate schedule can offer the same
 * choice without keeping a second copy of the rule for picking a default.
 *
 * The stored key is the one `OrdinanceDiff` has always written, so a reader
 * who chose unified months ago still gets unified.
 */

export type DiffView = "split" | "unified"

const KEY = "ordinance-diff-view"

class DiffViewPreference {
  /** Split until the browser says otherwise, so the prerendered page is split. */
  current = $state<DiffView>("split")

  /**
   * The reader's own answer, once there is a browser to ask: what they chose
   * before, or else unified on a narrow window, where split halves the width
   * of each side.
   */
  load() {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(KEY)
    } catch {
      // Storage refused (a private window, blocked site data): the default stands.
    }
    if (stored === "split" || stored === "unified") this.current = stored
    else if (window.matchMedia("(max-width: 767px)").matches) this.current = "unified"
  }

  choose(next: DiffView) {
    this.current = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Remembered for this page view only.
    }
  }
}

export const diffView = new DiffViewPreference()

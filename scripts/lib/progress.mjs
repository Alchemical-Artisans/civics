/**
 * A progress bar for the scrapes that take minutes rather than seconds.
 *
 * Most steps here are one request and print one line. `recordings:update` is
 * not: it reads ~64 listing pages one at a time with a pause between, because
 * HC Media rate-limits, and it used to say "reading Haverhill Community
 * Television..." and then nothing at all for seven minutes. A run that prints
 * nothing is indistinguishable from a run that has hung, and the only way to
 * tell was to wait it out.
 *
 * What a person actually wants to know is how much longer, so the bar carries
 * a count, what has been found so far, and an estimate -- paced off this run's
 * own pages rather than a figure written down here, since the wait is the
 * host's and not ours to predict.
 *
 * The drawing is separated from the scrape the same way `cacheAll`'s
 * `onProgress` is: `lib/recordings.mjs` reports what it has read and the script
 * decides what that looks like.
 */

const WIDTH = 24

/**
 * A bar `width` characters wide. A total of null -- which is what a WordPress
 * category's first page gives, the count only being printed from page two on --
 * draws an empty rail rather than a full one or a fake proportion.
 */
export function bar(done, total, width = WIDTH) {
  if (!total) return "░".repeat(width)
  const filled = Math.round((Math.min(done, total) / total) * width)
  return "█".repeat(filled) + "░".repeat(width - filled)
}

/**
 * Seconds as "7m 12s", or "45s" under a minute. Rounded up, so a bar never
 * says 0s while it is still working, and null for an estimate there is no
 * basis for yet.
 */
export function remaining(seconds) {
  if (seconds === null || !Number.isFinite(seconds) || seconds <= 0) return null
  const total = Math.ceil(seconds)
  const minutes = Math.floor(total / 60)
  return minutes ? `${minutes}m ${String(total % 60).padStart(2, "0")}s` : `${total}s`
}

/**
 * Somewhere to draw a line that the next one overwrites.
 *
 * Nothing is animated when stdout is not a terminal -- a run redirected to a
 * file, or read by something other than a person, gets the settled lines and
 * none of the carriage returns. `width` is the longest line written since the
 * last settled one, which is what a shorter line has to be padded to before it
 * can leave the tail of a longer one on screen.
 */
export function progress(out = process.stdout) {
  const live = Boolean(out.isTTY)
  let width = 0
  return {
    live,
    /** Draw a line in place of the last one. */
    update(text) {
      if (!live) return
      out.write(`\r${text.padEnd(width)}`)
      width = Math.max(width, text.length)
    },
    /** Replace it with a line that stays. */
    settle(text) {
      out.write(live ? `\r${text.padEnd(width)}\n` : `${text}\n`)
      width = 0
    },
  }
}

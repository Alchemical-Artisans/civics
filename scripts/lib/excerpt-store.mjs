/**
 * Where the document excerpts live, for the scripts that put them there.
 *
 * The excerpts are the one part of the site that is not in the repository.
 * There are 622 of them and they weigh 483 MB, 63% of a deploy artifact that
 * had reached 767 MB against GitHub Pages' 1 GB ceiling, and publishing them
 * with the site stopped working: the deploy job sat in `syncing_files` for
 * ten minutes and aborted, twice. So they live in a Google Cloud Storage
 * bucket, and the bucket is the only copy -- which is why `infra/main.tf`
 * turns on versioning and refuses to let an apply destroy it.
 *
 * **Three files spell this bucket's name**, because three systems need it in
 * their own language and none of them can read the others at the moment they
 * need it: this one for the scripts, `infra/variables.tf` for the bucket
 * itself, and `EXCERPT_ORIGIN` in `src/lib/router.ts` for the links the build
 * writes into the pages. `src/lib/excerpt-store.spec.ts` fails when they
 * drift, which is the whole reason a reader can trust any one of them.
 */

/** The bucket. Global across Google Cloud, so it cannot be renamed casually. */
export const BUCKET = "haverhill-civics-files"

/**
 * Everything sits under this prefix rather than at the bucket's root.
 *
 * `static/references/` is a second small store of the same kind -- a figure
 * out of a published report, a record the city holds and publishes nowhere --
 * and naming the bucket for files rather than for excerpts leaves it a prefix
 * of its own to arrive under. It is also the shape a subdomain would want:
 * `files.alchemicalartisans.com/excerpts/...` reads as a store with parts.
 */
export const PREFIX = "excerpts"

/** `gs://` URI of the prefix the local `excerpts/` directory mirrors. */
export const BUCKET_URI = `gs://${BUCKET}/${PREFIX}`

/**
 * The public origin, with no trailing slash. Must agree with `EXCERPT_ORIGIN`
 * in `src/lib/router.ts`, which is what the pages are built against.
 */
export const ORIGIN = `https://storage.googleapis.com/${BUCKET}`

/**
 * How long a reader's browser may keep a copy.
 *
 * An excerpt is all but immutable -- it is a fixed range of pages out of a
 * document the city has already published -- which argues for a year and
 * `immutable`. A day instead, because an excerpt does occasionally get
 * re-cut: the transcription procedure requires every one to be rendered and
 * looked at before it is published, and the ones that fail that check are
 * sideways scans re-cut under the same name. A year of `immutable` would
 * leave a reader who had seen the bad copy holding it until 2027.
 */
export const CACHE_CONTROL = "public, max-age=86400"

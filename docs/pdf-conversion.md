# Converting documents to HTML

Every meeting document has a page on this site at `/calendar/documents/<id>`,
with the PDF's text extracted into readable HTML and a link to the original at
the top. This is the point of the project: the city publishes PDFs that are
awkward on a phone, invisible to search, and hard going for a screen reader.

Conversion happens at scrape time, and the HTML is committed, for the same
reasons the scraped data is — see [README.md](./README.md).

## Prerequisite

The scripts shell out to [poppler](https://poppler.freedesktop.org/):

```sh
sudo apt install poppler-utils   # Debian/Ubuntu
brew install poppler             # macOS
```

Both scripts check for `pdftohtml` before doing any work and exit with an
install hint if it is missing. Poppler was chosen over a JavaScript library to
keep the project's dependency-light style — the scraper parses HTML with regexes
for the same reason. The cost is that the output depends on the poppler version:
the committed HTML was produced with **poppler 26.01.0**, and a contributor on a
different version may see diffs in files they did not touch.

## Roughly half the corpus cannot be converted

Most of what the city publishes is scanned paper, not exported documents:

| Outcome       | Documents | What it means                               |
| ------------- | --------: | ------------------------------------------- |
| `converted`   |        85 | Readable text was extracted                 |
| `scanned`     |       186 | Page images, with no usable text layer      |
| `unsupported` |         4 | Published as `.doc`/`.docx` rather than PDF |

Nearly every City Council document is a scan, including agenda packets of 150+
pages at 50–110 MB. `pdftohtml -xml` returns no `<text>` nodes at all for most of
them, which is how the scripts tell a scan from a failure.

Not all of them are that tidy. A scanned drawing can carry a handful of stray
vector glyphs: one 82 MB, 481-page packet converts to 416 characters of
`e ::I JI 11I I I 0 I`. So the test is not whether the conversion is empty but
whether it contains **words** — at least 20% of its characters sitting inside
runs of three or more letters. Every genuine document in the corpus scores 0.46
or better; that packet scores 0.00.

Counting characters per page would be the obvious test and is the wrong one:
several Council agendas are a real text-layer agenda followed by two hundred
pages of scanned attachments, scoring as little as 13 characters per page while
holding a perfectly good agenda worth keeping.

Those documents still get a page. It carries the source link, a note saying
plainly that the city published a scan, and an inline `<object>` PDF viewer so
the document is still readable in place. OCR was considered and rejected: it
would mean a heavyweight new dependency, hours of processing for the large
packets, and unreliable text.

There is **no size cap by default** — every document is fetched, including the
150-page, 100 MB Council packets. `--max-mb=N` opts into one if you want it,
recording anything over the limit as `too-large`. What stops a stalled transfer
hanging a run is a five-minute per-download timeout, which is the thing a
megabyte count was standing in for.

## How the conversion works

`scripts/lib/pdf-html.mjs` takes `pdftohtml -xml` output and returns a body-HTML
fragment. It is a pure function of the XML string, so every heuristic below is
unit-tested without a PDF, a binary, or the network.

Poppler's own HTML mode is not used: it emits absolutely-positioned text at a
fixed page width, which is unreadable on a phone and scrambled for a screen
reader, because it emits content in PDF drawing order — often footer first. The
XML gives the same data as `<text top left width height font>` nodes plus a
`<fontspec>` table, which we rebuild from.

**Runs.** Poppler splits text at every style boundary. A small-caps heading
arrives as `<b>C</b><b>ITY OF </b><b>H</b><b>AVERHILL</b>`, and one hyperlink as
three anchors — the link plus the space either side. Inline markup is decoded
into `{text, bold, italic, href}` runs, neighbours sharing formatting are merged,
and only `<b>`, `<i>` and a scheme-checked `<a href>` survive. Output is built
from that whitelist and escaped on the way out, so the page can use `{@html}`
without a sanitiser: nothing from the PDF reaches the browser as markup.

**Lines.** Nodes are grouped by vertical overlap rather than an equal `top`,
because those small-caps runs are set at different sizes: `top=51 height=50` and
`top=59 height=39` are the same visual line. Within a line, a horizontal gap
wider than 0.12 of the font size becomes a space. That threshold was measured
across the corpus rather than guessed — poppler butts intra-word runs together
with gaps up to 0.07, while genuine word spaces start at 0.17.

**Paragraphs.** Agendas are set with uniform leading, so a vertical gap alone
does not find the breaks. The load-bearing signal is an indent _increase_: a
first-line indent starts a paragraph and its wrapped lines sit further left. A
line ending short of the text column also ends one, where the column is the 90th
percentile of line right edges — a median gets dragged left by an address block.

**Headings.** A line 1.5× the body size, or 1.25×, becomes a heading by rank.
Bold alone is not enough: minutes bold the applicant, trading name and street
address under every agenda item, and promoting all of those buries the real
structure. A bold line must also look like a section head — numbered (`4.1 `) or
mostly capitals. Ranks are then mapped onto consecutive levels starting at `h2`,
so a document whose only headings are bold agenda items does not jump from the
page's `h1` straight to `h4`.

**Running headers and footers** are stripped, or every page of a nineteen-page
set of minutes repeats the department address block. Two signals are required.
Repetition alone is unsafe — `Second: Commissioner Driscoll seconded.` recurs on
most pages and is real content — and a margin band alone is unsafe too, since
letterheads here reach 18% of the way down the page. So: take the lines in each
page's margins, find the longest leading and trailing runs that at least half the
pages agree on, and drop those. Page numbers are neutralised before comparing, so
`Page 1 of 18` matches `Page 2 of 18`, but only on short lines — blanking digits
in a whole sentence would make `Item 1 was taken up` and `Item 2 was taken up`
look identical.

Each page becomes a `<section aria-label="Page N">` so passages stay citable.

## Where it gives up

Tables and multi-column layouts reflow into a single column. Reading order stays
correct, because everything is sorted by position; what is lost is alignment.
That is why the document page keeps the link to the original PDF prominent at the
top rather than tucked into a footer — the city's file is the record.

## Incremental by design

Conversion runs on every `calendar:update` and `calendar:rebuild`, over all
records rather than only newly-scraped ones. That is what makes a page missing
its HTML get picked up on the next refresh even when the listing has not changed.

A document is skipped when its HTML is already on disk — one `stat` per
document, so a run with nothing to do costs nothing. Documents previously found
to be `scanned`, `unsupported` or `too-large` are skipped too, carried forward
from the stored `docStatus`, so a rebuild does not re-convert a scan to learn
what it already knew.

Two statuses are deliberately _not_ carried forward. `failed`, because a network
blip should be retried. And `too-large`, which is not a property of the document
but of the document measured against whatever `--max-mb` the run was given — so
raising the cap takes effect on the next run rather than needing `--recheck`.

`--recheck` overrides both shortcuts and converts every document again. That is
what you want after changing a heuristic in `pdf-html.mjs`.

## The document cache

Every document the city publishes is kept in `.cache/documents/`. The directory
is **gitignored** — only the converted HTML is committed, since these files are
the city's to serve and come to a couple of gigabytes.

**Fetching is deliberately separate from converting, and covers everything.** A
run downloads all 274 documents, not just the ones it can do something with: the
scans, the oversized packets and the four `.docx` files are all pulled down too.
Two reasons. It makes `--recheck` a local operation — re-converting the whole
corpus with a warm cache does no network I/O at all, where otherwise every
iteration on the heuristics would mean re-downloading everything. And it means
any document the run flags for review can actually be opened, which was not true
when the unconvertible ones were skipped before download.

### Two ways in

```
.cache/documents/   canonical copies, named by document id
.cache/by-name/     symlinks, named the way the city names its files
```

The canonical name is the **document id**, because two documents can share a
filename and the id is what the rest of the pipeline uses. The original extension
is kept, so `.docx` entries stay recognisable.

But the id is not what you have in your hand: a run that flags something for
review prints the city's filename. So every cached document is also symlinked
under that filename, and the obvious search works:

```sh
find .cache -name full-agenda-73026.pdf
# .cache/by-name/full-agenda-73026.pdf
```

Filenames are not unique — 18 of them belong to two different documents each.
The first by id keeps the plain name and the rest get ` (2)` appended, so an
exact-name search always finds something:

```sh
ls .cache/by-name/ | grep july-2-2026
# july-2-2026.pdf
# july-2-2026 (2).pdf
```

The index is rebuilt from scratch on every run, so it never accumulates links to
documents the listing has dropped. Links are relative, so the cache directory can
be moved. If the filesystem refuses to create symlinks the run carries on without
the index; the canonical copies are unaffected.

```sh
npm run calendar:update -- --recheck     # reconvert everything, reusing the cache
npm run calendar:update -- --no-cache    # ignore local copies and re-download
rm -rf .cache/documents                  # reclaim the space
```

Deleting the directory is always safe; the next run re-fetches. Use `--no-cache`
if you suspect the city has replaced a file at a URL it had already published —
normally a changed document gets a new URL, and so a new cache entry, but that is
a convention rather than a guarantee.

Downloads are written under a temporary name and renamed into place, so a run
killed mid-transfer cannot leave a truncated file behind for the next one to
trust.

The first full run is the expensive one — the cache settles at roughly 2.2 GB.
The committed HTML is about 1.1 MB.

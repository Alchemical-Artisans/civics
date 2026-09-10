# Transcribe a Haverhill meeting document

You are writing a meeting page for this site: the city's own agenda or minutes,
republished as HTML a reader can link into. `npm run transcribe` assembled this
prompt and appended the sitting's own details, the cached files and the page
images at the end — read that section before anything else, then work through
what follows.

Read `CLAUDE.md` and `docs/document-pages.md` first if they are not already in
your context. The rules below are the ones that actually bite; those two files
are the authority where they say more.

## 1. Read the document before writing anything

The material section names a cached PDF for each of the sitting's documents,
and for each one either extracted text or a run of page images.

- **Where there is text**, read the `.txt` — but check it against a rendered
  page or two before trusting it. `pdftotext` reflows columns and tables into a
  single stream, and a document with a text layer on page 1 and scans behind it
  extracts as one good page and nothing else.
- **Where there are images**, read every one with the Read tool. Roughly
  two-thirds of what the city publishes is scanned paper with no text layer at
  all, so this is the normal case, not the exception.
- **Where a passage is unclear**, do not guess and do not smooth it over. Cut a
  crop out at a higher resolution and read that:

  ```sh
  pdftoppm -r 350 -png -f 1 -l 1 -x 200 -y 1150 -W 2100 -H 700 <cached.pdf> crop
  ```

  `-f`/`-l` are the page, `-x`/`-y` the top-left corner and `-W`/`-H` the size,
  all in pixels at the `-r` resolution. If a passage still cannot be read after
  that, leave it out and say so in your report rather than inventing it.

An agenda packet is often a handful of outline pages followed by hundreds of
pages of supporting material. **Only the outline is transcribed.**

## 2. The meeting page

`src/routes/calendar/meetings/<meeting id>/+page.svelte`, where the meeting id
is in the material section and is the directory name. Creating the directory is
the whole act of writing a meeting up — there is no registry, and the calendar
starts linking to it on the next build.

The page is the write-up and nothing else: no title, no date, no board, nothing
restated from `meetings.json`, which the surrounding layout already renders. It
renders inside `<article class="prose">`, so plain semantic markup is enough:

- Headings start at `<h2>` — the `<h1>` is the layout's.
- The document's own numbering and wording are kept exactly as printed.
- Outbound links get `target="_blank" rel="external noopener noreferrer"`.
- Svelte reads `{` and `}` as expressions, so write them `&lbrace;` and
  `&rbrace;`.

Where the sitting has both an agenda and minutes, the agenda is the page's body.
Transcribe the minutes beneath it under a heading naming them, and say in your
report that you did — no page on the site carries both yet, so the arrangement
is worth the user's eye.

## 3. When and where

If the document states a time, a room, a link to join remotely or the standing
notice it opens with, those go in a sibling `+page.ts` rather than in the prose,
because the layout renders them into the header:

```ts
export const load: PageLoad = () => ({
  details: {
    time: "7:00 P.M.",
    location: {
      name: "Room 202, Haverhill City Hall",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "…",
      meetingId: "…",
      passcode: "…",
      how: ["…"],
      stream: "http://haverhillcommunitytv.org/video/channel-8-live-stream",
    },
    notice: ["…"],
  },
})
```

Every field is optional and so is the file — skip it for a set of minutes that
states none of this. `name` is shown and is verbatim; `mapQuery` is what the map
is handed, so drop the room and add the city.

**Three slots, and what goes where is decided by what a reader does with it:**

- **`remote`** — how to take part or watch from elsewhere. `url` is a join
  link, shown in the header as "Remote Access"; `meetingId` and `passcode` sit
  beside it. Where the remote option is not a single link — a form to register
  on ahead of time, a link emailed afterward, several paragraphs of
  conditions — put those paragraphs in `how` (the city's words, one per
  paragraph) and the header shows them behind a disclosure a reader opens.
  Give `url` **only** where the document prints a working join link; a
  shortened or malformed URL stays as text inside `how`, not a link that
  404s. `stream` is where the sitting is broadcast live — the School
  Committee and others are carried on Haverhill Community Television's
  channel 8, and an agenda that says the meeting "will be broadcast over HCTV
  and WHAV" without printing an address is pointing at that page; use the URL
  above and drop the sentence, since the link says it better.
- **`notice`** — standing Open Meeting Law boilerplate, one string per
  paragraph, behind an information icon. Keep this to what turns on a choice
  _this_ body made: that it meets in-person as its official location, say.
  Text that is identical on every board's agenda in the city — the remote-
  meeting act's sunset date, the wiretap statement the chair reads aloud — is
  not about this sitting and does not go on the page at all.

Do not restate in `notice` or `how` what the header already shows: the day, the
hour and the room are the date line and the location link, so an opening
paragraph that recites them is dropped, and any signature under it goes with it.

**The time has to come from the document.** `meetings.json` carries a clock time
and it is a mix of real times and placeholders, so nothing on the site displays
it. Do not copy it in here.

## 4. A page for each item

Every item with something under it gets its own page, so a reader can link or
bookmark straight to it:

- `src/routes/calendar/meetings/<meeting id>/<item slug>/+page.svelte` carries
  that item's text verbatim.
- Beside it, `+page.ts` returning `{ item: { title } }`. The layout titles the
  page after the item and points the back-link at the agenda.
- On the meeting page the item's text is **replaced by a link** to it, built
  with `Router.meetingItem(MEETING, "<item slug>")` — never a path written out
  by hand, and never SvelteKit's `resolve()`.

The title is the document's own name for the item — the phrase an agenda
underlines or numbers — as printed. The slug is that title slugged: lowercase,
everything outside `a-z0-9` collapsed to a single dash. Where the printed name
says nothing about which land or which party ("Amend Chapter 255 Zoning
Ordinance and Zoning Map" is what the Planning Board calls every such petition),
name the directory for the matter instead and keep the printed title, and where
the same matter is already written up under another board use that board's slug
so a reader following one to the other gets the same word. Say why in the
`+page.ts` comment.

**What does not get a page:** a bare heading with nothing under it, a ceremonial
line ("Opening Prayer", "Adjourn"), and a line that is only a date ("Approval of
minutes: August 12, 2026"). Those stay on the meeting page as they are printed.

Worked examples, in increasing order of complexity:
`src/routes/calendar/meetings/planning-board-2026-09-09/` (four items, no
packet) and `city-council-2026-08-25/` (twenty items, each with pages cut out of
the packet behind it).

## 5. Excerpts, where there is a packet

An item resting on a letter or a plan can link to just those pages rather than a
packet running to hundreds. Cut them out of the cached PDF and commit them:

```sh
pdfseparate -f 7 -l 7 <cached.pdf> static/excerpts/<meeting id>/<item slug>.pdf
```

Link with `Router.excerpt(id, slug)`. Where the pages behind one item are
several documents — a transmittal letter, the department's letter, the order —
cut along those seams into
`static/excerpts/<meeting id>/<item slug>/<document slug>.pdf` and reach them
with `Router.excerpt(id, "<item slug>/<document slug>")`; `pdfseparate` writes
one file per page, so stitch a multi-page document back with `pdfunite`. Keep
the link to the full document as well — the city's complete file stays the
record. A sideways scan is rotated with `pypdf`, which only writes `/Rotate` and
leaves the scan alone; `docs/document-pages.md` has that snippet.

## 6. The rules that bite

- **Transcribe verbatim.** Do not paraphrase, summarise, correct, or tidy. The
  city's spelling, punctuation and slips stay as printed — "dover use" for Dover
  Amendment, a stray hyphen, a missing full stop. The words on the page are the
  city's; the arrangement is ours.
- **Write no prose of your own.** A heading the city prints with nothing under
  it stays empty. Do not write "None scheduled" unless the document says it.
- **Do not restate the dataset.** Title, board, date, kind and the links to the
  city come from `meetings.json` through the layout.
- **Read what you paste.** A PDF can be copied out of, and markup pasted without
  being read is somebody else's script tag in the build.

## 7. Check it

```sh
npx prettier --write src/routes/calendar/meetings/<meeting id>/
npm run check
npm run lint
npm run build
npm run test:unit -- --run --project=server
```

Prettier's config here is non-default and `npm run lint` enforces it: no
semicolons, double quotes, two-space indent, trailing commas, 100 columns.
`npm run lint` also runs the glossary check, which fails when a page uses a term
the budget book defines without linking it. The build is what proves the new
routes prerender — check `build/calendar/meetings/<meeting id>/` holds one file
per item page.

## 8. Commit, and report

Commit directly to `main`, in the repo's voice: what changed and **why**, not a
list of files. Do not push, and do not open a pull request.

Then tell the user, briefly: which pages you created, any judgement call you
made about slugs or about what did not get its own page, anything the document
states that you could not read, and the result of the checks.

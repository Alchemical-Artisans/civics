# Record a continued permit hearing

A permit hearing on an agenda this site has already published has been
continued to a later date. You are being handed one such continuance to write
up. The sitting, the permit, the new date and the document are at the foot of
this prompt.

Work in the repository you are launched in. Read
[CLAUDE.md](../../CLAUDE.md) if you have not; the rules there hold, and the
two that bite hardest here are that **the words on a page are the city's, not
yours**, and that `Router` builds every internal URL.

## Why this exists

The city publishes an agenda, and then a hearing on it is continued. The
Council does not reissue the agenda -- 23 of its 1,362 records back to 2020
are amended agendas, three or four a year, against hearings continued far
more often than that -- so the published agenda goes on saying the hearing
will be heard. The continuance appears on the permit's record in the city's
OpenGov portal and nowhere else, behind a bot challenge no script of ours may
pass, which is why a person looked this up by hand and why you are being told
rather than finding it.

A reader who came for that hearing finds nothing happening. That is the whole
point of the exercise, and it sets the standard of care below.

## The failure to be afraid of

It is **not** symmetric. A reader wrongly told a hearing still stands has
made a wasted trip. A reader wrongly told it has been continued stays home
and misses the hearing they cared about. So:

- **Read the document before you change anything.** Check that it concerns
  this permit, and that the date it states is the date entered by hand. The
  entered date is a person's transcription and may be wrong.
- **Where the document and the entered date disagree, change nothing.** Say
  what the document says, say what was entered, and stop. Do not pick one.
- **Where no document was supplied**, the date is unverified. Record it, and
  say plainly in your report that nothing was read to confirm it.
- The document may be a scan with no text layer. Render it and read it by eye
  rather than guessing from a filename, exactly as a transcription would.

## What to write

Four things, in this order.

### 1. The permit becomes a project, if it is not one already

A continuance is the first hard evidence that a permit spans sittings, and a
matter that spans sittings is a project (§6 of
[transcribe-meeting.md](transcribe-meeting.md)). This is the moment to
register it, because it is the first moment anyone could know: at the permit's
first hearing it might equally have been heard and decided that evening, so
the transcriber is asked the question before there is anything to answer it
with.

Check `PROJECTS` in `src/lib/projects.ts` for a project whose entries already
name this permit's item pages. If there is none, register one:

- `kind: "initiative"`, as §6 specifies for a matter that spans sittings and
  is not an election. Do not invent a new kind.
- An `ItemEntry` for **every** sitting that already has a page for this
  permit, oldest first, each `title` naming the step the permit had reached
  rather than the agenda's name for the item -- which is usually the
  application's own description, the same sentence at every sitting.
- A `DateEntry` for a vote the record states but no page here covers, such as
  the sitting that set the first hearing, with `from` naming the item page
  whose document records it.
- A page at `src/routes/projects/<slug>/`, with a `+page.server.ts` returning
  `{ today: easternDate() }` and a `+page.svelte` quoting what the city
  published and drawing `ProjectTimeline`.
  `projects/marshland-st-special-permit/` is the worked example for a permit;
  `pentucket-north-planned-development-district/` is the same shape for a
  rezoning petition.
- Change each of that permit's agenda lines on the **meeting** pages from
  `Router.meetingItem` to `agendaHref`, so the line opens the project on its
  own step.

### 2. The continuance goes on the project's timeline

Add the step for the sitting the hearing was on, titled for what happened
there -- "Continued at the applicant's request", "Continued to allow the
departments to be answered" -- and name the reason only where the document
states it. Do not infer a reason.

### 3. The item is written onto the sitting it moved to

The hearing is now on a later date, and the site should show it there. Where
that sitting already has a page, add the item to it. Where it does not, write
the placeholder the calendar understands: a directory named with the meeting
id the board and date resolve to, holding an `announced.ts` exporting an
`Announcement` (`src/lib/calendar.ts`) whose `meeting` and `item` are the page
the continuance was read off. The build fails if the directory is not the id
the board and date resolve to, which is the check that the date is real.

### 4. The sitting it came off says so

On the item page for the sitting the hearing was taken off, state the
continuance the way the existing pages state one -- the paired `record.ts`
form, where there is one, carries a `HEARING` timeline with one line per
continuance and the clerk's count under each. Add the line.

**Carry the date it was known.** A reader is being told not to come, on the
strength of a portal somebody checked on a particular day. Write the line so
it says what was known and when, the way the calendar's own "Last updated"
line does, rather than asserting what will happen. If the document states it,
quote the sentence; if nobody read a document, the line may say only that a
continuance was recorded, and on what date.

## Where a file is worth keeping

The continuance document itself can be published the way an excerpt is -- cut
into `excerpts/<meeting id>/` and linked with `Router.excerpt(...)` -- and
then `npm run excerpts:upload` publishes it. Do that **only** where the
document is the city's own: a clerk's notice, a board's vote. An applicant's
or an attorney's letter is somebody else's copyrighted work held in a public
record, and the rule in `Router.reference` holds here: anything under
copyright gets a link, not a copy. The portal's own file links cannot be
linked either, their signatures expiring within the hour, so for such a letter
quote the sentence that states the continuance and attribute it. The record
page is always linkable, and `PermitRecord` is how.

## Finishing

Run `npm run lint`, `npm run check` and
`npm run test:unit -- --run --project=server`, and build if you have touched a
route. Then report, in this order:

1. What the document said, and whether it matched the date entered by hand.
2. The project you registered or added to.
3. The sittings you changed, by page.
4. Anything you did not do, and why -- a date you could not confirm, a file
   you declined to mirror, a sitting you could not find. **Say it plainly
   rather than leaving it implied**; this run exists to stop a reader being
   misinformed, and a quiet omission here is the same failure one step back.

Do not commit. The person who ran this reviews the diff.

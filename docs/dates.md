# Working out when a meeting happened

This is the hardest part of the system, and the part most likely to mislead
readers if it goes wrong. A calendar that puts a meeting on the wrong day is
worse than no calendar.

The logic lives in [`scripts/lib/haverhill.mjs`](../scripts/lib/haverhill.mjs)
and is covered by
[`scripts/lib/haverhill.spec.mjs`](../scripts/lib/haverhill.spec.mjs).

## Why titles cannot be trusted

The obvious approach — read the date off the document title — fails. Across the
current 280 documents, titles use at least five different date formats:

| Shape               | Example                                      |
| ------------------- | -------------------------------------------- |
| ISO                 | `2025-03-06 Conservation Commission Minutes` |
| ISO, unpadded       | `2025-4-1 City Council Agenda`               |
| Month name leading  | `April 2, 2026 License Commission Agenda`    |
| Month name trailing | `City Council Agenda - April 14, 2026`       |
| Dotted US           | `BOA mtg min 10.28.2025`                     |

And roughly 9% of documents have **no date in the title at all** — they are
titled `Agenda and Minutes`, `Agenda and Minutes (2)`, `Agenda and Minutes (15)`,
and so on.

Worse, titles are sometimes simply wrong. `2026-6-27 Board of Assessors Minutes`
is a 2025 document with a typo in the year.

## The authoritative source

Each document has its own "media page" on the city's site, and that page carries
a proper metadata field:

```html
<tr>
  <th scope="row">Meeting Date</th>
  <td>01/06/2026 03:00 PM</td>
</tr>
```

This is the primary source. It costs one HTTP request per document, which is why
[the two scripts exist](./operations.md), but it resolves 265 of 280 records
directly and is right far more often than any title.

## The UTC rollover

The `Meeting Date` field has a systematic bug that must be corrected, or the
calendar shows meetings on the wrong day.

**The city's CMS renders a raw UTC instant with no timezone conversion.** So an
evening meeting entered as 7:00 PM local time appears as:

| Season              | 7:00 PM local is…  | Displayed as        | Date correct?  |
| ------------------- | ------------------ | ------------------- | -------------- |
| EDT (summer, UTC−4) | 23:00 UTC same day | `11:00 PM` same day | yes            |
| EST (winter, UTC−5) | 00:00 UTC next day | `12:00 AM` next day | **no, +1 day** |

Every `12:00 AM` record is therefore one day late. `parseMeetingDate()` rolls
those back a day.

### The evidence for that correction

This is an inference about someone else's data, so it is worth stating why it is
safe:

1. **The city publishes the schedule.** Its own page states City Council meets
   "every Tuesday at 7:00 o'clock P.M."
2. **The midnight records cluster on the wrong weekday.** Of the 20 records
   showing `12:00 AM`, 17 are City Council meetings sitting on a **Wednesday**.
3. **Rolling back fixes exactly that.** All 17 move onto Tuesday. Across the
   whole board, City Council went from 107 Tuesdays / 20 Wednesdays before the
   correction to **124 Tuesdays / 3 Wednesdays** after.
4. **Independent corroboration.** Of the seven midnight records whose PDF
   filename carries its own date, rolling back reconciles five of them.

Records corrected this way are marked `dateAdjusted: true`, and the untouched
original is kept in `rawMeetingDate`, so the inference is always auditable and
reversible.

## Clock times are not displayed

The time component is unreliable beyond the rollover issue. Among City Council
records, `12:00 PM` appears 59 times and `11:00 PM` 48 times, for a body that
meets at 7:00 PM. Conservation Commission times (`07:15 PM`) look plausible;
City Council's do not.

Since some times are real and some are placeholders, and there is no way to tell
which from the data alone, **only dates are shown**. The raw value is kept in the
dataset for anyone who wants to revisit that.

## The fallback chain

When the media page has no `Meeting Date` — a handful of documents genuinely
lack one — resolution falls through:

```
Meeting Date  →  title  →  PDF filename  →  give up (flagged)
```

Current distribution across 280 documents:

| Source     | Count | Field value    |
| ---------- | ----: | -------------- |
| Media page |   265 | `meeting-date` |
| Title      |    13 | `title`        |
| Filename   |     1 | `filename`     |
| None       |     1 | `none`         |

The single unresolved record is `City Council Amended Schedule 2025`, which is a
schedule document rather than a meeting, so having no meeting date is correct.

### Reading dates out of filenames

The last resort parses digit runs in PDF filenames, which are written without
separators: `boa-mtg-min-09092025.pdf`, `mtg-boa-1062026.pdf`,
`citycouncil_72225_minutes.pdf`.

The rule: take the trailing 4 digits as a year (falling back to 2 digits), then
split what remains into month and day.

| Filename fragment | Year | Remainder | Reading          |
| ----------------- | ---- | --------- | ---------------- |
| `09092025`        | 2025 | `0909`    | 09/09            |
| `552026`          | 2026 | `55`      | 5/5              |
| `72225`           | 25   | `722`     | 7/22             |
| `1062026`         | 2026 | `106`     | 1/06 **or** 10/6 |

That last row is genuinely ambiguous, and such records are marked
`ambiguous`. Note that ambiguity is decided by **whether more than one split
produces a valid calendar date**, not by the length of the remainder: `722` can
only be 7/22, because there is no month 72.

## When sources contradict each other

If a filename yields an unambiguous date that disagrees with the published
meeting date, the record is flagged with `dateConflict: true`. Currently 12
records are in this state, and they are genuine upstream contradictions:

```
meeting date 2025-10-23  vs  CityCouncil_9.23.25_minutes
meeting date 2025-05-15  vs  CityCouncil_4.15.25_minutes
meeting date 2025-03-18  vs  February 18, 2025 Administration & Finance Minutes
```

**These are not resolved automatically.** In most of them the filename looks more
credible (9/23/2025 was a Tuesday, when the Council meets), but not always — the
`2026-6-27 Board of Assessors` case has the error in the _title_ instead. Since
neither source wins consistently, and this is 4% of records, the published date
is kept, the record is flagged, and the count is shown in the page footer so
readers know some dates are uncertain.

Deciding these individually is a data-quality task for a human. Because
`calendar:update` never rewrites existing records, manual corrections made
directly in `meetings.json` will survive future refreshes.

## What `needsReview` means

A record is flagged when any of these hold:

- no date could be resolved at all,
- sources contradict each other (`dateConflict`), or
- the date came from an ambiguous filename split.

Currently 13 of 280 records are flagged. Both scripts print them at the end of
every run.

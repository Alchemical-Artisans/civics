/**
 * One meeting as an iCalendar (`.ics`) event.
 *
 * Pure and framework-free so it unit-tests without rendering -- the same reason
 * the date helpers sit in `calendar.ts`. The one caller is
 * `AddToCalendar.svelte`, which hands the string to the browser as a download;
 * the Google Calendar half of that control is built by `Router.googleCalendar`
 * from the same `CalendarEvent`.
 */
import { Router } from "./router"
import type { Meeting, MeetingDetails } from "./calendar"

export interface CalendarEvent {
  /** Stable across regenerations, so re-adding updates rather than duplicates. */
  uid: string
  title: string
  /** `YYYYMMDDTHHMMSS` wall-clock, or `YYYYMMDD` when the event runs all day. */
  start: string
  end: string
  allDay: boolean
  description: string
  location?: string
  url: string
}

const TZID = "America/New_York"

/**
 * The standard America/New_York rules -- the same block Apple and Google write
 * into their own exports. `DTSTART;TZID=` names a zone the file then has to
 * define, and naming it without this makes some parsers fall back to UTC.
 */
const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TZID}`,
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:-0500",
  "TZOFFSETTO:-0400",
  "TZNAME:EDT",
  "DTSTART:19700308T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:-0400",
  "TZOFFSETTO:-0500",
  "TZNAME:EST",
  "DTSTART:19701101T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
]

const pad = (n: number) => String(n).padStart(2, "0")
const compact = (iso: string) => iso.replace(/-/g, "")

/**
 * The meeting date plus `days`, as `YYYYMMDD`. `Date.UTC` so it does not slip a
 * day for a reader west of UTC, the same care `calendar.ts` takes.
 */
function shiftDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + days))
  return `${t.getUTCFullYear()}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}`
}

/**
 * `"7:15 P.M."` / `"7:00 PM"` -> `[19, 15]`. Anything the transcriber wrote
 * that this does not recognise returns `null`, and the caller writes an all-day
 * event rather than guess a time.
 */
export function parseClockTime(time: string | undefined): [number, number] | null {
  const m = time?.match(/^(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?$/i)
  if (!m) return null
  const hour = (Number(m[1]) % 12) + (/p/i.test(m[3]) ? 12 : 0)
  return [hour, Number(m[2])]
}

/** `YYYYMMDDTHHMMSSZ` in UTC, for `DTSTAMP` -- when the file was made. */
export function icsStamp(now: Date): string {
  return (
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
  )
}

/** What both halves of the "add to calendar" control describe. */
export function eventForMeeting(meeting: Meeting, details?: MeetingDetails): CalendarEvent {
  const clock = parseClockTime(details?.time)
  const url = Router.absolute(`/calendar/meetings/${meeting.id}`)

  const description = [
    details?.remote && `Join remotely: ${details.remote.url}`,
    details?.remote?.meetingId && `Meeting ID: ${details.remote.meetingId}`,
    details?.remote?.passcode && `Passcode: ${details.remote.passcode}`,
    `Agenda and documents: ${url}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n")

  const common = {
    uid: `${meeting.id}@haverhill.alchemicalartisans.com`,
    title: `Haverhill ${meeting.board}`,
    location: details?.location?.name,
    description,
    url,
  }

  if (!clock) {
    return {
      ...common,
      allDay: true,
      start: compact(meeting.date),
      end: shiftDate(meeting.date, 1),
    }
  }

  // The agenda gives a start but never a length. Two hours is a typical sitting
  // and short enough that a reader who wants it tighter can trim it without it
  // having blocked out their evening first; it is not a figure from the
  // document, and nothing on the site treats it as one.
  const [h, min] = clock
  const start = `${compact(meeting.date)}T${pad(h)}${pad(min)}00`
  const endHour = h + 2
  const end =
    endHour < 24
      ? `${compact(meeting.date)}T${pad(endHour)}${pad(min)}00`
      : `${shiftDate(meeting.date, 1)}T${pad(endHour - 24)}${pad(min)}00`

  return { ...common, allDay: false, start, end }
}

/** RFC 5545 wants these four escaped in a TEXT value, newlines folded to `\n`. */
const escapeText = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n")

/**
 * Content lines over 75 octets fold onto continuation lines beginning with a
 * space. Everything written here is ASCII, so an octet is a character.
 */
function fold(line: string): string {
  const parts: string[] = []
  let rest = line
  while (rest.length > 75) {
    parts.push(rest.slice(0, 75))
    rest = " " + rest.slice(75)
  }
  parts.push(rest)
  return parts.join("\r\n")
}

export function toIcs(event: CalendarEvent, stamp: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Meetinghouse//Meeting Calendar//EN",
    "CALSCALE:GREGORIAN",
    ...(event.allDay ? [] : VTIMEZONE),
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${stamp}`,
    event.allDay ? `DTSTART;VALUE=DATE:${event.start}` : `DTSTART;TZID=${TZID}:${event.start}`,
    event.allDay ? `DTEND;VALUE=DATE:${event.end}` : `DTEND;TZID=${TZID}:${event.end}`,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    `DESCRIPTION:${escapeText(event.description)}`,
    `URL:${event.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.map(fold).join("\r\n") + "\r\n"
}

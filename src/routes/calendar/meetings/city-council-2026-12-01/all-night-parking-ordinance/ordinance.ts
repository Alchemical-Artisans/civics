import type { Redline } from "$lib/redline"

/**
 * § 240-24, All-night parking, as the Mayor's order of 25 November 2026 would
 * amend it, transcribed from the copy in the packet that marks the change --
 * "November" struck and "December" set in bold in Subsection D -- mark for
 * mark. That is the only mark in the section; everything else is the section
 * as the order of 20 October left it, which already reads "December 15" in
 * Subsections A and B(1).
 *
 * Subsection F's two exemption tables are set down a row to a line with an em
 * dash between the cells, as in the 20 October transcription, so "Marble
 * Street North" does not read as one name.
 *
 * Source: `marked-ordinance.pdf` in
 * `excerpts/city-council-2026-12-01/all-night-parking-ordinance/`.
 */

export const HEADING = {
  chapter: "Chapter 240",
  article: "Article V",
  title: "§ 240-24. All-night parking",
}

export const REDLINE: Redline = [
  { kind: "heading", text: ["§ 240-24. All-night parking."] },
  {
    text: [
      "A. Except as otherwise provided in this section, no person shall allow, permit or suffer any vehicle registered in his name, other than one acting in an emergency, to be parked on any street for a period longer than one hour between the hours of 6:00 p.m. and 6:00 a.m. at any time between December 15 and March 15, or such dates as determined by the Mayor and approved by City Council in conformance with paragraph D below. [Amended 4-13-1993 by Doc. 26-C; 1-30-1996 by Doc. 18-C].",
    ],
  },
  {
    text: [
      "B. It shall be lawful to park any vehicle on alternate sides of all streets in those zoning districts known as RH, RL, RM and RU between the hours specified in Subsection A above as follows, unless otherwise amended by the Mayor and approved by the City Council in conformance with paragraph D below: [Amended 4-20-1981 by Doc. 11-E; 1-30-1996 by Doc. 18-C]",
    ],
  },
  {
    indent: 1,
    text: ["(1) Beginning December 15 at 6:00 p.m., even-numbered side of the street; and"],
  },
  { indent: 1, text: ["(2) Beginning January 1 at 6:00 p.m., odd-numbered side of the street;"] },
  {
    indent: 1,
    text: ["(3) Beginning February 1 at 6:00 p.m., even-numbered side of the street; and"],
  },
  { indent: 1, text: ["(4) Beginning March 1 at 6:00 p.m., odd-numbered side of the street."] },
  {
    text: [
      'C. This section shall not apply to any automobiles bearing a license number plate beginning with "HP" or "V," except during snow removal or snow plowing activity.',
    ],
  },
  {
    text: [
      "D. In any year the Mayor may modify the start and end dates of the all-night parking ban and exceptions under Subsection B, subject to final approval by the City Council. Changes to any dates in Subsection A or Subsection B may not take effect unless they are published on the City website and through the same news and media sources used to declare a snow emergency no less than 7 days prior to ",
      { struck: "November" },
      " ",
      { added: "December" },
      " 15, and unless the first day of the parking ban is no less than 7 days after the date of initial publication.",
    ],
  },
  {
    text: [
      "E. Any citizen or citizens may petition the City Council for an alternate parking plan on their respective streets. Permission may be granted at the discretion of the City Council.",
    ],
  },
  { text: ["F. Exemptions. [Added 1-10-1984 by Doc. 26-S]"] },
  {
    indent: 1,
    text: [
      "(1) The following streets shall be exempt from the above restrictions in Subsection A:",
    ],
  },
  { indent: 2, kind: "term", text: ["Name of Street — Side"] },
  { indent: 2, text: ["Marble Street — North"] },
  {
    indent: 1,
    text: ["(2) The following streets shall be exempt from the above allowances in Subsection B:"],
  },
  { indent: 2, kind: "term", text: ["Name of Street — Side"] },
  { indent: 2, text: ["Marble Street — South"] },
  {
    text: [
      "G. Whenever the Director of Public Works and the Chief of Police determine that a special emergency involving the health and/or safety of the people and/or their property exists within the City of Haverhill as a result of higher-than-normal snowfalls, the schedule may be temporarily altered at the discretion of the Director of Public Works and the Chief of Police. [Added 2-1-2011 by Doc. 23]",
    ],
  },
]

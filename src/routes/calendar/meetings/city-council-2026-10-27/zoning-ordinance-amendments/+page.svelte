<script lang="ts">
  import Diff from "$lib/Diff.svelte"
  import { Router } from "$lib/router"
  import { COLUMNS, REDLINE, TABLE_TEXT, USE_TABLE } from "./ordinance"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "zoning-ordinance-amendments"

  /** The city's own marked-up copy, which the diff below is transcribed from. */
  const MARKED = {
    href: Router.excerpt(MEETING, `${ITEM}/ordinance`),
    external: true,
  }
</script>

<p>
  <strong>Doc. 21-K</strong> &ndash; Planning Director, Jacki Byerley, requests a hearing for the following
  Zoning Amendment &ndash; Amend Chapter 255 Zoning Ordinance and Appendix A Table 1: Table of Use and
  Parking Regulations, or take any other action related to
</p>

<hr />

<h2>Letter from the Planning Director</h2>

<p>
  To: City Council<br />
  From: Jacki Byerley, AICP, Planning Director<br />
  Re: Amend Chapter 255 Zoning Ordinance and Appendix A Table 1: Table of Use and Parking Regulations<br
  />
  Date: September 10, 2026
</p>

<p>
  The Planning Department is submitting the attached proposed amendments to Chapter 255, Zoning, for
  City Council review and consideration. Planning has worked with the Building Commissioner and City
  Solicitor to develop the requested revisions.
</p>

<p>
  The proposed amendments are intended to clarify and update the Zoning Ordinance. The major
  revisions include:
</p>

<ul>
  <li>
    Administrative and Development Review: Updating references throughout the ordinance to the
    Planning Director or designee and clarifying responsibilities.
  </li>
  <li>
    Signs: Clarifying that an establishment may have a maximum of two wall signs, provided they are
    mounted on and face different sides of the building.
  </li>
  <li>
    Parking: Updating minimum parking-space dimensions, allowing a limited number of compact spaces
    and replacing the existing parking diagrams to reflect the 9x18 parking dimension. Along with
    clarifying parking and loading standards for five contiguous spaces and extending the exemption
    of backing into a street to a three-family dwelling.
  </li>
  <li>
    Residential Accessory Storage: Clarifying the requirements and limitations for the exterior
    storage of trailers, unregistered automobiles, campers and boats in residential districts.
  </li>
  <li>
    PDD Rezoning and Application Submissions: Removing fee amounts and applications submission
    requirements from the ordinance to reference the Council&rsquo;s application procedures.
  </li>
  <li>Performance Guarantees: Clarifying acceptable forms of performance guarantees.</li>
  <li>
    Consolidated Permitting: Updating the ordinance to address Consolidated Local Permits and small
    clean energy infrastructure, including the development review and pre-filing municipal meeting
    process.
  </li>
  <li>Special Permits: Extending the special permit lapse period to 36 months from 24 months.</li>
  <li>
    Nonconforming Structures and Uses: Clarifying provisions governing alterations to nonconforming
    structures and increasing the abandonment period for a nonconforming use or structure from two
    years to four years before protected status is lost.
  </li>
  <li>
    Definitions: Adding definitions for &ldquo;Performance Guarantee&rdquo; and &ldquo;Data
    Center.&rdquo;
  </li>
</ul>

<p>Appendix A &ndash; Table of Use and Parking Regulations</p>

<p>
  The proposed amendments also include several changes to Appendix A, Table 1 &ndash; Table of Use
  and Parking Regulations. These revisions are intended to make the table consistent with the
  proposed ordinance changes and clarify where certain uses are permitted.
</p>

<p>Specifically, the table would:</p>

<ul>
  <li>
    Add &ldquo;Data Center&rdquo; as a new use. The proposed table identifies the use as prohibited
    in all zoning districts establishing a clear zoning classification for this use.
  </li>
  <li>
    Revise the regulations for large family day-care homes, changing the current special-permit
    designation to allowed (Y) in the applicable districts.
  </li>
  <li>
    Update the accessory storage provisions in the table to correspond with the proposed revisions
    to Section 3.2.2.2, clarifying the treatment of trailers, unregistered automobiles, and boats as
    accessory storage.
  </li>
  <li>
    Make related corrections and updates to the use table so that the table reflects the terminology
    and requirements contained in the amended ordinance.
  </li>
  <li>Removing the special permit requirement for a three-family in the RU Zoning District.</li>
</ul>

<p>
  The attached ordinance identifies the proposed revisions through strikeout for language to be
  removed and for new language to be bolded and underlined. The proposed Appendix A table is
  included as a separate attachment for ease of review.
</p>

<p>
  If possible, I respectfully request that the City Council schedule these proposed zoning
  amendments for a public hearing on October 27, 2026, to allow for public review and comment.
</p>

<p>Thank you for your consideration,</p>

<p>
  Jacki Byerley<br />
  Planning Director
</p>

<h2>An Ordinance Relating to Zoning</h2>

<p>
  BE IT ORDAINED by the City Council of the City of Haverhill that Chapter 255, Zoning, of the code
  of the City of Haverhill, as amended, being and is hereby further amended as follows (<s
    >strike out</s
  >
  removed and <strong><u>bold and underline</u></strong> new)
</p>

<!-- The chapter as the ordinance would amend it, drawn as a diff: the order's
     eight divisions as paragraphs, then the four rows of Appendix A's use table
     the attached table marks, then the marked text of that table which is not a
     cell. The packet carries the city's own marked-up copy, so the
     strike-through the header opens is that PDF rather than one generated here,
     and the diff's marks are a transcription of its marks rather than a word
     diff -- see `ordinance.ts`. -->

<Diff
  name="An Ordinance Relating to Zoning"
  parts={[
    { kind: "text", redline: REDLINE },
    {
      kind: "table",
      caption: "Appendix A, Table 1: Table of Use and Parking Regulations",
      columns: COLUMNS,
      lines: USE_TABLE,
    },
    { kind: "text", redline: TABLE_TEXT },
  ]}
  strikeThrough={MARKED}
/>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 21-K, with the record of its filing<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/planning-directors-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Jacki Byerley, AICP, Planning Director, September 10, 2026<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={MARKED.href} target="_blank" rel="noopener">
      An Ordinance Relating to Zoning, with the deletions struck through and the additions bolded
      and underlined &ndash; including the five replacement parking diagrams<span class="sr-only">
        , PDF, twelve pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/use-table`)} target="_blank" rel="noopener">
      Appendix A, Table 1: Table of Use and Parking Regulations, as proposed<span class="sr-only">
        , PDF, fifteen pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/hearing-notice`)} target="_blank" rel="noopener">
      Confirmation of the hearing notice placed with the Haverhill Gazette<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/planning-board-recommendation`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Jacki Byerley, Planning Director, October 15, 2026, reporting the Planning
      Board&rsquo;s favorable recommendation of October 14, 2026<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

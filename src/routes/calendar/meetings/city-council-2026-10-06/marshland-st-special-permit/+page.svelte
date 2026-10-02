<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "marshland-st-special-permit"
</script>

<p>
  <strong>Doc 21-J</strong>- <strong>CCSP-26-7</strong> &ndash;Matt Silva for Sterling Commonwealth Builders
  requests approval to demolish existing single-family residence and construct three (3) attached townhouse
  condominium units on a single parcel at 27 Marshland St in the RH (Residential High) Zone. Each unit
  is proposed to contain three (3) bedrooms, 2 and one-half bathrooms, and an attached two-car garage
</p>

<p class="text-right"><strong>Continued from September 15, 2026</strong></p>

<AddressMap address="27 Marshland St, Haverhill, MA" lat={42.7874681} lon={-71.0794599} />

<hr />

<!-- The hearing was opened on 15 September and continued to tonight so the
     applicant could answer the departments; the Planning Director's memo is
     the recommendation the Council is being asked to vote, so it is
     transcribed rather than left inside a scan. The rest of the packet -- the
     application, the thirty-page departmental review record, the plans, the
     narrative -- is linked below. -->

<h2>Memorandum from Jacki Byerley, AICP, Planning Director, September 11, 2026</h2>

<p>Re: CCSP-26-7 &ndash; 27 Marshland Street</p>

<p>
  An application has been received pursuant to the Zoning Ordinance Section 10.4 Special Permits to
  construct a three-unit condominium project at 27 Marshland Street within the RH Zoning District,
  the applicant is Sterling Commonwealth Builders. A three family is allowed by Special Permit in
  the RH zoning district and requires 11,700 square feet of land, 80 feet of frontage and 2 parking
  spaces for 3-bedroom units; the applicant&rsquo;s proposal has 12,919 square feet and 111 feet of
  frontage and 2 spaces per unit for parking.
</p>

<p>
  The applicant has provided a write-up on how the project meets the special permit criteria.
  Departments have also provided comments regarding the proposal.
</p>

<p>
  It is recommended that the City Council approve the requested Special Permit, subject to the
  suggested conditions, standard special permit conditions and recommendations made by the
  departments.
</p>

<p>Suggested conditions:</p>

<!-- The memo numbers its first two conditions "1." and "1." and then runs 2 to
     9 on the page after; the numbering is kept as printed. -->
<ol>
  <li value="1">
    <p>
      The Applicant, property owner, and their successors or assigns (collectively, the "Applicant")
      shall construct the project substantially in accordance with the plans, architectural
      renderings and elevations submitted with the Special Permit application, which are
      incorporated herein by reference. If the Applicant determines that any modification to the
      approved plans is necessary, the Applicant shall submit the proposed modification in writing
      to the Building Commissioner and obtain the required approval prior to implementing the
      modification.
    </p>
    <p>
      The Building Commissioner shall make a determination of whether a proposed modification is
      minor or major. Minor changes may be approved in writing by the Building Commissioner in
      consultation with the Planning Director and Director of Inspectional Services. Any
      modification determined by the Building Commissioner to be major shall require review and
      approval by the City Council following a public hearing.
    </p>
  </li>
  <li value="1">
    Curb Cuts: Any new driveway opening or curb cuts that have egress to the public right of way
    must be approved by the City Engineer or Designee in advance of construction.
  </li>
  <li value="2">
    Fire Department and Utility Compliance: The Applicant shall be responsible for designing the
    utility&rsquo;s to meet City standards and ensuring compliance with the fire codes prior to
    commencing work under this permit.
  </li>
  <li value="3">
    Submission of As Built Foundation Plan: A copy of the as-built foundation plan shall be provided
    to the Building Department upon foundation completion.
  </li>
  <li value="4">
    Site Lighting: All lighting fixtures, including but not limited to, signage, building, parking
    lot, site decorative, and security shall feature cut off fixtures so that the lights are pointed
    downward reducing light pollution and glare onto abutting properties.
  </li>
  <li value="5">
    Hours of Construction: The Applicant shall take reasonable care not to disturb surrounding
    properties and property owners during construction. Construction work shall be limited to the
    hours of 7:00 am to 7:00 pm Monday &ndash; Saturday.
  </li>
  <li value="6">
    Submission of As-Built Site Plans: A copy of the as built site plans stamped by a professional
    engineer shall be submitted to the Office of Planning and Development at the completion of
    construction.
  </li>
  <li value="7">
    Prior to the sale or conveyance of any unit, the applicant shall establish a condominium
    association. The condominium documents shall provide for the ownership, maintenance, repair,
    replacement, and management of all common areas, parking areas, driveways, landscaping,
    utilities, stormwater facilities, and other shared improvements. The condominium documents shall
    also establish an adequate reserve fund for the long-term maintenance and replacement of common
    facilities, to be reviewed by the City Solicitor and departments prior to recording at the
    Registry of Deeds.
  </li>
  <li value="8">
    A landscaping plan shall be reviewed by the Planning Director prior to planting and must be
    planted prior to occupancy or at the next planting season. The association shall maintain the
    landscaping throughout the life of the project, should any of the landscaping die it shall be
    replaced during the next available planting season.
  </li>
  <li value="9">
    A Development Review meeting for review of the plans for compliance with City regulations and
    applicable state laws shall take place prior to start of construction.
  </li>
</ol>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 21-J<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/continuance-email`)} target="_blank" rel="noopener">
      Email from Jonathan Stark-Sachs, Johnson &amp; Borenstein, LLC, September 8, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/continuance-request`)} target="_blank" rel="noopener">
      Letter from Jonathan R. Stark-Sachs, Johnson &amp; Borenstein, LLC, requesting a continuance
      to October 6, 2026<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/neighbourhood-communication`)}
      target="_blank"
      rel="noopener"
    >
      Email from Lori A. Robertson, Administrative Assistant, relaying Mark Dickinson&rsquo;s
      concern about the continuance, September 14, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Special permit application, CCSP-26-7<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/hearing-notice`)} target="_blank" rel="noopener">
      Public hearing notice, August 24, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/notice-confirmation`)} target="_blank" rel="noopener">
      Confirmation of the public hearing notice<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/abutters-list`)} target="_blank" rel="noopener">
      Certified abutters list<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/departmental-reviews`)}
      target="_blank"
      rel="noopener"
    >
      The permit record&rsquo;s departmental reviews, printed September 8, 2026<span
        class="sr-only"
      >
        , PDF, thirty pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/project-summary`)} target="_blank" rel="noopener">
      Project summary &ndash; 27 Marshland St<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/zoning-compliance-statement`)}
      target="_blank"
      rel="noopener"
    >
      Zoning compliance statement<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/project-narrative`)} target="_blank" rel="noopener">
      Special permit project narrative, Sterling Commonwealth Builders, July 8, 2026<span
        class="sr-only"
      >
        , PDF, fourteen pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/plot-plans`)} target="_blank" rel="noopener">
      Proposed and certified plot plans, Medford Engineering &amp; Survey<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/site-plan`)} target="_blank" rel="noopener">
      Conceptual civil site plan, Engineering Solutions Group LLC<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/architectural-plans`)} target="_blank" rel="noopener">
      Marshland Townhouse architectural plans, Melo Design<span class="sr-only">
        , PDF, twelve pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/planning-director-memo`)}
      target="_blank"
      rel="noopener"
    >
      Memorandum from Jacki Byerley, AICP, Planning Director, September 11, 2026<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/special-permit-rules`)}
      target="_blank"
      rel="noopener"
    >
      Document 92-B, the Council&rsquo;s Rules and Regulations for Special Permits, attached for
      reference<span class="sr-only">, PDF, six pages, opens in a new tab</span>
    </a>
  </li>
</ul>

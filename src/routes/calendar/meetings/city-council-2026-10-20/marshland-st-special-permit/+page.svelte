<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "marshland-st-special-permit"
</script>

<p>
  <strong>Doc 21-J</strong>- <strong>CCSP-26-7</strong> &ndash;Matt Silva for Sterling Commonwealth Builders
  requests approval to demolish existing single-family residence and construct three (3) attached townhouse
  condominium units on a single parcel at 27 Marshland St in the RH (Residential High) Zone. Each unit
  is proposed to contain three (3) bedrooms, 2 and one-half bathrooms, and an attached two-car garage
</p>

<p class="text-right">
  <strong>
    Continued from <a href={Router.meeting("city-council-2026-10-06")}>October 6 , 2026</a>
  </strong>
</p>

<AddressMap address="27 Marshland St, Haverhill, MA" lat={42.7874681} lon={-71.0794599} />

<hr />

<!-- The hearing was opened on 15 September and continued twice. What this
     packet adds to the one the Council had on 6 October is the applicant's
     answer to the departments: the attorney's overview of the revisions and
     the civil engineer's point-by-point response, both transcribed below. The
     Planning Director's memo and the rest of the permit record are the same
     documents the 6 October packet carried and are linked rather than set down
     a second time. -->

<h2>Letter from Jonathan R. Stark-Sachs, Johnson &amp; Borenstein, LLC, October 15, 2026</h2>

<p>Re: Overview of Project Revisions &ndash; Special Permit for 27 Marshland Street</p>

<p>Dear President Jordan and members of the Council,</p>

<p>
  I write on behalf of Sterling Commonwealth Builders (the &ldquo;Applicant&rdquo;) regarding the
  pending special permit application to construct a three-family home at 27 Marshland Street (the
  &ldquo;Project&rdquo;) to provide an overview of revisions to Project. Following initial
  submission of the Applicant&rsquo;s special permit materials, comments were received from the
  various city departments regarding the placement of the driveways serving the three separate
  proposed townhomes and compliance with stormwater and landscaping requirements in Section 6.3 of
  the Haverhill Zoning Ordinance (the &ldquo;Ordinance&rdquo;). The Applicant provides the following
  responses and adjustments to Project plans. Lastly, the Applicant sought feedback from neighbors
  regarding the Project in advance of the hearing.
</p>

<p>A. The Applicant will seek a Subsequent Zoning Variance from Driveway Requirements.</p>

<p>
  The Project provides for three separate driveways and two-car garages to serve each proposed
  townhome, supporting up to four parking spaces for residents and guests of each unit. The design
  and provision of ample parking ensures that the Project will not contribute to demand for public
  on-street parking in the neighborhood, which is often a concern of neighbors when additional
  housing units are proposed. This driveway placement is also consistent with the townhome design,
  with differentiated facades for each unit, which was chosen to better fit within the existing
  neighborhood mix of single- and two-family homes.
</p>

<p>
  Should the Council grant the special permit, the Applicant therefore plans to seek a variance from
  the Haverhill Zoning Board of Appeals to allow for greater driveway coverage and closer spacing
  than normally allowed by the Ordinance.
</p>

<p>B. Plan Revisions to Provide for Stormwater Infrastructure and Additional Landscaping.</p>

<p>
  Accompanying this letter are revised civil engineering and landscape plans that the Applicant
  believes address all comments made by relevant city departments regarding compliance with
  standards set forth in Section 6.3 of the Ordinance. Each townhome will be provided with separate
  stormwater management infrastructure, and pavement in both the front and rear has been reduced and
  pitched to provide for managed stormwater runoff, along with other minor changes to utility
  placement. The Applicant&rsquo;s civil engineer has also provided a letter with detailed responses
  to staff comments. The Applicant will plant four street trees along the frontage of the property
  along with additional landscaping, as well as additional tree plantings in the rear yard to
  provide shade and attractive vegetation in association with the Project.
</p>

<p>
  All common infrastructure and landscaping will be required to be maintained by the association
  governing the proposed three-unit condominium.
</p>

<p>C. Neighborhood Outreach.</p>

<p>
  In addition to the required legal notice, the Applicant sent out mailings to property owners in
  the neighborhood detailing the Project plans and providing contact information if there were any
  concerns about the Project. The Applicant also went door-to-door the weekend of October 3-4, 2026,
  and spoke with several neighbors about the Project. Most were overall supportive of the project,
  but concerns about the availability of on-street parking were also communicated. The Applicant
  believes that the ample off-street parking provided, which will not result in any additional
  on-street parking demand, addresses this concern.
</p>

<p>
  The Applicant looks forward to presenting the Project with these revisions at the next Council
  hearing. Thank you for your attention to this matter.
</p>

<h2>Letter from Daniel Dragani, P.E., Engineering Solutions Group, October 13, 2026</h2>

<p>Subject: Response to Request for Additional Information</p>

<p>Project Location: 27 Marshland St, Haverhill MA</p>

<p>Dear Ms. Stokes,</p>

<p>
  This letter is in response to City comments relating to the project referenced above. Please note
  that City comments have been restated below and an explanation of our response has been provided
  in italics.
</p>

<ol>
  <li>
    <p>1/2&quot; Storm Requirements</p>
    <p>
      <em
        >ESG Response: Please see attached plan which shows drainage calculations for the 1/2-inch
        storm.</em
      >
    </p>
  </li>
  <li>
    <p>Driveway Drainage Concerns</p>
    <p>
      <em
        >ESG Response: The proposed driveways are to be crowned draining towards 12&rdquo;x24&rdquo;
        french drains that will run along both edges of the driveway to mitigate storm runoff.</em
      >
    </p>
  </li>
  <li>
    <p>Tree Conflict</p>
    <p>
      <em
        >ESG Response: The proposed utilities have been relocated away from the tree to avoid any
        potential conflicts.</em
      >
    </p>
  </li>
  <li>
    <p>ESGHWT Concern</p>
    <p>
      <em
        >ESG Response: The plan has been revised to now show the test pit data along with additional
        grading. Subsequently, the proposed stormtech systems each have a minimum of 2ft separation
        from ESGHWT to bottom of stone.</em
      >
    </p>
  </li>
  <li>
    <p>Zoning Impervious Coverage</p>
    <p>
      <em
        >ESG Response: Engineering Solutions Group does not perform zoning related work.
        Nonetheless, we have reduced the impervious coverage to alleviate this concern.</em
      >
    </p>
  </li>
  <li>
    <p>Erosion Control Measures</p>
    <p>
      <em
        >ESG Response: The erosion control limits have been added to the plan along with details.
        The additional details and notes will protect the construction area appropriately.</em
      >
    </p>
  </li>
</ol>

<p>Please feel free to reach out should you have any questions or concerns.</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 21-J, with the record of the hearing and its two continuances<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/revisions-letter`)} target="_blank" rel="noopener">
      Letter from Jonathan R. Stark-Sachs, Johnson &amp; Borenstein, LLC, October 15, 2026<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/engineering-response`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Daniel Dragani, P.E., Engineering Solutions Group, October 13, 2026<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/civil-site-plan`)} target="_blank" rel="noopener">
      Revised conceptual civil site plan, Engineering Solutions Group LLC<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/landscape-plans`)} target="_blank" rel="noopener">
      Revised landscape and tree plans, Melo Design<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/presentation`)} target="_blank" rel="noopener">
      27 Marshland Street Special Permit, the applicant&rsquo;s presentation<span class="sr-only">
        , PDF, eleven pages, opens in a new tab</span
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
    <a href={Router.meetingItem("city-council-2026-10-06", ITEM)}>
      The rest of the permit record, as the Council had it on 6 October
    </a>
  </li>
</ul>

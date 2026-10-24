<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "pentucket-north-planned-development-district"
</script>

<p>
  <strong>Doc. 21-G- PDD-26-1;</strong> Attorney Russell Channen for client
  <em>Pentucket North Development, LLC</em> requests to amend Chapter 255 Zoning Ordinance and Zoning
  Map by creating a Special Permit Planned Development District in accordance with Section 8.5 of the
  Zoning Ordinance. Applicant, Pentucket North Development, LLC is requesting a special permit of a planned
  residential development on a portion of land owned by Cedardale, Inc, located off of Boston Road known
  as 931 Boston Road (Map 754 Block 2 Lot 21) to construct six duplex units and two single family units.
  The property is currently zoned Commercial Highway (CH)
</p>

<p class="text-right"><strong>Continued from August 25, 2026</strong></p>

<AddressMap address="931 Boston Road, Haverhill, MA" lat={42.7523473} lon={-71.1043102} />

<hr />

<!-- The Planning Board's recommendation, reported to the Council by the
     Planning Director, and the ordinance the Council is being asked to pass.
     The rest of the packet -- the application, the attorney's impact
     statement, the site development plans and the stormwater report, and the
     two communications from I Street -- is linked at the foot. -->

<h2>Letter from the Planning Director</h2>

<p>
  To: City Council<br />
  From: Jacki Byerley, AICP, Planning Director<br />
  Re: 931 Boston Road &ndash; Special Permit Planned Development District<br />
  Date: October 15, 2026
</p>

<p>
  On October 14, 2026 at a regularly scheduled
  <a href={Router.meeting("planning-board-2026-10-14")}>Planning Board meeting</a> the Board reviewed
  the application submitted by Pentucket North Development for a special permit of a planned residential
  development on a portion of land owned by Cedardale, Inc, located off of Boston Road known as 931 Boston
  Road (Map 754 Block 2 Lot 21) to construct six duplex units and two single family units.
</p>

<p>
  The proposed project consists of six duplex units and two single family units together with
  associated parking, access, utilities, drainage, landscaping, grading, and other site
  improvements. Vehicular access to the proposed development is provided from I Street. During the
  review of the application, the adequacy and condition of I Street as the access roadway serving
  the proposed development were considered by the Planning Board and the appropriate City
  departments.
</p>

<p>
  Based upon the review of the application and comments received during the hearing process,
  improvements to I Street are necessary to provide adequate and safe access to the proposed
  development and to address the impacts associated with the proposed project.
</p>

<p>
  The applicant has proposed improvements to I Street to be reviewed by Engineering and Police prior
  to construction of the improvement. The applicant has also agreed to place additional hydrants
  within the site and will place sprinklers in all the units. They will work with the water
  department on the hydraulic analysis to confirm adequate water supply prior to construction and
  will mill/overlay I Street post construction.
</p>

<p>
  Based on the information presented, the Planning Board voted to recommend that City Council
  approve the project, subject to conditions requiring improvements to I Street; completion of a
  hydraulic analysis; milling and overlaying of I Street post construction; installation of fire
  hydrants within the development, to be approved by the Fire Department; installation of sprinkler
  systems in all units and establishment of a homeowners association with a restriction prohibiting
  rentals of the units.
</p>

<h2>Order</h2>

<p>ORDERED:</p>

<p>
  TO AMEND THE CITY OF HAVERHILL ZONING ORDINANCE CHAPTER 255 BY ADDING THE FOLLOWING: &ldquo;I
  STREET PLANNED RESIDENTIAL DEVELOPMENT DISTRTCT, (ISPRD)&rdquo; AS SET FORTH IN SECTION 8.5.C:
</p>

<p>
  <strong>Item 1.</strong> In Section 2.1.2, add "I Street Planned Residential Development District"
  to the list.<br />
  <strong>Item 2.</strong> Add the following new Section 8.5.C
</p>

<h3>8.5C I STREET PLANNED RESIDENTIAL DEVELOPMENT DISTRICT (ISPRD)</h3>

<p>
  <strong>8.5.C.1 Purpose.</strong> The purpose of the I Street Planned Residential Development District
  ("ISPRD") is as follows:
</p>

<ol>
  <li>To promote a diversity of housing in the City; and</li>
  <li>To promote the reuse of vacant land transforming the same into 14 condominium units.</li>
</ol>

<p>
  <strong>8.5.C. 2 Location.</strong> The ISPRD is a portion of land located on Tax Parcel Map 754, Block
  2, Lot21, containing approximately 55,820 square feet of land.
</p>

<p>
  <strong>8.5.C.3 As of Right Uses.</strong> The following uses are allowed in the ISPRD upon the issuance
  of Development Review approval pursuant to Section 10.1.4:
</p>

<ol>
  <li>Six (6) duplex and Two (2) single family Condominium units.</li>
</ol>

<p>
  <strong>8.5.C.4 Dimensional and Density Regulations.</strong> The following dimensional and density
  regulations shall apply in the ISPRD:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Set Back</th>
      <th scope="col">Proposed PD Lot</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Lot Area</th><td>55,820&rsquo;</td></tr>
    <tr><th scope="row">Lot Area Required Per Dwelling Unit</th><td>3,972&rsquo;</td></tr>
    <tr><th scope="row">Lot Frontage</th><td>207.36&rsquo;</td></tr>
    <tr><th scope="row">Lot Depth</th><td>291&rsquo;</td></tr>
    <tr><th scope="row">Front Setback</th><td>40&rsquo;</td></tr>
    <tr><th scope="row">Side Setback</th><td>15&rsquo;</td></tr>
    <tr><th scope="row">Rear Setback</th><td>15&rsquo;</td></tr>
    <tr><th scope="row">Building Height</th><td>&lt;40&rsquo;</td></tr>
    <tr><th scope="row">Building Height &ndash; Stores</th><td>&lt;3.5&rsquo;</td></tr>
    <tr><th scope="row">Building Coverage</th><td>18.1%</td></tr>
    <tr><th scope="row">Floor Area Ratio</th><td>&lt;0.50&rsquo;</td></tr>
    <tr><th scope="row">Open Space</th><td>51%</td></tr>
  </tbody>
</table>

<p>
  <strong>8.5C.5 Parking and Loading.</strong> The following parking requirements shall apply in the BRPRD.
  Both surface and underground parking areas are permissible.
</p>

<ol>
  <li>
    <strong>Multifamily Dwellings:</strong> 3.0 spaces per dwelling unit; 1 garage and 2 outdoor surface
    spaces.
  </li>
</ol>

<p>
  Parking and loading shall generally comply with the standards set forth in Section 6.1 of this
  Ordinance, unless waived by the City during Development Review.
</p>

<p>
  <strong>8.5.C.6 Roads and Utilities.</strong> The principal roadway(s) and driveways serving the site
  shall be adequate for the intended use and vehicular traffic and shall be maintained privately. The
  connection of all buildings in the ISPRD to the municipal water and sewer systems is required. All water,
  sewer, gas, electricity, cable, and telephone lines shall be installed underground.
</p>

<p>
  <strong>8.5.C.7 Performance Standards.</strong> All development in the ISPRD shall comply with the performance
  standards set forth in the Zoning Code, unless waived during developmental review.
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 21-G, with the record of continuances<span class="sr-only">
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
      Letter from Jacki Byerley, AICP, Planning Director, October 15, 2026, reporting the Planning
      Board&rsquo;s recommendation of October 14, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/proposed-ordinance`)} target="_blank" rel="noopener">
      Order amending Chapter 255 by adding Section 8.5.C, the I Street Planned Residential
      Development District<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Planned Development District application, PDD-26-1<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/applicants-narrative`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Russell S. Channen, Phillips, Gerstein &amp; Channen, LLP, April 28, 2026, the
      applicant&rsquo;s narrative on the special permit<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/hearing-notice`)} target="_blank" rel="noopener">
      Confirmation of the hearing notice placed with the Haverhill Gazette, and the notice as
      published<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/mahoney-communication`)}
      target="_blank"
      rel="noopener"
    >
      Email from Christine Mahoney, 59 I Street Resident &amp; Homeowner, opposing the proposed
      development, October 21, 2026<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/neals-communication`)} target="_blank" rel="noopener">
      Email from Patti Neals, Executor of 37 I Street, opposing the proposed development, October
      22, 2026<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/impact-statement`)} target="_blank" rel="noopener">
      Impact Statement from Russell S. Channen for Pentucket North Builders, LLC, October 22, 2026<span
        class="sr-only"
      >
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

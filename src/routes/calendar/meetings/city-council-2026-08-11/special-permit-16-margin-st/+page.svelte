<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "special-permit-16-margin-st"
</script>

<p>
  <strong>Doc 21-H; CCSP-26-5</strong> &ndash; Francis Bevilacqua of <em>Bevi Builds II</em>
  requests approval to replace existing single-family dwelling and construct a three-family residential
  dwelling at 16 Margin St in the Residential Urban (RU) zoning district
</p>

<AddressMap address="16 Margin St, Haverhill, MA" lat={42.7659842} lon={-71.0947883} />

<h2>Minutes</h2>

<p>
  Councilor Diodati stated I am abstaining from this vote and for the sake of transparency if the
  applicant is approved, I will be marketing the property.
</p>

<p><strong>President Jordan opened the hearing.</strong></p>

<p>
  Francis Bevilacqua addressed the council. He presented the proposed project, which involves the
  removal of a vacant, deteriorating single-family dwelling and construction of new housing with
  three attached units organized as condominiums and sold individually. The applicant stated the
  project is consistent with the Urban Residential zoning district and the City&rsquo;s
  Comprehensive Plan, promotes additional housing, and would improve the property while generating
  additional property tax revenue. The applicant also noted the property is within the Conservation
  Commission&rsquo;s jurisdiction and requested the necessary findings under Section 10.4 of the
  zoning ordinance.
</p>

<p>
  <strong>
    President Jordan asked if anyone would like to speak in favor. No one spoke.<br />
    President Jordan asked if anyone would like to speak in opposition.
  </strong>
</p>

<p>
  Kevin Masys (33 Margin Street) asked about sewer upgrades, noting the age and history of breaks in
  the area. Ginny Dodier (24 Margin Street) asked about the fencing and sewer and water capacity.
  Fran Bevilacqua stated he is only responsible for the sewer connection from the unit to the main
  and was not aware of any issues with the existing sewer system. He stated the project includes a
  stockade fence and agreed to meet with Jenny Dodier to discuss fencing and access.
</p>

<p><strong>President Jordan closed the hearing.</strong></p>

<p><strong>Motion by Councilor Sullivan to approve. Second by Councilor Ferreira.</strong></p>

<p>
  Councilor Rogers asked if the parking out front is double wide? Fran Bevilacqua stated I
  can&rsquo;t do double wide driveway, but the driveway is long enough. The project complies with
  the current zoning regulations of two parking spots but the driveway will be long enough for
  multiple cars.
</p>

<p>
  Vice President Michitson proposed making a motion - the absence of sewer problems a condition.
  Councilor Ferreira clarified that the project would still undergo Development Review. Councilor
  Toohey agreed. Vice President Michitson withdrew his motion.
</p>

<p>President Jordan stated Madam Clerk please call the roll:</p>

<p>
  City Clerk Wright Esposito: Vice President Michitson-yes, Councilor Basiliere-yes, Councilor
  Diodati-not present, Councilor Sullivan-yes, Councilor Ferreira-yes, Councilor Lewandowski-yes,
  Councilor Toohey-yes, Councilor McGonagle-yes, Councilor LePage-yes, Councilor Rogers-yes,
  President Jordan-yes.
</p>

<p>
  Motion by Councilor Sullivan to approve, Second by Councilor Ferreira<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Diodati)<br />
  <strong>President Jordan stated that passes</strong>
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 21-H, with the Council&rsquo;s vote of July 14, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Special permit application, CCSP-26-5<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/legal-advertisement`)} target="_blank" rel="noopener">
      Legal advertisement order confirmation<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/applicants-statement`)}
      target="_blank"
      rel="noopener"
    >
      Applicant&rsquo;s statement and description of the project, Bevilacqua Builds<span
        class="sr-only">, PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/site-plans`)} target="_blank" rel="noopener">
      Site plans<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/rules-and-regulations`)}
      target="_blank"
      rel="noopener"
    >
      City Council Rules and Regulations for Special Permits, Document # 92-B<span class="sr-only"
        >, PDF, six pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/example-application`)} target="_blank" rel="noopener">
      Example application, Haverhill Pavilion, with the Department of Mental Health&rsquo;s letter<span
        class="sr-only">, PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/applicants-narrative`)}
      target="_blank"
      rel="noopener"
    >
      Applicant&rsquo;s narrative, Special Permit Application, 16 Margin Street, June 24, 2026<span
        class="sr-only">, PDF, nine pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/plan`)} target="_blank" rel="noopener">
      Plan<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/public-hearing-notice`)}
      target="_blank"
      rel="noopener"
    >
      Public hearing notice, July 20, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/abutters`)} target="_blank" rel="noopener">
      List of abutters<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/abutters-table`)} target="_blank" rel="noopener">
      Abutters, spreadsheet<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/applicants-narrative-second-copy`)}
      target="_blank"
      rel="noopener"
    >
      Applicant&rsquo;s narrative, second copy<span class="sr-only"
        >, PDF, nine pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/planning-directors-memo`)}
      target="_blank"
      rel="noopener"
    >
      Memo from Jacki Byerley, Planning Director, August 6, 2026<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/workflow-records`)} target="_blank" rel="noopener">
      City department reviews, hearing dates and notices, CCSP-26-5<span class="sr-only"
        >, PDF, 27 pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

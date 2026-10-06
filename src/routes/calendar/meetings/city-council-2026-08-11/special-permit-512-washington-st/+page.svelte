<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "special-permit-512-washington-st"
</script>

<p>
  <strong>Doc 21-F; CCSP-26-6</strong> - Attorney Caitlyn Masys for client
  <em>Essex County Habitat for Humanity</em> requests a special permit to renovate existing property at
  512 Washington St and divide it into three affordable housing units. Applicant seeks to tear down the
  existing dilapidated garage on the property and proposes to build a duplex on either side of the existing
  house, adding an additional four affordable housing units to the property. Once complete, the property
  will have seven residential units that will be converted to condominiums. There will be a provision
  within the condominium documents, as well as restrictions in each of the deeds, stating that every unit
  shall perpetually be defined as affordable housing. Each unit will then be sold to qualified low-income
  home buyers.
</p>

<AddressMap address="512 Washington St, Haverhill, MA" lat={42.767254} lon={-71.0986656} />

<h2>Minutes</h2>

<p>
  Councilor Sullivan stated he is going to recuse himself from this vote. Attorney Masys is a
  colleague at the law office.
</p>

<p><strong>President Jordan opened the hearing.</strong></p>

<p>
  Attorney Caitlin Masys of Downey Law Office addressed the council on behalf of the applicant. She
  stated I am here on behalf of Habitat for Humanity to renovate a home on Washington Street into
  three units and add two duplexes. The entire property will be established as condominium with each
  unit individually sold to income qualified affordable homebuyers. Long-term affordability and
  resale restrictions will be included in the condominium documents. The project has received the
  required variances, addressed safety concerns and will undergo further development review if
  approved.
</p>

<p><strong>President Jordan asked if anyone would like to speak in favor.</strong></p>

<p>
  Andrew Herlihy of the Community Development Department. He noted he supports the project
  affordable homeownership highlighting its focus on affordable homeownership and first-time buyers.
  The city contributed $250,000 in federal HOME funds toward acquisition and may provide additional
  homebuyer assistance.
</p>

<p>
  <strong>
    President Jordan asked if anyone would like to speak in opposition. No one spoke.<br />
    President Jordan closed the hearing.
  </strong>
</p>

<p><strong>Motion by Councilor Diodati to approve. Second by Councilor Ferreira</strong></p>

<p>
  Councilor Diodati and Councilor Basiliere expressed support for the project. Councilor Basiliere
  asked how the units would impact on the City&rsquo;s Chapter 40B requirements and about future
  resale restrictions. Andrew Herlihy stated the units would count toward the City&rsquo;s
  affordable housing numbers, keeping the City safe from penalties. Attorney Masys explained that
  resale restrictions would be based on an income-based formula and codified in the master deed and
  individual unit deeds, with the Planning Department recommending an agency oversee the
  restrictions. Vice President Michitson praised the presentation and the project, and President
  Jordan expressed strong support for the homeownership opportunity and thanked Keith Boucher for
  the project.
</p>

<p>President Jordan stated Madam Clerk please call the roll:</p>

<p>
  City Clerk Wright Esposito: Vice President Michitson-yes, Councilor Basiliere-yes, Councilor
  Diodati-yes, Councilor Sullivan-not present, Councilor Ferreira-yes, Councilor Lewandowski-yes,
  Councilor Toohey-yes, Councilor McGonagle-yes, Councilor LePage-yes, Councilor Rogers-yes,
  President Jordan-yes.
</p>

<p>
  Motion by Councilor Diodati to approve, Second by Councilor Ferreira<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Sullivan)<br />
  <strong>President Jordan stated that passes.</strong>
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 21-F, with the Council&rsquo;s vote of June 30, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Special permit application, CCSP-26-6<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/legal-advertisement`)} target="_blank" rel="noopener">
      Legal advertisement order confirmation<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/letter-of-permission`)}
      target="_blank"
      rel="noopener"
    >
      Letter of Permission, Essex County Habitat for Humanity, June 4, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/project-summary`)} target="_blank" rel="noopener">
      Application for Special Permit, 512 Washington Street, June 4, 2026<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
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
      href={Router.excerpt(MEETING, `${ITEM}/description-of-project`)}
      target="_blank"
      rel="noopener"
    >
      Description of Project, 512 Washington Street<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/zoning-opinion-letter`)}
      target="_blank"
      rel="noopener"
    >
      Zoning Opinion Letter, Downey Law Group, June 5, 2026<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
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
      href={Router.excerpt(MEETING, `${ITEM}/required-information-letter`)}
      target="_blank"
      rel="noopener"
    >
      Special Permit Application, 512 Washington Street, required information, Downey Law Group,
      June 25, 2026<span class="sr-only">, PDF, four pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/notice-of-decision`)} target="_blank" rel="noopener">
      Zoning Board of Appeals notice of decision, with certification<span class="sr-only"
        >, PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/abutters-table`)} target="_blank" rel="noopener">
      Abutters, spreadsheet<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/abutters`)} target="_blank" rel="noopener">
      List of abutters<span class="sr-only">, PDF, three pages, opens in a new tab</span>
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
    <a href={Router.excerpt(MEETING, `${ITEM}/certified-plot-plan`)} target="_blank" rel="noopener">
      Certified Plot Plan, Morin-Cameron Group<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/full-site-elevation`)} target="_blank" rel="noopener">
      Full Site Elevation, PCA<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/rendering`)} target="_blank" rel="noopener">
      Rendering<span class="sr-only">, PDF, one page, opens in a new tab</span>
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
      City department reviews, hearing dates and notices, CCSP-26-6<span class="sr-only"
        >, PDF, 27 pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

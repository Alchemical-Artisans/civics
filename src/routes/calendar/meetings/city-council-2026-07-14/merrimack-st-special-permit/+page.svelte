<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-07-14"
  const ITEM = "merrimack-st-special-permit"
</script>

<p>
  <strong>Doc 21-A - CCSP-26-1</strong>-; Jony Perez of Davinci Mini Apartments, LLC and Davinci
  Child Center, LLC requesting to convert a currently unoccupied building to a daycare program on
  first floor (allowed by right in Zoning Code) and 12 apartments units (six two-bedrooms and six
  one-bedrooms) on the top three floors at
  <a href={Router.meetingItem("planning-board-2026-09-09", "site-plan-review-121-merrimack-street")}
    >121 Merrimack St</a
  > in the Waterfront (WD-C) District
</p>

<p class="text-right"><strong><em>Continued from May 19, 2026</em></strong></p>

<p>
  <em>
    Related communication from Planning Director, Jacki Byerley, stating Planning Board has
    continued their hearing until September 9<sup>th</sup> to allow applicant time to submit a traffic
    study report
  </em>
</p>

<AddressMap address="121 Merrimack St, Haverhill, MA" lat={42.774384} lon={-71.079971} />

<h2>Minutes</h2>

<p>
  President Jordan stated giving that we don&rsquo;t know how that Planning meeting is going to go
  we are looking for a motion to continue it not to a date certain.
</p>

<p>City Clerk Wright-Esposito stated you need some mechanism to bring it back.</p>

<p>
  Motion by Councilor Sullivan to continue to once the Planning Board has made a decision, Second by
  Vice President Michitson<br />
  PASSED TO CONTINUE &ndash; Yeas 9, Nays 0, Absent 2 (Toohey and Diodati)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 21-A, with the record of continuances from February 10, 2026 through May 19, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/planning-director-review`)}
      target="_blank"
      rel="noopener"
    >
      Planning Director Review, CCSP-26-1, July 9, 2026<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Special permit application, CCSP-26-1<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/abutters`)} target="_blank" rel="noopener">
      List of abutters<span class="sr-only">, PDF, three pages, opens in a new tab</span>
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
    <a href={Router.excerpt(MEETING, `${ITEM}/workflow-records`)} target="_blank" rel="noopener">
      City department reviews, hearing dates and notices, CCSP-26-1<span class="sr-only"
        >, PDF, 18 pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/plan-of-land`)} target="_blank" rel="noopener">
      Plan of Land<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/zoning-certificate`)} target="_blank" rel="noopener">
      Zoning Certificate, Zoning Solutions, Inc., May 28, 2025<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/assessor-records`)} target="_blank" rel="noopener">
      Assessor&rsquo;s property records<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/parcel-maps`)} target="_blank" rel="noopener">
      Parcel and zoning maps<span class="sr-only">, PDF, three pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/architectural-plans`)} target="_blank" rel="noopener">
      Architectural, structural and electrical plans, Design Group LLC<span class="sr-only"
        >, PDF, 42 pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/applicants-narrative`)}
      target="_blank"
      rel="noopener"
    >
      Applicant&rsquo;s response to the special permit criteria, January 28, 2026<span
        class="sr-only">, PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/project-summary`)} target="_blank" rel="noopener">
      Project executive summary, 119-125 Merrimack Street<span class="sr-only"
        >, PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/traffic-letter`)} target="_blank" rel="noopener">
      Letter from Jony Perez, February 20, 2026, on drop-off and pick-up operations<span
        class="sr-only">, PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/traffic-reviews`)} target="_blank" rel="noopener">
      Police, DPW, Storm Water, Water/Wastewater and Building Inspector reviews<span class="sr-only"
        >, PDF, ten pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

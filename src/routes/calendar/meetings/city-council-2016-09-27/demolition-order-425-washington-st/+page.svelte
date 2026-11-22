<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2016-09-27"
  const ITEM = "demolition-order-425-washington-st"
</script>

<p>
  <strong>14.2</strong> <u>Document 83;</u> Communication from Building, Inspector Richard Osborne, submitting
  Order to demolish building at 425 Washington st; Assessor&rsquo;s Map 511, Block 278, Lot 8
</p>

<p>
  <strong>14.2.1</strong> <u>Document 83-B</u>; Order to demolish building at 425 Washington st
</p>

<p>
  <em
    ><a href={Router.meeting("city-council-2016-09-13")}>Continued from September 13<sup>th</sup></a
    ></em
  >
</p>

<p>
  <em
    >Related communication from Building Inspector Richard Osborne, reporting that this fire damaged
    building has been property demolished at the expense of the owner and also requests that the
    Council vacate the demolition order</em
  >
</p>

<AddressMap address="425 Washington St, Haverhill, MA" lat={42.7697762} lon={-71.0952832} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/title-search-letter`)} target="_blank" rel="noopener">
      Letter from Richard Osborne, Building Inspector, to the City Solicitor, Re: Title Search,
      October 19, 2015<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/fire-department-survey-2015`)}
      target="_blank"
      rel="noopener"
    >
      Structural survey, Haverhill Fire Department, November 3, 2015<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/structural-survey-2015`)}
      target="_blank"
      rel="noopener"
    >
      Structural survey compiled by David W. Hewey, 11/02/2015<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/timeline`)} target="_blank" rel="noopener">
      Timeline of required tasks for owners, Abelardo and Blanca Nunez (the packet carries its page
      2 alone)<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/structural-survey-email`)}
      target="_blank"
      rel="noopener"
    >
      Email from Richard Osborne, May 18, 2016<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/structural-survey-request`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Richard Osborne, Building Inspector, Re: Structural Survey, May 18, 2016<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/photos`)} target="_blank" rel="noopener">
      Photographs<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/fire-department-survey-2016`)}
      target="_blank"
      rel="noopener"
    >
      Structural survey, Haverhill Fire Department, June 28, 2016<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order-83-b`)} target="_blank" rel="noopener">
      Document 83-B, In Municipal Council July 26 2016<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/property-record-card`)}
      target="_blank"
      rel="noopener"
    >
      Unofficial Property Record Card, 425 Washington St<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/hearing-notice`)} target="_blank" rel="noopener">
      Notice of hearing, Linda L. Koutoulas, City Clerk, September 2 2016<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/continuance-request`)} target="_blank" rel="noopener">
      Memorandum from Richard Osborne, Building Inspector, requesting a continuance, September 9,
      2016<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/demolition-complete`)} target="_blank" rel="noopener">
      Letter from Richard Osborne, Building Inspector, September 23, 2016<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

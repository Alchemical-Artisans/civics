<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "309-east-broadway-loan-order"
</script>

<p>
  <u><strong>Doc 26-D-</strong></u> Mayor Barrett submits a Loan Order for $900,000.00 for the Acquisition
  of Property at 309 East Broadway
</p>

<ul>
  <li>
    <strong>16.3.1.</strong> Order That the City is hereby authorized to acquire, either by purchase or
    eminent domain, the parcel of land located at 309 East Broadway identified as Assessor&rsquo;s Parcel
    ID 469-188-6, for the purpose of providing a new water supply well for City&rsquo;s water supply,
    and to take any other action incidental and related thereto
  </li>
</ul>

<p class="text-right"><strong><em>Filed on May 20, 2026</em></strong></p>

<AddressMap address="309 East Broadway, Haverhill, MA" lat={42.7768269} lon={-71.0271785} />

<h2>Minutes</h2>

<p>
  <strong>President Jordan stated could you pull up 16.3 and read into the record again.</strong>
</p>

<p>Asst. City Clerk Leonard-Flynn read:</p>

<p>
  <strong
    >Mayor Barrett submits a Loan Order for $900,000.00 for the Acquisition of Property at 309 East
    Broadway<br />Order That the City is hereby authorized to acquire, either by purchase or eminent
    domain, the parcel of land located at 309 East Broadway identified as Assessor&rsquo;s Parcel ID
    469-188-6, for the purpose of providing a new water supply well for City&rsquo;s water supply,
    and to take any other action incidental and related thereto</strong
  >
</p>

<p class="text-right"><strong><em>Filed on May 20, 2026</em></strong></p>

<p>MOTION BY COUNCILOR DIODATI, SECOND BY COUNCILOR TOOHEY</p>

<p>
  Asst. City Clerk Leonard-Flynn: Vice President Michitson-yes, Councilor Basiliere-yes, Councilor
  Diodati-yes, Councilor Sullivan-yes, Councilor Lewandowski-yes, Councilor Toohey-yes, Councilor
  McGonagle-yes, Councilor LePage-yes, Councilor Rogers-yes, President Jordan-yes
</p>

<p>PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)</p>

<hr />

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "309-east-broadway-taking")}>
      The evening&rsquo;s discussion, recorded under 5.4, Order of Taking, 309 East Broadway
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/document-26-d`)} target="_blank" rel="noopener">
      Document # 26-D, with the clerk&rsquo;s record of May 19, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, May 14, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/dpw-memo`)} target="_blank" rel="noopener">
      Memo from Robert E. Ward, DPW Director, May 14, 2026<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/loan-order`)} target="_blank" rel="noopener">
      $900,000 Land Acquisition Bonds, the order<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/notice-confirmation`)} target="_blank" rel="noopener">
      The notice placed with the Haverhill Gazette, and its confirmation<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.meeting("city-council-2026-02-10")}>City Council Minutes, February 10, 2026</a>
  </li>
  <li>
    <a href={Router.meeting("city-council-2026-03-10")}>City Council Minutes, March 10, 2026</a>
  </li>
</ul>

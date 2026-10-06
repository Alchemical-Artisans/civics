<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "annual-license-renewals"
</script>

<ul>
  <li>
    <strong>12.7.1. Hawker Peddlers License- Fixed location</strong> &ndash;
    <em>w/Police approval</em>
    <ul>
      <li>
        <strong>12.7.1.1. <u>FIXD-26-10;</u></strong> Kenneth Zibolis for newly proposed location of AmVets
        at 576 Primrose St to sell hot dogs, sausages, burgers, chicken tenders, and fries Monday through
        Sunday 11 AM to 7 PM
      </li>
    </ul>
  </li>
  <li>
    <strong>12.7.2. Coin-Op License <em>Renewals</em></strong> &ndash;
    <em>with Police approval</em>
  </li>
  <li><strong>12.7.3. Christmas Tree Vendor</strong> &ndash; <em>with Police approval</em></li>
  <li><strong>12.7.4. Taxi Driver Licenses:</strong> <em>with Police approval</em></li>
  <li><strong>12.7.5. Taxi/Limousine License</strong> <em>with Police approval</em></li>
  <li><strong>12.7.6. Junk Dealer /Collector License</strong> - <em>with Police approval</em></li>
  <li><strong>12.7.7. Pool/Billiard</strong></li>
  <li><strong>12.7.8. Bowling</strong></li>
  <li><strong>12.7.9. Sunday Bowling</strong></li>
  <li>
    <strong>12.7.10. Buy &amp; Sell Secondhand Articles</strong> <em>with Police approval</em>
  </li>
  <li>
    <strong>12.7.11. Buy &amp; Sell Secondhand Clothing</strong> <em>with Police approval</em>
  </li>
  <li><strong>12.7.12. Pawnbroker license</strong> - <em>with police approval</em></li>
  <li><strong>12.7.13. Fortune Teller</strong> <em>with - Police approval</em></li>
  <li><strong>12.7.14. Buy &amp; Sell Old Gold</strong> &ndash; <em>with Police approval</em></li>
  <li><strong>12.7.15. Roller Skating Rink</strong></li>
  <li><strong>12.7.16. Sunday Skating</strong></li>
  <li><strong>12.7.17. Exterior Vending Machines/Redbox Automated Retail, LLC</strong></li>
  <li>
    <strong>12.7.18. Limousine/Livery License/Chair Cars</strong> <em>with Police approval</em>
  </li>
</ul>

<AddressMap address="576 Primrose St, Haverhill, MA" lat={42.7929613} lon={-71.0882645} />

<h2>Minutes</h2>

<p>
  Kenneth Zibolis addressed the council. He stated I am at Bradford Common right now and that is a
  bad area for a food cart. It is very dangerous on Church Street. He noted the signage and
  apparatus will be in the parking lot and leave every day.
</p>

<p>
  Motion by Councilor McGonagle for approval, Second by Councilor Toohey<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Sullivan)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Fixed location street vendor permit application, FIXD-26-10<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/approvals-and-correspondence`)}
      target="_blank"
      rel="noopener"
    >
      City Clerk, Recreation, Health and Police approvals, and correspondence<span class="sr-only"
        >, PDF, ten pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/bond`)} target="_blank" rel="noopener">
      Travelers license and permit bond and power of attorney<span class="sr-only"
        >, PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/vendor-photograph`)} target="_blank" rel="noopener">
      Photograph of the food cart<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/parking-and-food-service-agreement`)}
      target="_blank"
      rel="noopener"
    >
      Hot Dog Vendor Parking &amp; Food Service Agreement, AmVets Post 147<span class="sr-only"
        >, PDF, six pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

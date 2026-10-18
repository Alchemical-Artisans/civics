<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "creek-brook-cml-fuel-storage"
</script>

<p>
  <strong>SPFL-25-3</strong>; JT Couch for Creek Brook CML requests to store 19,000 gallons of Class
  IIIB edible shortening oil and 5,000 gallons of Class II Diesel Fuel in above ground storage tanks
  at 30 Creek Brook Dr
</p>

<p class="text-right">Hearing continued from December 16, 2025</p>

<p class="text-right">
  <em>Related communication from applicant requesting continuance to February 3, 2026</em>
</p>

<AddressMap address="30 Creek Brook Drive, Haverhill, MA" lat={42.7884618} lon={-71.125403} />

<h2>Minutes</h2>

<p>
  President Jordan opened the hearing.<br />
  President Jordan closed the hearing.
</p>

<p>
  Motion by Vice President Michitson, Second by Councilor LePage<br />
  PASSED TO CONTINUE TO 2/3/26 &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/continuance-request`)} target="_blank" rel="noopener">
      Email from JT Couch, Creek Brook CML, January 9, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/document-97`)} target="_blank" rel="noopener">
      Document # 97, with the Council&rsquo;s votes of September 16, October 28 and November 18,
      2025<span class="sr-only">, PDF, three pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      The record of SPFL-25-3, as filed with the Council<span class="sr-only"
        >, PDF, 53 pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

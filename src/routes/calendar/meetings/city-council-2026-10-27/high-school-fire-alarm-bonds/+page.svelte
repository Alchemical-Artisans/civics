<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "high-school-fire-alarm-bonds"
</script>

<p>
  Mayor Barrett submits an Order to authorize borrowing for the Haverhill High School Fire Alarm
  Project Bonds
</p>

<ul>
  <li>
    <strong>5.3.1</strong> Order- That the City of Haverhill hereby appropriates Eight Hundred Thousand
    Dollars ($800,000), for the purpose of paying costs of the replacement, modernization and equipping
    of the fire alarm system at the Haverhill High School
  </li>
</ul>

<p class="text-right"><strong>FILE 10 DAYS</strong></p>

<hr />

<h2>Order</h2>

<p><strong>$800,000 Haverhill High School Fire Alarm Project Bonds</strong></p>

<p>
  <u>Ordered</u>: That Eight Hundred Thousand Dollars ($800,000) is hereby appropriated for the
  purpose of paying costs of the replacement, modernization and equipping of the fire alarm system
  at the Haverhill High School, including the payment of all costs incidental and related thereto;
  and that to meet this appropriation, the Treasurer, with the approval of the Mayor, is authorized
  to borrow said amount pursuant to Chapter 44, Section 7(1) of the General Laws, or pursuant to any
  other enabling authority, and to issue bonds or notes of the City therefor.
</p>

<p>
  <u>Further Ordered</u>: That the Treasurer is authorized to file an application with the
  appropriate officials of The Commonwealth of Massachusetts (the &ldquo;Commonwealth&rdquo;) to
  qualify under Chapter 44A of the General Laws any and all bonds of the City authorized to be
  borrowed pursuant to this loan order and to provide such information and execute such documents as
  such officials of the Commonwealth may require in connection therewith.
</p>

<AddressMap
  address="Haverhill High School, 137 Monument Street, Haverhill, MA"
  lat={42.7851758}
  lon={-71.1063061}
/>

<h2>Memorandum from the Haverhill Public Schools</h2>

<p>
  TO: Haverhill City Council<br />
  FROM: Clancy Main, Chief Financial Officer, Haverhill Public Schools<br />
  DATE: October 23, 2026<br />
  RE:
  <strong
    >Haverhill High School Fire Alarm System Replacement &ndash; Capital Funding Request</strong
  >
</p>

<p>
  The Haverhill Public Schools is requesting $800,000 in capital funding for the replacement and
  modernization of the fire alarm system at Haverhill High School.
</p>

<p>
  The existing fire alarm system is outdated and has experienced ongoing issues related to aging
  equipment and wiring throughout the building. The main control panel is nearing the end of its
  useful life, making continued repairs an increasingly unsustainable approach.
</p>

<p>
  The proposed project would include a full replacement of the fire alarm system, including the main
  control panel, annunciators, strobes, associated devices, and the necessary rewiring to support
  the upgraded system.
</p>

<p>
  This project is an important investment in the safety of students, staff, and visitors at
  Haverhill High School. Replacing the aging system will improve reliability, reduce the need for
  ongoing repairs, and ensure the building has a modern fire alarm system capable of meeting its
  operational and safety needs.
</p>

<p>
  The total estimated project cost is $800,000, with funding requested through the City&rsquo;s
  FY2027 Capital Budget. Similar fire alarm replacement work has previously been completed at two
  other schools within the district.
</p>

<p>
  We respectfully request the City Council&rsquo;s consideration and support of this capital funding
  request to address this critical infrastructure need at Haverhill High School.
</p>

<p>
  Clancy Main<br />
  Chief Financial Officer<br />
  Haverhill Public Schools
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 23, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/school-cfo-memo`)} target="_blank" rel="noopener">
      Memorandum from Clancy Main, Chief Financial Officer, Haverhill Public Schools, October 23,
      2026<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, $800,000 Haverhill High School Fire Alarm Project Bonds<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/notice-confirmation`)} target="_blank" rel="noopener">
      Confirmation of the notice placed with the Haverhill Gazette for publication on October 29,
      2026<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

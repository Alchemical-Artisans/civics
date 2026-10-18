<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "golden-hill-roof-replacement-bonds"
</script>

<p>
  Mayor Barrett submits an Order to authorize borrowing from the Golden Hill Elementary School Roof
  Replacement Project
</p>

<p class="text-right"><strong>File 10 Days</strong></p>

<!--
  How much, before the eight hundred words that say it once in the middle of a
  clause. The order writes the sum out in words and then in figures, a third of
  the way into a single sentence running the length of the page, and the
  Mayor's letter and the Schools' letter each state it again somewhere in their
  own prose: the one number the Council is being asked to vote is the hardest
  thing on the page to find. The card is the figure and the order's own label
  for it, in the order's own figures -- nothing here is summarised, and the
  clause it comes from is transcribed below like everything else.
-->
<div class="not-prose my-6">
  <div class="inline-flex flex-col gap-1 rounded-lg border border-slate-200 px-5 py-4">
    <span class="text-xs font-medium text-slate-500">Appropriation</span>
    <span class="text-3xl font-bold text-slate-900">$3,564,770</span>
    <span class="text-xs text-slate-500">
      including $300,000 already appropriated January 13, 2026
    </span>
  </div>
</div>

<AddressMap
  address="Golden Hill Elementary School, 140 Boardman Street, Haverhill, MA"
  lat={42.7755343}
  lon={-71.0584354}
/>

<hr />

<!-- The order itself, which is the whole of what the Council is being asked to
     vote. The $300,000 it counts against the appropriation was voted at the
     Council's own sitting of 13 January 2026, which is linked from the words
     naming it. -->

<h2>Golden Hill Elementary School Roof Replacement Bonds</h2>

<p>
  Ordered: That the City of Haverhill hereby appropriates Three Million Five Hundred Sixty-Four
  Thousand Seven Hundred Seventy Dollars ($3,564,770), including Three Hundred Thousand Dollars
  ($300,000) already appropriated for feasibility study and schematic design costs on
  <a href={Router.meeting("city-council-2026-01-13")}>January 13, 2026</a>, to pay costs of the
  design and construction of a roof replacement at Golden Hill Elementary School located at 140
  Boardman Street, Haverhill, Massachusetts, including the payment of all costs incidental or
  related thereto (the &ldquo;Project&rdquo;), which proposed repair project would materially extend
  the useful life of the school and preserve assets that otherwise are capable of supporting the
  required educational programs, and for which the City may be eligible for a grant from the
  Massachusetts School Building Authority (the &ldquo;MSBA&rdquo;), said amount to be expended under
  the direction of the City of Haverhill Building Committee; that to meet this appropriation, the
  City Treasurer, on behalf of the Haverhill School Building Commission and with the approval of the
  Mayor, is authorized to borrow said amount pursuant to Chapter 44 or Chapter 70B of the General
  Laws, or pursuant to any other enabling authority, and to issue bonds or notes of the City
  therefor; that the City acknowledges that the MSBA&rsquo;s grant program is a non-entitlement,
  discretionary program based on need, as determined by the MSBA, and any project costs the City
  incurs in excess of any grant that may be approved by and received from the MSBA shall be the sole
  responsibility of the City; that any grant that the City may receive from the MSBA for the Project
  shall not exceed the lesser of (1) seventy-seven and forty-seven one hundredths percent (77.47%)
  of eligible, approved project costs, as determined by the MSBA, or (2) the total maximum grant
  amount determined by the MSBA; and that the amount of the borrowing authorized pursuant to this
  loan order shall be reduced by any grant amount set forth in and received by the City pursuant to
  the Project Funding Agreement that may be executed between the City and the MSBA for the Project.
</p>

<p>
  <strong>Further Ordered:</strong> That the Treasurer is authorized to file an application with the appropriate
  officials of The Commonwealth of Massachusetts (the &ldquo;Commonwealth&rdquo;) to qualify under Chapter
  44A of the General Laws any and all bonds of the City authorized to be borrowed pursuant to this loan
  order, and to provide such information and execute such documents as such officials of the Commonwealth
  may require in connection therewith.
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 15, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/schools-letter`)} target="_blank" rel="noopener">
      Letter from Clancy Main, Chief Financial Officer, Haverhill Public Schools, October 15, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      The order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/notice-confirmation`)} target="_blank" rel="noopener">
      Confirmation of the notice placed with the Haverhill Gazette<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/gazette-notice`)} target="_blank" rel="noopener">
      The notice as placed<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

<hr />

<h2>
  Letter from Clancy Main, Chief Financial Officer, Haverhill Public Schools, October 15, 2026
</h2>

<p>RE: Golden Hill School Roof Replacement &ndash; MSBA Accelerated Repair Program</p>

<p>
  The Haverhill Public Schools is currently working through the Massachusetts School Building
  Authority (MSBA) Accelerated Repair Program for the replacement of the roof at Golden Hill School.
</p>

<p>
  The existing roof has exceeded its useful life and has experienced ongoing leaks and water
  infiltration. The roof replacement is necessary to address these conditions, protect the building,
  and prevent further deterioration.
</p>

<p>
  The project is currently in the schematic design phase. The estimated total cost of the roof
  replacement is $3,564,770, prior to reimbursement from the MSBA. The City is eligible for an
  anticipated reimbursement rate of 77.47%, which would result in a projected local contribution of
  approximately <strong>$803,000</strong>, subject to final eligible project costs and MSBA
  approval.
</p>

<p>
  Previously, $300,000 was authorized for the schematic design phase of the project. These eligible
  design costs are also subject to reimbursement at the same MSBA rate.
</p>

<p>
  Upon completion of schematic design, the final project budget will be established and submitted
  through the MSBA approval process. The project will then move toward the necessary local funding
  authorization and subsequent construction phases.
</p>

<p>
  Participation in the MSBA Accelerated Repair Program provides the City with an opportunity to
  address a significant capital maintenance need while substantially reducing the financial impact
  on local taxpayers through state reimbursement.
</p>

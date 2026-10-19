<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "road-opening-winter-st-at-hale-st"
</script>

<p>
  <strong>EROM-26-23-</strong> Lisa DeMeo, <em>City Engineer</em>, requests to open the roadway to
  allow for a gas valve to be raised, at the intersection of Winter St and Hale St; which requires
  National Grid to excavate in the right of way
</p>

<ul>
  <li><strong>8.2.1</strong> Order- Approve request to excavate at Winter and Hale St</li>
</ul>

<!--
  Where the street is to be opened. A road opening names a place and nothing
  else -- there is no applicant's plan, no plot, no house number -- so the one
  thing a reader wants to know about it is which corner of the city the gas
  valve is under, and "Winter St at Hale St" answers that only for somebody
  who already knows both streets.

  The point is the junction itself, not an approximation of it: both streets
  are ways in OpenStreetMap and they share exactly one node, which is the
  intersection the memo and the order name. That is what §"Mapping an address"
  asks for -- the place, never the street it sits on -- reached by the one
  lookup an intersection admits, since geocoding "Winter Street & Hale Street"
  returns nothing at all.
-->
<AddressMap
  address="Intersection of Winter Street &amp; Hale Street, Haverhill, MA"
  lat={42.777626}
  lon={-71.086819}
/>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, City Engineer, October 8, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      The order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

<hr />

<h2>Memo from Lisa E. DeMeo, City Engineer, October 8, 2026</h2>

<p>SUBJECT: ROAD OPENING, WINTER ST AT HALE ST, EROM-26-23</p>

<p>
  As the subject street was paved within the last 5 years, Council approval is required to open the
  roadway to allow for a gas valve to be raised, at the intersection of Winter St and Hale St; which
  requires National Grid to excavate in the right of way. I am supportive of this request, and The
  Engineering Office will require proper repaving from curb to curb and the limits of which will be
  established by city staff in the field.
</p>

<p>Please contact me if you have any questions.</p>

<h2>The order</h2>

<p>
  That the City Council approve the request to excavate within the Winter Street right of way at the
  following location to raise the valve in the street at: intersection of Winter Street &amp; Hale
  Street
</p>

<p>
  The roadway has been paved in the last 5 years and in accordance with Chapter 222, Section 11,
  Restrictions on future paving of the Municipal Ordinances, Council approval is necessary.
</p>

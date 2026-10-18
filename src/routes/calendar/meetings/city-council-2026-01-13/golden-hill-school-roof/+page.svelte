<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "golden-hill-school-roof"
</script>

<p>
  Mayor Barrett submits an order to appropriate funds for costs related to a feasibility study and
  schematic design regarding a potential Accelerated Repair Project for a new roof at Golden Hill
  School
</p>

<ul>
  <li>
    <strong>5.3.1</strong> Order- That the City of Haverhill appropriates the amount of $300,000 for the
    purpose of paying feasibility study and schematic design costs related to potential Accelerated Repair
    Project involving a new roof at Golden Hill School located at 140 Boardman Street.
  </li>
</ul>

<AddressMap address="140 Boardman Street, Haverhill, MA" lat={42.7737291} lon={-71.0599477} />

<h2>Minutes</h2>

<p>
  Mayor Barrett addressed the council. She noted $300,000 comes from free cash for this project.
  This is a key step in the process, and we will be reimbursed by MSBA approximately 77% of the cost
  of the roof. Councilor Rogers questioned whether this roof leaks right now. Mayor Barrett stated I
  believe it does. Councilor Rogers stated we are paying $300,000 for a schematic design. Mayor
  Barrett stated I do not make the rules. Councilor Rogers noted she struggles with paying that
  money for design.
</p>

<p>
  Motion by Vice President Michitson, Second by Councilor Sullivan<br />
  PASSED &ndash; Yeas 9, Nays 1, (Rogers), Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, January 9, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, in Municipal Council<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

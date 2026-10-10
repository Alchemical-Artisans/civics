<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"
</script>

<p>
  <strong>Amend Chapter 255 Zoning Ordinance and Zoning Map</strong> by creating a Special Permit Planned
  Development District in accordance with Section 8.5 of the Zoning Ordinance. Applicant, Pentucket North
  Development LLC, is requesting a special permit for a planned residential development on a portion of
  land owned by Cedardale, Inc, located off Boston Road known as 931 Boston Road (Map 754 Block 2 Lot
  21) to construct six duplex units and two single family units. The property is currently zoned Commercial
  Highway (CH).
</p>

<AddressMap address="931 Boston Road, Haverhill, MA" lat={42.7523473} lon={-71.1043102} />

<hr />

<ul>
  <li>
    <a href={Router.meeting("planning-board-2026-07-08")}>
      City of Haverhill Planning Board Minutes, July 8, 2026
    </a>
  </li>
  <li>
    <a
      href={Router.meetingItem(
        "planning-board-2026-09-09",
        "pentucket-north-planned-development-district",
      )}
    >
      The same matter on the Planning Board&rsquo;s agenda of September 9, 2026
    </a>
  </li>
  <li>
    <a
      href={Router.meetingItem(
        "city-council-2026-08-25",
        "pentucket-north-planned-development-district",
      )}
    >
      The same matter on the City Council&rsquo;s agenda of August 25, 2026
    </a>
  </li>
</ul>

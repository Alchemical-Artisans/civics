<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import PermitRecord from "$lib/PermitRecord.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-30"
  const ITEM = "special-permit-512-washington-st"
</script>

<p>
  <strong><PermitRecord number="CCSP-26-6" />;</strong> Attorney Caitlyn Masys for client
  <em>Essex County Habitat for Humanity</em> requests a special permit to renovate existing property at
  512 Washington St and divide it into three affordable housing units. Applicant seeks to tear down the
  existing dilapidated garage on the property and proposes to build a duplex on either side of the existing
  house, adding an additional four affordable housing units to the property. Once complete, the property
  will have seven residential units that will be converted to condominiums. There will be a provision
  within the condominium documents, as well as restrictions in each of the deeds, stating that every unit
  shall perpetually be defined as affordable housing. Each unit will then be sold to qualified low-income
  home buyers.
</p>

<p class="text-right"><strong><em>Hearing for August 11, 2026</em></strong></p>

<AddressMap address="512 Washington St, Haverhill, MA" lat={42.767254} lon={-71.0986656} />

<h2>Minutes</h2>

<p>
  MOTION BY COUNCILOR MCGONAGLE, SECOND BY COUNCILOR ROGERS<br />
  PASSED YEAS 11, NAYS 0, ABSENT 0
</p>

<hr />

<ul>
  <li>
    <a href={Router.meetingItem("city-council-2026-08-11", ITEM)}
      >Special Permit, 512 Washington St, City Council, August 11, 2026</a
    >
  </li>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      City Council Special Permit application, CCSP-26-6<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

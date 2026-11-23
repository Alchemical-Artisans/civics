<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import PermitRecord from "$lib/PermitRecord.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-30"
  const ITEM = "major-modification-39-railroad-ave"
</script>

<p>
  <strong>Doc 21-E - <PermitRecord number="SPMM-26-1" /></strong> &ndash; Attorney Michael Migliori
  for client, <em>Beck Residential LLC</em>, requests a major modification to Special Permit <PermitRecord
    number="CCSP-21-7"
  /> to change the current use of approximately 6,500 square foot retail space to include retail, office,
  and restaurant space at 39 Railroad Ave
</p>

<AddressMap address="39 Railroad Ave, Haverhill, MA" lat={42.7677284} lon={-71.0880827} />

<h2>Minutes</h2>

<p><strong>President Jordan opened the hearing.</strong></p>

<p>
  Attorney Michael Migliori addressed the council on behalf of the applicant. He noted we are here
  tonight requesting a major modification to an existing special permit to allow office use within
  previously approved retail space, after difficulty securing restaurant or café tenants. He
  explained the project would not affect the design or other approved elements and would help reduce
  vacancy. He noted City Departments and the Planning Director supported the request following
  review.
</p>

<p>Councilor Basiliere and President Jordan stated they support this modification.</p>

<p>
  <strong
    >President Jordan asked if anyone would like to speak in favor. No one spoke.<br />
    President Jordan asked if anyone would like to speak in opposition. No one spoke.<br />
    President Jordan closed the hearing.</strong
  >
</p>

<p>MOTION BY COUNCILOR TOOHEY FOR PASSAGE, SECOND BY COUNCILOR ROGERS</p>

<p>President Jordan stated City Clerk please call the roll.</p>

<p>
  City Clerk Wright-Esposito: Vice President Michitson-yes, Councilor Basiliere-yes, Councilor
  Diodati-yes, Councilor Sullivan-yes, Councilor Ferreira-yes, Councilor Lewandowski-yes, Councilor
  Toohey-yes, Councilor McGonagle-yes Councilor LePage-yes, Councilor Rogers-yes, President
  Jordan-yes
</p>

<p>PASSED YEAS 11, NAYS 0, ABSENT 0</p>

<p><strong>President Jordan stated that passes.</strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Document # 21-E, the application, the permit&rsquo;s record, the applicant&rsquo;s letters and
      the Planning Director&rsquo;s letter<span class="sr-only"
        >, PDF, forty-six pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

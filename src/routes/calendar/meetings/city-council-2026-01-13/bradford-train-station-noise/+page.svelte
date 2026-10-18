<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "bradford-train-station-noise"
</script>

<p>
  Mike Morales and Paul Bellos wish to address the City Council regarding the ongoing noise issues
  related to the Bradford Train Station
</p>

<AddressMap
  address="Bradford Station, 10 Railroad Avenue, Haverhill, MA"
  lat={42.7668803}
  lon={-71.0883223}
/>

<h2>Minutes</h2>

<p>
  Paul Bellos (84 Laurel Ave.) and Mike Morales (37 Coachman Ln.) reported severe train noise and
  vibration near Bradford Station and the Beck/MBTA building, stating that since summer 2024
  construction completion, noise has been amplified to 90 dB indoors and over 100 dB outdoors,
  causing health impacts and hearing loss. Mike Morales urged a noise study and mitigation measures.
  Councilor Tom Sullivan noted the issue has persisted for 40+ years, cited progress toward
  relocating the MBTA layover site, and proposed state outreach and a site visit. Councilors
  Diodati, Lewandowski and Michitson discussed ongoing issues and requested a legal review, with
  mayoral support, on whether Beck&rsquo;s noise constitutes a major permit modification.
</p>

<p>
  Motion by Councilor Sullivan to send a letter to the Governor, Lieutenant Governor and Legislative
  Delegation, Department of Transportation, MBTA making them aware of two issues 1. the status of
  the moving of the Bradford layover station to the area over at Hilldale Avenue 2. to encompass
  everything else that was said here tonight in terms of studies that need to be done to determine
  whether or not there has been additional impact to the neighborhood as a result of the Beck
  development. Also, a letter to Percopio asking him through the Mayor&rsquo;s office and the City
  Solicitor if they would all get together to try to figure out if there is anything can be done
  about those issues that may have been caused by the Beck development, Second by Vice President
  Michitson<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/morales`)} target="_blank" rel="noopener">
      Email from Mike Morales<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/bellos`)} target="_blank" rel="noopener">
      Email from Paul Bellos<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

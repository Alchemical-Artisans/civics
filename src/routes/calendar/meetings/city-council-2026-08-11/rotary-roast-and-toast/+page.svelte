<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "rotary-roast-and-toast"
</script>

<p>
  President Jordan wishes to introduce Tracy Fuller of the Haverhill Rotary Club to announce their
  upcoming Roast &amp; Toast of Peter Carbone to be held at the
  <em>Bradford Country Club</em> on Thursday, September 10th at 5:30 pm
</p>

<AddressMap
  address="Bradford Country Club, 201 Chadwick Rd, Haverhill, MA"
  lat={42.7510945}
  lon={-71.0657033}
/>

<h2>Minutes</h2>

<p>
  *moved to beginning of meeting*<br />
  Tracy Fuller addressed the council. She stated I am here announcing the annual fundraiser on September
  12<sup>th</sup> at the Bradford Country Club. The event supports 40 Haverhill nonprofits and will be
  honoring community leader Peter Carbone. She also noted there are two other events coming up Veterans
  Honors and Flag display and Bocce Tournament. She noted you can buy tickets on the Haverhill Rotary
  website.
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/letter`)} target="_blank" rel="noopener">
      Letter from President Timothy J. Jordan, August 6, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

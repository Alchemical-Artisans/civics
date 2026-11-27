<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const AGENDA =
    "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/vuxlv1m5/full-agenda-6226.pdf"
</script>

<h2>12.2.1.</h2>

<p>
  <u><strong>EVNT-26-15 &ndash;</strong></u> Kevin Burke for <em>Team Haverhill</em> requesting to
  hold
  <em>Thursday Nights Live!</em> Summer Concert Series from 6:00 to 8:00 PM on Thursdays from July
  9th to August 13th with rain dates of August 20th and August 27th <em>at the Bradford Common</em> at
  10 Church St and requests any additional fees be waived
</p>

<AddressMap address="Bradford Common, Haverhill, MA" lat={42.7673688} lon={-71.0761317} />

<h3>Minutes</h3>

<p>
  MOTION BY COUNCILOR BASILIERE, SECOND BY COUNCILOR ROGERS<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<h2>12.2.2.</h2>

<p>
  <u><strong>EVNT-26-18</strong></u>- Cynthia Graham for <em>Haverhill Firefighter Museum</em>
  requesting to hold a Fundraiser and Music Bingo from 6:00 to 10:00 PM on Saturday June 6<sup
    >th</sup
  > at 75 Kenoza Ave
</p>

<AddressMap address="75 Kenoza Ave, Haverhill, MA" lat={42.7823808} lon={-71.0743386} />

<h3>Minutes</h3>

<p>
  MOTION BY COUNCILOR ROGERS, SECOND BY COUNCILOR LEPAGE<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<hr />

<ul>
  <li>
    <a href={Router.pdfPage(AGENDA, 269)} target="_blank" rel="external noopener noreferrer">
      Thursday Nights Live!: the event application, the departments&rsquo; approvals, Team
      Haverhill&rsquo;s letters, the First Church of Christ&rsquo;s permission and the certificate
      of insurance<span class="sr-only"
        >, page 269 of the agenda, PDF, 15 pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.pdfPage(AGENDA, 284)} target="_blank" rel="external noopener noreferrer">
      Fundraiser and Music Bingo: the event application, the departments&rsquo; approvals and the
      museum&rsquo;s letters<span class="sr-only"
        >, page 284 of the agenda, PDF, 17 pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

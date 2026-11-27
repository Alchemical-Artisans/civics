<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import PermitRecord from "$lib/PermitRecord.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "mariams-cottage-special-permit"
  const AGENDA =
    "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/vuxlv1m5/full-agenda-6226.pdf"
</script>

<p>
  <u><strong>Doc 21-D</strong></u> - <PermitRecord number="CCSP-26-3" /> - Attorney Jonathan Stark-Sachs
  for Maryam Salehi-Ala-Yamin requests approval to operate &ldquo;Mariam&rsquo;s Cottage&rdquo; a family
  run bed and breakfast at 421 East Broadway allowed with a special permit in the RR (Rural Residential)
  zoning district and seeks to host small-scale weddings and similar outdoor events of up to 50 guests
  packaged with overnight stays
</p>

<p>
  <strong
    ><em
      >Related communications from applicant requesting to continue the hearing until <a
        href={Router.meetingItem("city-council-2026-06-30", ITEM)}>June 30<sup>th</sup></a
      ></em
    ></strong
  >
</p>

<AddressMap address="421 East Broadway, Haverhill, MA" lat={42.783045} lon={-71.024913} />

<h2>Minutes</h2>

<p><strong><em>*moved after 5.5 in the meeting*</em></strong></p>

<p>
  MOTION BY COUNCILOR BASILIERE, SECOND BY COUNCILOR TOOHEY<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<p>
  Attorney Russell Channen addressed the council on behalf of his clients (Judith Biewener and Tim
  Sturgeon) He noted the request for continuance was due to a councilor not being present tonight.
  He raised concerns about vacation schedules and who knows if there is going to be a full council
  attendance on June 30<sup>th</sup>. President Jordan stated it is our protocol it is what we have
  done since I have been a councilor is give the option if there is not going to be full attendance
  that they may request a continuance. My understanding is that June 30<sup>th</sup> should be full council
  as of right now.
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/document-21-d`)} target="_blank" rel="noopener">
      Document # 21-D, with the clerk&rsquo;s record of April 14, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/continuance-request`)} target="_blank" rel="noopener">
      Letter from Jonathan Stark-Sachs, Johnson &amp; Borenstein, LLC, May 27, 2026, requesting to
      continue the hearing<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.pdfPage(AGENDA, 190)} target="_blank" rel="external noopener noreferrer">
      The application, its narrative and plans, correspondence and petitions, and the
      departments&rsquo; reviews<span class="sr-only"
        >, page 190 of the agenda, PDF, 62 pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

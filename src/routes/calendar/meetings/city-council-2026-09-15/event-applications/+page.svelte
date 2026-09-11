<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
  const ITEM = "event-applications"
</script>

<p><strong>Amusement/Event Application:</strong> <em>with Police approval</em></p>

<ul>
  <li>
    <strong>12.4.1</strong> EVNT-26-23- Kathy McCormick for
    <em>Rocks Village Memorial Association, Inc</em>
    request to hold an Art Show to coincide with Essex Heritage Trails and Sails on September 12th &amp;
    13th, September 19th &amp; 20<sup>th</sup>, September 26th &amp; 27st, and October 3 &amp; 4
    from 10 AM to 5 PM
  </li>
  <li>
    <strong>12.4.2</strong> EVNT-26-25- Jennifer Silva for
    <em>Fresh Start Brew Co. DBA Aroma Joe&rsquo;s</em>
    requests to hold a Free Fall Event for all on October 30th from 3:30 &ndash; 8 PM at 727 South Main
    St in the building and parking lot
  </li>
  <li>
    <strong>12.4.3</strong> EVNT-26-27- Devon Allen for <em>Vintage Bazaar New England</em> requesting
    to hold the Vintage Bazaar Fall Festival at Crescent Farm for a vintage and craft show with live music
    and food to be held on Saturday October 3rd from 8:30 AM to 4 PM and Sunday October 4th from 10 AM
    to 3 PM.
  </li>
</ul>

<hr />

<ul>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/art-show-application`)}
      target="_blank"
      rel="noopener"
    >
      Event permit application, EVNT-26-23, Rocks Village Memorial Association, Inc.<span
        class="sr-only"
      >
        , PDF, sixteen pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/free-fall-event-application`)}
      target="_blank"
      rel="noopener"
    >
      Event permit application, EVNT-26-25, Fresh Start Brew Co. DBA Aroma Joe&rsquo;s<span
        class="sr-only"
      >
        , PDF, twenty-one pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/vintage-bazaar-application`)}
      target="_blank"
      rel="noopener"
    >
      Event permit application, EVNT-26-27, Vintage Bazaar New England<span class="sr-only">
        , PDF, eleven pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

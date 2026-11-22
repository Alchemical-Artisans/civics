<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2016-09-27"
  const ITEM = "walk-for-youth"
</script>

<p>
  <strong>10.1</strong> Application from Kathleen Pruett for
  <a href="https://www.haverhillbgc.org/" target="_blank" rel="external noopener noreferrer"
    ><em>Boys &amp; Girls Club of Greater Haverhill</em><span class="sr-only">
      (opens in a new tab)</span
    ></a
  >
  for &ldquo;Walk for Youth&rdquo;; beginning and ending at the Club on 55 Emerson st; Saturday, October
  15<sup>th</sup>; 10 am &ndash; 12 noon; with rain date of Sunday, October 16th
</p>

<p><em>Application has Police approval</em></p>

<AddressMap address="55 Emerson St, Haverhill, MA" lat={42.7750497} lon={-71.0818552} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Application for Permit, Boys &amp; Girls Club of Greater Haverhill<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/walk-route`)} target="_blank" rel="noopener">
      Boys &amp; Girls Club of Greater Haverhill 2016 Walk for Youth, Proposed walk route<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

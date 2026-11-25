<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-12-01"
  const ITEM = "holiday-luncheon-donations"
</script>

<p>5.6. Mayor Barrett submits the following gift donations:</p>

<ul>
  <li>
    <strong>5.6.1.</strong> Order - Authorizing the City Council to accept the following donations for
    the Holiday Luncheon at the Citizen Center to the Council on Aging Department
  </li>
</ul>

<p>
  <strong>
    $100.00 from Sacred Hearts Church<br />
    $500.00 from Fantini Baking Company<br />
    $150.00 from Aspen Hill Operator LLC
  </strong>
</p>

<hr />

<h2>Letter from the Mayor</h2>

<p>
  <strong>
    RE: Order Authorizing City Council to Accept Donations for Holiday Luncheon at the Citizens
    Center.
  </strong>
</p>

<p>
  Please see attached an order authorizing City Council to accept the following donations for the
  Holiday Luncheon at the Citizens Center to the Council on Aging Department.
</p>

<p>
  $100.00 from Sacred Hearts Church<br />
  $500.00 from Fantini Baking Company<br />
  $150.00 from Aspen Hill Operator LLC
</p>

<p>I recommend approval.</p>

<h2>Gift Acceptance</h2>

<p>
  At a regularly convened meeting of the City Council of the City of Haverhill, held on the 1st day
  of December 2026, it was voted as follows:
</p>

<p>
  That the City Council of the City of Haverhill, duly elected, qualified, and acting as such, on
  behalf of the City votes to accept the following donations for the Holiday Luncheon at the
  Citizens Center. Consistent with the purposes stated in the letters of donations, the Gift shall
  be used by the Council on Aging Department.
</p>

<p>
  $100.00 from Sacred Hearts Church<br />
  $500.00 from Fantini Baking Company<br />
  $150.00 from Aspen Hill Operator LLC
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, November 25, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Gift Acceptance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("city-council-2026-11-17", ITEM)}>
      The donations to the same luncheon accepted on November 17, 2026
    </a>
  </li>
</ul>

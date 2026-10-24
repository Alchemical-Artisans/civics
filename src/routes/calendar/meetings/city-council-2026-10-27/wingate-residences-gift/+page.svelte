<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "wingate-residences-gift"
</script>

<p><strong>5.2</strong> Mayor Barrett submits the following gift order:</p>

<ul>
  <li>
    <strong>5.2.1</strong> Order- Authorizing the City Council to accept a gift donation from Wingate
    Residences in the amount of $ 200.00 for the Council on Aging Department&rsquo;s Halloween Party at
    the Citizen Center
  </li>
</ul>

<hr />

<!-- The order as the packet prints it, and the donor's letter it refers back
     to for the purpose of the gift. The Mayor's covering letter says nothing
     either of them does not; it is linked at the foot. The order's own voting
     block -- YEAS, NAYS, ABSENT, PASSED IN COUNCIL, all blank until the
     sitting -- is not transcribed. -->

<h2>Order</h2>

<p><strong>GIFT ACCEPTANCE</strong></p>

<p>
  At a regularly convened meeting of the City Council of the City of Haverhill, held on the 27th day
  of October 2026, it was voted as follows:
</p>

<p>
  That the City Council of the City of Haverhill duly elected, qualified, and acting as such, on
  behalf of the City votes to accept a gift of two hundred dollars ($200.00) for the Halloween Party
  at the Citizens Center. Consistent with the purpose of the donation, as stated in the letter from
  Wingate Residences at Haverhill addressed to the City of Haverhill dated September 2026, the Gift
  shall be used by the Council on Aging Department.
</p>

<h2>Letter from Wingate Residences at Haverhill</h2>

<p>9-14-26</p>

<p>To Whom it May Concern:</p>

<p>
  Wingate Residences at Haverhill has donated $200 to the Haverhill Council on Aging for the
  sponsorship of the Halloween Party on 10-23-26. We enjoy being included in your programming and
  look forward to more opportunities to work together.
</p>

<p>Kind Regards,</p>

<p>
  Stacey Blakeslee<br />
  Director of Community Relations<br />
  Wingate Residences at Haverhill
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 22, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, Gift Acceptance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/donation-letter`)} target="_blank" rel="noopener">
      Letter from Stacey Blakeslee, Director of Community Relations, Wingate Residences at
      Haverhill, September 14, 2026<span class="sr-only"> , PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/check`)} target="_blank" rel="noopener">
      The cheque<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

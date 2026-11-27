<script lang="ts">
  import FileTenDays from "$lib/FileTenDays.svelte"
  import { Router } from "$lib/router"
  import { agendaHref } from "$lib/projects"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-06-02"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of minutes of prior meeting</h2>

<h2>4. Assignment of the minutes review for the next Meeting:</h2>

<h2>5. Communications from the Mayor:</h2>

<ul>
  <li>
    <strong>5.1.</strong>
    <a href={Router.meetingItem(MEETING, "happy-rides-gift")}>
      Gift for the Happy Rides Program, Breakfast Exchange Club
    </a>
  </li>
  <li>
    <strong>5.2.</strong>
    <a href={Router.meetingItem(MEETING, "highway-park-group-agreement")}>
      Memorandum Agreement, Highway/ Park Group
    </a>
    <FileTenDays />
  </li>
  <li>
    <strong>5.3.</strong>
    <a href={Router.meetingItem(MEETING, "administrative-professional-and-non-union-agreement")}>
      Memorandum Agreement, Administrative/ Professional and Non- Union Groups
    </a>
    <FileTenDays />
  </li>
  <li>
    <strong>5.4.</strong>
    <a href={agendaHref(MEETING, "309-east-broadway-taking")}>
      Order of Taking, 309 East Broadway
    </a>
  </li>
  <li>
    <strong>5.5.</strong>
    <a href={Router.meetingItem(MEETING, "fixed-location-vendors-ordinance")}>
      Fixed Location Vendors Ordinance
    </a>
    <FileTenDays />
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council:</h2>

<ul>
  <li>
    <strong>6.1.</strong>
    <a href={Router.meetingItem(MEETING, "multicultural-festival")}>
      Multicultural Festival, Haverhill&rsquo;s Cultural Council
    </a>
  </li>
  <li>
    <strong>6.2.</strong>
    <a href={Router.meetingItem(MEETING, "water-street-closure")}> Partial Water Street Closure </a>
  </li>
</ul>

<h2>7. Public Participation- Requests under Council Rule 28:</h2>

<h2>8. Communications and Reports from City Officers and Employees:</h2>

<ul>
  <li>
    <strong>8.1.</strong>
    <a href={Router.meetingItem(MEETING, "cdbg-application")}>
      FY2027 Community Development Block Grant Application
    </a>
  </li>
  <li>
    <strong>8.2.</strong>
    <a href={Router.meetingItem(MEETING, "revenue-and-expense-reports")}>
      Revenue and Expense Reports, April 2026
    </a>
  </li>
</ul>

<h2>9. Utility Public Hearing(s) and Related Order(s):</h2>

<ul>
  <li>
    <strong>9.1.</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-jackson-st")}>
      Single Pole Location, Jackson St
    </a>
  </li>
</ul>

<h2>10. Public Hearings and Related Orders:</h2>

<ul>
  <li>
    <strong>10.1.</strong>
    <a href={agendaHref(MEETING, "mariams-cottage-special-permit")}>
      Continue Hearing for Mariam&rsquo;s Cottage to June 30, 2026
    </a>
  </li>
  <li>
    <strong>10.2.</strong>
    <a href={Router.meetingItem(MEETING, "marijuana-social-consumption-zoning-request")}>
      Continue Hearing for Marijuana Social Consumption Zoning Request to July 14, 2026
    </a>
  </li>
</ul>

<h2>11. APPOINTMENTS:</h2>

<ul>
  <li>
    <strong>11.1. <u>Confirming Appointments:</u></strong>
    <ul>
      <li>
        <strong>11.1.1.</strong>
        <a href={Router.meetingItem(MEETING, "parking-commission-appointment")}>
          Appointment, Parking Commission
        </a>
      </li>
    </ul>
  </li>
  <li><strong>11.2. <u>Non-Confirming Appointments:</u></strong></li>
  <li><strong>11.3. <u>Constables</u></strong></li>
  <li><strong>11.4. <u>Resignations</u></strong></li>
</ul>

<h2>12. Petitions:</h2>

<ul>
  <li>
    <strong>12.1. <u>Applications Handicap Parking Sign:</u></strong> <em>with Police approval</em>
  </li>
  <li>
    <strong>12.2. <u>Amusement/Event Application<em>:</em></u></strong>
    <em>with Police approval</em>
    <ul>
      <li>
        <strong>12.2.1.</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>
          Thursday Nights Live! Summer Concert Series
        </a>
      </li>
      <li>
        <strong>12.2.2.</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>
          Fundraiser and Music Bingo, Haverhill Firefighter Museum
        </a>
      </li>
    </ul>
  </li>
  <li><strong>12.3. <u>Auctioneer License</u></strong>:</li>
  <li><strong>12.4. <u>Tag Days</u></strong><em>: with Police approval</em></li>
  <li><strong>12.5. <u>One Day Liquor License &ndash;with HPD approval</u></strong></li>
  <li>
    <strong>12.6. <u>ANNUAL LICENSE RENEWALS</u></strong>:
    <ul>
      <li>
        <strong>12.6.1. Hawker Peddlers License- Fixed location &ndash;</strong>
        <em>w/Police approval</em>
      </li>
      <li>
        <strong>12.6.2. Coin-Op License <em>Renewals</em> &ndash;</strong>
        <em>with Police approval</em>
      </li>
      <li><strong>12.6.3. Christmas Tree Vendor &ndash;</strong> <em>with Police approval</em></li>
      <li><strong>12.6.4. Taxi Driver Licenses:</strong> <em>with Police approval</em></li>
      <li><strong>12.6.5. Taxi/Limousine License</strong> <em>with Police approval</em></li>
      <li>
        <strong>12.6.6. Junk Dealer /Collector License -</strong> <em>with Police approval</em>
      </li>
      <li><strong>12.6.7. Pool/Billiard</strong></li>
      <li><strong>12.6.8. Bowling</strong></li>
      <li><strong>12.6.9. Sunday Bowling</strong></li>
      <li>
        <strong>12.6.10. Buy &amp; Sell Secondhand Articles</strong> <em>with Police approval</em>
      </li>
      <li>
        <strong>12.6.11. Buy &amp; Sell Secondhand Clothing</strong> <em>with Police approval</em>
      </li>
      <li><strong>12.6.12. Pawnbroker license</strong> - <em>with police approval</em></li>
      <li><strong>12.6.13. Fortune Teller</strong> <em>with - Police approval</em></li>
      <li>
        <strong>12.6.14. Buy &amp; Sell Old Gold</strong> &ndash; <em>with Police approval</em>
      </li>
      <li><strong>12.6.15. Roller Skating Rink</strong></li>
      <li><strong>12.6.16. Sunday Skating</strong></li>
      <li><strong>12.6.17. Exterior Vending Machines/Redbox Automated Retail, LLC</strong></li>
      <li>
        <strong>12.6.18. Limousine/Livery License/Chair Cars</strong> <em>with Police approval</em>
      </li>
    </ul>
  </li>
</ul>

<h2>13. Motions and Orders:</h2>

<ul>
  <li>
    <strong>13.1.</strong>
    <a href={Router.meetingItem(MEETING, "fy2027-water-appropriation")}>
      Continue FY2027 Water Department Appropriation to June 16, 2026
    </a>
  </li>
  <li>
    <strong>13.2.</strong>
    <a href={Router.meetingItem(MEETING, "fy2027-wastewater-appropriation")}>
      Continue FY2027 Wastewater Department Appropriation to June 16, 2026
    </a>
  </li>
  <li>
    <strong>13.3.</strong>
    <a href={Router.meetingItem(MEETING, "fy2027-general-fund-appropriation")}>
      Continue FY2027 General Fund Appropriation to June 16, 2026
    </a>
  </li>
  <li>
    <strong>13.4.</strong>
    <a href={Router.meetingItem(MEETING, "snow-and-ice-deficit-transfer")}>
      Free Cash Transfer, Snow and Ice Deficit
    </a>
  </li>
</ul>

<h2>14. Ordinances (File 10 days):</h2>

<h2>15. Communications from Councilors:</h2>

<h2>16. UNFINISHED BUSINESS OF PRECEDING MEETING:</h2>

<ul>
  <li>
    <strong>16.1.</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-58-blossom-st")}>
      Handicap Parking, 58 Blossom St
    </a>
  </li>
  <li>
    <strong>16.2.</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-30-lancaster-st")}>
      Handicap Parking, 30 Lancaster St
    </a>
  </li>
  <li>
    <strong>16.3.</strong>
    <a href={agendaHref(MEETING, "309-east-broadway-loan-order")}>
      Loan Order, Acquisition of 309 East Broadway
    </a>
  </li>
  <li>
    <strong>16.4.</strong>
    <a href={Router.meetingItem(MEETING, "silver-hill-roof-replacement-loan-order")}>
      Loan Order, Silver Hill Elementary School Roof Replacement
    </a>
  </li>
</ul>

<h2>17. RESOLUTIONS and PROCLAMATIONS:</h2>

<h2>18. COUNCIL COMMITTEE REPORTS AND ANNOUNCEMENTS:</h2>

<h2>
  <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
    19. Documents referred to committee study:
  </a>
</h2>

<h2>20. Long term matters study list:</h2>

<h2>21. ADJOURN:</h2>

<!-- Each item's own record is on its page; what is left here belongs to no
     item, under the minutes' own numbers. -->
<h2>Minutes</h2>

<p>Asst. City Clerk: Rose Leonard Flynn</p>

<p>
  <strong>3.</strong> COUNCILOR LEWANDOWSKI STATED SHE REVIEWED THE MINUTES AND FINDS THEM IN ORDER,
  SECOND BY COUNCILOR TOOHEY<br />
  PASSED YEAS10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<p><strong>4.</strong> PRESIDENT JORDAN ASSIGNED THE MINUTES TO COUNCILOR TOOHEY</p>

<p><strong>18.</strong></p>

<ul>
  <li>
    Councilor Sullivan cordially invited everyone to attend the annual pride flag ceremony. It will
    be this Thursday at Winnekenni Castle at 4PM with a social reception to follow from 5-7PM at the
    Roma Restaurant, sponsored by Haverhil Bank. Both events are family friendly and free.
  </li>
  <li>President Jordan stated this Saturday is the Art Walk</li>
</ul>

<p>
  <strong>21.</strong> MOTION BY COUNCILOR ROGERS TO ADJOURN, SECOND BY COUNCILOR BASILIERE<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)<br />
  <strong>ADJOURNED: 20:39</strong>
</p>

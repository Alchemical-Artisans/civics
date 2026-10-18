<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-01-13"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of Minutes of Prior Meeting</h2>

<h2>4. Assignment of the Minutes Review for the next Meeting:</h2>

<h2>5. Communications from the Mayor:</h2>

<ul>
  <li>
    <strong>5.1</strong>
    <a href={Router.meetingItem(MEETING, "recognize-fire-chief-robert-obrien")}>
      Recognize Fire Chief Robert O&rsquo;Brien
    </a>
  </li>
  <li>
    <strong>5.2</strong>
    <a href={Router.meetingItem(MEETING, "housing-production-plan")}>
      Haverhill Housing Production Plan
    </a>
  </li>
  <li>
    <strong>5.3</strong>
    <a href={Router.meetingItem(MEETING, "golden-hill-school-roof")}>
      New Roof at Golden Hill School
    </a>
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council:</h2>

<h2>7. Public Participation- Requests under Council Rule 28</h2>

<ul>
  <li>
    <strong>7.1</strong>
    <a href={Router.meetingItem(MEETING, "bradford-train-station-noise")}>
      Bradford Train Station Noise
    </a>
  </li>
</ul>

<h2>8. Communications and Reports from City Officers and Employees:</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "abatement-report-december-2025")}>
      Abatement Report, December 2025
    </a>
  </li>
  <li>
    <strong>8.2</strong>
    <a href={Router.meetingItem(MEETING, "revenue-and-expense-reports")}>
      Revenue and Expense Reports, December 2025
    </a>
  </li>
</ul>

<h2>9. Utility Hearing(s) and Related Order(s):</h2>

<ul>
  <li>
    <strong>9.1</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-south-pleasant-st")}>
      Joint Pole Location, South Pleasant St
    </a>
  </li>
  <li>
    <strong>9.2</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-oxford-ave")}>
      Joint Pole Location, Oxford Ave
    </a>
  </li>
  <li>
    <strong>9.3</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-salem-st-wr31101453")}>
      Joint Pole Location, Salem St, WR#31101453
    </a>
  </li>
  <li>
    <strong>9.4</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-salem-st-wr31101455")}>
      Joint Pole Location, Salem St, WR# 31101455
    </a>
  </li>
  <li>
    <strong>9.5</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-chadwick-rd")}>
      Joint Pole Location, Chadwick Rd
    </a>
  </li>
</ul>

<h2>10. Hearings and Related Orders:</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={Router.meetingItem(MEETING, "broco-energy-permit-revocation")}>
      Revocation Hearing, Broco Energy, 168 Hale Street
    </a>
  </li>
  <li>
    <strong>10.2</strong>
    <a href={Router.meetingItem(MEETING, "creek-brook-cml-fuel-storage")}>
      Continue Hearing for Fuel Storage, 30 Creek Brook Dr to February 3, 2026
    </a>
  </li>
  <li>
    <strong>10.3</strong>
    <a href={Router.meetingItem(MEETING, "battery-energy-storage-systems-ordinance")}>
      Continue Hearing for Battery Energy Storage Systems Ordinance to January 27, 2026
    </a>
  </li>
</ul>

<h2>11. Appointments:</h2>

<ul>
  <li><strong>11.1 Confirming Appointments:</strong></li>
  <li><strong>11.2 Non-Confirming Appointments:</strong></li>
  <li><strong>11.3 Constables</strong></li>
  <li>
    <strong>11.4 Resignations</strong>
    <ul>
      <li>
        <strong>11.4.1</strong>
        <a href={Router.meetingItem(MEETING, "washington-street-shoe-commission-resignation")}>
          Resignation, Washington Street Shoe Historic District Commission
        </a>
      </li>
    </ul>
  </li>
</ul>

<h2>12. Petitions:</h2>

<ul>
  <li>
    <strong>12.1</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-lowell-ave")}>
      Joint Pole Location, Lowell Ave, Hearing for February 10, 2026
    </a>
  </li>
  <li>
    <strong>12.2 Applications Handicap Parking Sign:</strong>
    <em>with Police approval</em>
  </li>
  <li><strong>12.3 Amusement/Event Application<em>:</em></strong> <em>with Police approval</em></li>
  <li><strong>12.4 Auctioneer License</strong>:</li>
  <li><strong>12.5 Tag Days</strong><em>: with Police approval</em></li>
  <li><strong>12.6 One Day Liquor License &ndash;with HPD approval</strong></li>
  <li>
    <strong>12.7</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}>Annual License Renewals</a>
  </li>
</ul>

<h2>13. Motions and Order:</h2>

<ul>
  <li>
    <strong>13.1</strong>
    <a href={Router.meetingItem(MEETING, "pay-bills-of-previous-years")}>
      Pay Bills of Previous Years
    </a>
  </li>
</ul>

<h2>14. Ordinances (File 10 days):</h2>

<ul>
  <li>
    <strong>14.1</strong>
    <a href={Router.meetingItem(MEETING, "add-handicap-parking-60-franklin-st")}>
      Add Handicap Parking, 60 Franklin St
    </a>
  </li>
  <li>
    <strong>14.2</strong>
    <a href={Router.meetingItem(MEETING, "delete-handicap-parking-113-laurel-ave")}>
      Delete Handicap Parking, 113 Laurel Ave
    </a>
  </li>
</ul>

<h2>15. Communications from Councilors:</h2>

<h2>16. Unfinished Business of Preceeding Meeting:</h2>

<ul>
  <li>
    <strong>16.1</strong>
    <a href={Router.meetingItem(MEETING, "youth-activity-fund-transfer")}>
      Youth Activity Fund Transfer
    </a>
  </li>
  <li>
    <strong>16.2</strong>
    <a href={Router.meetingItem(MEETING, "land-and-water-conservation-fund-loan-order")}>
      Loan Order, Land and Water Conservation Fund Grant
    </a>
  </li>
  <li>
    <strong>16.3</strong>
    <a href={Router.meetingItem(MEETING, "parc-grant-loan-order")}>Loan Order, PARC Grant</a>
  </li>
  <li>
    <strong>16.4</strong>
    <a href={Router.meetingItem(MEETING, "trinity-stadium-turf-field-loan-order")}>
      Loan Order, Turf Field at Trinity Stadium
    </a>
  </li>
  <li>
    <strong>16.5</strong>
    <a href={Router.meetingItem(MEETING, "highway-department-truck-lease")}>
      Lease Purchase of Three Trucks, Highway Department
    </a>
  </li>
  <li>
    <strong>16.6</strong>
    <a href={Router.meetingItem(MEETING, "dibitetto-family-land")}>
      Acceptance of DiBitetto Family Land
    </a>
  </li>
  <li>
    <strong>16.7</strong>
    <a href={Router.meetingItem(MEETING, "south-park-street-public-way")}>
      South Park Street as a Public Way
    </a>
  </li>
  <li>
    <strong>16.8</strong>
    <a href={Router.meetingItem(MEETING, "oakwood-terrace-public-way")}>
      Oakwood Terrace as a Public Way
    </a>
  </li>
  <li>
    <strong>16.9</strong>
    <a href={Router.meetingItem(MEETING, "police-patrolman-association-agreement")}>
      Memorandum of Agreement, Police Patrolman Association Group
    </a>
  </li>
  <li>
    <strong>16.10</strong>
    <a href={Router.meetingItem(MEETING, "agricultural-commission-ordinance")}>
      Continue Agricultural Commission Ordinance to January 27, 2026
    </a>
  </li>
</ul>

<h2>17. Resolutions and Proclamations:</h2>

<ul>
  <li>
    <strong>17.1</strong>
    <a href={Router.meetingItem(MEETING, "martin-luther-king-jr-day-proclamation")}>
      Martin Luther King Jr. Day Proclamation
    </a>
  </li>
</ul>

<h2>18. Council Committee Reports and Announcements:</h2>

<h2>
  <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
    19. Documents referred to committee study:
  </a>
</h2>

<h2>20. Long term matters study list:</h2>

<h2>21. Adjourn:</h2>

<h2>Minutes</h2>

<p>
  Present: President Jordan, Councilors Michitson, Basiliere, Diodati, Sullivan, Ferreira,
  Lewandowski, Toohey, LePage and Rogers<br />
  Remote: None<br />
  Absent: Councilor McGonagle<br />
  City Clerk: Kaitlin M. Wright
</p>

<p>
  <strong>2. Pledge of Allegiance</strong><br />
  A moment of silence was held for Maureen Ferris who passed away this week after a brief illness. Councilor
  Sullivan offered words of condolences.
</p>

<p>
  <strong>3. Approval of minutes of prior meeting</strong><br />
  Councilor Toohey stated he reviewed the minutes and finds them in order, Second by Councilor Lewandowski<br
  />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<p>
  <strong>4. Assignment of the minutes review for the next Meeting:</strong><br />
  President Jordan assigned the minutes to Councilor LePage.
</p>

<p>
  <strong>18. Council Committee Reports and Announcements:</strong>
</p>

<ul>
  <li>Councilor LePage wished his daughter Stefanie a Happy Birthday</li>
</ul>

<p>
  <strong>21. Adjourn</strong><br />
  Motion by Councilor Sullivan, Second by Councilor LePage<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)<br />
  ADJOURNED: 21:33
</p>

<script lang="ts">
  import { Router } from "$lib/router"
  import { agendaHref } from "$lib/projects"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-06-30"
</script>

<!-- The amended agenda, "REVISION OF AGENDA ORIGINALLY POSTED ON JUNE 26, 2026
     AT 2:10 PM", is the outline here: it adds 5.0, the emergency order for the
     force main that broke on the 26th, and otherwise matches the original. -->

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of minutes of prior meeting</h2>

<h2>4. Assignment of the minutes review for the next Meeting:</h2>

<h2>5. Communications from the Mayor:</h2>

<ul>
  <li>
    <strong>5.0</strong>
    <a href={Router.meetingItem(MEETING, "sewer-emergency-declaration")}>
      Declaration of Emergency, 42&rdquo; Sewer Force Main
    </a>
  </li>
  <li>
    <strong>5.1.</strong>
    <a href={Router.meetingItem(MEETING, "police-commendation")}>
      Commendation, Sgt. Fogarty and Detectives
    </a>
  </li>
  <li>
    <strong>5.2.</strong>
    <a href={Router.meetingItem(MEETING, "narcotics-and-gang-unit-recognition")}>
      Recognition, Narcotics Unit and Gang Unit
    </a>
  </li>
  <li>
    <strong>5.3.</strong>
    <a href={Router.meetingItem(MEETING, "search-and-rescue-recognition")}>
      Recognition, Search and Rescue of May 22-23, 2026
    </a>
  </li>
  <li>
    <strong>5.4.</strong>
    <a href={agendaHref(MEETING, "micromobility-safety")}>
      Senate Bill 3077, <em>An Act to Enhance the Safe Use of Micromobility Devices</em>
    </a>
  </li>
  <li>
    <strong>5.5.</strong>
    <a href={Router.meetingItem(MEETING, "city-clerk-fee-schedule")}>City Clerk Fee Schedule</a>
  </li>
  <li>
    <strong>5.6.</strong>
    <a href={Router.meetingItem(MEETING, "veterans-assistance-fund")}>
      Municipal Veterans Assistance Fund
    </a>
  </li>
  <li>
    <strong>5.7.</strong>
    <a href={Router.meetingItem(MEETING, "crane-services-for-city-docks")}>
      Crane Services for City Docks
    </a>
  </li>
  <li>
    <strong>5.8.</strong>
    <a href={Router.meetingItem(MEETING, "school-building-lease-415-primrose-st")}>
      School Building Lease, 415 Primrose St
    </a>
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council:</h2>

<h2>7. Public Participation- Requests under Council Rule 28:</h2>

<h2>8. Communications and Reports from City Officers and Employees:</h2>

<ul>
  <li>
    <strong>8.1.</strong>
    <a href={Router.meetingItem(MEETING, "abatement-report-may-2026")}>
      Abatement Report, May 2026
    </a>
  </li>
  <li>
    <strong>8.2.</strong>
    <a href={Router.meetingItem(MEETING, "revenue-and-expense-reports")}>
      Revenue and Expense Reports, May 2026
    </a>
  </li>
  <li>
    <strong>8.3.</strong>
    <a href={Router.meetingItem(MEETING, "road-opening-179-monument-st")}>
      Road Opening, 179 Monument Street
    </a>
  </li>
  <li>
    <strong>8.4.</strong>
    <a href={Router.meetingItem(MEETING, "road-opening-170-172-winter-st")}>
      Road Opening, 170-172 Winter Street
    </a>
  </li>
</ul>

<h2>9. Utility Public Hearing(s) and Related Order(s):</h2>

<h2>10. Public Hearings and Related Orders:</h2>

<ul>
  <li>
    <strong>10.1.</strong>
    <a href={Router.meetingItem(MEETING, "major-modification-39-railroad-ave")}>
      Major Modification to Special Permit, 39 Railroad Ave
    </a>
  </li>
  <li>
    <strong>10.2.</strong>
    <a href={agendaHref(MEETING, "mariams-cottage-special-permit")}>
      Mariam&rsquo;s Cottage Special Permit
    </a>
  </li>
</ul>

<h2>11. Appointments:</h2>

<ul>
  <li>
    <strong>11.1. Confirming Appointments:</strong>
    <ul>
      <li>
        <strong>11.1.1.</strong>
        <a href={Router.meetingItem(MEETING, "board-of-appeals-reappointment")}>
          Reappointment, Board of Appeals
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>11.2. Non-Confirming Appointments:</strong>
    <ul>
      <li>
        <strong>11.2.1.</strong>
        <a href={Router.meetingItem(MEETING, "conservation-commission-appointment")}>
          Appointment, Conservation Commission
        </a>
      </li>
    </ul>
  </li>
  <li><strong>11.3. Constables</strong></li>
  <li>
    <strong>11.4. Resignations</strong>
    <ul>
      <li>
        <strong>11.4.1.</strong>
        <a href={Router.meetingItem(MEETING, "conservation-commission-resignation")}>
          Resignation, Conservation Commission
        </a>
      </li>
      <li>
        <strong>11.4.2.</strong>
        <a href={Router.meetingItem(MEETING, "parking-commission-resignation")}>
          Resignation, Central Business District Parking Commission
        </a>
      </li>
    </ul>
  </li>
</ul>

<h2>12. Petitions:</h2>

<ul>
  <li>
    <strong>12.1.</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-lowell-ave")}>
      Joint Pole Location, Lowell Ave
    </a>
  </li>
  <li>
    <strong>12.2.</strong>
    <a href={Router.meetingItem(MEETING, "underground-facilities-lowell-ave")}>
      Underground Facilities, Lowell Ave
    </a>
  </li>
  <li>
    <strong>12.3.</strong>
    <a href={agendaHref(MEETING, "pentucket-north-planned-development-district")}>
      Pentucket North Planned Development District
    </a>
  </li>
  <li>
    <strong>12.4.</strong>
    <a href={Router.meetingItem(MEETING, "special-permit-512-washington-st")}>
      Special Permit, 512 Washington St
    </a>
  </li>
  <li>
    <strong>12.5. Applications Handicap Parking Sign:</strong> <em>with Police approval</em>
  </li>
  <li>
    <strong>12.6. Amusement/Event Application<em>:</em></strong> <em>with Police approval</em>
    <ul>
      <li>
        <strong>12.6.1.</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>The Longest Table</a>
      </li>
      <li>
        <strong>12.6.2.</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>River Ruckus</a>
      </li>
    </ul>
  </li>
  <li><strong>12.7. Auctioneer License</strong>:</li>
  <li>
    <strong>12.8. Tag Days</strong><em>: with Police approval</em>
    <ul>
      <li>
        <strong>12.8.1.</strong>
        <a href={Router.meetingItem(MEETING, "tag-days")}>Haverhill Elite Cheer</a>
      </li>
    </ul>
  </li>
  <li><strong>12.9. One Day Liquor License &ndash;with HPD approval</strong></li>
  <li>
    <strong>12.10.</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}>Annual License Renewals</a>
  </li>
</ul>

<h2>13. Motions and Orders:</h2>

<ul>
  <li>
    <strong>13.1.</strong>
    <a href={Router.meetingItem(MEETING, "wastewater-capital-transfer")}>
      Transfer of FY26 Wastewater Enterprise Funds to Capital Fund Accounts
    </a>
  </li>
  <li>
    <strong>13.2.</strong>
    <a href={Router.meetingItem(MEETING, "fuel-system-transfer")}>
      Transfer to Replace the Failing Fuel System
    </a>
  </li>
  <li>
    <strong>13.3.</strong>
    <a href={Router.meetingItem(MEETING, "refuse-expense-transfer")}>
      Transfer to Outdoor Lighting and Vehicle Maintenance
    </a>
  </li>
</ul>

<h2>14. Ordinances (File 10 days):</h2>

<h2>15. Communications from Councilors:</h2>

<ul>
  <li>
    <strong>15.1.</strong>
    <a href={agendaHref(MEETING, "micromobility-safety")}>
      Public Safety, E-Bikes and Governor Healey&rsquo;s Ride Safe Act
    </a>
  </li>
  <li>
    <strong>15.2.</strong>
    <a href={agendaHref(MEETING, "planning-development-committee-meeting")}>
      Planning and Development Committee Meeting, July 7, 2026
    </a>
  </li>
  <li>
    <strong>15.3.</strong>
    <a href={Router.meetingItem(MEETING, "haverhill-ai-summit")}>Haverhill AI Summit</a>
  </li>
</ul>

<h2>16. Unfinished Business of Preceding Meeting:</h2>

<ul>
  <li>
    <strong>16.1.</strong>
    <a href={Router.meetingItem(MEETING, "south-elm-st-parking-ordinance")}>
      Parking Restriction, South Elm St
    </a>
  </li>
</ul>

<h2>17. Resolutions and Proclamations:</h2>

<h2>18. Council Committee Reports and Announcements:</h2>

<h2>19. Documents referred to committee study:</h2>

<h2>20. Long term matters study list:</h2>

<h2>21. Adjourn:</h2>

<!-- Each item's own record is on its page; what is left here belongs to no
     item, under the minutes' own numbers. -->
<h2>Minutes</h2>

<p>City Clerk: Kaitlin M. Wright-Esposito</p>

<p>
  <strong>3.</strong> COUNCILOR MCGONAGLE STATED HE REVIEWED THE MINUTES AND FINDS THEM IN ORDER,
  SECOND BY COUNCILOR TOOHEY<br />
  PASSED YEAS 11, NAYS 0, ABSENT 0
</p>

<p><strong>4.</strong> PRESIDENT JORDAN ASSIGNED THE MINUTES TO COUNCILOR LEPAGE</p>

<p>
  <strong>21.</strong> MOTION BY COUNCILOR SULLIVAN TO ADJOURN, SECOND BY COUNCILOR LEWANDOWSKI<br
  />
  <strong>ADJOURN: 23:21</strong>
</p>

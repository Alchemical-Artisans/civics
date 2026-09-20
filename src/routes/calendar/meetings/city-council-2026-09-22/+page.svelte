<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-09-22"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of Minutes of Prior Meeting</h2>

<h2>4. Assignment of the Minutes Review for the Next Meeting</h2>

<h2>5. Communications from the Mayor</h2>

<ul>
  <li>
    <strong>5.1</strong>
    <a href={Router.meetingItem(MEETING, "recreational-motorized-vehicles-ordinance")}>
      Recreational Motorized Vehicles Ordinance
    </a>
  </li>
  <li>
    <strong>5.2</strong>
    <a href={Router.meetingItem(MEETING, "water-use-restriction-ordinance")}>
      Water Use Restriction Ordinance
    </a>
  </li>
</ul>

<h2>6. Communications from Councilors to Introduce an Individual(s) to Address The Council</h2>

<h2>7. Public Participation- Requests under Council Rule 28</h2>

<h2>8. Communications and Reports from City Officers and Employees</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "revenue-and-expense-reports")}>
      Revenue and Expense Reports, August 2026
    </a>
  </li>
</ul>

<h2>9. Utility Public Hearing(s) and Related Order(s)</h2>

<h2>10. Public Hearings and Related Orders</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={Router.meetingItem(MEETING, "mariams-cottage-special-permit")}>
      Mariam&rsquo;s Cottage Special Permit
    </a>
  </li>
</ul>

<h2>11. Appointments</h2>

<ul>
  <li>
    <strong>11.1</strong> Confirming Appointments:
    <ul>
      <li>
        <strong>11.1.1</strong>
        <a href={Router.meetingItem(MEETING, "confirming-appointments")}>
          Haverhill Cultural Council
        </a>
      </li>
    </ul>
  </li>
  <li><strong>11.2</strong> Non-Confirming Appointments:</li>
</ul>

<h2>12. Petitions</h2>

<ul>
  <li><strong>12.1 Applications Handicap Parking Sign:</strong> <em>with Police approval</em></li>
  <li>
    <strong>12.2 Amusement/Event Application:</strong>
    <em>with Police approval</em>
    <ul>
      <li>
        <strong>12.2.1</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>
          Annual Festival Fundraiser, Hellenic Orthodox Community
        </a>
      </li>
      <li>
        <strong>12.2.2</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>
          Chili/Chowder Cookoff, Haverhill Firefighting Museum
        </a>
      </li>
    </ul>
  </li>
  <li><strong>12.3 Auctioneer License</strong></li>
  <li><strong>12.4 Tag Days</strong>: <em>with Police approval</em></li>
  <li>
    <strong>12.5 One Day Liquor License</strong> &ndash;with Police and License Commission approval
  </li>
  <li>
    <strong>12.6</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}> Annual License Renewals </a>
  </li>
</ul>

<h2>13. Motions and Orders</h2>

<h2>14. Ordinances (File 10 days)</h2>

<h2>15. Communications from Councilors</h2>

<ul>
  <li>
    <strong>15.1</strong>
    <a href={Router.meetingItem(MEETING, "marijuana-overlay-consolidation")}>
      Marijuana Overlay District Consolidation
    </a>
  </li>
</ul>

<h2>16. Unfinished Business of Preceding Meeting</h2>

<h2>17. Resolutions and Proclamations</h2>

<ul>
  <li>
    <strong>17.1</strong>
    <a href={Router.meetingItem(MEETING, "hispanic-heritage-month-proclamation")}>
      Hispanic Heritage Month Proclamation
    </a>
  </li>
</ul>

<h2>18. Council Committee Reports and Announcements</h2>

<h2>19. Documents Referred to Committee Study</h2>

<h2>20. Long Term Matters Study List</h2>

<h2>21. Adjourn</h2>

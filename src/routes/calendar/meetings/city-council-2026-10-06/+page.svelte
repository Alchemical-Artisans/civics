<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-10-06"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of minutes of prior meeting</h2>

<h2>4. Assignment of the minutes review for the next Meeting</h2>

<h2>5. Communications from the Mayor</h2>

<ul>
  <li>
    <strong>5.1</strong>
    <a href={Router.meetingItem(MEETING, "wreaths-across-america")}>
      Wreaths Across America, Hilldale Cemetery
    </a>
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council</h2>

<h2>7. Public Participation- Requests under Council Rule 28</h2>

<h2>8. Communications and Reports from City Officers and Employees</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "early-voting-schedule")}>
      Early Voting Schedule and Election Deadlines
    </a>
  </li>
  <li>
    <strong>8.2</strong>
    <a href={Router.meetingItem(MEETING, "election-warrant")}>
      Election Warrant, 2026 State Election
    </a>
  </li>
</ul>

<h2>9. Utility Public Hearing(s) and Related Order(s)</h2>

<h2>10. Public Hearings and Related Orders</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={Router.meetingItem(MEETING, "marshland-st-special-permit")}>
      Special Permit, 27 Marshland St
    </a>
  </li>
</ul>

<h2>11. Appointments</h2>

<ul>
  <li><strong>11.1 Confirming Appointments:</strong></li>
  <li><strong>11.2 Non-Confirming Appointments:</strong></li>
</ul>

<h2>12. Petitions</h2>

<ul>
  <li><strong>12.1 Applications Handicap Parking Sign:</strong> <em>with Police approval</em></li>
  <li><strong>12.2 Amusement/Event Application:</strong> <em>with Police approval</em></li>
  <li><strong>12.3 Auctioneer License</strong>:</li>
  <li><strong>12.4 Tag Days</strong>: <em>with Police approval</em></li>
  <li>
    <strong>12.5 One Day Liquor License</strong> &ndash;with Police &amp; License Commission approval
  </li>
  <li>
    <strong>12.6</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}> Annual License Renewals </a>
  </li>
</ul>

<h2>13. Motions and Orders</h2>

<h2>14. Ordinances (File 10 days)</h2>

<h2>15. Communications from Councilors</h2>

<h2>16. Unfinished Business of Preceding Meeting</h2>

<ul>
  <li>
    <strong>16.1</strong>
    <a href={Router.meetingItem(MEETING, "recreational-motorized-vehicles-ordinance")}>
      Recreational Motorized Vehicles Ordinance
    </a>
  </li>
  <li>
    <strong>16.2</strong>
    <a href={Router.meetingItem(MEETING, "water-use-restriction-ordinance")}>
      Water Use Restriction Ordinance
    </a>
  </li>
</ul>

<h2>17. Resolutions and Proclamations</h2>

<ul>
  <li>
    <strong>17.1</strong>
    <a href={Router.meetingItem(MEETING, "white-cane-awareness-day")}>
      White Cane Awareness Day Proclamation
    </a>
  </li>
</ul>

<h2>18. Council Committee Reports and Announcements</h2>

<ul>
  <li>
    <strong>18.1</strong>
    <a href={Router.meetingItem(MEETING, "planning-development-committee-meeting")}>
      Planning and Development Committee, October 19, 2026
    </a>
  </li>
</ul>

<!-- The agenda prints this heading with nothing under it, and the packet's
     last two pages are the list itself, the same arrangement as 29 September.
     The heading is the link rather than a bullet beneath it, since the list
     has no name of its own apart from the heading's. -->
<h2>
  <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
    19. Documents referred to committee study
  </a>
</h2>

<h2>20. Long term matters study list</h2>

<h2>21. Adjourn</h2>

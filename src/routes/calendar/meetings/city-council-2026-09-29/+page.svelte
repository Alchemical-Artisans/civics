<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-09-29"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of Minutes of Prior Meeting</h2>

<h2>4. Assignment of the Minutes Review for the next Meeting</h2>

<h2>5. Communications from the Mayor</h2>

<ul>
  <li>
    <strong>5.1</strong>
    <a href={Router.meetingItem(MEETING, "first-nations-park-dedication-update")}>
      First Nations Park Dedication Update
    </a>
  </li>
  <li>
    <strong>5.2</strong>
    <a href={Router.meetingItem(MEETING, "all-night-parking-ordinance")}>
      All-Night Parking Ordinance
    </a>
  </li>
  <li>
    <strong>5.3</strong>
    <a href={Router.meetingItem(MEETING, "south-mill-street-authority-to-file")}>
      South Mill Street Pumping Station Force Main &ndash; Authority to File
    </a>
  </li>
</ul>

<h2>6. Communications from Councilors to Introduce an Individual(s) to Address The Council</h2>

<h2>7. Public Participation- Requests under Council Rule 28</h2>

<h2>8. Communications and Reports from City Officers and Employees</h2>

<h2>9. Utility Public Hearing(s) and Related Order(s)</h2>

<h2>10. Public Hearings and Related Orders</h2>

<h2>11. Appointments</h2>

<ul>
  <li><strong>11.1 Confirming Appointments:</strong></li>
  <li><strong>11.2 Non-Confirming Appointments:</strong></li>
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
          Magazine Event, Northshore Magazine
        </a>
      </li>
    </ul>
  </li>
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

<ul>
  <li>
    <strong>13.1</strong>
    <a href={Router.meetingItem(MEETING, "pay-previous-years-bills")}> FY25 Bills </a>
  </li>
</ul>

<h2>14. Ordinances (File 10 days)</h2>

<h2>15. Communications from Councilors</h2>

<h2>16. Unfinished Business of Preceding Meeting</h2>

<ul>
  <li>
    <strong>16.1</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-12-blaisdell-st")}>
      Doc 10-Q &ndash; 12 Blaisdell St
    </a>
  </li>
  <li>
    <strong>16.2</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-16-forest-ave")}>
      Doc 10-R &ndash; 16 Forest Av
    </a>
  </li>
  <li>
    <strong>16.3</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-9-varnum-st")}>
      Doc 40-B &ndash; 9 Varnum St
    </a>
  </li>
</ul>

<h2>17. Resolutions and Proclamations</h2>

<h2>18. Council Committee Reports and Announcements</h2>

<ul>
  <li>
    <strong>18.1</strong>
    <a href={Router.meetingItem(MEETING, "natural-resources-and-public-property-committee-report")}>
      Natural Resources and Public Property, September 14, 2026
    </a>
  </li>
</ul>

<!-- The agenda prints this heading with nothing under it, but the packet's
     last two pages are the list itself -- the clerk's standing record of what
     is sitting in which committee, dated the week of the sitting. The heading
     is the link rather than a bullet beneath it, since the list has no name of
     its own apart from the heading's. -->
<h2>
  <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
    19. Documents Referred to Committee Study
  </a>
</h2>

<h2>20. Long Term Matters Study List</h2>

<h2>21. Adjourn</h2>

<script lang="ts">
  import FileTenDays from "$lib/FileTenDays.svelte"
  import { Router } from "$lib/router"
  import { agendaHref } from "$lib/projects"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-10-20"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of minutes of prior meeting</h2>

<h2>4. Assignment of the minutes review for the next Meeting</h2>

<h2>5. Communications from the Mayor</h2>

<ul>
  <li>
    <strong>5.1</strong>
    <a href={Router.meetingItem(MEETING, "introduce-economic-development-director")}>
      Introduce Alison Gulubicki, Economic Development Director
    </a>
  </li>
  <li>
    <strong>5.2</strong>
    <a href={agendaHref(MEETING, "golden-hill-roof-replacement-bonds")}>
      Golden Hill Elementary School Roof Replacement Bonds
    </a>
    <FileTenDays />
  </li>
  <li>
    <strong>5.3</strong>
    <a href={Router.meetingItem(MEETING, "snow-plowing-rates")}> Snow Plowing Rates </a>
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council</h2>

<ul>
  <li>
    <strong>6.1</strong>
    <a href={Router.meetingItem(MEETING, "veterans-fundraiser-breakfast")}>
      Veterans Fundraiser Breakfast
    </a>
  </li>
</ul>

<h2>7. Public Participation- Requests under Council Rule 28</h2>

<h2>8. Communications and Reports from City Officers and Employees</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "monthly-abatement-report")}>
      Monthly Abatement Report, September
    </a>
  </li>
  <li>
    <strong>8.2</strong>
    <a href={Router.meetingItem(MEETING, "road-opening-winter-st-at-hale-st")}>
      Road Opening, Winter St at Hale St
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
  <li>
    <strong>11.1</strong> Confirming Appointments:
    <ul>
      <li>
        <strong>11.1.1</strong>
        <a href={Router.meetingItem(MEETING, "confirming-appointments")}>
          Board of Health, Dr. Alexandra Filipakis
        </a>
      </li>
    </ul>
  </li>
  <li><strong>11.2</strong> Non-Confirming Appointments:</li>
  <li><strong>11.3</strong> Constables:</li>
  <li>
    <strong>11.4</strong> Resignation:
    <ul>
      <li>
        <strong>11.4.1</strong>
        <a href={Router.meetingItem(MEETING, "board-of-health-resignation")}>
          Board of Health, Dr. Romie Mundy
        </a>
      </li>
    </ul>
  </li>
</ul>

<h2>12. Petitions</h2>

<ul>
  <li>
    <strong>12.1</strong>
    <a href={Router.meetingItem(MEETING, "national-grid-pole-petition")}>
      Joint Pole Location, North Broadway
    </a>
  </li>
  <li><strong>12.2 Applications Handicap Parking Sign:</strong> <em>with Police approval</em></li>
  <li>
    <strong>12.3 Amusement/Event Application:</strong>
    <em>with Police approval</em>
    <ul>
      <li>
        <strong>12.3.1</strong>
        <a href={Router.meetingItem(MEETING, "winter-haverhill-farmers-market")}>
          Winter Haverhill Farmers Market, Creative Haverhill
        </a>
      </li>
      <li>
        <strong>12.3.2</strong>
        <a href={Router.meetingItem(MEETING, "big-dog-show")}>
          Big Dog Show, Whittier Birthplace
        </a>
      </li>
    </ul>
  </li>
  <li><strong>12.4 Auctioneer License</strong>:</li>
  <li><strong>12.5 Tag Days</strong>: <em>with Police approval</em></li>
  <li>
    <strong>12.6 One Day Liquor License</strong> &ndash;with Police &amp; License Commission approval
  </li>
  <li>
    <strong>12.7</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}> ANNUAL LICENSE RENEWALS </a>
  </li>
</ul>

<h2>13. Motions and Orders</h2>

<ul>
  <li>
    <strong>13.1</strong>
    <a href={Router.meetingItem(MEETING, "city-hall-improvements-reallocation")}>
      City Hall Improvements Account Reallocation
    </a>
  </li>
  <li>
    <strong>13.2</strong>
    <a href={Router.meetingItem(MEETING, "pay-previous-years-bills")}> FY25 Bills </a>
  </li>
  <li>
    <strong>13.3</strong>
    <a href={Router.meetingItem(MEETING, "2027-capital-account-reallocation")}>
      2027 Capital Account Reallocation
    </a>
  </li>
</ul>

<h2>14. Ordinances (File 10 days)</h2>

<ul>
  <li>
    <strong>14.1</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-310-washington-st")}>
      310 Washington St &ndash; No Parking Ordinance
    </a>
  </li>
  <li>
    <strong>14.2</strong>
    <a
      href={Router.meetingItem(MEETING, "parking-ordinance-washington-st-niagara-to-pleasant-view")}
    >
      Washington St, Niagara St to Pleasant View Ave &ndash; No Parking Ordinance
    </a>
  </li>
</ul>

<h2>15. Communications from Councilors</h2>

<h2>16. Unfinished Business of Preceding Meeting</h2>

<ul>
  <li>
    <strong>16.1</strong>
    <a href={Router.meetingItem(MEETING, "all-night-parking-ordinance")}>
      All-Night Parking Ordinance
    </a>
  </li>
</ul>

<h2>17. Resolutions and Proclamations</h2>

<h2>18. Council Committee Reports and Announcements</h2>

<h2>19. Documents referred to committee study</h2>

<h2>20. Long term matters study list</h2>

<h2>21. Adjourn</h2>

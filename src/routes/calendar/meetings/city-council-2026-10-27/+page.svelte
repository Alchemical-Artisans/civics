<script lang="ts">
  import { Router } from "$lib/router"
  import { agendaHref } from "$lib/projects"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-10-27"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of minutes of prior meeting</h2>

<h2>4. Assignment of the minutes review for the next Meeting</h2>

<h2>5. Communications from the Mayor</h2>

<ul>
  <li>
    <strong>5.1</strong>
    <a href={Router.meetingItem(MEETING, "fire-safety-and-liheap")}>Fire Safety and LIHEAP</a>
  </li>
  <li>
    <strong>5.2</strong> Mayor Barrett submits the following gift order:
    <ul>
      <li>
        <strong>5.2.1</strong>
        <a href={Router.meetingItem(MEETING, "wingate-residences-gift")}>
          Gift from Wingate Residences
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>5.3</strong>
    <a href={Router.meetingItem(MEETING, "high-school-fire-alarm-bonds")}>
      Haverhill High School Fire Alarm Project Bonds
    </a>
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council</h2>

<ul>
  <li>
    <strong>6.1</strong>
    <a href={Router.meetingItem(MEETING, "downtown-whittier-statue")}>
      Downtown Statue of John Greenleaf Whittier
    </a>
  </li>
  <li>
    <strong>6.2</strong>
    <a href={Router.meetingItem(MEETING, "eagle-scout-ryan-hiro")}>Ryan Hiro, Eagle Scout</a>
  </li>
  <li>
    <strong>6.3</strong>
    <a href={Router.meetingItem(MEETING, "national-lead-poisoning-prevention-week")}>
      National Lead Poisoning Prevention Week
    </a>
  </li>
</ul>

<h2>7. Public Participation- Requests under Council Rule 28</h2>

<h2>8. Communications and Reports from City Officers and Employees</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "revenue-and-expense-reports")}>
      Revenue and Expense Reports, September 2026
    </a>
  </li>
  <li>
    <strong>8.2</strong>
    <a href={agendaHref(MEETING, "state-election-reminder")}>State Election Reminder</a>
  </li>
</ul>

<h2>9. Utility Public Hearing(s) and Related Order(s)</h2>

<h2>10. Public Hearings and Related Orders</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={Router.meetingItem(MEETING, "zoning-ordinance-amendments")}>
      Amendments to Chapter 255, Zoning
    </a>
  </li>
  <li>
    <strong>10.2</strong>
    <a href={agendaHref(MEETING, "pentucket-north-planned-development-district")}>
      Pentucket North Planned Development District
    </a>
  </li>
  <li>
    <strong>10.3</strong>
    <a href={agendaHref(MEETING, "battery-energy-storage-systems-ordinance")}>
      Battery Energy Storage Systems Ordinance
    </a>
  </li>
  <li>
    <strong>10.4</strong>
    <a href={agendaHref(MEETING, "battery-energy-storage-systems-ordinance-hilldale-ave")}>
      Battery Energy Storage Systems Ordinance, Hilldale Ave Location
    </a>
  </li>
</ul>

<h2>11. Appointments</h2>

<ul>
  <li><strong>11.1 Confirming Appointments:</strong></li>
  <li><strong>11.2 Non-Confirming Appointments:</strong></li>
  <li><strong>11.3 Constables:</strong></li>
  <li><strong>11.4 Resignation:</strong></li>
</ul>

<h2>12. Petitions</h2>

<ul>
  <li><strong>12.1 Applications Handicap Parking Sign:</strong> <em>with Police approval</em></li>
  <li><strong>12.2 Amusement/Event Application:</strong> <em>with Police approval</em></li>
  <li><strong>12.3 Auctioneer License:</strong></li>
  <li><strong>12.4 Tag Days</strong><em>: with Police approval</em></li>
  <li>
    <strong>12.5 One Day Liquor License &ndash;with Police &amp; License Commission approval</strong
    >
  </li>
  <li>
    <strong>12.6</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}>ANNUAL LICENSE RENEWALS</a>
  </li>
</ul>

<h2>13. Motions and Orders</h2>

<ul>
  <li>
    <strong>13.1</strong>
    <a href={Router.meetingItem(MEETING, "pay-previous-years-bills")}>FY25 Bills</a>
  </li>
</ul>

<h2>14. Ordinances (File 10 days)</h2>

<ul>
  <li>
    <strong>14.1</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-20-park-st")}>
      20 Park St &ndash; No Parking Ordinance
    </a>
  </li>
</ul>

<h2>15. Communications from Councilors</h2>

<ul>
  <li>
    <strong>15.1</strong>
    <a href={Router.meetingItem(MEETING, "snow-plan-update")}>Snow Plan Update</a>
  </li>
  <li>
    <strong>15.2</strong>
    <a href={Router.meetingItem(MEETING, "planning-development-committee-meeting")}>
      Planning and Development Committee, November 9, 2026
    </a>
  </li>
</ul>

<h2>16. Unfinished Business of Preceding Meeting</h2>

<h2>17. Resolutions and Proclamations</h2>

<h2>18. Council Committee Reports and Announcements</h2>

<h2>19. Documents Referred to Committee Study</h2>

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
      Documents Referred to Committee Study
    </a>
  </li>
</ul>

<h2>20. Long term matters study list</h2>

<h2>21. Adjourn</h2>

<script lang="ts">
  import FileTenDays from "$lib/FileTenDays.svelte"
  import { Router } from "$lib/router"
  import { agendaHref } from "$lib/projects"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2025-12-09"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of Minutes of Prior Meeting</h2>

<h2>4. Assignment of the Minutes Review for the next Meeting:</h2>

<h2>5. Communications from the Mayor:</h2>

<ul>
  <li>
    <strong>5.1</strong>
    <a href={Router.meetingItem(MEETING, "holiday-luncheon-gift-sarahs-place")}>
      Gift for the Holiday Luncheon, Sarah&rsquo;s Place
    </a>
  </li>
  <li>
    <strong>5.2</strong>
    <a href={Router.meetingItem(MEETING, "thanksgiving-luncheon-gift-wingate-residences")}>
      Gift for the Thanksgiving Luncheon, Wingate Residences at Haverhill
    </a>
  </li>
  <li>
    <strong>5.3</strong>
    <a href={Router.meetingItem(MEETING, "police-patrolman-association-agreement")}>
      Memorandum of Agreement, Police Patrolman Association Group
    </a>
    <FileTenDays />
  </li>
  <li>
    <strong>5.4</strong>
    <a href={agendaHref(MEETING, "fiscal-impact-analysis-progress-report")}>
      Fiscal Impact Analysis Progress Report
    </a>
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council:</h2>

<ul>
  <li>
    <strong>6.1</strong>
    <a href={Router.meetingItem(MEETING, "home-rule-age-waiver-jonathan-gagne")}>
      Home Rule Age Waiver, Jonathan Gagne
    </a>
  </li>
  <li>
    <strong>6.2</strong>
    <a href={Router.meetingItem(MEETING, "cogswell-club-grant-recipients")}>
      2025 Cogswell Club Grant Recipients
    </a>
  </li>
</ul>

<h2>7. Public Participation- Requests under Council Rule 28</h2>

<h2>8. Communications and Reports from City Officers and Employees:</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "abatement-report-november-2025")}>
      Abatement Report, November 2025
    </a>
  </li>
</ul>

<h2>9. Utility Hearing(s) and Related Order(s):</h2>

<h2>10. Hearings and Related Orders:</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={agendaHref(MEETING, "233-winter-st-special-permit")}>
      Special Permit, 233 Winter St
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
        <a href={Router.meetingItem(MEETING, "planning-board-resignation")}>
          Resignation, Haverhill Planning Board
        </a>
      </li>
    </ul>
  </li>
</ul>

<h2>12. Petitions:</h2>

<ul>
  <li>
    <strong>12.1 Applications Handicap Parking Sign:</strong>
    <em>with Police approval</em>
  </li>
  <li><strong>12.2 Amusement/Event Application<em>:</em></strong> <em>with Police approval</em></li>
  <li><strong>12.3 Auctioneer License</strong>:</li>
  <li><strong>12.4 Tag Days</strong><em>: with Police approval</em></li>
  <li><strong>12.5 One Day Liquor License &ndash;with HPD approval</strong></li>
  <li>
    <strong>12.6 ANNUAL LICENSE RENEWALS:</strong>
    <ul>
      <li>
        <strong>12.6.1 Hawker Peddlers License- Fixed location &ndash;</strong>
        <em>w/Police approval</em>
      </li>
      <li>
        <strong>12.6.2 Coin-Op License <em>Renewals</em> &ndash;</strong>
        <em>with Police approval</em>
      </li>
      <li>
        <strong>12.6.3 Christmas Tree Vendor &ndash;</strong> <em>with Police approval</em>
      </li>
      <li>
        <strong>12.6.4 Taxi Driver Licenses for 2024:</strong> <em>with Police approval</em>
      </li>
      <li><strong>12.6.5 Taxi/Limousine License</strong> <em>with Police approval</em></li>
      <li>
        <strong>12.6.6 Junk Dealer /Collector License -</strong> <em>with Police approval</em>
      </li>
      <li><strong>12.6.7 Pool/Billiard</strong></li>
      <li><strong>12.6.8 Bowling</strong></li>
      <li><strong>12.6.9 Sunday Bowling</strong></li>
      <li>
        <strong>12.6.10 Buy &amp; Sell Second Hand Articles</strong>
        <em>with Police approval</em>
      </li>
      <li>
        <strong>12.6.11 Buy &amp; Sell Second Hand Clothing</strong>
        <em>with Police approval</em>
      </li>
      <li><strong>12.6.12 Pawnbroker license</strong> - <em>with police approval</em></li>
      <li><strong>12.6.13 Fortune Teller</strong> <em>with - Police approval</em></li>
      <li>
        <strong>12.6.14 Buy &amp; Sell Old Gold &ndash;</strong> <em>with Police approval</em>
      </li>
      <li><strong>12.6.15 Roller Skating Rink</strong></li>
      <li><strong>12.6.16 Sunday Skating</strong></li>
      <li><strong>12.6.17 Exterior Vending Machines/Redbox Automated Retail, LLC</strong></li>
      <li>
        <strong>12.6.18 Limousine/Livery License/Chair Cars</strong>
        <em>with Police approval</em>
      </li>
    </ul>
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

<h2>15. Communications from Councilors:</h2>

<ul>
  <li>
    <strong>15.1</strong>
    <a href={Router.meetingItem(MEETING, "pedestrian-safety")}>Pedestrian Safety in Haverhill</a>
  </li>
</ul>

<h2>16. Unfinished Business of Preceeding Meeting:</h2>

<h2>17. Resolutions and Proclamations:</h2>

<h2>18. Council Committee Reports and Announcements:</h2>

<h2>19. Documents referred to committee study:</h2>

<h2>20. Long term matters study list:</h2>

<h2>21. Adjourn:</h2>

<!-- The clerk files the minutes as the agenda annotated in place, so they
     number the sections differently from the agenda from 6 on (a second "6"
     for public participation, and everything after it one lower). Each item's
     own record is on its page; what is left here is what belongs to no item,
     under the minutes' own numbers. -->
<h2>Minutes</h2>

<p>City Clerk: Kaitlin M. Wright</p>

<p>
  <strong>3. Approval of minutes of prior meeting</strong><br />
  Vice President Jordan stated he reviewed the minutes and finds them in order.<br />
  Motion by Vice President Jordan to place on file, second by Councilor Lewandowski<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Rogers)
</p>

<p>
  <strong>4. Assignment of the minutes review for the next Meeting:</strong><br />
  President Sullivan assigned the minutes to Councilor Lewandowski
</p>

<p>
  <strong>17 Council Committee Reports and Announcements:</strong>
</p>

<ul>
  <li>Vice President Jordan noted the Jr. ROTC has a fundraiser at G&rsquo;s tomorrow night.</li>
</ul>

<p>
  <strong>20 Adjourn:</strong> Motion by Vice President Jordan to adjourn, second by Councilor
  Basiliere<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Rogers) <strong>Adjourned: 22:19</strong>
</p>

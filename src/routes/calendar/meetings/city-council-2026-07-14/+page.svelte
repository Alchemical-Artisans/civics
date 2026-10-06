<script lang="ts">
  import { Router } from "$lib/router"
  import { agendaHref } from "$lib/projects"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-07-14"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of minutes of prior meeting</h2>

<h2>4. Assignment of the minutes review for the next Meeting</h2>

<h2>5. Communications from the Mayor</h2>

<ul>
  <li>
    <strong>5.1</strong>
    <a href={Router.meetingItem(MEETING, "declaration-of-independence-reading")}>
      Declaration of Independence Reading Video
    </a>
  </li>
  <li>
    <strong>5.2</strong>
    <a href={Router.meetingItem(MEETING, "whittier-regional-agreement-amendment-committee-update")}>
      Whittier Regional Agreement Amendment Committee Update
    </a>
  </li>
  <li>
    <strong>5.3</strong>
    <a href={Router.meetingItem(MEETING, "force-main-sewer-break-update")}>
      42-Inch Force Main Sewer Break Update
    </a>
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council</h2>

<h2>7. Public Participation- Requests under Council Rule 28</h2>

<h2>8. Communications and Reports from City Officers and Employees</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "monthly-abatement-report")}>
      Monthly Abatement Report, June
    </a>
  </li>
  <li>
    <strong>8.2</strong>
    <a href={agendaHref(MEETING, "polling-place-changes")}>Polling Place Changes</a>
  </li>
  <li>
    <strong>8.3</strong>
    <a href={agendaHref(MEETING, "primary-election-warrant")}>
      Election Warrant, 2026 State Primary
    </a>
  </li>
  <li>
    <strong>8.4</strong>
    <a href={Router.meetingItem(MEETING, "road-opening-136-winter-st")}>
      Road Opening, 136 Winter St, EROM-26-16
    </a>
  </li>
</ul>

<h2>9. Utility Public Hearing(s) and Related Order(s)</h2>

<ul>
  <li>
    <strong>9.1</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-south-prospect-st")}>
      Joint Pole Location, South Prospect St
    </a>
  </li>
  <li>
    <strong>9.2</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-location-water-st")}>
      Joint Pole Location, Water St
    </a>
  </li>
</ul>

<h2>10. Public Hearings and Related Orders</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={Router.meetingItem(MEETING, "merrimack-st-special-permit")}>
      Special Permit, 121 Merrimack St, Planning Board Hearing Continued to September 9
    </a>
  </li>
  <li>
    <strong>10.2</strong>
    <a href={Router.meetingItem(MEETING, "battery-energy-storage-systems-ordinance")}>
      Continue Hearing for Battery Energy Storage Systems Ordinance to August 25, 2026
    </a>
  </li>
  <li>
    <strong>10.3</strong>
    <a href={Router.meetingItem(MEETING, "marijuana-social-consumption-zoning-request")}>
      Marijuana Social Consumption Zoning Request, Application Withdrawn
    </a>
  </li>
</ul>

<h2>11. Appointments</h2>

<h2>12. Petitions</h2>

<ul>
  <li>
    <strong>12.1</strong>
    <a href={Router.meetingItem(MEETING, "special-permit-16-margin-st")}>
      Special Permit, 16 Margin St, Hearing for August 11, 2026
    </a>
  </li>
  <li>
    <strong>12.2</strong>
    <a href={Router.meetingItem(MEETING, "special-permit-125-river-st")}>
      Special Permit, 125 River St, Hearing for August 25, 2026
    </a>
  </li>
  <li><strong>12.3 Applications Handicap Parking Sign:</strong> <em>with Police approval</em></li>
  <li>
    <strong>12.4 Amusement/Event Application:</strong> <em>with Police approval</em>
    <ul>
      <li>
        <strong>12.4.1</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>
          Woofstock 2026, Cyndie&rsquo;s Methodical Media
        </a>
      </li>
    </ul>
  </li>
  <li><strong>12.5 Auctioneer License</strong>:</li>
  <li>
    <strong>12.6 Tag Days</strong>: <em>with Police approval</em>
    <ul>
      <li>
        <strong>12.6.1</strong>
        <a href={Router.meetingItem(MEETING, "tag-days")}
          >Haverhill Lions Club, September 12, 2026</a
        >
      </li>
    </ul>
  </li>
  <li>
    <strong>12.7 One Day Liquor License</strong> &ndash;with Police and License Commission approval
    <ul>
      <li>
        <strong>12.7.1</strong>
        <a href={Router.meetingItem(MEETING, "one-day-liquor-license")}>
          River Ruckus Festival, Team Haverhill
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>12.8</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}> Annual License Renewals </a>
  </li>
</ul>

<h2>13. Motions and Orders</h2>

<ul>
  <li>
    <strong>13.1</strong>
    <a href={Router.meetingItem(MEETING, "fy26-budget-transfers")}>FY26 Budget Transfers</a>
  </li>
</ul>

<h2>14. Ordinances (File 10 days)</h2>

<h2>15. Communications from Councilors</h2>

<ul>
  <li>
    <strong>15.1</strong>
    <a href={Router.meetingItem(MEETING, "public-safety-committee-meeting")}>
      Public Safety Committee, July 29, 2026
    </a>
  </li>
</ul>

<h2>16. Unfinished Business of Preceding Meeting</h2>

<h2>17. Resolutions and Proclamations</h2>

<h2>18. Council Committee Reports and Announcements</h2>

<h2>
  <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
    19. Documents referred to committee study
  </a>
</h2>

<h2>20. Long term matters study list</h2>

<h2>21. Adjourn</h2>

<h2>Minutes</h2>

<p>
  Present: Councilors Jordan, Basiliere, Sullivan, Ferreira, Michitson, Lewandowski, LePage and
  Rogers<br />
  Remote: Councilor McGonagle<br />
  Absent: Councilors Toohey and Diodati<br />
  City Clerk: Kaitlin M. Wright-Esposito
</p>

<p>
  <strong>3. Approval of minutes of prior meeting</strong><br />
  Councilor LePage stated he reviewed the minutes and finds them in order, Second by Councilor Lewandowski<br
  />
  PASSED &ndash; Yeas 9, Nays 0, Absent 2 (Toohey and Diodati)
</p>

<p>
  <strong>4. Assignment of the minutes review for the next Meeting:</strong><br />
  President Jordan assigned the minutes to Councilor Rogers
</p>

<p>
  <strong>21. Adjourn</strong><br />
  Motion by Councilor Sullivan to adjourn, Second by Councilor Rogers<br />
  PASSED &ndash; Yeas 9, Nays 0, Absent 2 (Toohey and Diodati)<br />
  ADJOURNED: 20:47
</p>

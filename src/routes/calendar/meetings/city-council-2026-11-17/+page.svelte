<script lang="ts">
  import { Router } from "$lib/router"
  import { agendaHref } from "$lib/projects"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-11-17"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of minutes of prior meeting</h2>

<h2>4. Assignment of the minutes review for the next Meeting:</h2>

<h2>5. Communications from the Mayor:</h2>

<ul>
  <li>
    <strong>5.1</strong> Mayor Barrett submits the following gift order:
    <ul>
      <li>
        <strong>5.1.1</strong>
        <a href={Router.meetingItem(MEETING, "sculpture-gift-dale-rogers")}>
          Gift of a Sculpture, Dale Rogers
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>5.2</strong> Mayor Barrett submits the following gift order:
    <ul>
      <li>
        <strong>5.2.1</strong>
        <a href={Router.meetingItem(MEETING, "vietnam-veterans-memorial-gift-louis-fossarelli")}>
          Gift to the Vietnam Veterans Memorial in Honor of Louis Fossarelli
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>5.3</strong> Mayor Barrett submits the following gift order:
    <ul>
      <li>
        <strong>5.3.1</strong>
        <a href={Router.meetingItem(MEETING, "vietnam-veterans-memorial-plaque-gift")}>
          Plaque Restoration at the Vietnam Veterans Memorial
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>5.4</strong>
    <a href={Router.meetingItem(MEETING, "waterway-fund-crane-services")}>
      Waterway Fund, Crane Services for Docks
    </a>
  </li>
  <li>
    <strong>5.5</strong> Mayor Barrett submits the following donations:
    <ul>
      <li>
        <strong>5.5.1</strong>
        <a href={Router.meetingItem(MEETING, "holiday-luncheon-donations")}>
          Holiday Luncheon Donations, Council on Aging
        </a>
      </li>
    </ul>
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council:</h2>

<h2>7. Public Participation- Requests under Council Rule 28:</h2>

<h2>8. Communications and Reports from City Officers and Employees:</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "road-opening-91-gale-ave")}>Road Opening, 91 Gale Ave</a>
  </li>
  <li>
    <strong>8.2</strong>
    <a href={Router.meetingItem(MEETING, "road-opening-40-south-warren")}>
      Road Opening, 40 South Warren
    </a>
  </li>
  <li>
    <strong>8.3</strong>
    <a href={Router.meetingItem(MEETING, "monthly-abatement-report")}>
      Monthly Abatement Report, October
    </a>
  </li>
</ul>

<h2>9. Utility Public Hearing(s) and Related Order(s):</h2>

<h2>10. Public Hearings and Related Orders:</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={Router.meetingItem(MEETING, "tax-classification-hearing")}>
      Tax Classification Hearing, FY 2027
    </a>
  </li>
</ul>

<h2>11. Appointments:</h2>

<ul>
  <li><strong>11.1 Confirming Appointments:</strong></li>
  <li>
    <strong>11.2 Non-Confirming Appointments:</strong>
    <ul>
      <li>
        <strong>11.2.1</strong>
        <a href={Router.meetingItem(MEETING, "water-abatement-review-board-reappointments")}>
          Water Abatement Review Board Reappointments
        </a>
      </li>
    </ul>
  </li>
  <li><strong>11.3 Constables:</strong></li>
  <li><strong>11.4 Resignation:</strong></li>
</ul>

<h2>12. Petitions:</h2>

<ul>
  <li>
    <strong>12.1</strong>
    <a href={Router.meetingItem(MEETING, "battery-energy-storage-systems-moratorium")}>
      Temporary Moratorium on Battery Energy Storage Systems
    </a>
  </li>
  <li>
    <strong>12.2</strong>
    <a href={Router.meetingItem(MEETING, "national-grid-pole-petition-oak-terrace")}>
      Joint Pole Location, Oak Terrace
    </a>
  </li>
  <li>
    <strong>12.3</strong>
    <a href={Router.meetingItem(MEETING, "national-grid-pole-petition-main-st")}>
      Joint Pole Location, Main St
    </a>
  </li>
</ul>

<h2>13. Applications Handicap Parking Sign: with Police approval</h2>

<ul>
  <li>
    <strong>13.1 Amusement/Event Application:</strong> <em>with Police approval</em>
    <ul>
      <li>
        <strong>13.1.1</strong>
        <a href={Router.meetingItem(MEETING, "haverhill-santa-parade")}>Haverhill Santa Parade</a>
      </li>
    </ul>
  </li>
  <li><strong>13.2 Auctioneer License:</strong></li>
  <li><strong>13.3 Tag Days:</strong> <em>with Police approval</em></li>
  <li>
    <strong>13.4 One Day Liquor License &ndash;with Police &amp; License Commission approval</strong
    >
  </li>
  <li>
    <strong>13.5</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}>ANNUAL LICENSE RENEWALS</a>
  </li>
</ul>

<h2>14. Motions and Orders:</h2>

<h2>15. Ordinances (File 10 days):</h2>

<ul>
  <li>
    <strong>15.1</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-22-hillside-st")}>
      22 Hillside St &ndash; Parking Ordinance
    </a>
  </li>
</ul>

<h2>16. Communications from Councilors:</h2>

<ul>
  <li>
    <strong>16.1</strong>
    <a href={Router.meetingItem(MEETING, "2027-city-council-meeting-schedule")}>
      2027 City Council Meeting Schedule
    </a>
  </li>
</ul>

<h2>17. Unfinished Business of Preceding Meeting:</h2>

<ul>
  <li>
    <strong>17.1</strong>
    <a href={agendaHref(MEETING, "golden-hill-roof-replacement-bonds")}>
      Golden Hill Elementary School Roof Replacement Bonds
    </a>
  </li>
  <li>
    <strong>17.2</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-310-washington-st")}>
      310 Washington St &ndash; No Parking Ordinance
    </a>
  </li>
  <li>
    <strong>17.3</strong>
    <a
      href={Router.meetingItem(MEETING, "parking-ordinance-washington-st-niagara-to-pleasant-view")}
    >
      Washington St, Niagara St to Pleasant View Ave &ndash; No Parking Ordinance
    </a>
  </li>
  <li>
    <strong>17.4</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-20-park-st")}>
      20 Park St &ndash; No Parking Ordinance
    </a>
  </li>
  <li>
    <strong>17.5</strong>
    <a href={Router.meetingItem(MEETING, "high-school-fire-alarm-bonds")}>
      Haverhill High School Fire Alarm Project Bonds
    </a>
  </li>
  <li>
    <strong>17.6</strong>
    <a href={Router.meetingItem(MEETING, "snow-plan-update")}>Snow Plan Update</a>
  </li>
</ul>

<h2>18. Resolutions and Proclamations:</h2>

<h2>19. Council Committee Reports and Announcements:</h2>

<h2>20. Documents Referred to Committee Study:</h2>

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
      Documents Referred to Committee Study
    </a>
  </li>
</ul>

<h2>21. Long Term Matters Study List:</h2>

<h2>22. Adjourn:</h2>

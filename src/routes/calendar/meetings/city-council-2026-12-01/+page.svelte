<script lang="ts">
  import FileTenDays from "$lib/FileTenDays.svelte"
  import { Router } from "$lib/router"
  import { agendaHref } from "$lib/projects"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2026-12-01"
</script>

<!-- The city published this agenda in two files, the outline and the first
     half of the packet in one and the rest of the packet in the other; the
     outline is the same six pages either way, so it is transcribed once. -->

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of minutes of prior meeting</h2>

<h2>4. Assignment of the minutes review for the next Meeting:</h2>

<h2>5. Communications from the Mayor:</h2>

<ul>
  <li>
    <strong>5.1</strong> Mayor Barrett submits the following order:
    <ul>
      <li>
        <strong>5.1.1</strong>
        <a href={Router.meetingItem(MEETING, "all-night-parking-ordinance")}>
          All-Night Parking Ordinance
        </a>
        <FileTenDays />
      </li>
    </ul>
  </li>
  <li>
    <strong>5.2</strong> Mayor Barrett submits the following gift order:
    <ul>
      <li>
        <strong>5.2.1</strong>
        <a href={Router.meetingItem(MEETING, "golden-hill-playground-gift")}>
          Gift of the Golden Hill Elementary School Playground
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>5.3</strong> Mayor Barrett submits the following order to authorize investment of OPEB
    (other post-employment benefits) trust funds:
    <ul>
      <li>
        <strong>5.3.1</strong>
        <a href={Router.meetingItem(MEETING, "opeb-trust-investment")}>
          Investment of OPEB Trust Funds
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>5.4</strong> Mayor Barrett submits the following order to amend the following loan order
    which was approved on October 1, 2016
    <ul>
      <li>
        <strong>5.4.1</strong>
        <a href={agendaHref(MEETING, "new-drinking-water-source-loan-order")}>
          Loan Order, New Drinking Water Source
        </a>
        <FileTenDays />
      </li>
    </ul>
  </li>
  <li>
    <strong>5.5</strong> Mayor Barrett submits the following gift order:
    <ul>
      <li>
        <strong>5.5.1</strong>
        <a href={Router.meetingItem(MEETING, "happy-rides-gift")}>
          Gift for the Happy Rides Program, Breakfast Exchange Club
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>5.6</strong> Mayor Barrett submits the following gift donations:
    <ul>
      <li>
        <strong>5.6.1</strong>
        <a href={Router.meetingItem(MEETING, "holiday-luncheon-donations")}>
          Holiday Luncheon Donations, Council on Aging
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>5.7</strong>
    <a href={Router.meetingItem(MEETING, "water-emergency-declaration-update")}>
      Water Emergency Declaration Update
    </a>
  </li>
</ul>

<h2>6. Communications from Councilors to introduce an individual(s) to address The Council:</h2>

<ul>
  <li>
    <strong>6.1</strong>
    <a href={Router.meetingItem(MEETING, "haverhill-bank-tom-mortimer")}>
      Recognition of Tom Mortimer, Haverhill Bank
    </a>
  </li>
  <li>
    <strong>6.2</strong>
    <a href={Router.meetingItem(MEETING, "downtown-parking-concerns")}>Downtown Parking Concerns</a>
  </li>
</ul>

<h2>7. Public Participation- Requests under Council Rule 28:</h2>

<h2>8. Communications and Reports from City Officers and Employees:</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "revenue-and-expense-reports")}>
      Revenue and Expense Reports, October 2026
    </a>
  </li>
</ul>

<h2>9. Utility Public Hearing(s) and Related Order(s):</h2>

<ul>
  <li>
    <strong>9.1</strong>
    <a href={Router.meetingItem(MEETING, "national-grid-pole-petition-north-broadway")}>
      Joint Pole Location, North Broadway
    </a>
  </li>
  <li>
    <strong>9.2</strong>
    <a href={Router.meetingItem(MEETING, "national-grid-pole-petition-east-broadway")}>
      Joint Pole Location, East Broadway
    </a>
  </li>
</ul>

<h2>10. Public Hearings and Related Orders:</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={agendaHref(MEETING, "pentucket-north-planned-development-district")}>
      Pentucket North Planned Development District
    </a>
  </li>
  <li>
    <strong>10.2</strong>
    <a href={Router.meetingItem(MEETING, "battery-energy-storage-systems-moratorium")}>
      Temporary Moratorium on Battery Energy Storage Systems
    </a>
  </li>
  <li>
    <strong>10.3</strong>
    <a href={agendaHref(MEETING, "battery-energy-storage-systems-ordinance-hilldale-ave")}>
      Battery Energy Storage Systems Ordinance, Hilldale Ave Location
    </a>
  </li>
</ul>

<h2>11. Appointments:</h2>

<ul>
  <li><strong>11.1 Confirming Appointments:</strong></li>
  <li><strong>11.2 Non-Confirming Appointments:</strong></li>
  <li><strong>11.3 Constables:</strong></li>
  <li><strong>11.4 Resignation:</strong></li>
</ul>

<h2>12. Petitions:</h2>

<ul>
  <li>
    <strong>12.1</strong>
    <a href={Router.meetingItem(MEETING, "national-grid-pole-petition-sixth-ave")}>
      Joint Pole Location, Sixth Ave
    </a>
  </li>
  <li>
    <strong>12.2 Applications Handicap Parking Sign:</strong> <em>with Police approval</em>
  </li>
  <li>
    <strong>12.3 Amusement/Event Application:</strong> <em>with Police approval</em>
  </li>
  <li><strong>12.4 Auctioneer License</strong>:</li>
  <li><strong>12.5 Tag Days</strong>: <em>with Police approval</em></li>
  <li>
    <strong>12.6 One Day Liquor License &ndash;with Police &amp; License Commission approval</strong
    >
  </li>
  <li>
    <strong>12.7</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}>ANNUAL LICENSE RENEWALS</a>
  </li>
</ul>

<h2>13. Motions and Orders:</h2>

<ul>
  <li>
    <strong>13.1</strong>
    <a href={Router.meetingItem(MEETING, "pay-previous-years-bills")}>FY25 Bills</a>
  </li>
</ul>

<h2>14. Ordinances (File 10 days):</h2>

<h2>15. Communications from Councilors:</h2>

<ul>
  <li>
    <strong>15.1</strong>
    <a href={Router.meetingItem(MEETING, "social-consumption-of-cannabis-update")}>
      Social Consumption of Cannabis Update
    </a>
  </li>
  <li>
    <strong>15.2</strong>
    <a href={Router.meetingItem(MEETING, "germain-ave-traffic-safety")}>
      Traffic Safety on Germain Ave
    </a>
  </li>
  <li>
    <strong>15.3</strong>
    <a href={Router.meetingItem(MEETING, "flock-cameras")}>
      Flock Cameras and License Plate Monitoring
    </a>
  </li>
</ul>

<h2>16. Unfinished Business of Preceding Meeting:</h2>

<ul>
  <li>
    <strong>16.1</strong>
    <a href={Router.meetingItem(MEETING, "snow-plan-update")}>Snow Plan Update</a>
  </li>
  <li>
    <strong>16.2</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-22-hillside-st")}>
      22 Hillside St &ndash; Parking Ordinance
    </a>
  </li>
</ul>

<h2>17. Resolutions and Proclamations:</h2>

<h2>18. Council Committee Reports and Announcements:</h2>

<h2>19. Documents Referred to Committee Study:</h2>

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
      Documents Referred to Committee Study
    </a>
  </li>
</ul>

<h2>20. Long Term Matters Study List:</h2>

<h2>21. Adjourn:</h2>

<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
</script>

<h2>1. Opening Prayer</h2>

<h2>2. Pledge of Allegiance</h2>

<h2>3. Approval of Minutes of Prior Meeting</h2>

<h2>4. Assignment of the Minutes Review for the Next Meeting</h2>

<h2>5. Communications from the Mayor</h2>

<ul>
  <li>
    <strong>5.1</strong>
    <a href={Router.meetingItem(MEETING, "drought-emergency-update")}> Drought Emergency Update </a>
  </li>
</ul>

<h2>6. Communications from Councilors to Introduce an Individual(s) to Address The Council</h2>

<ul>
  <li>
    <strong>6.1</strong>
    <a href={Router.meetingItem(MEETING, "haverhill-exchange-club-big-e-award")}>
      Haverhill Exchange Club, Big E Award
    </a>
  </li>
  <li>
    <strong>6.2</strong>
    <a href={Router.meetingItem(MEETING, "haverhill-community-playground-update")}>
      Haverhill Community Playground Update
    </a>
  </li>
</ul>

<h2>7. Public Participation- Requests under Council Rule 28</h2>

<h2>8. Communications and Reports from City Officers and Employees</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "fy2027-tax-classification-hearing")}>
      FY2027 Tax Classification Hearing
    </a>
  </li>
  <li>
    <strong>8.2</strong>
    <a href={Router.meetingItem(MEETING, "monthly-abatement-report")}>
      Monthly Abatement Report, August
    </a>
  </li>
  <li>
    <strong>8.3</strong>
    <a href={Router.meetingItem(MEETING, "road-opening-628-main-st")}>
      Road Opening, 628 Main St, EROM-26-20
    </a>
  </li>
  <li>
    <strong>8.4</strong>
    <a href={Router.meetingItem(MEETING, "road-opening-1-macon-ave")}>
      Road Opening, 1 Macon Ave, EROM-26-21
    </a>
  </li>
  <li>
    <strong>8.5</strong>
    <a href={Router.meetingItem(MEETING, "road-opening-36-arlington-st")}>
      Road Opening, 36 Arlington St, EROM-26-22
    </a>
  </li>
</ul>

<h2>9. Utility Public Hearing(s) and Related Order(s)</h2>

<ul>
  <li>
    <strong>9.1</strong>
    <a href={Router.meetingItem(MEETING, "joint-pole-emerson-st")}>
      Joint Pole Location, Emerson St
    </a>
  </li>
</ul>

<h2>10. Public Hearings and Related Orders</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={Router.meetingItem(MEETING, "marshland-st-special-permit")}>
      Continue Hearing for 27 Marshland St to October 6, 2026
    </a>
  </li>
  <li>
    <strong>10.2</strong>
    <a href={Router.meetingItem(MEETING, "merrimack-st-special-permit")}>
      Withdraw Special Permit Application for 121 Merrimack St
    </a>
  </li>
  <li>
    <strong>10.3</strong>
    <a href={Router.meetingItem(MEETING, "battery-energy-storage-systems-ordinance")}>
      Battery Energy Storage Systems Ordinance
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
        <a href={Router.meetingItem(MEETING, "confirming-appointments")}> Mary Grise </a>
      </li>
      <li>
        <strong>11.1.2</strong>
        <a href={Router.meetingItem(MEETING, "confirming-appointments")}> Wendy Sczechowicz </a>
      </li>
    </ul>
  </li>
  <li><strong>11.2</strong> Non-Confirming Appointments:</li>
</ul>

<h2>12. Petitions</h2>

<ul>
  <li>
    <strong>12.1</strong>
    <a href={Router.meetingItem(MEETING, "chapter-255-zoning-amendments")}>
      Proposed Amendments to Chapter 255, Zoning
    </a>
  </li>
  <li><strong>12.2</strong></li>
  <li><strong>12.3 Applications Handicap Parking Sign:</strong> <em>with Police approval</em></li>
  <li>
    <strong>12.4 Amusement/Event Application:</strong>
    <em>with Police approval</em>
    <ul>
      <li>
        <strong>12.4.1</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>
          Art Show, Rocks Village Memorial Association
        </a>
      </li>
      <li>
        <strong>12.4.2</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>
          Free Fall Event, Fresh Start Brew Co.
        </a>
      </li>
      <li>
        <strong>12.4.3</strong>
        <a href={Router.meetingItem(MEETING, "event-applications")}>
          Vintage Bazaar Fall Festival, Vintage Bazaar New England
        </a>
      </li>
    </ul>
  </li>
  <li><strong>12.5 Auctioneer License</strong></li>
  <li>
    <strong>12.6 Tag Days</strong>: <em>with Police approval</em>
    <ul>
      <li>
        <strong>12.6.1</strong>
        <a href={Router.meetingItem(MEETING, "tag-days")}>
          Haverhill High Wrestling, September 26 &amp; September 27
        </a>
      </li>
      <li>
        <strong>12.6.2</strong>
        <a href={Router.meetingItem(MEETING, "tag-days")}>
          Haverhill High Girls Varsity Field Hockey Team, October 23, 24, and 25
        </a>
      </li>
    </ul>
  </li>
  <li>
    <strong>12.7 One Day Liquor License</strong> &ndash;with Police and License Commission approval
  </li>
  <li>
    <strong>12.8</strong>
    <a href={Router.meetingItem(MEETING, "annual-license-renewals")}> Annual License Renewals </a>
  </li>
</ul>

<h2>13. Motions and Orders</h2>

<h2>14. Ordinances (File 10 Days)</h2>

<ul>
  <li>
    <strong>14.1</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-12-blaisdell-st")}>
      12 Blaisdell St &ndash; No Parking Ordinance
    </a>
  </li>
  <li>
    <strong>14.2</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-16-forest-ave")}>
      16 Forest Ave &ndash; No Parking Ordinance
    </a>
  </li>
  <li>
    <strong>14.3</strong>
    <a href={Router.meetingItem(MEETING, "parking-ordinance-9-varnum-st")}>
      9 Varnum St &ndash; No Parking Ordinance (Deletion)
    </a>
  </li>
</ul>

<h2>15. Communications from Councilors</h2>

<ul>
  <li>
    <strong>15.1</strong>
    <a href={Router.meetingItem(MEETING, "planning-development-committee-summary")}>
      Planning and Development Committee Summary
    </a>
  </li>
</ul>

<h2>16. Unfinished Business of Preceding Meeting</h2>

<ul>
  <li>
    <strong>16.1</strong>
    <a href={Router.meetingItem(MEETING, "south-mill-street-loan-order")}>
      Loan Order &ndash; South Mill Street Pumping Station and Force Main Improvements
    </a>
  </li>
  <li>
    <strong>16.2</strong>
    <a href={Router.meetingItem(MEETING, "mohawk-trail-no-parking")}>
      Mohawk Trail &ndash; No Parking Ordinance
    </a>
  </li>
</ul>

<h2>17. Resolutions and Proclamations</h2>

<h2>18. Council Committee Reports and Announcements</h2>

<h2>19. Documents Referred to Committee Study</h2>

<h2>20. Long Term Matters Study List</h2>

<h2>21. Adjourn</h2>

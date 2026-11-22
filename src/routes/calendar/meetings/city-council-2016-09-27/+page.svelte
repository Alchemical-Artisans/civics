<script lang="ts">
  import FileTenDays from "$lib/FileTenDays.svelte"
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the document's id. */
  const MEETING = "city-council-2016-09-27"
</script>

<h2>Agenda</h2>

<h2>1. Approval of Records of the Previous Meeting</h2>

<h2>2. Assignment of the Minutes Review for the Next Meeting</h2>

<h2>3. Communications from the Mayor:</h2>

<ul>
  <li>
    <strong>3.1</strong>
    <a href={Router.meetingItem(MEETING, "new-drinking-water-source-loan-order")}>
      Loan Order, New Drinking Water Source
    </a>
    <FileTenDays />
  </li>
</ul>

<h2>4. Communications and Reports from City Officers and Employees</h2>

<ul>
  <li>
    <strong>4.1</strong>
    <a href={Router.meetingItem(MEETING, "lake-street-zoning-line-adjustments")}>
      Zoning Ordinance &ndash; Lake Street Area Zone Line Adjustments
    </a>
    <FileTenDays />
  </li>
</ul>

<h2>5. Utility Hearing(s) and Related Order(s)</h2>

<p><u>NO SCHEDULE</u></p>

<h2>6. Appointments:</h2>

<p><u>NO SCHEDULES</u></p>

<h3><u>Confirming Appointments</u></h3>

<h3><u>Non-confirming Appointments</u></h3>

<h3><u>Resignations</u></h3>

<h2>7. Petitions</h2>

<ul>
  <li>
    <strong>7.1</strong>
    <a href={Router.meetingItem(MEETING, "al-forno-building-special-permit")}>
      Special Permit, 81-87 Washington St
    </a>
  </li>
</ul>

<h2>8. Applications/Handicap Parking Signs:</h2>

<ul>
  <li>
    <strong>8.1</strong>
    <a href={Router.meetingItem(MEETING, "handicap-parking-signs")}>Rodney Ball</a>
  </li>
  <li>
    <strong>8.2</strong>
    <a href={Router.meetingItem(MEETING, "handicap-parking-signs")}>Joseph Miller</a>
  </li>
</ul>

<h2>9. One Day Liquor Licenses:</h2>

<p><u>NO SCHEDULE</u></p>

<h2>10. Applications for Permit</h2>

<ul>
  <li>
    <strong>10.1</strong>
    <a href={Router.meetingItem(MEETING, "walk-for-youth")}>Walk for Youth, Boys &amp; Girls Club</a
    >
  </li>
</ul>

<h2>11. Tag Days</h2>

<p><u>NO SCHEDULE</u></p>

<h2>
  <a href={Router.meetingItem(MEETING, "annual-license-renewals")}>
    12. Annual License Renewals:
  </a>
</h2>

<p><strong><u>Hawker/Peddler</u></strong></p>

<h2>13. Drainlayer 2016 License</h2>

<p><u>NO SCHEDULE</u></p>

<h2>14. Hearings &amp; Related Orders:</h2>

<ul>
  <li>
    <strong>14.2</strong>
    <a href={Router.meetingItem(MEETING, "demolition-order-425-washington-st")}>
      Vacate Demolition Order, 425 Washington St
    </a>
  </li>
</ul>

<h2>15. New Business/Orders:</h2>

<p><u>NO SCHEDULE</u></p>

<h2>16. Ordinances (File 10 days):</h2>

<p><u>NO SCHEDULE</u></p>

<h2>17. Unfinished Business:</h2>

<p><u>NO SCHEDULE</u></p>

<h2>18. Monthly Reports</h2>

<p><u>NO SCHEDULE</u></p>

<h2>19. Communication from Councillors</h2>

<ul>
  <li>
    <strong>19.1</strong>
    <a href={Router.meetingItem(MEETING, "financial-and-planning-data-tax-classification")}>
      Financial and Planning Data for Tax Classification
    </a>
  </li>
  <li>
    <strong>19.2</strong>
    <a href={Router.meetingItem(MEETING, "lighting-on-riverview-st")}>Lighting on Riverview St</a>
  </li>
  <li>
    <strong>19.3</strong>
    <a href={Router.meetingItem(MEETING, "hc-media-awards")}>HC Media Awards</a>
  </li>
  <li>
    <strong>19.4</strong>
    <a href={Router.meetingItem(MEETING, "central-plaza-bethany-avenue-crosswalk")}>
      Central Plaza/Bethany Avenue Crosswalk Safety
    </a>
  </li>
  <li>
    <strong>19.5</strong>
    <a href={Router.meetingItem(MEETING, "fantini-bakery-noise")}>
      Noise at Fantini Bakery, Currier Square
    </a>
  </li>
  <li>
    <strong>19.6</strong>
    <a href={Router.meetingItem(MEETING, "cross-rd-and-boston-rd-project")}>
      Project at Cross Rd and Boston Rd, Ward Hill
    </a>
  </li>
  <li>
    <strong>19.7</strong>
    <a href={Router.meetingItem(MEETING, "carleton-st-and-broadway-traffic")}>
      Traffic at Carleton St and Broadway
    </a>
  </li>
</ul>

<h2>20. Resolutions and Proclamations</h2>

<p><u>NO SCHEDULE</u></p>

<h2>21. Council Committee Reports and Announcements</h2>

<ul>
  <li>
    <strong>21.1</strong>
    <a href={Router.meetingItem(MEETING, "public-safety-committee-minutes")}>
      Public Safety Committee Minutes, September 12, 2016
    </a>
  </li>
</ul>

<h2>
  <a href={Router.meetingItem(MEETING, "documents-referred-to-committee-study")}>
    22. Documents Referred to Committee Study
  </a>
</h2>

<h2>23. Adjourn</h2>

<h2>Minutes</h2>

<p>
  Present &ndash; President Michitson, Councillors Barrett, Vargas, McGonagle, Bevilacqua, LePage,
  Daly O&rsquo;Brien, Macek and Sullivan.<br />
  City Clerk &ndash; Linda L. Koutoulas
</p>

<h3>1. Approval of Records of the Previous Meeting</h3>
<p>The minutes were approved. Yeas 9, Nays 0</p>

<h3>2. Assignment of the minutes review for the next Meeting</h3>
<p>Councillor LePage was assigned the minutes.</p>

<h3>3. Communications from the Mayor:</h3>
<p>
  Mayor Fiorentini submits Loan Order along with Authority to File a document to fund the cost of
  planning, engineering, and construction to develop a new back up drinking water source for the
  City of Haverhill with related communication from Robert Ward, Deputy Director<br />
  PLACED ON FILE 26N
</p>
<p>
  ORDERED: That $17,168,750.00 is appropriated for the purpose of financing the planning,
  engineering and construction of improvements to develop a new drinking water source (see document
  for complete text)<br />
  PLACED ON FILE for at least 10 days Yeas 9, Nays 0 15J
</p>

<h3>4. Communications and Reports from City Officers and Employees</h3>
<p>
  Communication from William Pillsbury, City&rsquo;s Economic Development and Planning Director,
  requesting Hearing: regarding an amendment to Zoning Ordinance &ndash; Lake Street area; RR &amp;
  RM zoning line adjustments and submits related Zoning Ordinance<br />
  REFERRED TO PLANNING BOARD<br />
  COUNCIL HEARING NOV 29, 2016 Yeas 9, Nays 0 99
</p>
<p>
  MUNICIPAL ORDINANCE CHAPTER 255<br />
  An Ordinance Relating to Zoning Map (Lake St)<br />
  Be it Ordained by the City Council of the City of Haverhill that Chapter 255, being and is further amended
  as follows:<br />
  Chapter 255 Zoning Ordinance map: The zoning map is further amended to reflect the zone line to be deleted
  and the zone line to be added ash shown on the attached plan (see document for complete text)<br
  />
  PLACED ON FILE for at least 10 days Yeas 9, Nays 0 99B
</p>

<h3>5. Utility Hearing(s) and Related Order(s)</h3>
<p>No Schedule</p>

<h3>6. Appointments:</h3>
<p>No Schedule</p>

<h3>7. Petitions</h3>
<p>
  Petition from Dave Traggorth/Traggorth Companies LLC, requesting Special Permit to redevelop and
  restore 81-87 Washington st; known as the Al Forno Building; to create up to 24 rental apartments,
  including 6 two-bedroom units and 12 one-bedroom units to include 1,900 SF of ground floor retail
  space for lease along Washington st; Assessor&rsquo;s Map 301, Block 52, Lot 6<br />
  REFERRED TO PLANNING BOARD<br />
  COUNCIL HEARING NOV 29, 2016 Yeas 9, Nays 0 100
</p>

<h3>8. Applications/Handicap Parking Signs:</h3>
<p>
  Rodney Ball &ndash; New, 13 &frac12; Grove st<br />
  REFERRED TO PLANNING Yeas 9, Nays 0 59I
</p>
<p>
  Joseph Miller &ndash; Renewal, 20 Swasey st, 1st Floor, Application has police approval<br />
  GRANTED Yeas 9, Nays 0 59J
</p>

<h3>9. One Day Liquor Licenses:</h3>
<p>No Schedule</p>

<h3>10. Applications for Permit</h3>
<p>
  Application from Kathleen Pruett for Boys &amp; Girls Club of Greater Haverhill for &ldquo;Walk
  for Youth&rdquo;; beginning and ending at the Club on 55 Emerson st; Saturday, October 15,
  10:00AM&ndash; 12Noon; with rain date of Sunday, October 16; Application has police approval<br />
  GRANTED Yeas 9, Nays 0 17R
</p>

<h3>11. Tag Days</h3>
<p>No Schedule</p>

<h3>12. Annual License Renewals:</h3>
<p>Limousines</p>
<p>
  Black Tie Limousine Inc, Mark Mollica, 5 Bond st, 52 Limousines<br />
  GRANTED Yeas 9, Nays 0 77L
</p>

<h3>13. Drainlayer 2016 License</h3>
<p>No Schedule</p>

<h3>14. Hearings &amp; Related Orders:</h3>
<p>
  Document 83; Communication from Building, Inspector Richard Osborne, submitting Order to demolish
  building at 425 Washington st; Assessor&rsquo;s Map 511, Block 278, Lot 8<br />
  PLACED ON FILE 83
</p>
<p>
  Document 83-B<br />
  ORDERED: Pursuant to Massachusetts General Law, Chapter 139, Section 1, after hearing, it is hereby
  adjudged that the building(s) at 425 Washington St., Assessor&rsquo;s Map #511, Lot # 8, in Haverhill,
  is a nuisance to the neighborhood and is dangerous, in accordance with the authority bestowed upon us
  by said Chapter, it is hereby ordered that said Building(s) be demolished or repaired. (see document
  for complete text)<br />
  Related communication from Building Inspector Richard Osborne, reporting that this fire damaged building
  has been properly demolished at the expense of the owner and also requests that the Council vacate the
  demolition order<br />
  ON MOTION OF COUNCILLOR MACEK TO VACATE THE DEMOLITION ORDER<br />
  DEMOLITION ORDER VACATED Yeas 9, Nays 0 83B
</p>

<h3>15. New Business/Orders:</h3>
<p>No Schedule</p>

<h3>16. Ordinances (File 10 days):</h3>
<p>No Schedule</p>

<h3>17. Unfinished Business:</h3>
<p>No Schedule</p>

<h3>18. Monthly Reports</h3>
<p>No Schedule</p>

<h3>19. Communication from Councillors</h3>
<p>
  Communication from Councillor Michitson requesting critical financial and planning data to be
  provided to City Council in advance of tax classification hearing schedule for November 15th.<br
  />
  ON MOTION OF COUNCILLOR MICHITSON TO SEND LETTER TO MAYOR REQUESTING UPDATED 5 YR. PLAN WITH EXPENDITURES
  &amp; REVENUES Yeas 9, Nays 0 96K
</p>
<p>
  Communication from Councillor McGonagle requesting to introduce Noa Astor to speak about lighting
  on Riverview st<br />
  ON MOTION OF COUNCILLOR MCGONAGLE TO SEND LETTER TO MAYOR &amp; TRAFFIC AND SAFETY COMMITTEE Yeas 9,
  Nays 0 96L
</p>
<p>
  Communication from Councillor Bevilacqua requesting to recognize HC Media for their recent awards<br
  />
  CITATION PRESENTED FOR BEST ACCESS CENTER FOR NORTHEAST<br />
  PLACED ON FILE Yeas 9, Nays 0 96M
</p>
<p>
  Communication from Councillor McGonagle requesting a discussion about Central Plaza/Bethany Avenue
  crosswalk safety concerns<br />
  JERED STEWART, PRESIDENT/CEO OF BETHANY HOMES SPOKE ABOUT PUBLIC SAFETY CONCERNS AT THE CROSSWALK. COUNCILLOR
  MCGONAGLE STATED THAT HE HAD SPOKEN TO POLICE DEPT. AND THEY HAD SENT A LETTER TO MAYOR SUGGESTING SAFETY
  ENHANCEMENTS.<br />
  ON MOTION OF COUNCILLOR MCGONAGLE TO SEND LETTER TO MAYOR ASKING ABOUT SUGGESTIONS FROM POLICE DEPT
  AND TIMETABLE FOR IMPLEMENTATION; &amp; HIS OFFICE CONTACT DEMOULAS ORGANIZATION Yeas 9, Nays 0 96N
</p>
<p>
  Communication from Councillor Bevilacqua requesting a discussion regarding noise concerns at
  Fantini Bakery, Currier Square<br />
  COUNCILLOR BEVILACQUA STATED THAT THE LONG IDLING OF DIESEL TRUCKS IS NOISY &amp; DISRUPTIVE TO NEIGHBORS
  AND EMISSIONS CAUSING CONCERN.<br />
  ON MOTION OF COUNCILLOR BEVILACQUA TO SEND LETTER TO POLICE DEPT &amp; BUILDING INSPECTOR Yeas 8, Abstain
  1 (Barrett) 96O
</p>
<p>
  Communication from Councillors Macek and McGonagle requesting to discuss concerns regarding the
  project at Cross rd and Boston rd, Rte. 125, Ward Hill<br />
  COUNCILLOR MACEK STATED THAT THE DEVELOPER PROVIDED A LETTER TO ABUTTER, JUDITH RAWDING, ABOUT GRADING
  HER DRIVEWAY/YARD AS REQUESTED<br />
  PLACED ON FILE Yeas 9, Nays 0 96P
</p>
<p>
  Communication from Councillor Bevilacqua requesting a discussion regarding traffic concerns at
  Carleton st and Broadway<br />
  COUNCILLOR BEVILACQUA STATED THAT DRIVERS DO NOT STOP AT THE STOP SIGN AT RTE. 495 EXIT RAMP GOING SOUTH
  THIS CAUSES CONFLICT WITH DRIVERS TRYING TO GET ONTO BROADWAY FROM CARLETON ST<br />
  ON MOTION OF COUNCILLOR BEVILACQUA TO REFER TO APPROPRIATE CITY DEPT. Yeas 9, Nays 0 96Q
</p>

<h3>20. Resolutions and Proclamations</h3>
<p>No Schedule</p>

<h3>21. Council Committee Reports and Announcements</h3>
<p>
  Councillor McGonagle presented Minutes of the Public Safety Committee meeting held on September
  12, 2016. The start time of the meeting should be changed from 7:00PM to 6:00PM. Items discussed
  were: Traffic safety issues on North Ave. and the immediate area - Motion to send letter to Mayor
  requesting study be conducted to eliminate heavy truck traffic from using North Ave; and Motion to
  send letter to Mayor requesting John Pettis reevaluate adding stop signs on North Ave around or
  near Concord St. Discussion about limited access to downtown for residents during major downtown
  events. Motion to send letter from the Council to Chamber of Commerce to coordinate with police
  department a plan for parking during these events. Discussion about tag days &ndash; no
  recommendation to expand new locations. Discussion about street closing notifications. Motion to
  send letter to Mayor asking for notification process be developed.<br />
  MINUTES ACCEPTED AND PLACED ON FILE Yeas 9, Nays 0 19L
</p>
<p>
  Councillor LePage announced the
  <a href={Router.meeting("administration-finance-committee-2016-09-29")}
    >Administration &amp; Finance Committee meeting scheduled for 9/29</a
  >
  at 7:00PM in the City Council office. Items for discussion are Salary Survey Commission findings and
  Permit for Amusements/exhibitions.
</p>
<p>Councillor Macek announced the new local radio station 97.9.</p>
<p>
  Councillor Barrett announced the Friends of the Public Library will be having their semi-annual
  book sale, Sept. 29-Oct1 in the library auditorium.
</p>
<p>
  Councillor McGonagle announced Rebuilding Together fundraiser, Glo Gulf at Garrison Golf Center,
  9/30 at 5:30PM.
</p>

<h3>22. Documents referred to Committee Study</h3>

<p>Meeting adjourned at 8:07 o&rsquo;clock P.M. Yeas 9, Nays 0</p>

<p>
  Attest: Linda Koutoulas<br />
  City Clerk
</p>

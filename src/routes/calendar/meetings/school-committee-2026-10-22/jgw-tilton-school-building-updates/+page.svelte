<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { Router } from "$lib/router"

  const MEETING = "school-committee-2026-10-22"
  const ITEM = "jgw-tilton-school-building-updates"

  /** `Router.excerpt`'s second argument for one document in this item's packet. */
  const excerpt = (document: string) => Router.excerpt(MEETING, `${ITEM}/${document}`)

  // The flyer gives a day and an hour, and no length, so the event runs the
  // two hours section 5 of the transcription rules sets where none is stated.
  const session: CalendarEvent = {
    uid: `${MEETING}-${ITEM}@haverhill.alchemicalartisans.com`,
    title: "Public Information Session, Whittier Middle School Project",
    start: "20261105T180000",
    end: "20261105T200000",
    allDay: false,
    location: "Whittier Middle School cafeteria, 256 Concord Street, Haverhill, MA",
    description: `Public information session on the Whittier Middle School Project.\nSchool Committee agenda item: ${Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`)}`,
    url: Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`),
  }
</script>

<p>JGW/Tilton School Building Updates.</p>

<h2>Join us to learn more about the Whittier Middle School Project!</h2>

<p>
  Parents, students, and community members are invited to hear project updates, ask questions, and
  learn what&rsquo;s next!
</p>

<table>
  <tbody>
    <tr>
      <th scope="row">DATE:</th>
      <td>NOVEMBER 5, 2026</td>
    </tr>
    <tr>
      <th scope="row">TIME:</th>
      <td>6:00 PM</td>
    </tr>
    <tr>
      <th scope="row">LOCATION:</th>
      <td>WHITTIER MIDDLE SCHOOL CAFETERIA</td>
    </tr>
  </tbody>
</table>

<p>Join us to learn more and ask questions.</p>

<div class="not-prose my-4">
  <AddToCalendar event={session} filename="whittier-public-information-session-2026-11-05" />
</div>

<AddressMap
  address="John G. Whittier Middle School, 256 Concord Street, Haverhill, MA"
  lat={42.7976383}
  lon={-71.0783048}
/>

<h2>The Whittier Middle School Project: What You Need to Know</h2>

<p>
  An overview of the project, why is it being considered, and the goals guiding the planning process
</p>

<p>
  Built in 1957, Whittier Middle School has served generations of Haverhill students without a major
  renovation. As the building ages, the City of Haverhill is partnering with the Massachusetts
  School Building Authority (MSBA) to explore long-term solutions that address facility challenges
  and support the educational needs of current and future students.
</p>

<h3>Why Whittier?</h3>

<ul>
  <li>Built in 1957 &mdash; no major renovation completed</li>
  <li>Aging HVAC, electrical &amp; plumbing systems</li>
  <li>Overcrowding in classrooms, hallways &amp; common areas</li>
  <li>Limited science, STEM &amp; student support spaces</li>
</ul>

<h3>Who is the MSBA?</h3>

<ul>
  <li>
    Massachusetts School Building Authority &mdash; state agency partnering with communities on
    school construction &amp; renovation
  </li>
  <li>Provides a structured process : evaluate conditions, needs &amp; potential solutions</li>
  <li>The MSBA reimburses districts for eligible project costs during construction up to 77.4%</li>
  <li>
    The MSBA process is broken down into modules. The process begins with the submission of a
    Statement of Interest (&ldquo;SOI&rdquo;) during their annual open submission period. Haverhill
    submitted their SOI for Whittier Middle School in 2022.
  </li>
</ul>

<h2>Planning for Whittier: What&rsquo;s Being Considered?</h2>

<p>
  The project aims to address Whittier Middle School&rsquo;s facility and educational needs by
  exploring improvements to learning spaces, building systems, and the overall school environment.
  Community input is an important part of the process, helping inform decisions and shape the
  project as it moves from feasibility study through completion.
</p>

<h3>Educational Space Goals</h3>

<ul>
  <li>Dedicated science &amp; STEM learning spaces</li>
  <li>Proper spaces for special education &amp; student support services</li>
  <li>Right-sized library, music &amp; cafeteria areas</li>
  <li>Modern technology infrastructure &amp; electrical capacity</li>
</ul>

<h3>Building &amp; Safety Goals</h3>

<ul>
  <li>Resolve moisture, structural &amp; accessibility challenges</li>
  <li>Replace aging building systems (HVAC, electrical, plumbing)</li>
  <li>Improve energy efficiency &amp; long-term sustainability</li>
  <li>Develop a solution aligned with the District&rsquo;s educational program</li>
</ul>

<h3>Key Milestones</h3>

<ol>
  <li>Feasibility Study <em>&mdash; we are here</em></li>
  <li>Preferred Solution Selection</li>
  <li>Schematic Design &amp; Costs</li>
  <li>MSBA &amp; Local Approvals</li>
  <li>Design &amp; Construction</li>
  <li>Project Completion</li>
</ol>

<h2>
  J.G. Whittier Middle School, Haverhill, MA &mdash;
  <a href={Router.meeting("john-greenleaf-whittier-school-building-committee-2026-10-14")}>
    School Building Committee, October 14, 2026
  </a>
</h2>

<h3>Agenda</h3>

<ol>
  <li>
    WELCOME AND INTRODUCTIONS
    <ol type="a">
      <li>Opening &ndash; SBC Chair</li>
    </ol>
  </li>
  <li>
    REVIEW AND DISCUSSION
    <ol type="a">
      <li>MSBA Process</li>
      <li>Schedule</li>
      <li>Existing Conditions</li>
      <li>Community Outreach</li>
    </ol>
  </li>
  <li>ADJOURNMENT SBC CHAIR</li>
</ol>

<h3>Schedule &mdash; Overall Project</h3>

<table>
  <thead>
    <tr>
      <th scope="col">Milestone</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><td>Haverhill Whittier Middle School Designer Contract Executed</td><td>July 20, 2026</td
      ></tr
    >
    <tr><td>MSBA PDP Submittal</td><td>Dec 9, 2026</td></tr>
    <tr><td>MSBA Board Mtg &ndash; PSR Approval</td><td>June 30, 2027</td></tr>
    <tr><td>MSBA BD Mtg &ndash; Scope &amp; Budget</td><td>Dec 8, 2027</td></tr>
    <tr><td>Local Project Funding Authorization (Votes)</td><td>Mar 13 - 20, 2028</td></tr>
    <tr><td>Construction Start</td><td>Sept 20, 2029</td></tr>
    <tr><td>Substantial Completion of Building Construction</td><td>June18, 2031</td></tr>
    <tr><td>Move-In Complete</td><td>Aug 27, 2031</td></tr>
    <tr><td>First Day of School</td><td>Sep 1, 2031</td></tr>
  </tbody>
</table>

<p>
  Phase lengths given on the same chart: Pre-Design / Feasibility Study 14 mo.; Schematic Design 5.5
  mo.; Public Info Period 3.5 mo.; Design Development 6 mo.; Construction Documents 10 mo.; B/N 1
  mo.; Construction Administration 21 months; Site Construction 5 months; Closeout 6 months; 27
  Months Total Construction Duration.
</p>

<p>
  Schedule subject to MSBA Board approval and municipal funding authorization. Dates are projected
  and may be revised.
</p>

<h3>Schedule &mdash; Feasibility Study&ndash;Schematic Design</h3>

<table>
  <thead>
    <tr>
      <th scope="col">Stage</th>
      <th scope="col">Date or length</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Kick Off</td><td>5/18/26</td></tr>
    <tr><td>Preliminary Design Program (PDP)</td><td>4.25 mo., to 12/9/26</td></tr>
    <tr><td>Feasibility Study</td><td>18 mo.</td></tr>
    <tr><td>Preferred Schematic Report (PSR)</td><td>4.75 mo., to 4/22/27</td></tr>
    <tr><td>MSBA Board Mtg</td><td>6/30/27</td></tr>
    <tr><td>Schematic Design (SD)</td><td>6 mo., 12 Weeks min, to 10/21/27</td></tr>
    <tr
      ><td>Project Scope and Budget Approval (PS&amp;B) &mdash; MSBA Board Mtg</td><td>12/15/27</td
      ></tr
    >
    <tr><td>Local Project Funding Votes</td><td>3/15/28? 3/21/28?</td></tr>
  </tbody>
</table>

<p>
  The chart also carries &ldquo;Preliminary Prep work and Ex. Cond. Assessments&rdquo; at its foot.
</p>

<h3>District Enrollment Analysis</h3>

<h4>Existing School Progression &mdash; Sept 2026</h4>

<table>
  <thead>
    <tr>
      <th scope="col">School</th>
      <th scope="col">Grades</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Silver Hill</td><td>K-4</td></tr>
    <tr><td>Tilton</td><td>K-4</td></tr>
    <tr><td>Walnut Square</td><td>K-3</td></tr>
    <tr><td>Pentucket Lake</td><td>K-4</td></tr>
    <tr><td>Golden Hill</td><td>K-4</td></tr>
    <tr><td>Bradford</td><td>K-4</td></tr>
    <tr><td>Hunking</td><td>K-4</td></tr>
    <tr><td>Consentino</td><td>5-8</td></tr>
    <tr><td>Whittier</td><td>5-8</td></tr>
    <tr><td>Nettle</td><td>5-8</td></tr>
    <tr><td>Hunking</td><td>5-8</td></tr>
  </tbody>
</table>

<h4>Option 1 &mdash; Whittier 5-8 (745) &ndash; Sept 2029</h4>

<p>TILTON CANNOT CLOSE UNDER THIS SCENARIO &ndash; NOT ENOUGH CAPACITY IN OTHER ELEMENTARIES</p>

<table>
  <thead>
    <tr>
      <th scope="col">School</th>
      <th scope="col">Grades</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Silver Hill</td><td>K-4</td></tr>
    <tr><td>Tilton</td><td>K-4</td></tr>
    <tr><td>Walnut Square</td><td>K-3</td></tr>
    <tr><td>Pentucket Lake</td><td>K-4</td></tr>
    <tr><td>Golden Hill</td><td>K-4</td></tr>
    <tr><td>Bradford</td><td>K-4</td></tr>
    <tr><td>Hunking</td><td>K-4</td></tr>
    <tr><td>Consentino</td><td>5-8</td></tr>
    <tr><td>Whittier [RENO/ADD OR NEW CONSTRUCTION]</td><td>5-8</td></tr>
    <tr><td>Nettle</td><td>5-8</td></tr>
    <tr><td>Hunking</td><td>5-8</td></tr>
  </tbody>
</table>

<p>
  All ES Grades K-4 proportionally redistributed<br />
  All MS Grades 5-8 proportionally redistributed<br />
  REDISTRIBUTION WILL REQUIRE MINOR REDRAWING OF SCHOOL ATTENDANCE ZONE BOUNDARIES
</p>

<h4>Option 2 &mdash; Whittier 4-8 (1,045) &ndash; Sept 2029</h4>

<p>
  TILTON CAN CLOSE UNDER THIS SCENARIO &ndash; BUT ALL OTHER ELEMENTARIES ARE AT OR OVER CAPACITY
  WITH NO WIGGLE ROOM
</p>

<table>
  <thead>
    <tr>
      <th scope="col">School</th>
      <th scope="col">Grades</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Silver Hill</td><td>K-4</td></tr>
    <tr><td>Tilton</td><td>&ndash;</td></tr>
    <tr><td>Walnut Square</td><td>K-3</td></tr>
    <tr><td>Pentucket Lake</td><td>PK-3</td></tr>
    <tr><td>Golden Hill</td><td>K-4</td></tr>
    <tr><td>Bradford</td><td>K-4</td></tr>
    <tr><td>Hunking</td><td>K-4</td></tr>
    <tr><td>Consentino</td><td>5-8</td></tr>
    <tr><td>Whittier [RENO/ADD OR NEW CONSTRUCTION]</td><td>4-8</td></tr>
    <tr><td>Nettle</td><td>5-8</td></tr>
    <tr><td>Hunking</td><td>5-8</td></tr>
  </tbody>
</table>

<p>
  All ES Grades K-4 proportionally redistributed<br />
  All MS Grades 5-8 proportionally redistributed<br />
  REDISTRIBUTION WILL REQUIRE MINOR REDRAWING OF SCHOOL ATTENDANCE ZONE BOUNDARIES
</p>

<h4>Option 3 &mdash; Whittier 3-8 (1,325) &ndash; Sept 2029</h4>

<p>
  TILTON CAN CLOSE UNDER THIS SCENARIO &ndash; BUT ALL OTHER ELEMENTARIES ARE AT OR JUST OVER
  CAPACITY WITH LITTLE WIGGLE ROOM
</p>

<table>
  <thead>
    <tr>
      <th scope="col">School</th>
      <th scope="col">Grades</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Silver Hill</td><td>K-4</td></tr>
    <tr><td>Tilton</td><td>&ndash;</td></tr>
    <tr><td>Walnut Square</td><td>K-2</td></tr>
    <tr><td>Pentucket Lake</td><td>PK-2</td></tr>
    <tr><td>Golden Hill</td><td>K-4</td></tr>
    <tr><td>Bradford</td><td>K-4</td></tr>
    <tr><td>Hunking</td><td>K-4</td></tr>
    <tr><td>Consentino</td><td>5-8</td></tr>
    <tr><td>Whittier [RENO/ADD OR NEW CONSTRUCTION]</td><td>3-8</td></tr>
    <tr><td>Nettle</td><td>5-8</td></tr>
    <tr><td>Hunking</td><td>5-8</td></tr>
  </tbody>
</table>

<p>
  All ES Grades K-4 proportionally redistributed<br />
  All MS Grades 5-8 proportionally redistributed<br />
  REDISTRIBUTION WILL REQUIRE MINOR REDRAWING OF SCHOOL ATTENDANCE ZONE BOUNDARIES
</p>

<h4>Option 2A &mdash; Whittier 4-8 (1,045) &ndash; Sept 2029</h4>

<p>
  TILTON CAN CLOSE UNDER THIS SCENARIO &ndash; TO MAKE ROOM FOR ITS STUDENTS, CONSENTINO AND NETTLE
  BECOME GRADE 4-8 AND SOME ELEMENTARIES BECOME K-3&rsquo;S
</p>

<table>
  <thead>
    <tr>
      <th scope="col">School</th>
      <th scope="col">Grades</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Silver Hill</td><td>K-3</td></tr>
    <tr><td>Tilton</td><td>&ndash;</td></tr>
    <tr><td>Walnut Square</td><td>K-1</td></tr>
    <tr><td>Pentucket Lake</td><td>K-3</td></tr>
    <tr><td>Golden Hill</td><td>K-3</td></tr>
    <tr><td>Bradford</td><td>K-4</td></tr>
    <tr><td>Hunking</td><td>K-4</td></tr>
    <tr><td>Consentino</td><td>4-8</td></tr>
    <tr><td>Whittier [RENO/ADD OR NEW CONSTRUCTION]</td><td>4-8</td></tr>
    <tr><td>Nettle</td><td>4-8</td></tr>
    <tr><td>Hunking</td><td>5-8</td></tr>
  </tbody>
</table>

<p>
  All ES Grades K-3/4 proportionally redistributed<br />
  All MS Grades 4/5-8 proportionally redistributed<br />
  REDISTRIBUTION WILL REQUIRE POTENTIALLY SIGNIFICANT REDRAWING OF SCHOOL ATTENDANCE ZONE BOUNDARIES
</p>

<h3>Existing Conditions</h3>

<h4>Civil Observations</h4>

<p><strong>OVERALL CONDITION OF THE PAVING, STORMWATER MANAGEMENT, &amp; UTILITIES</strong></p>

<p>
  Driveways, parking lots, walkways, and curbing are in fair to poor condition, with extensive
  cracking and deterioration throughout.<br />
  Sidewalks are in fair to poor condition, and curb cuts generally lack required tactile warning panels
  and striping at crosswalks.<br />
  No ADA compliant van-accessible parking space or accessible parking spot with loading zone, tactile
  warning panel, and signage.<br />
  Drainage and utility structures show signs of age.
</p>

<p><strong>FEASIBILITY OF RENOVATION AND EXPANSION OF THE STRUCTURE</strong></p>

<p>
  Reconstruct deteriorated pavement, curbing, and sidewalks to current MAAB/ADA standards, and
  inspect/clean the stormwater and sewer systems. Utility infrastructure will likely need to be
  updated as part of any project.
</p>

<h4>Landscape Observations</h4>

<p><strong>OVERALL CONDITION OF LANDSCAPE FEATURES</strong></p>

<p>
  The gravel parking area serving the 2024 modular addition is unstriped and in poor condition.<br
  />
  The basketball court is in poor condition, and athletic field backstops no longer appear in active use.<br
  />
  Lawn areas near the building show poor drainage, and wetland buffers are present southeast of the site.<br
  />
  Asphalt ramps at several building entrances exceed accessible slopes
</p>

<p><strong>FEASIBILITY OF RENOVATION AND EXPANSION OF THE STRUCTURE</strong></p>

<p>
  Resurface the parking area and court pavement, address accessibility at egress doors, regrade
  poorly-drained lawn areas, and anticipate Conservation Commission permitting near mapped wetlands.
</p>

<h4>Interior Architectural</h4>

<p><strong>OVERALL CONDITION OF THE INTERIOR BUILDING SYSTEMS</strong></p>

<p>
  Classroom and corridor flooring is a patchwork of tile types, and the original gym floor is
  buckled and worn.<br />
  Some interior walls show damage around utility penetrations, and ceilings show staining from roof leaks.<br
  />
  Gymnasium egress doors have rusted frames, damaged gaskets, and warped leaves that do not seal.<br
  />
  Toilet rooms have undersized grab bars and are missing required partitions and mirrors in some locations.<br
  />
  The building&rsquo;s MEP systems are largely original and at or beyond their useful life &mdash; aging
  boilers, undersized electrical service, and outdated fixtures, no sprinkler system.
</p>

<p><strong>FEASIBILITY OF RENOVATION AND EXPANSION OF THE STRUCTURE</strong></p>

<p>
  Replace flooring, ceilings, and non-compliant doors/hardware in a renovation, and reconfigure
  toilet rooms to meet MAAB/ADA standards. Replacement of the building&rsquo;s mechanical,
  electrical, and plumbing systems, and upgrading the technology infrastructure to support modern
  devices and instruction.
</p>

<h4>Exterior Architectural</h4>

<p><strong>OVERALL CONDITION OF THE EXTERIOR BUILDING SYSTEM</strong></p>

<p>
  Original brick masonry is in good overall condition, with isolated spalling at several concrete
  foundation corners.<br />
  Sealant at building control joints has failed and is cracking.<br />
  Several locations show severe efflorescence, moisture damage and mortar erosion.<br />
  Window joint sealant has failed at both the 2012 windows and the modular addition, with visible mildew
  and water intrusion.<br />
  Entry canopy steel framing is corroding at the column bases.<br />
  Outwash between the drip edge profiles indicates failing sealant from the 2006 roof replacement.<br
  />
  Window-mounted AC units are inefficient, drip condensate onto walls and give birds places to nest.
</p>

<p><strong>FEASIBILITY OF RENOVATION AND EXPANSION OF THE STRUCTURE</strong></p>

<p>
  Address canopy, roofing, and sealant issues as near-term maintenance, and replace window AC units
  with central/split cooling in a major renovation.
</p>

<h4>Space Summary 5-8 &mdash; Proposed vs Existing</h4>

<table>
  <caption>Whittier Middle School 5-8, 745 students</caption>
  <thead>
    <tr>
      <th scope="col">Room type</th>
      <th scope="col">New construction &mdash; Area totals</th>
      <th scope="col">Existing building &mdash; Area totals</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">CORE ACADEMIC</th><td>41,310</td><td>18,922</td></tr>
    <tr><th scope="row">SPECIAL EDUCATION</th><td>18,680</td><td>1,384</td></tr>
    <tr><th scope="row">ART &amp; MUSIC</th><td>4,600</td><td>2,928</td></tr>
    <tr><th scope="row">VOCATIONS &amp; TECHNOLOGY</th><td>4,320</td><td>0</td></tr>
    <tr><th scope="row">HEALTH &amp; PHYSICAL EDUCATION</th><td>10,400</td><td>7,516</td></tr>
    <tr><th scope="row">MEDIA CENTER</th><td>4,664</td><td>1,163</td></tr>
    <tr><th scope="row">DINING &amp; FOOD SERVICE</th><td>9,967</td><td>4,852</td></tr>
    <tr><th scope="row">MEDICAL</th><td>610</td><td>274</td></tr>
    <tr><th scope="row">ADMINISTRATION &amp; GUIDANCE</th><td>5,825</td><td>2,646</td></tr>
    <tr><th scope="row">CUSTODIAL &amp; MAINTENANCE</th><td>2,200</td><td>1,260</td></tr>
    <tr><th scope="row">OTHER</th><td>0</td><td>0</td></tr>
    <tr><th scope="row">NON-PROGRAMMED SPACES</th><td>51,298</td><td>10,607</td></tr>
  </tbody>
  <tfoot>
    <tr
      ><th scope="row">Total Building Gross Floor Area (GFA)</th><td>153,874</td><td>51,552</td></tr
    >
    <tr><th scope="row">Grossing Factor (GFA / NFA)</th><td>1.50</td><td>1.26</td></tr>
  </tfoot>
</table>

<p>
  Key, used on this table and on the charts beside it: &ldquo;RIGHT SIZED&rdquo; &mdash; Total area
  is within 10% of program needs. &ldquo;OVERSIZED&rdquo; &mdash; Total area exceeds program needs
  by more than 10%. &ldquo;UNDERSIZED&rdquo; &mdash; Total area is more than 10% below program
  needs.
</p>

<h4>Tilton Existing Conditions &mdash; Observations</h4>

<p>
  BUILT IN 1890, THE BUILDING IS IN FAIR TO GOOD CONDITION FOR ITS AGE, BUT ITS SYSTEMS ARE BEYOND
  THEIR USEFUL LIFE AND ITS EDUCATIONAL SPACES ARE STRETCHED TO SUPPORT MODERN LEARNING.
</p>

<p><strong>OVERALL CONDITION OF THE SITE AND BUILDING</strong></p>

<p>
  Civil: Paving, curbs, and sidewalks are fair to poor; accessible parking and crosswalk warnings
  are missing; utilities are aging.<br />
  Landscape: The gravel lot and basketball court are poor, lawns drain poorly, and entry ramps exceed
  accessible slopes.<br />
  Interior: Worn flooring, non-compliant doors and toilet rooms, no sprinklers, MEP past useful life,
  and undersized spaces.<br />
  Exterior: Masonry is sound but needs some repointing, the chimney cap is damaged, accessibility is limited,
  and the roof is fair to good.
</p>

<p><strong>FEASIBILITY OF RENOVATION AND EXPANSION OF THE STRUCTURE</strong></p>

<p>
  Rebuild paving, sidewalks, and ramps to MAAB/ADA standards and update utilities. Replace interior
  finishes, doors, toilet rooms, and the MEP and technology systems. Add sprinkler system.
</p>

<h3>Community Outreach</h3>

<p>Upcoming Dates</p>

<ul>
  <li>October 22nd &ndash; School Committee Meeting</li>
  <li>November 5th &ndash; Public Information Session at Whittier</li>
  <li>
    November 19th &ndash;
    <a href={Router.meeting("school-committee-2026-11-19")}>School Committee Meeting</a>
  </li>
  <li>
    On-going community outreach
    <ul>
      <li>Regular updates to School Committee</li>
      <li>Public Information Sessions at Key Milestones</li>
      <li>School Building Committee meetings</li>
      <li>Public Information Meetings Leading Up to Funding Votes</li>
    </ul>
  </li>
  <li>March 2028 - Project Funding Authorization Votes</li>
</ul>

<hr />

<ul>
  <li>
    <a href={excerpt("public-information-session")} target="_blank" rel="noopener">
      Public information session flyer, November 5, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={excerpt("project-overview")} target="_blank" rel="noopener">
      The Whittier Middle School Project: What You Need to Know<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={excerpt("school-building-committee-presentation")} target="_blank" rel="noopener">
      J.G. Whittier Middle School, School Building Committee, October 14, 2026<span class="sr-only"
        >, PDF, thirty-two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

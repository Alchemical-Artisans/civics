<script lang="ts">
  // A script here for the parts of the book this page belongs with and does not
  // carry; see this page's `+page.ts` and docs/budget-pages.md.
  import BookElsewhere from "$lib/BookElsewhere.svelte"
  import BudgetTable from "$lib/BudgetTable.svelte"
  import { APPROPRIATIONS, DEPARTMENTS } from "./tables"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"

  let { data } = $props()
</script>

<!-- Pages 15 and 16, the book's two sets of goals. Each half keeps the
     heading the book prints over it, which is neither of the names its contents
     page gives them. -->
<h2>Mayor's 2027 Budgetary Goals</h2>

<p>
  The preliminary framework guiding the budget directives for 2027 includes the following
  initiatives:
</p>

<ul>
  <li>
    Strive to limit the property tax bill increase to 3.3% in order to reduce the impact on
    taxpayers.
  </li>
  <li>
    Maintain an excess <GlossaryTerm term="Levy">levy</GlossaryTerm> of 1.6% of the total available <GlossaryTerm
      term="Levy">levy</GlossaryTerm
    >
    to serve as a budgetary reserve, as well as set aside savings for future capital projects.
  </li>
  <li>
    Decrease the city's historical reliance on <GlossaryTerm term="Free Cash"
      >free cash</GlossaryTerm
    > to subsidize the <GlossaryTerm term="Operating Budget">operating budget</GlossaryTerm> in order
    to build a more structurally stable budget and adhere to the city's internal financial policies.
  </li>
  <li>
    Develop a long-term, stable budget using a 10-year projection model as a tool to ensure that
    current budget decisions and initiatives will be supported by future revenue growth.
  </li>
</ul>

<h2>Long-Term Perspective Strategic Goals</h2>

<p>The long-term strategic goals influencing the 2027 budget process include the following:</p>

<ul>
  <li>Ensure long-range forecasts will maintain reserves in accordance with internal policies.</li>
  <li>
    Ensure that debt ratios will comply with state statutes and the city's financial policies.
  </li>
  <li>Continue to meet or exceed the statutory net school spending requirements.</li>
  <li>Allocate funding for maintenance of capital equipment, buildings, and infrastructure.</li>
  <li>
    Plan for long-range capital projects such as a Fire Station, JG Whittier Middle School, and
    Whittier Technical High School.
  </li>
</ul>

<!-- Page 28. The city's capital requests are on the spending side of the
     book, but note that almost none of them are in this year's appropriation:
     the page-78 table's "Capital - Pay as you go" line is empty for 2027 and
     the funding decision was postponed. What capital costs this year is the
     debt service on what was borrowed for it in years past. -->
<h2>Capital Planning</h2>

<p>
  The city keeps a continuous inventory of all capital requirements to effectively connect <GlossaryTerm
    term="Grant">grant</GlossaryTerm
  >
  opportunities with its needs and to plan for long-term budgeting and strategic objectives. These requests
  are reviewed annually during the budgeting cycle, allowing for the allocation of funds for:
</p>

<ul>
  <li>Borrowing costs for projects exceeding $250,000</li>
  <li>Direct purchases using available funds for projects under $250,000</li>
</ul>

<p>
  <GlossaryTerm term="Department">Department</GlossaryTerm> heads are required to submit a written capital
  request that details the project and includes a cost estimate. The Mayor's budget team assesses these
  requests in collaboration with each <GlossaryTerm term="Department">department</GlossaryTerm>,
  fostering discussion and enhancing project understanding.
</p>

<p>In making final funding recommendations to the Mayor, the budget team considers:</p>

<ul>
  <li>
    The urgency of the project as determined by the <GlossaryTerm term="Department"
      >department</GlossaryTerm
    > head and the Mayor
  </li>
  <li>Any implications for public safety</li>
  <li>Any legal obligations associated with project completion</li>
  <li>The financial impact on the city</li>
</ul>

<h2>5-Year Capital Requests by Category</h2>

<table>
  <thead>
    <tr>
      <th scope="col">5-Year Capital Requests</th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
      <th scope="col">Grand Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Buildings &amp; Building Improvements</th>
      <td>$3,560,656</td>
      <td>$125,002,000</td>
      <td>$1,270,000</td>
      <td>$6,045,000</td>
      <td>$3,995,000</td>
      <td>$139,872,656</td>
    </tr>
    <tr>
      <th scope="row">Computer Equipment</th>
      <td>$70,000</td>
      <td>$133,870</td>
      <td>$184,124</td>
      <td></td>
      <td>$160,972</td>
      <td>$548,966</td>
    </tr>
    <tr>
      <th scope="row">Computer Software</th>
      <td>$495,146</td>
      <td></td>
      <td>$308,994</td>
      <td></td>
      <td></td>
      <td>$804,140</td>
    </tr>
    <tr>
      <th scope="row">Equipment</th>
      <td>$3,904,998</td>
      <td>$780,713</td>
      <td>$1,630,000</td>
      <td>$445,000</td>
      <td>$365,000</td>
      <td>$7,125,711</td>
    </tr>
    <tr>
      <th scope="row">Infrastructure</th>
      <td>$8,697,500</td>
      <td>$3,411,500</td>
      <td>$1,913,042</td>
      <td>$1,871,232</td>
      <td>$1,928,315</td>
      <td>$17,821,589</td>
    </tr>
    <tr>
      <th scope="row">Land &amp; Land Improvements</th>
      <td>$66,320</td>
      <td>$130,000</td>
      <td>$200,000</td>
      <td>$75,000</td>
      <td>$225,000</td>
      <td>$696,320</td>
    </tr>
    <tr>
      <th scope="row">Planning &amp; Design</th>
      <td></td>
      <td></td>
      <td>$575,000</td>
      <td></td>
      <td></td>
      <td>$575,000</td>
    </tr>
    <tr>
      <th scope="row">Software</th>
      <td>$50,000</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>$50,000</td>
    </tr>
    <tr>
      <th scope="row">Vehicles</th>
      <td>$375,000</td>
      <td>$2,849,570</td>
      <td>$2,355,000</td>
      <td>$475,000</td>
      <td>$355,000</td>
      <td>$6,409,570</td>
    </tr>
    <tr>
      <th scope="row">Grand Total</th>
      <td>$17,219,620</td>
      <td>$132,307,653</td>
      <td>$8,436,160</td>
      <td>$8,911,232</td>
      <td>$7,029,287</td>
      <td>$173,903,952</td>
    </tr>
  </tbody>
</table>

<p>
  The city's current five-year capital requests exceed $173 million, primarily focusing on building
  maintenance and construction projects, including JG Whittier Middle School and a new fire station.
  To help alleviate the financial burden of the JG Whittier project, the city is applying for <GlossaryTerm
    term="Grant">grant</GlossaryTerm
  >
  funding from the MSBA (Massachusetts School Building Authority), similar to the support previously obtained
  for Hunking and Consentino.
</p>

<p>
  Significant infrastructure requirements also encompass the removal and reconstruction of the
  Little River Dam, with total costs anticipated to surpass $9.5 million. The city has already
  secured a $5 million <GlossaryTerm term="Grant">grant</GlossaryTerm> and is actively pursuing additional
  funding to cover a portion of the remaining expenses.
</p>

<p>
  Additionally, the city faces $7 million in unfunded road improvement needs over the next five
  years. The estimated allotment for 2027 from the state's Chapter 90 program is $2,346,230. Chapter
  90 offers annual, formula-based reimbursement funding to municipalities in Massachusetts for local
  transportation infrastructure enhancements, including road reconstruction, sidewalk repairs, and
  traffic signal upgrades.
</p>

<!--
  Pages 30 to 35 are one table of every request by category, broken across
  pages wherever it runs out of room -- so the page titles ("Building
  Improvements", "Building Improvements Continued & Computer Equipment", and so
  on) name whatever happens to start or finish on that page rather than a
  section. The category headings the table itself carries are used here
  instead, which keeps each category whole.
-->

<h2>Buildings &amp; Building Improvements</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Animal Shelter - Police</th><td></td><td>$1,725,000</td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Boilers at High School Schematic Design</th><td></td><td>$100,000</td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Bradford Elementary HVAC</th><td></td><td>$1,000,000</td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Bradford Elementary Roof</th><td></td><td></td><td>$300,000</td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">City Hall Auditorium Air Conditioning</th><td></td><td></td><td></td><td
        >$750,000</td
      ><td></td></tr
    >
    <tr
      ><th scope="row">City Hall Auditorium Balcony Railings</th><td></td><td></td><td>$275,000</td
      ><td></td><td></td></tr
    >
    <tr
      ><th scope="row">City Hall Elevator Rehabilitation</th><td>$130,000</td><td></td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">City Hall Heating Circulation &amp; Controls</th><td></td><td>$770,000</td
      ><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">City Hall Repairs &amp; Maintenance</th><td></td><td>$75,000</td><td></td><td
        >$80,000</td
      ><td></td></tr
    >
    <tr
      ><th scope="row">City Hall Window Replacement</th><td></td><td></td><td></td><td></td><td
        >$2,900,000</td
      ></tr
    >
    <tr
      ><th scope="row">Elevator Repair - High School</th><td>$200,000</td><td></td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Elevator Repair: Pentucket Lake, Silver Hill, Golden Hill</th><td
        >$525,000</td
      ><td></td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Fire Alarm - High School</th><td>$800,000</td><td></td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Fire Station</th><td></td><td>$30,000,000</td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Generators &amp; Transfer Panels - School</th><td>$80,000</td><td>$80,000</td
      ><td>$80,000</td><td>$80,000</td><td>$80,000</td></tr
    >
    <tr
      ><th scope="row">Golden Hill Roof - School</th><td>$750,000</td><td></td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Heating System Highway Garage</th><td>$130,000</td><td></td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Highway Administration Roof Replacement</th><td>$50,000</td><td></td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Highway Garage Roof Repairs</th><td>$15,000</td><td></td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Highway Yard Rehabilitation</th><td></td><td>$300,000</td><td></td><td
        >$20,000</td
      ><td></td></tr
    >
    <tr
      ><th scope="row">HVAC replacement for Indoor Skating Rink</th><td></td><td></td><td
        >$300,000</td
      ><td></td><td></td></tr
    >
    <tr
      ><th scope="row">JGW / Tilton School Core Project</th><td></td><td>$90,000,000</td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Oil Tank Removals - School</th><td></td><td>$100,000</td><td>$100,000</td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Park Barn Asbestos Removal and Floor and Stair Replacement - Highway</th><td
        >$50,000</td
      ><td></td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Park Barn Rehabilitation - Highway</th><td>$15,000</td><td>$40,000</td><td
        >$15,000</td
      ><td>$15,000</td><td>$15,000</td></tr
    >
    <tr
      ><th scope="row">Parking Lot Repairs - School</th><td></td><td>$100,000</td><td>$100,000</td
      ><td>$100,000</td><td></td></tr
    >
    <tr
      ><th scope="row">Pentucket Lake Roof - School</th><td></td><td>$300,000</td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Police Locker Rooms</th><td></td><td></td><td></td><td></td><td
        >$1,000,000</td
      ></tr
    >
    <tr
      ><th scope="row">Police Water Heater</th><td></td><td>$12,000</td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Powder House Renovations - Community Development</th><td></td><td
        >$100,000</td
      ><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">School Ceiling Refurbishments</th><td></td><td>$100,000</td><td>$100,000</td
      ><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Silver Hill Roof - School</th><td>$815,656</td><td></td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Stadium Restrooms</th><td></td><td>$200,000</td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Winnekenni Castle Repairs &amp; Restorations - CONSTRUCTION</th><td></td><td
      ></td><td></td><td>$5,000,000</td><td></td></tr
    >
    <tr
      ><th scope="row">Buildings &amp; Building Improvements Total</th><td>$3,560,656</td><td
        >$125,002,000</td
      ><td>$1,270,000</td><td>$6,045,000</td><td>$3,995,000</td></tr
    >
  </tbody>
</table>

<h2>Computer Equipment</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Backup System Redundancy - IT</th><td></td><td></td><td>$25,972</td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Core Network Overhaul - IT</th><td></td><td>$103,870</td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">DPW Internet Resilience - IT</th><td></td><td>$30,000</td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Fire Station Internet Resilience- IT</th><td>$45,000</td><td></td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Firewall Upgrade - IT</th><td></td><td></td><td>$57,940</td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Legacy Wiring Clean Up - IT</th><td>$25,000</td><td></td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Remote Location Fiber Upgrade - IT</th><td></td><td></td><td></td><td
      ></td><td>$160,972</td></tr
    >
    <tr
      ><th scope="row">Server Hardware Refresh - IT</th><td></td><td></td><td>$56,972</td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Server Room Upgrade - IT</th><td></td><td></td><td>$43,240</td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Computer Equipment Total</th><td>$70,000</td><td>$133,870</td><td
        >$184,124</td
      ><td></td><td>$160,972</td></tr
    >
  </tbody>
</table>

<h2>Computer Software</h2>

<!--
  This total is $545,146 in 2027 against the $495,146 the summary on page 29
  gives, because the summary lists the CMMS system's $50,000 as a category of
  its own called "Software" and this table folds it in here. Both are printed
  as they stand.
-->
<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Archival Inventory and Digitization - City Clerk</th><td>$160,000</td><td
      ></td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">CMMS Computerized Maintenance Management System - Highway</th><td>$50,000</td
      ><td></td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Dispatch &amp; Records Software Update - Police</th><td></td><td></td><td
        >$308,994</td
      ><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Tax Collection Software - Treasurer</th><td>$335,146</td><td></td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Computer Software Total</th><td>$545,146</td><td></td><td>$308,994</td><td
      ></td><td></td></tr
    >
  </tbody>
</table>

<h2>Equipment</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Airboat - Police</th><td></td><td>$113,403</td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Backhoe - Highway</th><td></td><td></td><td>$170,000</td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Batwing Attachment - Highway</th><td>$50,000</td><td></td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Crane CDL Grapple Truck - Highway</th><td></td><td></td><td></td><td></td><td
        >$365,000</td
      ></tr
    >
    <tr
      ><th scope="row">Front End Loader - Highway</th><td></td><td></td><td>$375,000</td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Gasboy Vehicle Fuel System - Highway</th><td>$60,000</td><td></td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Harbormaster Boat</th><td></td><td>$252,310</td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">iPad &amp; Phones - Inspectional Services</th><td></td><td>$30,000</td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Mini Excavator - Highway</th><td></td><td>$130,000</td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Parking Kiosks - Highway</th><td></td><td></td><td>$500,000</td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Radios - Fire</th><td>$2,384,135</td><td></td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Rubber Tired Excavator - Highway</th><td></td><td></td><td></td><td
        >$220,000</td
      ><td></td></tr
    >
    <tr><th scope="row">SCBA - Fire</th><td>$1,290,863</td><td></td><td></td><td></td><td></td></tr>
    <tr
      ><th scope="row">Skid Steer - Highway</th><td>$120,000</td><td></td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Street Sweeper - Highway</th><td></td><td></td><td>$300,000</td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Trackless Tractor - Highway</th><td></td><td>$225,000</td><td>$225,000</td
      ><td>$225,000</td><td></td></tr
    >
    <tr
      ><th scope="row">Tractor - Highway</th><td></td><td></td><td>$60,000</td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Zero Turn Mower - Highway</th><td></td><td>$30,000</td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Equipment Total</th><td>$3,904,998</td><td>$780,713</td><td>$1,630,000</td
      ><td>$445,000</td><td>$365,000</td></tr
    >
  </tbody>
</table>

<h2>Infrastructure</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Brandy Brow East Meadow River Culvert - Highway</th><td>$65,000</td><td
      ></td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Bridge CIP Update - Highway</th><td>$50,000</td><td></td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Forest Street Bridge Replacement - Engineering</th><td></td><td>$287,500</td
      ><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Intersection Improvements- Kingsbury/Chadwick/Willow - Highway</th><td
      ></td><td>$600,000</td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Kenoza Ave Improvements - Highway</th><td>$200,000</td><td></td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Kingsbury Ave/Chadwick/Willow Intersection Improvements - Engineering</th><td
      ></td><td>$600,000</td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Little River Dam Removal - Highway</th><td>$4,500,000</td><td></td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Miscellaneous Traffic Safety - Highway</th><td>$50,000</td><td></td><td
        >$50,000</td
      ><td></td><td>$50,000</td></tr
    >
    <tr
      ><th scope="row">Parking Lot Paving at Citizens Center</th><td>$60,000</td><td></td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Parking Lot Repairs - Stadium</th><td>$100,000</td><td></td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Parking Lots - Elliott Place - Highway</th><td></td><td></td><td></td><td
        >$15,450</td
      ><td></td></tr
    >
    <tr
      ><th scope="row">Parking Lots - Essex St - Highway</th><td></td><td></td><td></td><td
        >$29,500</td
      ><td></td></tr
    >
    <tr
      ><th scope="row">Parking Lots - Locke Street - Highway</th><td></td><td></td><td></td><td
      ></td><td>$78,315</td></tr
    >
    <tr
      ><th scope="row">Parking Lots - Phoenix Row - Highway</th><td></td><td>$61,000</td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Parking Lots - River Front Promenade - Highway</th><td></td><td></td><td
      ></td><td>$26,282</td><td></td></tr
    >
    <tr
      ><th scope="row">Parking Lots - Washington Square - Highway</th><td></td><td></td><td
        >$63,042</td
      ><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Sidewalks - Annual Repair &amp; Replace - Highway</th><td>$1,100,000</td><td
        >$1,100,000</td
      ><td>$1,100,000</td><td>$1,100,000</td><td>$1,100,000</td></tr
    >
    <tr
      ><th scope="row">Stormwater Assessment at DPW Facility and adjacent property on Downing</th
      ><td>$17,500</td><td></td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Street Lights - Highway</th><td>$55,000</td><td></td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Supplemental Paving - Highway</th><td>$700,000</td><td>$700,000</td><td
        >$700,000</td
      ><td>$700,000</td><td>$700,000</td></tr
    >
    <tr
      ><th scope="row">W. Lowell Ave Bridge Replacement - Design - Engineering</th><td></td><td
        >$63,000</td
      ><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Washington Square - Improvements and Construction - Highway</th><td
        >$1,800,000</td
      ><td></td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Infrastructure Total</th><td>$8,697,500</td><td>$3,411,500</td><td
        >$1,913,042</td
      ><td>$1,871,232</td><td>$1,928,315</td></tr
    >
  </tbody>
</table>

<h2>Land &amp; Land Improvements</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">Cooling Corridors Street Tree Planting - Highway</th><td>$7,500</td><td
      ></td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Puglielli Field Improvements - Highway</th><td></td><td>$50,000</td><td
        >$200,000</td
      ><td>$50,000</td><td>$200,000</td></tr
    >
    <tr
      ><th scope="row">Railroad Square Garage Brownfields Closure - Community Development</th><td
      ></td><td>$55,000</td><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Shade Trees for Parks - Highway</th><td>$25,000</td><td>$25,000</td><td
      ></td><td>$25,000</td><td>$25,000</td></tr
    >
    <tr
      ><th scope="row">Whittier Birthplace Trail Hub - Highway</th><td>$33,820</td><td></td><td
      ></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Land &amp; Land Improvements Total</th><td>$66,320</td><td>$130,000</td><td
        >$200,000</td
      ><td>$75,000</td><td>$225,000</td></tr
    >
  </tbody>
</table>

<h2>Planning &amp; Design</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">City Hall Auditorium Air Conditioning - PLANNING &amp; DESIGN</th><td
      ></td><td></td><td>$75,000</td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Winnekenni Castle Repairs &amp; Restorations - PLANNING &amp; DESIGN</th><td
      ></td><td></td><td>$500,000</td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Planning &amp; Design Total</th><td></td><td></td><td>$575,000</td><td
      ></td><td></td></tr
    >
  </tbody>
</table>

<h2>Vehicles</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">(1) 6 Wheel Dump Trucks with Sanders and Plows - Highway</th><td></td><td
        >$250,000</td
      ><td>$250,000</td><td>$250,000</td><td>$250,000</td></tr
    >
    <tr
      ><th scope="row">10-Wheeler Plow Truck - Highway</th><td></td><td>$250,000</td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">1-Ton Truck - Highway</th><td>$105,000</td><td>$105,000</td><td>$105,000</td
      ><td>$105,000</td><td>$105,000</td></tr
    >
    <tr
      ><th scope="row">2500 Pick-up Truck with Plow - Highway</th><td>$90,000</td><td>$90,000</td
      ><td></td><td></td><td></td></tr
    >
    <tr
      ><th scope="row">Chevrolet Tahoe C-2 - Fire</th><td></td><td>$80,000</td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Chevrolet Traverse C-4 - Fire</th><td></td><td>$35,000</td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Ford Escape - Inspectional Services</th><td></td><td>$45,000</td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Ford F550 Bucket FA-2 - Fire</th><td></td><td></td><td></td><td>$120,000</td
      ><td></td></tr
    >
    <tr
      ><th scope="row">Incident Command Vehicle - Police</th><td></td><td>$250,000</td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Maintenance Vehicle - Recreation</th><td></td><td>$55,000</td><td></td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Pick-Up Truck - Police</th><td></td><td>$57,000</td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Pierce Ladder Truck - Fire</th><td></td><td></td><td>$2,000,000</td><td
      ></td><td></td></tr
    >
    <tr
      ><th scope="row">Pierce Pumper - Fire</th><td></td><td>$1,000,000</td><td></td><td></td><td
      ></td></tr
    >
    <tr><th scope="row">Tanker - Fire</th><td></td><td>$632,570</td><td></td><td></td><td></td></tr>
    <tr
      ><th scope="row">Trash Truck - Highway</th><td>$180,000</td><td></td><td></td><td></td><td
      ></td></tr
    >
    <tr
      ><th scope="row">Vehicles Total</th><td>$375,000</td><td>$2,849,570</td><td>$2,355,000</td><td
        >$475,000</td
      ><td>$355,000</td></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$17,219,620</td><td>$132,307,653</td><td>$8,436,160</td
      ><td>$8,911,232</td><td>$7,029,287</td></tr
    >
  </tbody>
</table>

<h2>2027 Capital Requests</h2>

<!--
  The same requests again, but only the ones asked for in 2027, each with the
  department's own case for it and the urgency the department gave it:
  Essential, High, Moderate or Low. Pages 36 to 45.
-->

<h3>Buildings &amp; Building Improvements</h3>

<h4>Admin. Roof Replacement - Highway</h4>
<!-- The book's cell cuts this sentence off where it does; nothing follows "from". -->
<p>
  Funds will be utilized to address on going issues with the roof at the DPW office at 500 Primrose
  St. They will be used to remove no longer used HVAC units and redo roof that is leaking and
  damaged to ensure the facility remains secure and protected from
</p>
<p><strong>Essential</strong> &mdash; $50,000</p>

<h4>City Hall Elevator Rehabilitation</h4>
<p>
  The project would rehab and update the 50 year-old City Hall Elevator by replacing a number of
  major components, such as the master controller, door openers, fire recall, and associated
  fixtures. This rehabilitation project will ensure the long-term functionality and safe operation
  of the elevator, lower the potential for breakdowns and entrapments, and bring the aged unit into
  compliance with the current state building code.
</p>
<p><strong>High</strong> &mdash; $130,000</p>

<h4>Elevator Repair - High School</h4>
<p>
  The District is requesting capital funding to modernize the elevator system at Haverhill High
  School. This elevator is in significantly worse condition than the units currently being addressed
  at Pentucket Lake, Silver Hill, and Golden Hill, and the existing control panels, operating
  systems, and supporting infrastructure have exceeded their useful life. Haverhill High School has
  experienced regular and intermittent elevator failures, including entrapments, which create
  serious safety concerns for students, staff, and visitors and disrupt daily building operations.
  Continued issues also put the building at risk of falling out of ADA compliance. Given the age and
  condition of this unit, the risk of further breakdowns is higher than at the other schools, making
  this a priority life-safety and accessibility investment that cannot be deferred.
</p>
<p><strong>Essential</strong> &mdash; $200,000</p>

<h4>Elevator Repair: Pentucket Lake, Silver Hill, Golden Hill</h4>
<p>
  The School District is requesting capital funding to complete elevator modernization upgrades at
  Pentucket Lake, Silver Hill, and Golden Hill Schools. These elevators have aging control panels,
  operating systems, and related infrastructure that are no longer reliable and are approaching the
  end of their useful life. The work will include upgrades to the control systems, electrical
  components, safety features, and other modernization items needed to bring the units to current
  standards. These buildings have experienced regular elevator entrapments, creating ongoing safety
  concerns. Similar upgrades will be completed at Bradford and Nettle Schools over the summer.
  Funding these projects will address a critical life-safety need, ensure continued accessibility,
  and reduce the risk of continued failures in three heavily used school facilities.
</p>
<p><strong>Moderate</strong> &mdash; $525,000</p>

<h4>Fire Alarm - High School</h4>
<p>
  The District is requesting approximately $800,000 in capital funding to replace and modernize the
  fire alarm system at Haverhill High School. The existing system is outdated and has become
  increasingly unreliable due to aging equipment and wiring issues throughout the building. The main
  control panel is obsolete and nearing the end of its service life, making continued repairs an
  unsustainable approach. This project will require a full system replacement, including the panel,
  annunciators, strobes, and associated devices, along with necessary rewiring to support the
  upgraded system. Because these components function together, replacing only certain parts would
  not resolve the underlying problems.
</p>
<p><strong>Essential</strong> &mdash; $800,000</p>

<h4>Garage Roof Repairs - Highway</h4>
<p>
  Funds will be utilized to address the ongoing issues with the roof at the DPW fleet garage.
  Specifically, they will be used to repair and patch areas that are damaged and leaking, ensuring
  that the facility remains secure and protected from the elements.
</p>
<p><strong>Essential</strong> &mdash; $15,000</p>

<h4>Generators &amp; Transfer Panels - School</h4>
<p>
  The District is requesting capital funding to add five emergency generators and transfer panels to
  the capital project list, including installations at the four elementary schools &mdash; Bradford,
  Pentucket Lake, Silver Hill, and Golden Hill &mdash; as well as at Nettle School. In recent years,
  we have experienced multiple generator failures. Each generator and transfer panel installation is
  estimated at approximately $80,000. Given the overall cost, the District would plan to complete
  these upgrades on a phased basis, installing approximately one generator per year.
</p>
<p><strong>Moderate</strong> &mdash; $80,000</p>

<h4>Golden Hill Roof - School</h4>
<p>
  The District is currently in the schematic design phase for a roof replacement project at Silver
  Hill School, and we have recently begun the same process for Golden Hill. Both roofs are past
  their useful life, and staff have been consistently chasing leaks and addressing ongoing water
  infiltration issues. Based on current estimates, the total cost of the Silver Hill roof project,
  after the MSBA reimbursement rate of approximately 76%, will be close to $750,000. The initial
  schematic design budget was approved at $300,000, and we anticipate spending roughly $150,000,
  which will also be reimbursed at the same rate. The entire project will cost around $3,000,000
  prior to reimbursement.
</p>
<p><strong>Moderate</strong> &mdash; $750,000</p>

<h4>Heating System Highway Garage</h4>
<p>
  Replacement of the aging heating system in the DPW garage. The existing system is over 25 years
  old and consists of ten industrial gas-fired heating units. Currently, only two of the ten units
  remain operational, as replacement parts for the others are no longer available. The proposed
  project includes the installation of a modern, energy-efficient heating system, along with new
  thermostats and blower units. The new system is expected to reduce energy consumption leading to a
  cost savings within the Highway <GlossaryTerm term="Operating Budget"
    >operating budget</GlossaryTerm
  > over time. The City has been awarded $27,000 through an Energy Efficiency and Conservation Block Grant
  (EECBG) to support this project.
</p>
<p><strong>High</strong> &mdash; $130,000</p>

<h4>Park Barn Asbestos Removal and Floor and Stair Replacement - Highway</h4>
<p>Removal of asbestos insulation and replacement of failing floor and unsafe stairs.</p>
<p><strong>High</strong> &mdash; $50,000</p>

<h4>Park Barn Rehabilitation - Highway</h4>
<p>
  Annual capital funding for the maintenance and restoration of the Park's Barn building . This
  includes necessary improvements such as replacing the siding, windows, and doors, as well as
  addressing various other repairs to ensure the building remains safe and functional.
</p>
<p><strong>Essential</strong> &mdash; $15,000</p>

<h4>Silver Hill Roof - School</h4>
<p>
  Total project cost $3.5 million. City portion $650,000. This has gone through schematic design
</p>
<p><strong>Essential</strong> &mdash; $815,656</p>

<h3>Computer Equipment</h3>

<h4>Fire Station Internet Resilience- IT</h4>
<p>Provide backup internet connectivity to fire stations.</p>
<p><strong>Low</strong> &mdash; $45,000</p>

<h4>Legacy Wiring Clean Up - IT</h4>
<p>Remove old wiring and equipment from decades of upgrades.</p>
<p><strong>High</strong> &mdash; $25,000</p>

<h3>Computer Software</h3>

<h4>Archival Inventory and Digitization - City Clerk</h4>
<p>
  The City Clerk's Office aims to inventory and digitize all records housed in the City Clerk's
  section of the City Archives. Our records date back to Haverhill's founding in the mid-1600s. Many
  documents are quite fragile and at risk of deterioration. Digitization will preserve these
  historical records, improve public access, and streamline our ability to fulfill research requests
  without lengthy archive searches. Most importantly, it offers a far more cost-effective
  preservation method than restoring each document or book individually. I have no preference on
  timing, but the sooner the better for the sake of the records. I do plan to apply for grants, as
  well, as there are several opportunities for nationwide historical preservation programs.
</p>
<p><strong>Moderate</strong> &mdash; $160,000</p>

<h4>Tax Collection Software - Treasurer</h4>
<p>
  The current Tax Collection software is outdated, and no further upgrades are available. This
  request is to upgrade to OpenGov which is a cloud based product. This would allow users to access
  the system in real time. This system would be accessible to residents, vendors and mortgage
  companies to lookup tax data information.
</p>
<p><strong>Moderate</strong> &mdash; $335,146</p>

<h3>Equipment</h3>

<h4>Batwing Attachment - Highway</h4>
<p>
  This attachment will expand the unit's functionality by enabling efficient mowing of large
  municipal properties, roadway shoulders, parks, and other public spaces. Allowing for year-round
  use of Trackless tractor outside of sidewalk snow removal.
</p>
<p><strong>High</strong> &mdash; $50,000</p>

<h4>Gasboy Vehicle Fuel System - Highway</h4>
<p>
  The existing system is nearing the end of its useful life and poses a risk of operational
  disruption. Replacement is necessary to maintain reliable and efficient service.
</p>
<p><strong>High</strong> &mdash; $60,000</p>

<h4>Radios - Fire</h4>
<p>
  We respectfully request approval for a capital budget allocation to replace the Fire Department's
  radio communications system. The current radios have exceeded their service life, are no longer
  supported by the manufacturer, and replacement parts and batteries have become increasingly
  difficult and costly to obtain. This project would include upgrading all vehicle-mounted and
  portable radios, as well as the dispatching system at the stations. Modernizing this system will
  improve reliability, enhance firefighter safety, and ensure full interoperability with the Police
  Department and neighboring communities, which is critical to effective coordination and compliance
  with the community's emergency management plan.
</p>
<p><strong>High</strong> &mdash; $2,384,135</p>

<h4>SCBA - Fire</h4>
<p>
  The fire <GlossaryTerm term="Department">department</GlossaryTerm> respectfully submits this capital
  budget request in the amount of $1,290,863.00 for the replacement of our current SCBA units. The existing
  equipment is reaching the end of its service life, and the costs associated with maintenance and repairs
  continues to rise. Replacing the fleet at this time will ensure that firefighters have reliable, modern
  respiratory protection that meets current safety standards. This request is also driven by the departments
  ongoing growth and planned new apparatus in the coming year. New SCBA units now will support operational
  expansion, maintain uniformity of equipment across all front line vehicles, and reduce long term expenses
  by avoiding piecemeal or emergency replacements. Upgrading now is both cost effective and strategically
  advantageous for both operational readiness and the health and safety of our firefighters.
</p>
<p><strong>Essential</strong> &mdash; $1,290,863</p>

<!-- The heading is printed "Skid Steer - Highway2"; the stray 2 is the book's. -->
<h4>Skid Steer - Highway2</h4>
<p>
  A skid steer with an asphalt milling attachment to enhance operational versatility and efficiency.
  Its compact size and specialized attachment allow year-round use for asphalt milling, snow
  removal, landscaping, material handling, and small construction projects. This reduces reliance on
  contractors, improves response times, and supports cost-effective, in-house infrastructure
  maintenance.
</p>
<p><strong>Moderate</strong> &mdash; $120,000</p>

<h3>Infrastructure</h3>

<h4>Brandy Brow East Meadow River Culvert - Highway</h4>
<p>
  Project replaces the existing, failing culvert with a structure that can accommodate larger storm
  flows, provides better protection against erosion and scour, reduces resident vulnerability to
  changing climatic conditions, and improves access across the East Meadow River for pedestrians and
  emergency personnel over the culvert. City applied for $1,000,000 in MassDOT grant funding in
  early 2026. No match required. City plans to apply for up to $650,000 in MassDER Culvert
  Replacement funding in March 2026. There is a 10% match requirement. 2024 project estimate
  attached. Maximize in-kind DPW services to reduce/eliminate local capital requirement.
</p>
<p><strong>Moderate</strong> &mdash; $65,000</p>

<h4>Bridge CIP Update - Highway</h4>
<p>
  Update Haverhill's Bridge Capital Improvement Program, including inspections, prioritization of
  repairs, and planning for rehabilitation or replacement projects, to ensure safety, extend asset
  life, and maintain a resilient transportation network.
</p>
<p><strong>Moderate</strong> &mdash; $50,000</p>

<h4>Kenoza Ave Improvements - Highway</h4>
<p>
  Complete Streets improvements on Kenoza Avenue, including pedestrian and bicycle facilities, to
  strengthen neighborhood accessibility; $500K <GlossaryTerm term="Grant">grant</GlossaryTerm> supported.
</p>
<p><strong>Moderate</strong> &mdash; $200,000</p>

<h4>Little River Dam Removal - Highway</h4>
<p>
  The Little River Dam Removal Project will remove an obsolete dam and restore the river corridor to
  improve public safety, climate resilience, and environmental function. Work is expected to include
  dam removal, sediment management (as needed), riverbank stabilization, and site restoration. The
  project will reduce long-term dam failure risk and downstream impacts, improve flood resilience
  and river hydraulics, restore aquatic habitat and fish passage, and advance City goals for climate
  adaptation, infrastructure resilience, environmental restoration, and economic development. The
  estimated project cost is $9.5 million. City currently has $5 million in <GlossaryTerm
    term="Grant">grant</GlossaryTerm
  > money leaving a funding gap of $4.5 million at this time.
</p>
<p><strong>Moderate</strong> &mdash; $4,500,000</p>

<h4>Miscellaneous Traffic Safety - Highway</h4>
<p>
  Request of $50K to address urgent, unplanned traffic safety needs such as signage, pavement
  markings, signal repairs, and temporary traffic control measures necessary to protect public
  safety.
</p>
<p><strong>Moderate</strong> &mdash; $50,000</p>

<h4>Parking Lot Paving at Citizens Center</h4>
<p>
  The Citizens Parking Lot, installed in 1978, is showing signs of age with persistent potholes and
  visible cracking throughout the year. This estimate is based on similar projects, such as Plug
  Pond.
</p>
<p><strong>Essential</strong> &mdash; $60,000</p>

<h4>Parking Lot Repairs - Stadium</h4>
<p>City has $50,000 Earmark but total project cost is estimated at $100,000.</p>
<p><strong>High</strong> &mdash; $100,000</p>

<h4>Sidewalks - Annual Repair &amp; Replace - Highway</h4>
<p>
  This <GlossaryTerm term="Annual Budget">annual budget</GlossaryTerm> allocation will enable the <GlossaryTerm
    term="Department">department</GlossaryTerm
  >
  to remediate all non-compliant curb ramps and poor condition sidewalks over the next 30 years per engineering
  consultant.
</p>
<p><strong>Low</strong> &mdash; $1,100,000</p>

<h4>Stormwater Assessment at DPW Facility and adjacent property on Downing Ave</h4>
<p>
  Assessment, identification, and characterization of stormwater nonpoint source pollution (NPS)
  impacts. Contract a firm to 1) survey the DPW facility and our adjacent property south of Downing
  Av, including a delineation of the surrounding wetland systems, topography, related drainage
  systems 2) design stormwater best management practices to improve quality of water discharged to
  Little River, 3) prepare an Operations and Maintenance Plan for the facility, and 4) install BMP
  improvements as funding allows.
</p>
<p><strong>Moderate</strong> &mdash; $17,500</p>

<h4>Street Lights - Highway</h4>
<p>
  Funds will be used to install new streetlights that have been requested by residents once they
  have met approval. Approval process includes a roadway safety and feasibility review to ensure
  that the light is required, and installation is possible at a reasonable cost compared to other
  requested streetlights.
</p>
<p><strong>Moderate</strong> &mdash; $55,000</p>

<h4>Supplemental Paving - Highway</h4>
<p>
  These funds ensure the safety and longevity of our city's roadways, it is crucial to secure
  funding that will help us maintain the Road Surface Rating (RSR). This investment will not only
  preserve the quality of our streets but also enable us to make improvements to the City's
  infrastructure, ultimately benefiting all members of the community.
</p>
<p><strong>Essential</strong> &mdash; $700,000</p>

<h4>Washington Square - Improvements and Construction - Highway</h4>
<p>Construction costs for improvements in the Washington Square area.</p>
<p><strong>Moderate</strong> &mdash; $1,800,000</p>

<h3>Land &amp; Land Improvements</h3>

<h4>Cooling Corridors Street Tree Planting - Highway</h4>
<p>
  Street tree planting provides multiple benefits, including improved air quality, reduced urban
  heat, better stormwater management, enhanced neighborhood appearance, and increased biodiversity.
  Trees also offer shade, lower energy costs, and contribute to the overall health and well-being of
  residents. Targeted neighborhoods are Zins Park/Katsaros Dr and Cogwell/Hunking . DPW will provide
  in-kind services to periodically inspect new tree plantings for watering , maintenance, and
  replacement, as needed.
</p>
<p><strong>Moderate</strong> &mdash; $7,500</p>

<h4>Shade Trees for Parks - Highway</h4>
<p>
  The request is to replace and plant new shade trees in public parks, thereby improving user
  comfort, mitigating heat, and enhancing long-term park sustainability. The investment supports
  public health, climate resilience, and asset preservation.
</p>
<p><strong>Low</strong> &mdash; $25,000</p>

<h4>Whittier Birthplace Trail Hub - Highway</h4>
<p>
  Mass Trails Grant Application Fi led 02-02-2026. Project will create an essential connection
  between three trail systems: Brandy Brow Forest, Meadow Brook Conservation Area, and Winnekenni
  Park Conservation Area trails, while promoting access to some of the region's most significant
  historical and cultural viewing natural sites. By linking these trails, the project will enhance
  outdoor recreation, celebrate the area's natural beauty, and honor its agricultural heritage.
  Having been selected as an alternate project in 2025, the City anticipates funding in the current
  <GlossaryTerm term="Grant">grant</GlossaryTerm> round.
</p>
<p><strong>High</strong> &mdash; $33,820</p>

<h3>Software</h3>

<h4>CMMS Computerized Maintenance Management System - Highway</h4>
<p>
  Implement a computerized maintenance management system (CMMS) for the Highway Division to improve
  tracking, scheduling, and reporting of maintenance activities, enhancing operational efficiency
  and asset management.
</p>
<p><strong>Moderate</strong> &mdash; $50,000</p>

<h3>Vehicles</h3>

<h4>1-Ton Truck - Highway</h4>
<p>
  Replacement of an aging one-ton truck that is no longer expected to pass state inspection. This
  vehicle is critical to daily operations, including material transport and is vital during winter
  operations, particularly for snow removal efforts that ensure roads remain safe and clear for
  traffic.
</p>
<p><strong>Essential</strong> &mdash; $105,000</p>

<h4>2500 Pick-up Truck with Plow - Highway</h4>
<p>
  This vehicle is necessary to respond to emergencies, inspect active work sites, oversee
  infrastructure projects, and coordinate daily field operations throughout the City. The addition
  of this vehicle will strengthen winter storm response capabilities, improve operational
  flexibility, and enhance public safety. It will also support long-term fleet management objectives
  by ensuring that supervisory staff have reliable, appropriately equipped transportation to
  effectively perform their duties in all weather conditions.
</p>
<p><strong>Moderate</strong> &mdash; $90,000</p>

<h4>Trash Truck - Highway</h4>
<p>
  The existing truck, which was purchased as a used unit, has been decommissioned due to safety
  concerns and is no longer able to pass the mandated state inspection. The acquisition of a new
  truck will enable us to continue providing effective waste management services while ensuring
  compliance with safety regulations. Will allow us to expand our current public space trash barrel
  program and could save funds in future trash hauling contracts.
</p>
<p><strong>Essential</strong> &mdash; $180,000</p>

<h2>2027 Capital Funding Recommendation</h2>

<p>
  <em>
    Due to budget limitations stemming from decreasing <GlossaryTerm term="Revenues"
      >revenues</GlossaryTerm
    > and rising inflation, along with uncertainties at both government and global levels, the Mayor's
    budget team has put forward initial funding recommendations. However, the Mayor and CFO have suggested
    postponing final funding decisions, potentially until later in fiscal 2027. This delay would enable
    a reassessment of the economic climate and the exploration of viable, sustainable funding alternatives.
    It would also allow for the certification of the city's fiscal 2026 <GlossaryTerm
      term="Free Cash">free cash</GlossaryTerm
    > and determine any excess available for capital projects.
  </em>
</p>

<h2>Plan for Funding Major Capital Projects</h2>

<p>
  <em>
    The funding strategy for significant capital projects, such as JG Whittier Middle School and a
    Fire Station, involves reallocating part of the retiring pension assessment, which will be
    accessible in 2033. This reallocation will help cover the <GlossaryTerm term="Debt Service"
      >debt service</GlossaryTerm
    > payment obligations necessary to finance these initiatives.
  </em>
</p>

<p>
  <em>
    The city is on track to fully fulfill its pension liability by 2032, which is eight years ahead
    of the statutory deadline set for 2040. Once the pension liability is met, the plan is to
    allocate a substantial portion of these funds to tackle the city's considerable Other
    Post-Employment Benefits (OPEB) liability, currently estimated at over $300 million.
    Nevertheless, the city may also consider utilizing some of these funds for the previously
    mentioned capital projects. If funding for these projects is needed before 2033, a debt
    exclusion might be required.
  </em>
</p>

<h3>What is OPEB?</h3>

<p>
  <em>
    OPEB liability represents the future financial commitments that employers, mainly government
    entities, have to provide non-pension post-employment benefits. These benefits primarily
    encompass retiree health insurance, dental coverage, and life insurance earned by employees.
  </em>
</p>

<!-- Page 69: the same spending carried out to 2036. -->
<h2>10-Year Appropriation Projection (2027 to 2031)</h2>

<h3>The anticipated general fund budget is founded on the following assumptions:</h3>

<ul>
  <li>
    Estimates actual and future costs for <GlossaryTerm term="Debt Service"
      >debt service</GlossaryTerm
    > according to the capital improvement plan.
  </li>
  <li>
    Includes a placeholder for <GlossaryTerm term="Debt Service">debt service</GlossaryTerm> starting
    in 2033 for JG Whittier Middle School and a Fire Station.
  </li>
  <li>Reflects a 4.98% increase in employee benefits.</li>
  <li>
    Accounts for a 1% annual increase in the <GlossaryTerm term="Overlay">Overlay</GlossaryTerm> (reserve
    for real estate abatements and exemptions).
  </li>
  <li>Incorporates a 1.39% rise in State Assessments, which aligns with the historical average.</li>
  <li>Projects a 2.5% overall annual increase across all departments.</li>
  <li>Allocates 100% of Chapter 70 funds to the School Department.</li>
  <li>
    Plans for OPEB (Other Post Employment Benefits) funding starting in 2033 at $15 million
    annually, utilizing savings from the pension assessment. As of June 30, 2024, the city's OPEB
    liability stood at $307,805,511.
  </li>
</ul>

<p>
  This projection leads to a $583,787 budget shortfall in 2029, or 0.19% of the total budget, even
  if the city uses its entire excess <GlossaryTerm term="Levy">levy</GlossaryTerm> reserve. This shortfall
  is expected to grow to $2.7 million by 2032, or .82% of the anticipated total <GlossaryTerm
    term="General Fund">general fund</GlossaryTerm
  > budget.
</p>

<p>
  <em>
    It is crucial to understand that forecasting is more of an art than an exact science, with
    accuracy diminishing significantly beyond five years. Ultimately, this budget gap will need to
    be addressed through either increased revenue or reduced appropriations.
  </em>
</p>

<h3>The administration aims to establish a sustainable operating budget that:</h3>

<ul>
  <li>Provides consistent services</li>
  <li>Maximizes available resources</li>
  <li>
    Focuses on achieving long-term goals, such as attracting and retaining high-quality staff,
    delivering exceptional services, and updating aging infrastructure.
  </li>
</ul>

<!--
  Printed as "2027-2031 Appropriation Projection" and "2032-2036 Appropriation
  Projection" on facing pages. Joined here for the same reason the revenue
  forecast is. Row 18 appears only from 2033, when OPEB funding starts.
-->
<h2>2027&ndash;2036 Appropriation Projection</h2>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
      <th scope="col">2031</th>
      <th scope="col">2032</th>
      <th scope="col">2033</th>
      <th scope="col">2034</th>
      <th scope="col">2035</th>
      <th scope="col">2036</th>
    </tr>
  </thead>
  <tbody>
    <tr
      ><th scope="row">1. GENERAL GOVERNMENT</th><td>$6,265,194</td><td>$6,421,824</td><td
        >$6,582,369</td
      ><td>$6,746,929</td><td>$6,915,602</td><td>$7,088,492</td><td>$7,265,704</td><td
        >$7,447,347</td
      ><td>$7,633,531</td><td>$7,824,369</td></tr
    >
    <tr
      ><th scope="row">2. POLICE</th><td>$17,501,996</td><td>$17,939,546</td><td>$18,388,035</td><td
        >$18,847,735</td
      ><td>$19,318,929</td><td>$19,801,902</td><td>$20,296,950</td><td>$20,804,373</td><td
        >$21,324,483</td
      ><td>$21,857,595</td></tr
    >
    <tr
      ><th scope="row">3. FIRE</th><td>$15,919,972</td><td>$16,469,972</td><td>$16,881,721</td><td
        >$17,303,764</td
      ><td>$17,736,358</td><td>$18,179,767</td><td>$18,634,262</td><td>$19,100,118</td><td
        >$19,577,621</td
      ><td>$20,067,062</td></tr
    >
    <tr
      ><th scope="row">4. SCHOOL DEPARTMENT CITY CONTRIBUTION</th><td>$40,571,576</td><td
        >$41,585,865</td
      ><td>$42,625,512</td><td>$43,691,150</td><td>$44,783,428</td><td>$45,903,014</td><td
        >$47,050,590</td
      ><td>$48,226,854</td><td>$49,432,526</td><td>$50,668,339</td></tr
    >
    <tr
      ><th scope="row">5. SCHOOL DEPARTMENT CH 70</th><td>$96,427,042</td><td>$98,355,583</td><td
        >$100,322,694</td
      ><td>$102,329,148</td><td>$104,375,731</td><td>$106,463,246</td><td>$108,592,511</td><td
        >$110,764,361</td
      ><td>$112,979,648</td><td>$115,239,241</td></tr
    >
    <tr
      ><th scope="row">6. WHITTIER/ESSEX TECH &amp; OTHER EDUCATION</th><td>$10,159,836</td><td
        >$10,566,229</td
      ><td>$10,988,879</td><td>$11,428,434</td><td>$11,885,571</td><td>$12,360,994</td><td
        >$12,855,434</td
      ><td>$13,369,651</td><td>$13,904,437</td><td>$14,460,615</td></tr
    >
    <tr
      ><th scope="row">7. PUBLIC WORKS</th><td>$11,025,718</td><td>$11,301,361</td><td
        >$11,583,895</td
      ><td>$11,873,492</td><td>$12,170,330</td><td>$12,474,588</td><td>$12,786,453</td><td
        >$13,106,114</td
      ><td>$13,433,767</td><td>$13,769,611</td></tr
    >
    <tr
      ><th scope="row">8. SNOW &amp; ICE</th><td>$1,210,000</td><td>$1,210,000</td><td
        >$1,210,000</td
      ><td>$1,210,000</td><td>$1,210,000</td><td>$1,240,250</td><td>$1,271,256</td><td
        >$1,303,038</td
      ><td>$1,335,614</td><td>$1,369,004</td></tr
    >
    <tr
      ><th scope="row">9. LIBRARY</th><td>$2,010,050</td><td>$2,060,301</td><td>$2,111,809</td><td
        >$2,164,604</td
      ><td>$2,218,719</td><td>$2,274,187</td><td>$2,331,042</td><td>$2,389,318</td><td
        >$2,449,051</td
      ><td>$2,510,277</td></tr
    >
    <tr
      ><th scope="row">10. RECREATION</th><td>$320,397</td><td>$328,407</td><td>$336,617</td><td
        >$345,033</td
      ><td>$353,658</td><td>$362,500</td><td>$371,562</td><td>$380,851</td><td>$390,373</td><td
        >$400,132</td
      ></tr
    >
    <tr
      ><th scope="row">11. OTHER HUMAN SERVICES</th><td>$2,805,878</td><td>$2,876,025</td><td
        >$2,947,926</td
      ><td>$3,021,624</td><td>$3,097,164</td><td>$3,174,593</td><td>$3,253,958</td><td
        >$3,335,307</td
      ><td>$3,418,690</td><td>$3,504,157</td></tr
    >
    <tr
      ><th scope="row">12. DEBT SERVICE</th><td>$8,349,024</td><td>$8,798,657</td><td>$8,444,908</td
      ><td>$8,317,749</td><td>$8,207,658</td><td>$8,015,440</td><td>$7,822,400</td><td
        >$7,429,095</td
      ><td>$7,293,664</td><td>$6,980,177</td></tr
    >
    <tr
      ><th scope="row">13. NEW DEBT SERVICE (Fire Station/JG Whittier/Landfill)</th><td>$485,795</td
      ><td>$495,683</td><td>$495,760</td><td>$495,839</td><td>$495,920</td><td>$496,002</td><td
        >$6,659,749</td
      ><td>$8,169,420</td><td>$9,515,987</td><td>$11,119,805</td></tr
    >
    <tr
      ><th scope="row">14. EMPLOYEE BENEFITS</th><td>$59,327,682</td><td>$62,381,939</td><td
        >$65,487,718</td
      ><td>$68,748,123</td><td>$72,170,852</td><td>$75,763,987</td><td>$54,536,011</td><td
        >$57,251,169</td
      ><td>$60,101,505</td><td>$63,093,749</td></tr
    >
    <tr
      ><th scope="row">15. LIABILITY INSURANCE</th><td>$1,381,899</td><td>$1,423,356</td><td
        >$1,466,056</td
      ><td>$1,510,038</td><td>$1,555,339</td><td>$1,601,999</td><td>$1,650,059</td><td
        >$1,699,561</td
      ><td>$1,750,548</td><td>$1,803,064</td></tr
    >
    <tr
      ><th scope="row">16. STATE ASSESSMENTS &amp; OFFSETS</th><td>$10,271,435</td><td
        >$10,672,021</td
      ><td>$11,088,230</td><td>$11,520,671</td><td>$11,969,977</td><td>$12,436,806</td><td
        >$12,921,841</td
      ><td>$13,425,793</td><td>$13,949,399</td><td>$14,493,426</td></tr
    >
    <tr
      ><th scope="row">17. OVERLAY</th><td>$250,000</td><td>$252,500</td><td>$255,025</td><td
        >$257,575</td
      ><td>$260,151</td><td>$262,753</td><td>$265,380</td><td>$268,034</td><td>$270,714</td><td
        >$273,421</td
      ></tr
    >
    <tr
      ><th scope="row">18. FUND OPEB LIABILITY WITH RETIRED PENSION FUNDS</th><td></td><td></td><td
      ></td><td></td><td></td><td></td><td>$15,353,685</td><td>$14,451,118</td><td>$13,459,250</td
      ><td>$12,362,343</td></tr
    >
    <tr
      ><th scope="row">19. BUDGET RESERVE</th><td>$988,666</td><td>$1,003,496</td><td>$1,018,548</td
      ><td>$1,033,827</td><td>$1,049,334</td><td>$1,065,074</td><td>$1,081,050</td><td
        >$1,097,266</td
      ><td>$1,113,725</td><td>$1,130,431</td></tr
    >
    <tr
      ><th scope="row">Grand Total</th><td>$285,272,159</td><td>$294,142,765</td><td
        >$302,235,702</td
      ><td>$310,845,734</td><td>$319,774,722</td><td>$328,965,594</td><td>$334,999,897</td><td
        >$344,018,788</td
      ><td>$353,334,531</td><td>$362,926,817</td></tr
    >
    <tr
      ><th scope="row"><em>Annual % Increase</em></th><td></td><td>3.1%</td><td>2.8%</td><td
        >2.8%</td
      ><td>2.9%</td><td>2.9%</td><td>1.8%</td><td>2.7%</td><td>2.7%</td><td>2.7%</td></tr
    >
    <tr
      ><th scope="row">Budget Surplus / (Deficit)</th><td>$(0)</td><td>$(1,781,111)</td><td
        >$(2,404,458)</td
      ><td>$(3,249,092)</td><td>$(4,036,208)</td><td>$(4,811,220)</td><td>$(2,176,387)</td><td
        >$(2,241,598)</td
      ><td>$(2,312,574)</td><td>$(2,362,111)</td></tr
    >
    <tr
      ><th scope="row">Estimated Excess Levy</th><td>$1,482,862</td><td>$1,849,847</td><td
        >$1,820,671</td
      ><td>$1,922,956</td><td>$2,014,815</td><td>$2,104,313</td><td>$2,176,387</td><td
        >$2,241,597</td
      ><td>$2,312,574</td><td>$2,362,111</td></tr
    >
    <tr
      ><th scope="row">Adjusted Budget</th><td>$1,482,862</td><td>$68,736</td><td>$(583,787)</td><td
        >$(1,326,136)</td
      ><td>$(2,021,394)</td><td>$(2,706,908)</td><td>$0</td><td>$(0)</td><td>$0</td><td>$0</td></tr
    >
  </tbody>
</table>

<!-- Page 72: what departments asked to add to the budgets above, and what
     they were granted. Not money of its own -- every approved line is already
     inside a department's total. -->
<h2>Summary Department Budget Requests</h2>

<p>
  Due to budgetary constraints, not all requested items could be included in the 2027 <GlossaryTerm
    term="Operating Budget">operating budget</GlossaryTerm
  >. Some requests, such as Fire Department supplies and street voting lists, will be phased in over
  several years. Higher-priority needs, like the Police body camera implementation, were addressed
  first. The Police Department secured a $250,000 state <GlossaryTerm term="Grant"
    >grant</GlossaryTerm
  > to offset implementation costs for this initiative. The operating budget supplements the <GlossaryTerm
    term="Grant">grant</GlossaryTerm
  > by covering related staffing and video storage expenses. Additionally, the Mayor restructured the
  Public Works Department to improve operations and provide strategic oversight. Finally, the proposed
  budget includes step and COLA increases for non-union staff to ensure pay equity with collectively bargained
  employees.
</p>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Budget Request</th>
      <th scope="col">Amount Approved</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Non-Union Step Increase</th><td>$131,233.01</td><td>$131,233.01</td></tr>
    <tr
      ><th scope="row">City Clerk Increase Street &amp; Voting List</th><td>$33,000.00</td><td
        >$5,000.00</td
      ></tr
    >
    <tr
      ><th scope="row">Fire Apparatus Repair &amp; Supply Budget Increase</th><td>$25,000.00</td><td
        >$5,000.00</td
      ></tr
    >
    <tr><th scope="row">Restructure DPW</th><td>$141,652.00</td><td>$141,652.00</td></tr>
    <tr><th scope="row">Library New Division Head</th><td>$56,000.00</td><td>&ndash;</td></tr>
    <tr
      ><th scope="row">Police Civilian Dispatch Supervisor</th><td>$10,000.00</td><td>$10,000.00</td
      ></tr
    >
    <tr><th scope="row">Fire Detail Officer Stipend</th><td>$5,000.00</td><td>$2,500.00</td></tr>
    <tr
      ><th scope="row">Police Body Camera Storage Software</th><td>$115,000.00</td><td
        >$115,000.00</td
      ></tr
    >
    <tr><th scope="row">Police BRU Clinician</th><td>$85,000.00</td><td>$42,500.00</td></tr>
    <tr
      ><th scope="row">Police Crisis Intervention Counselor</th><td>$123,000.00</td><td
        >$73,000.00</td
      ></tr
    >
    <tr><th scope="row">Police Evidence Tech.</th><td>$36,230.00</td><td>$36,230.00</td></tr>
    <tr><th scope="row">FOIA Coordinator</th><td>$1,768.00</td><td>$1,768.00</td></tr>
    <tr><th scope="row">Grand Total</th><td>$762,883.01</td><td>$563,883.01</td></tr>
  </tbody>
</table>

<!-- Page 73: what had to come out of the budget above to balance it, and
     what is driving it up. -->
<h2>Other Budget Reductions to Create a Balanced Budget</h2>

<h3>Preliminary Budget Goals for Fiscal 2027</h3>

<p>The Mayor's initial budget objectives for fiscal 2027 encompassed several key components:</p>

<ul>
  <li>A <strong>3.3% property tax increase.</strong></li>
  <li>
    Absorption of the <strong>first 50% reduction</strong> from the Fire Department's Federal SAFER grant,
    with the second half needing to be absorbed in 2028 to avoid potential layoffs.
  </li>
  <li>
    Incorporation of the Police Department's <strong>Crisis Intervention Counselor</strong> and
    <strong>BRU Clinician</strong>, previously funded by Federal ARPA funds.
  </li>
  <li>Allocation of funds to maintain <strong>level services</strong> across the city.</li>
</ul>

<h3>Budgetary Challenges</h3>

<p>
  The challenge was to meet these budget goals amidst rising inflation and declining state and
  federal <GlossaryTerm term="Revenues">revenues</GlossaryTerm>, all while minimizing the impact on
  local property taxes.
</p>

<p>Some significant budgetary hurdles for 2027 included:</p>

<ul>
  <li>
    A <strong>7.35% increase</strong> in the city's health insurance, totaling an additional
    <strong>$1.57 million</strong>
  </li>
  <li>
    An <strong>8.8% increase</strong> in the Whittier Tech. assessment, amounting to
    <strong>$764,891</strong>
  </li>
  <li>
    A <strong>6.8% increase</strong> in state assessments, constrained by only a
    <strong>0.8% increase</strong> in general government aid
  </li>
  <li>
    The city's Chapter 70 school funding from the state increased by only <strong>2.34%</strong>,
    while a <strong>7.1% increase</strong> had been expected, resulting in a
    <strong>$4.5 million shortfall</strong>.
  </li>
</ul>

<p>
  Collectively, city departments submitted budget requests totaling a <strong>4.4% increase</strong
  >, or <strong>$12.2 million</strong>, over fiscal 2026. These requests surpassed the Mayor's
  target budget by <strong>$5.8 million</strong>.
</p>

<h3>Budgetary Challenges Continued</h3>

<p>
  During initial budget discussions, the Mayor and Department Heads reached an agreement to reduce
  the budget by <strong>$1.35 million</strong>, which included:
</p>

<ul>
  <li><strong>$647,000</strong> from the Fire Department</li>
  <li><strong>$100,000</strong> from legal services</li>
  <li><strong>$200,000</strong> from Highway</li>
  <li><strong>$24,000</strong> in overtime</li>
  <li><strong>$379,000</strong> across all other city departments.</li>
</ul>

<p>
  Despite these adjustments, the city remained significantly far from achieving a <GlossaryTerm
    term="Balanced Budget">balanced budget</GlossaryTerm
  >. We undertook a comprehensive reassessment of <GlossaryTerm term="Revenues"
    >revenues</GlossaryTerm
  > using actual figures up to March and meticulously analyzed departmental budgets line by line to identify
  potential savings. Ultimately, we recommend the following budget adjustments:
</p>

<ul>
  <li>
    <GlossaryTerm term="Fund">Fund</GlossaryTerm> vacant positions at <strong>50%</strong>, reducing
    the budget by <strong>$275,000</strong>
    (approximately <strong>5.5 FTEs</strong>)
  </li>
  <li>
    Cut Police overtime, repairs and maintenance, and computer supplies by <strong>$507,142</strong>
  </li>
  <li>Reduce Fire overtime, supplies, and repairs and maintenance by <strong>$206,050</strong></li>
  <li>Decrease Highway equipment, overtime, and capital expenses by <strong>$254,467</strong></li>
  <li>
    Reduce General Government repairs and maintenance, office supplies, consulting, and training by
    <strong>$24,200</strong>
  </li>
  <li>
    Reduce Human Services veterans payments, building maintenance, and office supplies by
    <strong>$44,300</strong>
  </li>
  <li>
    Lower group insurance for anticipated vacancies and attrition by <strong>$509,859</strong>
  </li>
  <li>
    Reduce salary and budget reserve by <strong>$890,000</strong> (previously used to <GlossaryTerm
      term="Fund">fund</GlossaryTerm
    > collective bargaining settlements and snow removal deficits)
  </li>
  <li>
    Reduce debt service by <strong>$90,479</strong> due to bond issue with lower than estimated interest
    cost
  </li>
  <li>
    Increase motor vehicle excise revenue by <strong>$548,000</strong> based on actual receipts through
    March 2026
  </li>
</ul>

<h3>Final Recommendations</h3>

<p>
  The final recommendation to balance the 2027 <GlossaryTerm term="Operating Budget"
    >operating budget</GlossaryTerm
  > involves utilizing a portion of the city's tax
  <strong><GlossaryTerm term="Levy">levy</GlossaryTerm> reserve</strong>. This option was carefully
  considered to prevent creating a structurally unbalanced budget or leaving unresolved issues for
  2028. The city's projected excess <GlossaryTerm term="Levy">levy</GlossaryTerm> for 2027, which represents
  the amount of funds that can be appropriated without a referendum, totals
  <strong>$2.6 million</strong>. Using the entire excess <GlossaryTerm term="Levy"
    >levy</GlossaryTerm
  > would undoubtedly lead to a <GlossaryTerm term="Deficit">deficit</GlossaryTerm> for 2028, likely resulting
  in layoffs.
</p>

<p>
  The <strong>Mayor's budget proposal includes a year-over-year budget increase of 2.9%</strong> and
  using an additional <strong>$1.1 million</strong> from the city's <GlossaryTerm term="Levy"
    >levy</GlossaryTerm
  > reserve, leaving an excess tax <GlossaryTerm term="Levy">levy</GlossaryTerm> of
  <strong>$1.5 million</strong>. Utilizing this additional <GlossaryTerm term="Levy"
    >levy</GlossaryTerm
  > will increase the estimated tax bill by <strong>4.1%</strong>, or <strong>$244.97</strong> for
  the average single-family home, based on the 2026 valuations and tax shift percentages. The tax
  bill increase for the average single-family home in 2026 was <strong>4.6%</strong>.
</p>

<h3>Major Budget Driver - Group Health Insurance</h3>

<p>
  During the budget process, the Mayor, Human Resources Director, and the CFO met with the city's
  independent insurance advisor to discuss the city's group insurance plan, anticipated rate
  increases, and alternative options for managing health care costs. We learned that because the
  city has a poor loss ratio, meaning the GIC - Group Insurance Commission, has paid out more in
  claims in the recent reporting period than it has received in premiums, it is likely the city
  would not receive proposals from alternative health care carriers as it has not received proposals
  in the recent past. We were also informed that if the city were to withdraw from the GIC, it must
  wait three years to re-apply to the Commission, and upon reapplication the GIC is <em>not</em>
  required to accept the city's request for re-entry. However, if the city remains with the GIC, the GIC
  <em>must</em> renew the city's policy each year.
</p>

<p>
  The GIC is a Massachusetts state agency that provides high-value health insurance and other
  benefits (like dental, vision, life, and disability insurance) to state employees, retirees, their
  families, and eligible municipal workers. The GIC is the biggest employer purchaser of health
  insurance in the state, and it uses this leverage to drive quality and affordability in the
  market. In addition to covering state employees, the GIC presently covers 11 cities, 27 towns, and
  16 school districts. No municipal units left the GIC in fiscal 2026 and 11 new municipal units
  have joined for 2027.
</p>

<!-- Pages 76 to 78, "2027 Budget in Brief": every department on one line, and
     the same budget rolled up by function. The book splits the first across two
     pages purely for room -- same columns, same header, alphabetical throughout
     -- so the two halves are one table here. The revenue that balances against
     these is on the revenue page, where its own chart is. -->
<h2>2027 Budget in Brief</h2>

<BudgetTable table={DEPARTMENTS} />

<h3>Appropriations</h3>

<BudgetTable table={APPROPRIATIONS} />

<BookElsewhere items={data.elsewhere} book={data.book} />

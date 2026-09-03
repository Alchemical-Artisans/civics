<script lang="ts">
  import { onMount } from "svelte"
  import BudgetColumns from "$lib/BudgetColumns.svelte"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import { CAPITAL_REQUESTS } from "../../tables"
  import { amount, cell } from "$lib/budget-table"

  /**
   * Page 29's table, as one stacked bar per year rather than a grid of
   * fifty-odd cells. `order` is every category's five-year total, largest
   * first, so a category keeps one colour and one band running across all
   * five bars -- read down the same band in each rather than picked out of
   * five independently-sorted ones. "Grand Total" is excluded as a category
   * (`order` would draw a tenth band that is every other category added
   * together) and read directly as each bar's own stated total instead of
   * summed, the same reason `SPENDING_TOTAL` is stated rather than summed.
   */
  const capitalYears = CAPITAL_REQUESTS.columns.slice(1, -1)
  const capitalCategories = CAPITAL_REQUESTS.rows
    .map((row) => row.label)
    .filter((label) => label !== "Grand Total")
  const capitalOrder = [...capitalCategories].sort(
    (a, b) =>
      amount(cell(CAPITAL_REQUESTS, b, "Grand Total"))! -
      amount(cell(CAPITAL_REQUESTS, a, "Grand Total"))!,
  )

  /**
   * Two one-time projects that are almost the whole of the 2028 building
   * total: $90 million for JGW/Tilton and $30 million for the Fire Station,
   * $120 million of the category's $125,002,000 that year. Left out of this
   * chart only -- the table below still carries both in full, at their own
   * rows -- because $120 million in two projects sets the scale every other
   * category and every other year is read against, and against it they all
   * draw as a flat line at the foot. The bar beside the chart says so now,
   * charted rather than written out in a note; nothing here touches
   * `CAPITAL_REQUESTS` itself, which stays the book's own figures.
   */
  const EXCLUDED_YEAR = "2028"
  const EXCLUDED_CATEGORY = "Buildings & Building Improvements"
  const EXCLUDED_PROJECTS = [
    { label: "JGW / Tilton School Core Project", amount: 90000000 },
    { label: "Fire Station", amount: 30000000 },
  ]
  const excludedTotal = EXCLUDED_PROJECTS.reduce((sum, project) => sum + project.amount, 0)

  const capitalRequests = capitalYears.map((year) => ({
    label: year,
    total:
      amount(cell(CAPITAL_REQUESTS, "Grand Total", year))! -
      (year === EXCLUDED_YEAR ? excludedTotal : 0),
    parts: capitalCategories
      .map((label) => {
        const raw = amount(cell(CAPITAL_REQUESTS, label, year))
        if (raw === null) return null
        const value =
          year === EXCLUDED_YEAR && label === EXCLUDED_CATEGORY ? raw - excludedTotal : raw
        return value > 0 ? { label, amount: value } : null
      })
      .filter((part): part is { label: string; amount: number } => part !== null),
  }))

  /**
   * The same two projects, drawn as their own bar rather than only named in
   * the note -- one column, largest first, the same component and the same
   * reading (hover or focus a segment for its figure) as the chart it sits
   * beside. It carries no `order`: two projects that appear in no other bar
   * have no shared band to keep a colour for.
   */
  const excludedSummary = [
    { label: "Excluded from 2028", parts: EXCLUDED_PROJECTS, total: excludedTotal },
  ]

  /**
   * Pages 30 to 35's own tables, one per category -- eight short tables of
   * the same shape, facets of one dataset rather than eight distinct topics,
   * so a route each the way the five topics above got would be a page with
   * nothing on it but one table. Tabbed in place instead, the same
   * `live`/hidden-markup mechanism `spending`'s own topics used before they
   * became routes -- right again here, since nothing here needs linking to
   * on its own the way "Council Orders" did.
   */
  const TABLES = [
    { slug: "buildings", label: "Buildings & Building Improvements" },
    { slug: "computer-equipment", label: "Computer Equipment" },
    { slug: "computer-software", label: "Computer Software" },
    { slug: "equipment", label: "Equipment" },
    { slug: "infrastructure", label: "Infrastructure" },
    { slug: "land", label: "Land & Land Improvements" },
    { slug: "planning", label: "Planning & Design" },
    { slug: "vehicles", label: "Vehicles" },
  ]

  let activeTable = $state(TABLES[0].slug)

  let tablesLive = $state(false)
  onMount(() => (tablesLive = true))

  const moveTable = (event: KeyboardEvent) => {
    const at = TABLES.findIndex((table) => table.slug === activeTable)
    if (event.key === "ArrowRight") activeTable = TABLES[(at + 1) % TABLES.length].slug
    else if (event.key === "ArrowLeft")
      activeTable = TABLES[(at - 1 + TABLES.length) % TABLES.length].slug
    else if (event.key === "Home") activeTable = TABLES[0].slug
    else if (event.key === "End") activeTable = TABLES[TABLES.length - 1].slug
    else return
    event.preventDefault()
    document.getElementById(`table-tab-${activeTable}`)?.focus()
  }
</script>

<!-- Page 28. The city's capital requests are on the spending side of the
book, but note that almost none of them are in this year's appropriation:
the page-78 table's "Capital - Pay as you go" line is empty for 2027 and
the funding decision was postponed. What capital costs this year is the
debt service on what was borrowed for it in years past. -->
<h2>Capital Planning</h2>

<!--
Page 29's table is a stacked bar per year now, not a heading and a grid of
its own: nine categories across five years read as a shape charted, not as
fifty-odd cells read one at a time. It opens the section, ahead of the
book's own prose, rather than sitting fixed above every tab the way it used
to -- a reader lands on the shape of the five years before the paragraphs
that explain them. The second bar beside it is what the first one leaves out
of 2028 -- the two projects themselves, charted rather than written out in a
note under both, so a reader comparing bar heights across years is shown the
reason 2028's is shorter than the table under it says, not just told it. The
two projects are still in that table, at their own rows.
-->
<div class="not-prose mb-6 flex flex-wrap items-end gap-10">
  <div class="h-40">
    <BudgetColumns rows={capitalRequests} order={capitalOrder} minHeight={96} />
  </div>
  <div class="h-40">
    <BudgetColumns rows={excludedSummary} minHeight={96} />
  </div>
</div>

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
instead, which keeps each category whole, and now tabbed -- eight tables run
long as a straight scroll, and a reader after one category no longer has to
pass the other seven to reach it.
-->
<div class="tables" class:live={tablesLive}>
  <div
    role="tablist"
    aria-label="Capital request tables"
    class="table-tab-bar not-prose mb-4 flex flex-wrap gap-x-4 gap-y-1 border-b border-slate-200"
  >
    {#each TABLES as table (table.slug)}
      <button
        type="button"
        role="tab"
        id="table-tab-{table.slug}"
        aria-controls="table-panel-{table.slug}"
        aria-selected={activeTable === table.slug}
        tabindex={activeTable === table.slug ? 0 : -1}
        class="-mb-px border-b-2 px-1 py-2 text-sm font-medium {activeTable === table.slug
          ? 'border-slate-900 text-slate-900'
          : 'border-transparent text-slate-500 hover:text-slate-700'}"
        onclick={() => (activeTable = table.slug)}
        onkeydown={moveTable}
      >
        {table.label}
      </button>
    {/each}
  </div>

  <div
    id="table-panel-buildings"
    role="tabpanel"
    aria-labelledby="table-tab-buildings"
    class="table-tab-panel"
    class:active={activeTable === "buildings"}
  >
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
          ><th scope="row">Animal Shelter - Police</th><td></td><td>$1,725,000</td><td></td><td
          ></td><td></td></tr
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
          ><th scope="row">Bradford Elementary Roof</th><td></td><td></td><td>$300,000</td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">City Hall Auditorium Air Conditioning</th><td></td><td></td><td></td><td
            >$750,000</td
          ><td></td></tr
        >
        <tr
          ><th scope="row">City Hall Auditorium Balcony Railings</th><td></td><td></td><td
            >$275,000</td
          ><td></td><td></td></tr
        >
        <tr
          ><th scope="row">City Hall Elevator Rehabilitation</th><td>$130,000</td><td></td><td
          ></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">City Hall Heating Circulation &amp; Controls</th><td></td><td
            >$770,000</td
          ><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">City Hall Repairs &amp; Maintenance</th><td></td><td>$75,000</td><td
          ></td><td>$80,000</td><td></td></tr
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
          ><th scope="row">Fire Alarm - High School</th><td>$800,000</td><td></td><td></td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Fire Station</th><td></td><td>$30,000,000</td><td></td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row">Generators &amp; Transfer Panels - School</th><td>$80,000</td><td
            >$80,000</td
          ><td>$80,000</td><td>$80,000</td><td>$80,000</td></tr
        >
        <tr
          ><th scope="row">Golden Hill Roof - School</th><td>$750,000</td><td></td><td></td><td
          ></td><td></td></tr
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
          ><th scope="row">Oil Tank Removals - School</th><td></td><td>$100,000</td><td>$100,000</td
          ><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Park Barn Asbestos Removal and Floor and Stair Replacement - Highway</th
          ><td>$50,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Park Barn Rehabilitation - Highway</th><td>$15,000</td><td>$40,000</td
          ><td>$15,000</td><td>$15,000</td><td>$15,000</td></tr
        >
        <tr
          ><th scope="row">Parking Lot Repairs - School</th><td></td><td>$100,000</td><td
            >$100,000</td
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
          ><th scope="row">School Ceiling Refurbishments</th><td></td><td>$100,000</td><td
            >$100,000</td
          ><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Silver Hill Roof - School</th><td>$815,656</td><td></td><td></td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Stadium Restrooms</th><td></td><td>$200,000</td><td></td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row">Winnekenni Castle Repairs &amp; Restorations - CONSTRUCTION</th><td
          ></td><td></td><td></td><td>$5,000,000</td><td></td></tr
        >
        <tr
          ><th scope="row">Buildings &amp; Building Improvements Total</th><td>$3,560,656</td><td
            >$125,002,000</td
          ><td>$1,270,000</td><td>$6,045,000</td><td>$3,995,000</td></tr
        >
      </tbody>
    </table>
  </div>

  <div
    id="table-panel-computer-equipment"
    role="tabpanel"
    aria-labelledby="table-tab-computer-equipment"
    class="table-tab-panel"
    class:active={activeTable === "computer-equipment"}
  >
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
          ><th scope="row">Server Room Upgrade - IT</th><td></td><td></td><td>$43,240</td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Computer Equipment Total</th><td>$70,000</td><td>$133,870</td><td
            >$184,124</td
          ><td></td><td>$160,972</td></tr
        >
      </tbody>
    </table>
  </div>

  <div
    id="table-panel-computer-software"
    role="tabpanel"
    aria-labelledby="table-tab-computer-software"
    class="table-tab-panel"
    class:active={activeTable === "computer-software"}
  >
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
          ><th scope="row">CMMS Computerized Maintenance Management System - Highway</th><td
            >$50,000</td
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
          ><th scope="row">Computer Software Total</th><td>$545,146</td><td></td><td>$308,994</td
          ><td></td><td></td></tr
        >
      </tbody>
    </table>
  </div>

  <div
    id="table-panel-equipment"
    role="tabpanel"
    aria-labelledby="table-tab-equipment"
    class="table-tab-panel"
    class:active={activeTable === "equipment"}
  >
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
          ><th scope="row">Crane CDL Grapple Truck - Highway</th><td></td><td></td><td></td><td
          ></td><td>$365,000</td></tr
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
          ><th scope="row">iPad &amp; Phones - Inspectional Services</th><td></td><td>$30,000</td
          ><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Mini Excavator - Highway</th><td></td><td>$130,000</td><td></td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Parking Kiosks - Highway</th><td></td><td></td><td>$500,000</td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Radios - Fire</th><td>$2,384,135</td><td></td><td></td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row">Rubber Tired Excavator - Highway</th><td></td><td></td><td></td><td
            >$220,000</td
          ><td></td></tr
        >
        <tr
          ><th scope="row">SCBA - Fire</th><td>$1,290,863</td><td></td><td></td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row">Skid Steer - Highway</th><td>$120,000</td><td></td><td></td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row">Street Sweeper - Highway</th><td></td><td></td><td>$300,000</td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Trackless Tractor - Highway</th><td></td><td>$225,000</td><td
            >$225,000</td
          ><td>$225,000</td><td></td></tr
        >
        <tr
          ><th scope="row">Tractor - Highway</th><td></td><td></td><td>$60,000</td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row">Zero Turn Mower - Highway</th><td></td><td>$30,000</td><td></td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Equipment Total</th><td>$3,904,998</td><td>$780,713</td><td
            >$1,630,000</td
          ><td>$445,000</td><td>$365,000</td></tr
        >
      </tbody>
    </table>
  </div>

  <div
    id="table-panel-infrastructure"
    role="tabpanel"
    aria-labelledby="table-tab-infrastructure"
    class="table-tab-panel"
    class:active={activeTable === "infrastructure"}
  >
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
          ><th scope="row">Forest Street Bridge Replacement - Engineering</th><td></td><td
            >$287,500</td
          ><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Intersection Improvements- Kingsbury/Chadwick/Willow - Highway</th><td
          ></td><td>$600,000</td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Kenoza Ave Improvements - Highway</th><td>$200,000</td><td></td><td
          ></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Kingsbury Ave/Chadwick/Willow Intersection Improvements - Engineering</th
          ><td></td><td>$600,000</td><td></td><td></td><td></td></tr
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
          ><th scope="row">Sidewalks - Annual Repair &amp; Replace - Highway</th><td>$1,100,000</td
          ><td>$1,100,000</td><td>$1,100,000</td><td>$1,100,000</td><td>$1,100,000</td></tr
        >
        <tr
          ><th scope="row"
            >Stormwater Assessment at DPW Facility and adjacent property on Downing</th
          ><td>$17,500</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Street Lights - Highway</th><td>$55,000</td><td></td><td></td><td
          ></td><td></td></tr
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
  </div>

  <div
    id="table-panel-land"
    role="tabpanel"
    aria-labelledby="table-tab-land"
    class="table-tab-panel"
    class:active={activeTable === "land"}
  >
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
          ><th scope="row">Railroad Square Garage Brownfields Closure - Community Development</th
          ><td></td><td>$55,000</td><td></td><td></td><td></td></tr
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
          ><th scope="row">Land &amp; Land Improvements Total</th><td>$66,320</td><td>$130,000</td
          ><td>$200,000</td><td>$75,000</td><td>$225,000</td></tr
        >
      </tbody>
    </table>
  </div>

  <div
    id="table-panel-planning"
    role="tabpanel"
    aria-labelledby="table-tab-planning"
    class="table-tab-panel"
    class:active={activeTable === "planning"}
  >
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
          ><th scope="row">Winnekenni Castle Repairs &amp; Restorations - PLANNING &amp; DESIGN</th
          ><td></td><td></td><td>$500,000</td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Planning &amp; Design Total</th><td></td><td></td><td>$575,000</td><td
          ></td><td></td></tr
        >
      </tbody>
    </table>
  </div>

  <div
    id="table-panel-vehicles"
    role="tabpanel"
    aria-labelledby="table-tab-vehicles"
    class="table-tab-panel"
    class:active={activeTable === "vehicles"}
  >
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
          ><th scope="row">10-Wheeler Plow Truck - Highway</th><td></td><td>$250,000</td><td
          ></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">1-Ton Truck - Highway</th><td>$105,000</td><td>$105,000</td><td
            >$105,000</td
          ><td>$105,000</td><td>$105,000</td></tr
        >
        <tr
          ><th scope="row">2500 Pick-up Truck with Plow - Highway</th><td>$90,000</td><td
            >$90,000</td
          ><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Chevrolet Tahoe C-2 - Fire</th><td></td><td>$80,000</td><td></td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Chevrolet Traverse C-4 - Fire</th><td></td><td>$35,000</td><td></td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Ford Escape - Inspectional Services</th><td></td><td>$45,000</td><td
          ></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Ford F550 Bucket FA-2 - Fire</th><td></td><td></td><td></td><td
            >$120,000</td
          ><td></td></tr
        >
        <tr
          ><th scope="row">Incident Command Vehicle - Police</th><td></td><td>$250,000</td><td
          ></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Maintenance Vehicle - Recreation</th><td></td><td>$55,000</td><td
          ></td><td></td><td></td></tr
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
          ><th scope="row">Pierce Pumper - Fire</th><td></td><td>$1,000,000</td><td></td><td
          ></td><td></td></tr
        >
        <tr
          ><th scope="row">Tanker - Fire</th><td></td><td>$632,570</td><td></td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row">Trash Truck - Highway</th><td>$180,000</td><td></td><td></td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row">Vehicles Total</th><td>$375,000</td><td>$2,849,570</td><td>$2,355,000</td
          ><td>$475,000</td><td>$355,000</td></tr
        >
        <tr
          ><th scope="row">Grand Total</th><td>$17,219,620</td><td>$132,307,653</td><td
            >$8,436,160</td
          ><td>$8,911,232</td><td>$7,029,287</td></tr
        >
      </tbody>
    </table>
  </div>
</div>

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

<style>
  /*
    Hidden markup rather than markup that is not there, the same mechanism
    `spending`'s own topics used before they became routes: `tablesLive`,
    `false` until this component mounts, is what a CSS rule for hiding seven
    of eight panels is keyed on -- before that, every table sits in the flow
    and the tab bar itself stays `display: none`, so a reader who does not
    hydrate gets all eight tables stacked, exactly as this page rendered
    before tabs.
  */
  .table-tab-bar {
    display: none;
  }

  .tables.live .table-tab-bar {
    display: flex;
  }

  .tables.live .table-tab-panel {
    display: none;
  }

  .tables.live .table-tab-panel.active {
    display: block;
  }
</style>

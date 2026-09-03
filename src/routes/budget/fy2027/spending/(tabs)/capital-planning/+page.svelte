<script lang="ts">
  import { onMount } from "svelte"
  import BudgetColumns from "$lib/BudgetColumns.svelte"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import { CAPITAL_REQUESTS } from "../../tables"
  import { amount, cell } from "$lib/budget-table"
  import { Router } from "$lib/router"

  let { data } = $props()

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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "city-hall-elevator-rehabilitation")}
              >City Hall Elevator Rehabilitation</a
            ></th
          ><td>$130,000</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "elevator-repair-high-school")}
              >Elevator Repair - High School</a
            ></th
          ><td>$200,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "elevator-repair-pentucket-lake-silver-hill-golden-hill",
              )}>Elevator Repair: Pentucket Lake, Silver Hill, Golden Hill</a
            ></th
          ><td>$525,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "fire-alarm-high-school")}
              >Fire Alarm - High School</a
            ></th
          ><td>$800,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Fire Station</th><td></td><td>$30,000,000</td><td></td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "generators-transfer-panels-school")}
              >Generators &amp; Transfer Panels - School</a
            ></th
          ><td>$80,000</td><td>$80,000</td><td>$80,000</td><td>$80,000</td><td>$80,000</td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "golden-hill-roof-school")}
              >Golden Hill Roof - School</a
            ></th
          ><td>$750,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "heating-system-highway-garage")}
              >Heating System Highway Garage</a
            ></th
          ><td>$130,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "highway-administration-roof-replacement",
              )}>Highway Administration Roof Replacement</a
            ></th
          ><td>$50,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "highway-garage-roof-repairs")}
              >Highway Garage Roof Repairs</a
            ></th
          ><td>$15,000</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "park-barn-asbestos-removal-and-floor-and-stair-replacement-highway",
              )}>Park Barn Asbestos Removal and Floor and Stair Replacement - Highway</a
            ></th
          ><td>$50,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "park-barn-rehabilitation-highway")}
              >Park Barn Rehabilitation - Highway</a
            ></th
          ><td>$15,000</td><td>$40,000</td><td>$15,000</td><td>$15,000</td><td>$15,000</td></tr
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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "silver-hill-roof-school")}
              >Silver Hill Roof - School</a
            ></th
          ><td>$815,656</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(data.book.id, "fire-station-internet-resilience-it")}
              >Fire Station Internet Resilience- IT</a
            ></th
          ><td>$45,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Firewall Upgrade - IT</th><td></td><td></td><td>$57,940</td><td></td><td
          ></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "legacy-wiring-clean-up-it")}
              >Legacy Wiring Clean Up - IT</a
            ></th
          ><td>$25,000</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "archival-inventory-and-digitization-city-clerk",
              )}>Archival Inventory and Digitization - City Clerk</a
            ></th
          ><td>$160,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "cmms-computerized-maintenance-management-system-highway",
              )}>CMMS Computerized Maintenance Management System - Highway</a
            ></th
          ><td>$50,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Dispatch &amp; Records Software Update - Police</th><td></td><td></td><td
            >$308,994</td
          ><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "tax-collection-software-treasurer")}
              >Tax Collection Software - Treasurer</a
            ></th
          ><td>$335,146</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "batwing-attachment-highway")}
              >Batwing Attachment - Highway</a
            ></th
          ><td>$50,000</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "gasboy-vehicle-fuel-system-highway")}
              >Gasboy Vehicle Fuel System - Highway</a
            ></th
          ><td>$60,000</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "radios-fire")}>Radios - Fire</a></th
          ><td>$2,384,135</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Rubber Tired Excavator - Highway</th><td></td><td></td><td></td><td
            >$220,000</td
          ><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "scba-fire")}>SCBA - Fire</a></th
          ><td>$1,290,863</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "skid-steer-highway")}
              >Skid Steer - Highway</a
            ></th
          ><td>$120,000</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "brandy-brow-east-meadow-river-culvert-highway",
              )}>Brandy Brow East Meadow River Culvert - Highway</a
            ></th
          ><td>$65,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "bridge-cip-update-highway")}
              >Bridge CIP Update - Highway</a
            ></th
          ><td>$50,000</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "kenoza-ave-improvements-highway")}
              >Kenoza Ave Improvements - Highway</a
            ></th
          ><td>$200,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row">Kingsbury Ave/Chadwick/Willow Intersection Improvements - Engineering</th
          ><td></td><td>$600,000</td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "little-river-dam-removal-highway")}
              >Little River Dam Removal - Highway</a
            ></th
          ><td>$4,500,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(data.book.id, "miscellaneous-traffic-safety-highway")}
              >Miscellaneous Traffic Safety - Highway</a
            ></th
          ><td>$50,000</td><td></td><td>$50,000</td><td></td><td>$50,000</td></tr
        >
        <tr
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "parking-lot-paving-at-citizens-center",
              )}>Parking Lot Paving at Citizens Center</a
            ></th
          ><td>$60,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "parking-lot-repairs-stadium")}
              >Parking Lot Repairs - Stadium</a
            ></th
          ><td>$100,000</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "sidewalks-annual-repair-replace-highway",
              )}>Sidewalks - Annual Repair &amp; Replace - Highway</a
            ></th
          ><td>$1,100,000</td><td>$1,100,000</td><td>$1,100,000</td><td>$1,100,000</td><td
            >$1,100,000</td
          ></tr
        >
        <tr
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "stormwater-assessment-at-dpw-facility-and-adjacent-property-on-downing",
              )}>Stormwater Assessment at DPW Facility and adjacent property on Downing</a
            ></th
          ><td>$17,500</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "street-lights-highway")}
              >Street Lights - Highway</a
            ></th
          ><td>$55,000</td><td></td><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "supplemental-paving-highway")}
              >Supplemental Paving - Highway</a
            ></th
          ><td>$700,000</td><td>$700,000</td><td>$700,000</td><td>$700,000</td><td>$700,000</td></tr
        >
        <tr
          ><th scope="row">W. Lowell Ave Bridge Replacement - Design - Engineering</th><td></td><td
            >$63,000</td
          ><td></td><td></td><td></td></tr
        >
        <tr
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "washington-square-improvements-and-construction-highway",
              )}>Washington Square - Improvements and Construction - Highway</a
            ></th
          ><td>$1,800,000</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "cooling-corridors-street-tree-planting-highway",
              )}>Cooling Corridors Street Tree Planting - Highway</a
            ></th
          ><td>$7,500</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "shade-trees-for-parks-highway")}
              >Shade Trees for Parks - Highway</a
            ></th
          ><td>$25,000</td><td>$25,000</td><td></td><td>$25,000</td><td>$25,000</td></tr
        >
        <tr
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "whittier-birthplace-trail-hub-highway",
              )}>Whittier Birthplace Trail Hub - Highway</a
            ></th
          ><td>$33,820</td><td></td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "1-ton-truck-highway")}
              >1-Ton Truck - Highway</a
            ></th
          ><td>$105,000</td><td>$105,000</td><td>$105,000</td><td>$105,000</td><td>$105,000</td></tr
        >
        <tr
          ><th scope="row"
            ><a
              href={Router.capitalRequestItem(data.book.id, "2500-pick-up-truck-with-plow-highway")}
              >2500 Pick-up Truck with Plow - Highway</a
            ></th
          ><td>$90,000</td><td>$90,000</td><td></td><td></td><td></td></tr
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
          ><th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "trash-truck-highway")}
              >Trash Truck - Highway</a
            ></th
          ><td>$180,000</td><td></td><td></td><td></td><td></td></tr
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

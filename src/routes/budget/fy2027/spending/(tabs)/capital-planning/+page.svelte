<script lang="ts">
  import { onMount } from "svelte"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import { Router } from "$lib/router"

  let { data } = $props()

  /**
   * Pages 30 to 35's own tables, one per category -- seven short tables of
   * the same shape, facets of one dataset rather than seven distinct topics,
   * so a route each the way the five topics above got would be a page with
   * nothing on it but one table. Tabbed in place instead, the same
   * `live`/hidden-markup mechanism `spending`'s own topics used before they
   * became routes -- right again here, since nothing here needs linking to
   * on its own the way "Council Orders" did.
   *
   * The book gives eight of these, but "Planning & Design" carries only two
   * line items and both are 2029 requests -- nothing for 2027, not even a
   * total the book prints as $0 -- so trimmed to this year alone it is a tab
   * with nothing on it, and it is left out rather than kept empty.
   */
  const TABLES = [
    { slug: "buildings", label: "Buildings & Building Improvements" },
    { slug: "computer-equipment", label: "Computer Equipment" },
    { slug: "computer-software", label: "Computer Software" },
    { slug: "equipment", label: "Equipment" },
    { slug: "infrastructure", label: "Infrastructure" },
    { slug: "land", label: "Land & Land Improvements" },
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

<!--
Pages 30 to 35 are one table of every request by category, broken across
pages wherever it runs out of room -- so the page titles ("Building
Improvements", "Building Improvements Continued & Computer Equipment", and so
on) name whatever happens to start or finish on that page rather than a
section. The category headings the table itself carries are used here
instead, which keeps each category whole, and now tabbed -- seven tables run
long as a straight scroll, and a reader after one category no longer has to
pass the others to reach it.

Each table keeps only its 2027 column and the rows with a figure in it -- the
book's other four years and the rows that belong to them only, dropped along
with the rest of the site's history and forecasts, since this page is about
2027's own request. The 40 rows that survive are exactly the ones with a page
of their own under "2027 Capital Requests", linked here the same as before.
With only one column left, the year is no longer what heads it -- "2027" is
already the whole page's subject, named in the heading above and nowhere else
on this table, so the money column reads "Amount" instead, the same word the
one-column tables elsewhere on the site (`LONG_TERM_DEBT`, the reserve dials)
head theirs with.
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
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "city-hall-elevator-rehabilitation")}
              >City Hall Elevator Rehabilitation</a
            ></th
          >
          <td>$130,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "elevator-repair-high-school")}
              >Elevator Repair - High School</a
            ></th
          >
          <td>$200,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "elevator-repair-pentucket-lake-silver-hill-golden-hill",
              )}>Elevator Repair: Pentucket Lake, Silver Hill, Golden Hill</a
            ></th
          >
          <td>$525,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "fire-alarm-high-school")}
              >Fire Alarm - High School</a
            ></th
          >
          <td>$800,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "generators-transfer-panels-school")}
              >Generators &amp; Transfer Panels - School</a
            ></th
          >
          <td>$80,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "golden-hill-roof-school")}
              >Golden Hill Roof - School</a
            ></th
          >
          <td>$750,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "heating-system-highway-garage")}
              >Heating System Highway Garage</a
            ></th
          >
          <td>$130,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "highway-administration-roof-replacement",
              )}>Highway Administration Roof Replacement</a
            ></th
          >
          <td>$50,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "highway-garage-roof-repairs")}
              >Highway Garage Roof Repairs</a
            ></th
          >
          <td>$15,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "park-barn-asbestos-removal-and-floor-and-stair-replacement-highway",
              )}>Park Barn Asbestos Removal and Floor and Stair Replacement - Highway</a
            ></th
          >
          <td>$50,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "park-barn-rehabilitation-highway")}
              >Park Barn Rehabilitation - Highway</a
            ></th
          >
          <td>$15,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "silver-hill-roof-school")}
              >Silver Hill Roof - School</a
            ></th
          >
          <td>$815,656</td>
        </tr>
        <tr>
          <th scope="row">Buildings &amp; Building Improvements Total</th>
          <td>$3,560,656</td>
        </tr>
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
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(data.book.id, "fire-station-internet-resilience-it")}
              >Fire Station Internet Resilience- IT</a
            ></th
          >
          <td>$45,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "legacy-wiring-clean-up-it")}
              >Legacy Wiring Clean Up - IT</a
            ></th
          >
          <td>$25,000</td>
        </tr>
        <tr>
          <th scope="row">Computer Equipment Total</th>
          <td>$70,000</td>
        </tr>
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

    <table>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "archival-inventory-and-digitization-city-clerk",
              )}>Archival Inventory and Digitization - City Clerk</a
            ></th
          >
          <td>$160,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "cmms-computerized-maintenance-management-system-highway",
              )}>CMMS Computerized Maintenance Management System - Highway</a
            ></th
          >
          <td>$50,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "tax-collection-software-treasurer")}
              >Tax Collection Software - Treasurer</a
            ></th
          >
          <td>$335,146</td>
        </tr>
        <tr>
          <th scope="row">Computer Software Total</th>
          <td>$545,146</td>
        </tr>
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
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "batwing-attachment-highway")}
              >Batwing Attachment - Highway</a
            ></th
          >
          <td>$50,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "gasboy-vehicle-fuel-system-highway")}
              >Gasboy Vehicle Fuel System - Highway</a
            ></th
          >
          <td>$60,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "radios-fire")}>Radios - Fire</a></th
          >
          <td>$2,384,135</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "scba-fire")}>SCBA - Fire</a></th
          >
          <td>$1,290,863</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "skid-steer-highway")}
              >Skid Steer - Highway</a
            ></th
          >
          <td>$120,000</td>
        </tr>
        <tr>
          <th scope="row">Equipment Total</th>
          <td>$3,904,998</td>
        </tr>
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
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "brandy-brow-east-meadow-river-culvert-highway",
              )}>Brandy Brow East Meadow River Culvert - Highway</a
            ></th
          >
          <td>$65,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "bridge-cip-update-highway")}
              >Bridge CIP Update - Highway</a
            ></th
          >
          <td>$50,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "kenoza-ave-improvements-highway")}
              >Kenoza Ave Improvements - Highway</a
            ></th
          >
          <td>$200,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "little-river-dam-removal-highway")}
              >Little River Dam Removal - Highway</a
            ></th
          >
          <td>$4,500,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(data.book.id, "miscellaneous-traffic-safety-highway")}
              >Miscellaneous Traffic Safety - Highway</a
            ></th
          >
          <td>$50,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "parking-lot-paving-at-citizens-center",
              )}>Parking Lot Paving at Citizens Center</a
            ></th
          >
          <td>$60,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "parking-lot-repairs-stadium")}
              >Parking Lot Repairs - Stadium</a
            ></th
          >
          <td>$100,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "sidewalks-annual-repair-replace-highway",
              )}>Sidewalks - Annual Repair &amp; Replace - Highway</a
            ></th
          >
          <td>$1,100,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "stormwater-assessment-at-dpw-facility-and-adjacent-property-on-downing",
              )}>Stormwater Assessment at DPW Facility and adjacent property on Downing</a
            ></th
          >
          <td>$17,500</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "street-lights-highway")}
              >Street Lights - Highway</a
            ></th
          >
          <td>$55,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "supplemental-paving-highway")}
              >Supplemental Paving - Highway</a
            ></th
          >
          <td>$700,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "washington-square-improvements-and-construction-highway",
              )}>Washington Square - Improvements and Construction - Highway</a
            ></th
          >
          <td>$1,800,000</td>
        </tr>
        <tr>
          <th scope="row">Infrastructure Total</th>
          <td>$8,697,500</td>
        </tr>
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
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "cooling-corridors-street-tree-planting-highway",
              )}>Cooling Corridors Street Tree Planting - Highway</a
            ></th
          >
          <td>$7,500</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "shade-trees-for-parks-highway")}
              >Shade Trees for Parks - Highway</a
            ></th
          >
          <td>$25,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(
                data.book.id,
                "whittier-birthplace-trail-hub-highway",
              )}>Whittier Birthplace Trail Hub - Highway</a
            ></th
          >
          <td>$33,820</td>
        </tr>
        <tr>
          <th scope="row">Land &amp; Land Improvements Total</th>
          <td>$66,320</td>
        </tr>
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
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "1-ton-truck-highway")}
              >1-Ton Truck - Highway</a
            ></th
          >
          <td>$105,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a
              href={Router.capitalRequestItem(data.book.id, "2500-pick-up-truck-with-plow-highway")}
              >2500 Pick-up Truck with Plow - Highway</a
            ></th
          >
          <td>$90,000</td>
        </tr>
        <tr>
          <th scope="row"
            ><a href={Router.capitalRequestItem(data.book.id, "trash-truck-highway")}
              >Trash Truck - Highway</a
            ></th
          >
          <td>$180,000</td>
        </tr>
        <tr>
          <th scope="row">Vehicles Total</th>
          <td>$375,000</td>
        </tr>
        <tr>
          <th scope="row">Grand Total</th>
          <td>$17,219,620</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<style>
  /*
    Hidden markup rather than markup that is not there, the same mechanism
    `spending`'s own topics used before they became routes: `tablesLive`,
    `false` until this component mounts, is what a CSS rule for hiding six
    of seven panels is keyed on -- before that, every table sits in the flow
    and the tab bar itself stays `display: none`, so a reader who does not
    hydrate gets all seven tables stacked, exactly as this page rendered
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

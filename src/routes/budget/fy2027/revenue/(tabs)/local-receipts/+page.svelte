<script lang="ts">
  import { onMount } from "svelte"
  import BudgetTable from "$lib/BudgetTable.svelte"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import {
    DEPARTMENT_REVENUE,
    EXCISE,
    FEES,
    FINES_INVESTMENTS,
    LICENSE_PERMITS,
    OTHER_AVAILABLE,
    OTHER_LOCAL_RECEIPTS,
  } from "../../tables"

  /**
   * Seven short tables of the same shape -- one local-receipts category
   * each, facets of one dataset rather than seven distinct topics -- tabbed
   * in place, the same `live`/hidden-markup mechanism `spending`'s own
   * Capital Planning tab uses for its own seven category tables. A route
   * each would be a page with a paragraph or two and one table on it; a
   * plain scroll makes a reader after Fines & Investments pass five other
   * categories to reach it.
   */
  const TABLES = [
    { slug: "excise", label: "Local Excise Taxes" },
    { slug: "other-local-receipts", label: "Other Local Receipts" },
    { slug: "fees", label: "Fees" },
    { slug: "department-revenue", label: "Department Revenue" },
    { slug: "license-permits", label: "License & Permits" },
    { slug: "fines-investments", label: "Fines & Investments" },
    { slug: "other-available", label: "Other Available Revenue" },
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

<h2>Local Revenue Receipts</h2>

<p>
  Local revenue receipts are funds generated at the local level, aside from property taxes. Some of
  the most common types of local receipts include excise taxes, regulatory fees (such as fines,
  licenses, and permits), user fees (for services such as water, sewer, and garbage), departmental
  <GlossaryTerm term="Revenues">revenues</GlossaryTerm>, and investment income. Typically, local
  receipts are deposited into the community's
  <GlossaryTerm term="General Fund">general fund</GlossaryTerm> unless they are designated for specific
  departmental uses in accordance with state regulations.
</p>

<p>
  Certain local receipts are mandated by law (for example, motor vehicle excise taxes, hunting
  licenses, and firearms permits), while others can be negotiated (such as investment income and
  payments in lieu of taxes). Additionally, some revenue sources are established through the
  adoption of local ordinances or bylaws. With user fees, a community can set charges that either
  partially or fully <GlossaryTerm term="Fund">fund</GlossaryTerm> a particular service, and periodically
  reassess them to ensure an adequate revenue stream to support those services.
</p>

<div class="tables" class:live={tablesLive}>
  <div
    role="tablist"
    aria-label="Local receipts tables"
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
    id="table-panel-excise"
    role="tabpanel"
    aria-labelledby="table-tab-excise"
    class="table-tab-panel"
    class:active={activeTable === "excise"}
  >
    <h2>Local Excise Taxes</h2>

    <p>
      Motor vehicle excise tax represents the city's largest single source of local revenue. Up
      until February 2026, this category experienced a substantial year-over-year decline of over
      22%. However, in March, there was a notable recovery as the majority of the city's motor
      vehicle excise tax was collected. Initially, revenue estimates suggested that this category
      would remain flat in 2027; however, following the results from March's collections, we felt
      confident enough to increase this estimate by 6.5%.
    </p>

    <p>In addition to motor vehicle excise, the city has also implemented:</p>

    <ul>
      <li>A 3% cannabis excise tax</li>
      <li>A 0.75% meals tax</li>
      <li>A 6% room tax</li>
    </ul>

    <p>
      Furthermore, per state regulations, there is a 1% boat excise tax, of which 50% of the annual
      revenue is allocated to the Waterways <GlossaryTerm term="Revolving Fund"
        >Revolving Fund</GlossaryTerm
      >. This fund can be utilized for harbor and waterway maintenance, infrastructure improvements,
      and enhancing boating safety.
    </p>

    <BudgetTable table={EXCISE} />
  </div>

  <div
    id="table-panel-other-local-receipts"
    role="tabpanel"
    aria-labelledby="table-tab-other-local-receipts"
    class="table-tab-panel"
    class:active={activeTable === "other-local-receipts"}
  >
    <h2>Other Local Receipts</h2>

    <p>
      A Payment in Lieu of Taxes (PILOT) is a contribution made by tax-exempt organizations or
      government entities to local governments to compensate for the loss of property tax revenue.
      These payments are generally voluntary or based on negotiated agreements, designed to help
      municipalities <GlossaryTerm term="Fund">fund</GlossaryTerm> essential public services, including
      fire safety and infrastructure.
    </p>

    <h3>Waste Disposal Fee as a PILOT Agreement</h3>

    <p>
      One example of a PILOT agreement is the Waste Disposal Fee that the city has with Covanta.
      Currently, the city receives a rate of $4.69 per ton of trash processed at the waste disposal
      facility. With an average monthly tonnage of 53,000, this results in approximately $250,000 in
      monthly revenue for the city.
    </p>

    <p>Additional PILOT Agreements</p>

    <ul>
      <li>Bradford Solar</li>
      <li>NRG DG Haverhill</li>
      <li>Nautilus Solar</li>
      <li>Fondi Road Solar</li>
      <li>BWC Camp Brook</li>
      <li>Kearsarge Haverhill</li>
    </ul>

    <BudgetTable table={OTHER_LOCAL_RECEIPTS} />
  </div>

  <div
    id="table-panel-fees"
    role="tabpanel"
    aria-labelledby="table-tab-fees"
    class="table-tab-panel"
    class:active={activeTable === "fees"}
  >
    <h2>Fees</h2>

    <p>
      User fees are charges designed to partially or fully finance specific services and can be
      periodically evaluated to maintain a sufficient revenue stream for that service. A fee
      represents the cost levied on individuals who utilize or gain benefits from the service. Such
      fees may be implemented when a local government delivers a particular service (like a police
      detail), grants a permit or license, or provides a benefit, such as a recreational program.
    </p>

    <BudgetTable table={FEES} />
  </div>

  <div
    id="table-panel-department-revenue"
    role="tabpanel"
    aria-labelledby="table-tab-department-revenue"
    class="table-tab-panel"
    class:active={activeTable === "department-revenue"}
  >
    <h2>Department Revenue</h2>

    <p>
      <GlossaryTerm term="Department">Department</GlossaryTerm> revenue consists of funds received by
      local departments&mdash;such as police, public works, and town clerk&mdash;that do not come from
      property taxes, local aid, or specific state grants.
    </p>

    <p>
      This year, the estimate for cable fees has been lowered for the segment of the franchise fee
      allocated to capital. This reduction will be deposited to the newly established Cable Public
      Access revolving <GlossaryTerm term="Fund">fund</GlossaryTerm>, which was adopted by the City
      Council in 2026.
    </p>

    <p>
      Medicaid reimbursement (also known as School-Based Medicaid Programs or School-Based Services
      (SBS) claiming) allows local governments to receive federal funds to offset costs for
      providing health-related services&mdash;such as nursing, therapy, and mental health
      care&mdash;to Medicaid-eligible students.
    </p>

    <BudgetTable table={DEPARTMENT_REVENUE} />
  </div>

  <div
    id="table-panel-license-permits"
    role="tabpanel"
    aria-labelledby="table-tab-license-permits"
    class="table-tab-panel"
    class:active={activeTable === "license-permits"}
  >
    <h2>License &amp; Permits</h2>

    <p>
      Licenses and permits serve as local receipts, reflecting fees imposed for the privilege of
      engaging in specific activities, such as construction, health services, and alcohol sales.
    </p>

    <p>
      The city has experienced a significant year-over-year decline in licenses and permits, with a
      drop of over 27% as of March 2026, primarily due to a reduction in building permits. This
      decline is attributed to several large projects that were permitted in previous fiscal years.
      While the city remains active in issuing permits, the revenue decrease is largely a result of
      the scale of these ongoing projects.
    </p>

    <BudgetTable table={LICENSE_PERMITS} />
  </div>

  <div
    id="table-panel-fines-investments"
    role="tabpanel"
    aria-labelledby="table-tab-fines-investments"
    class="table-tab-panel"
    class:active={activeTable === "fines-investments"}
  >
    <h2>Fines &amp; Investments</h2>

    <p>
      Parking meter revenue estimates have been increased due to an uptick in collections between
      March 2025 and 2026.
    </p>

    <p>
      Investment income has been reduced as ARPA and borrowing proceeds will no longer be available
      for investment in 2027.
    </p>

    <BudgetTable table={FINES_INVESTMENTS} />
  </div>

  <div
    id="table-panel-other-available"
    role="tabpanel"
    aria-labelledby="table-tab-other-available"
    class="table-tab-panel"
    class:active={activeTable === "other-available"}
  >
    <h2>Other Available Revenue</h2>

    <p>
      This revenue group comprises <GlossaryTerm term="Free Cash">free cash</GlossaryTerm> used to support
      the <GlossaryTerm term="Operating Budget">operating budget</GlossaryTerm>, indirect receipts
      from <GlossaryTerm term="Enterprise Funds">Enterprise funds</GlossaryTerm> for administrative overhead
      reimbursement, and funding from the Hospital Trust fund, which subsidizes the Public Health department.
    </p>

    <p>
      Since 2025, the city has made a concerted effort to reduce the annual allocation from <GlossaryTerm
        term="Free Cash">free cash</GlossaryTerm
      >, aligning with the current administration's goal. By decreasing reliance on <GlossaryTerm
        term="Free Cash">free cash</GlossaryTerm
      > (one-time funds) for recurring expenses, this strategy aims to foster a structurally sustainable
      <GlossaryTerm term="Operating Budget">operating budget</GlossaryTerm>.
    </p>

    <p>
      In Massachusetts, <GlossaryTerm term="Free Cash">Free Cash</GlossaryTerm> is a certified, unrestricted
      revenue source that represents unspent funds from the previous <GlossaryTerm
        term="Fiscal Year">fiscal year</GlossaryTerm
      >'s operations. It is calculated by the Department of Revenue's (DOR) Division of Local
      Services and is generated when actual <GlossaryTerm term="Revenues">revenues</GlossaryTerm> exceed
      budget estimates, and <GlossaryTerm term="Expenditures">expenditures</GlossaryTerm> are lower than
      appropriations.
    </p>

    <BudgetTable table={OTHER_AVAILABLE} />
  </div>
</div>

<style>
  /*
    Hidden markup rather than markup that is not there, the same mechanism
    Capital Planning's own seven tables use: `tablesLive`, `false` until this
    component mounts, is what a CSS rule for hiding six of seven panels is
    keyed on -- before that, every panel sits in the flow and the tab bar
    itself stays `display: none`, so a reader who does not hydrate gets all
    seven sections stacked, exactly as this page rendered before tabs.
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

  /*
    Each panel's own heading repeats its tab's label exactly -- "Fees" over
    "Fees", "License & Permits" over "License & Permits" -- which said
    nothing new once the tab bar was there to say it, the visible tab
    already `aria-selected` and the panel already `aria-labelledby` it. Kept
    in the markup rather than dropped outright, since it is not redundant
    at all in the un-hydrated view this same markup renders: no tab bar
    shows there, so the heading is what tells a reader stacked past six
    other categories which one they are reading. `display: none` rather
    than deleting the element removes it from the accessibility tree too,
    so a screen reader on the live page is not told "Fees" twice, by the
    tab and then again by a heading a beat later.
  */
  .tables.live .table-tab-panel > h2 {
    display: none;
  }
</style>

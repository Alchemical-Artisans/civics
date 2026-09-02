<script lang="ts">
  // A script here because these three tables are charted on the book's front
  // page as well; see docs/budget-pages.md. Nothing on the page is generated --
  // `BudgetTable` prints the cells exactly as `tables.ts` holds them, which is
  // exactly as the book sets them.
  import BudgetTable from "$lib/BudgetTable.svelte"
  import BookElsewhere from "$lib/BookElsewhere.svelte"
  import { FUND_BALANCE, FREE_CASH, STABILIZATION } from "./tables"

  let { data } = $props()
</script>

<!-- Page 17. The page is "Reserves", which is the bucket; this is the section
     of the book in it. -->
<h2>Fiscal Reserves</h2>

<p>
  <em>
    The city will monitor reserves to ensure they are adequate and sustainable for future fiscal
    years, while meeting or exceeding the city's financial policy benchmarks, Department of Revenue
    recommendations, bond rating agency standards, and aligning with GFOA best practices.
  </em>
</p>

<p>
  <strong>City Reserve Policy #1:</strong> The City shall maintain an undesignated fund balance between
  5% and 15% of general fund revenues, less debt exclusion and Ch. 70.
</p>

<p>
  <strong>Results:</strong> The city's undesignated fund balance as of June 30, 2025, was $13,985,452
  or 7.85% of general fund revenue. This is up from June 2024, which was $12,569,995 or 7.36%.
</p>

<BudgetTable table={FUND_BALANCE} />

<h2>Fund Balance</h2>

<p>
  Fund balance is the net position of a governmental fund (assets minus liabilities), representing
  the accumulated difference between revenues and expenditures over time. It measures available
  financial resources, acting as a "net worth" or savings account for governments to pay bills,
  maintain cash flow, and ensure financial stability.
</p>

<table>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">2023</th>
      <th scope="col">2024</th>
      <th scope="col">2025</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Beginning Fund Balance</th>
      <td>$12,429,870</td>
      <td>$10,209,394</td>
      <td>$12,569,995</td>
    </tr>
    <tr>
      <th scope="row">Net Reserve for Encumbrances</th>
      <td>$97,098</td>
      <td>$(617,924)</td>
      <td>$(3,738,924)</td>
    </tr>
    <tr>
      <th scope="row">Plus Fiscal Year Revenue</th>
      <td>$231,470,272</td>
      <td>$244,738,056</td>
      <td>$262,614,748</td>
    </tr>
    <tr>
      <th scope="row">Less Fiscal Year Expenditures</th>
      <td>$(233,787,846)</td>
      <td>$(241,759,531)</td>
      <td>$(257,460,366)</td>
    </tr>
    <tr>
      <th scope="row">Ending Fund Balance</th>
      <td>$10,209,394</td>
      <td>$12,569,995</td>
      <td>$13,985,453</td>
    </tr>
  </tbody>
</table>

<h2>Free Cash</h2>

<p>
  <strong>City Reserve Policy #3:</strong> The amount to be held in free cash shall not be less than 2%
  or more than 8% of general fund revenues, less debt exclusion and Ch. 70.
</p>

<p>
  <strong>Results:</strong> The city is projected to have a free cash balance of $0 at the end of fiscal
  year 2026, largely due to exceptionally high snow removal costs that exceeded $4.6 million during the
  past winter. This winter was the coldest and snowiest the area has experienced since 2014-2015. In light
  of these unprecedented expenses, the Mayor and the city's Emergency Management Director have requested
  financial assistance from the Commonwealth. This year's free cash balance marks a significant decrease
  from the city's balance at the end of fiscal year 2025, which was $2,578,279, reflecting a decline of
  1.51%.
</p>

<BudgetTable table={FREE_CASH} />

<h2>Stabilization Reserve</h2>

<p>
  <strong>City Reserve Policy #4:</strong> The city shall maintain a Stabilization Reserve Fund of at
  least 3% of general fund revenue, less debt exclusion and Chapter 70.
</p>

<p>
  <strong>Results:</strong> The city's stabilization fund is $8,001,094 or 4.49% of general fund revenue,
  not including Chapter 70 and debt exclusions. This is up from fiscal 2025 which had a balance of $7,533,248
  or 4.41%.
</p>

<BudgetTable table={STABILIZATION} />

<BookElsewhere items={data.elsewhere} book={data.book} />

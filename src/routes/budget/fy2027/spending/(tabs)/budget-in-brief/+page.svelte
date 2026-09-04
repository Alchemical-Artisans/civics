<script lang="ts">
  import BudgetColumns from "$lib/BudgetColumns.svelte"
  import { APPROPRIATIONS, DEPARTMENTS } from "../../tables"
  import { amount, cell, column, type BudgetTableData } from "$lib/budget-table"

  /**
   * Every category's own total across the six years charted, largest first --
   * the order both charts below stack and colour by, so a category reads as
   * one band down every bar rather than picked out of six
   * independently-sorted stacks. "Grand Total" is not a category, and is
   * read directly off its own row instead of summed, the same reason
   * `SPENDING_TOTAL` is stated rather than summed.
   */
  const order = (table: BudgetTableData, headings: string[]) => {
    const totals: Record<string, number> = {}
    for (const heading of headings) {
      for (const part of column(table, heading, { exclude: ["Grand Total"] })) {
        totals[part.label] = (totals[part.label] ?? 0) + part.amount
      }
    }
    return Object.keys(totals).sort((a, b) => totals[b] - totals[a])
  }

  /**
   * Pages 76 and 77, every department on one line, as one stacked bar per
   * year rather than a grid running to four hundred-odd cells. The book
   * gives five more columns per department than the six charted here -- two
   * average/annual percent changes, the 2027 department request kept apart
   * from what was actually recommended, and that request's and the
   * recommendation's own percent and dollar change -- dropped, since a
   * reader comparing bar heights across years already sees the change a
   * percentage would only restate, and the request is superseded by the
   * recommendation, the figure that became the appropriation. The book's
   * headings for what is otherwise the same run of years differ from
   * `APPROPRIATIONS`' own ("2025 Actual" against "2025 Budgeted", "FY26
   * Adopted Budget" against "2026 Budgeted", "2027 Recommended" against
   * "2027 Proposed") -- kept exactly as each table prints them; only the
   * chart's own labels are shortened to the bare year.
   */
  const DEPARTMENT_YEARS = [
    { heading: "2022 Actual", label: "2022" },
    { heading: "2023 Actual", label: "2023" },
    { heading: "2024 Actual", label: "2024" },
    { heading: "2025 Actual", label: "2025" },
    { heading: "FY26 Adopted Budget", label: "2026" },
    { heading: "2027 Recommended", label: "2027" },
  ]
  const departmentOrder = order(
    DEPARTMENTS,
    DEPARTMENT_YEARS.map((year) => year.heading),
  )
  const departments = DEPARTMENT_YEARS.map(({ heading, label }) => ({
    label,
    total: amount(cell(DEPARTMENTS, "Grand Total", heading))!,
    parts: column(DEPARTMENTS, heading, { exclude: ["Grand Total"] }),
  }))

  /**
   * Page 78, the same budget rolled up by function: fourteen categories
   * across the same six years, the general fund's own account of itself
   * rather than one line per department.
   */
  const APPROPRIATION_YEARS = [
    { heading: "2022 Actual", label: "2022" },
    { heading: "2023 Actual", label: "2023" },
    { heading: "2024 Actual", label: "2024" },
    { heading: "2025 Budgeted", label: "2025" },
    { heading: "2026 Budgeted", label: "2026" },
    { heading: "2027 Proposed", label: "2027" },
  ]
  const appropriationOrder = order(
    APPROPRIATIONS,
    APPROPRIATION_YEARS.map((year) => year.heading),
  )
  const appropriations = APPROPRIATION_YEARS.map(({ heading, label }) => ({
    label,
    total: amount(cell(APPROPRIATIONS, "Grand Total", heading))!,
    parts: column(APPROPRIATIONS, heading, { exclude: ["Grand Total"] }),
  }))
</script>

<!-- Pages 76 to 78, "2027 Budget in Brief": every department on one line, and
the same budget rolled up by function. The book splits the first across two
pages purely for room -- same columns, same header, alphabetical throughout
-- so the two halves are one chart here, as they were one table before it.
The revenue that balances against these is on the revenue page, where its
own chart is. -->
<h2>2027 Budget in Brief</h2>

<div class="not-prose mb-6 h-96">
  <BudgetColumns rows={departments} order={departmentOrder} minHeight={320} />
</div>

<h3>Appropriations</h3>

<div class="not-prose mb-6 h-72">
  <BudgetColumns rows={appropriations} order={appropriationOrder} minHeight={256} />
</div>

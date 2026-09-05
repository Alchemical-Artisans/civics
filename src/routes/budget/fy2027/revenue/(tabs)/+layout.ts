import type { LayoutLoad } from "./$types"

/**
 * Everything the book says about where the money comes from: "2027 Revenue
 * Estimates" (page 48), split here into the narrative that opens it, the
 * state aid behind two of its rows, the tax levy and Prop 2½, and the run of
 * local-receipts tables that back the rest; "2027 Revenue Summary" (64),
 * which rolls the same year up and is where the book's own page-65 pie sits
 * too; "10-Year Revenue Forecast" (67), which carries it out to 2036; the
 * revenue half of "2027 Budget in Brief" (78) and "2027 Estimated Tax Bill
 * Impact" (79), together since the tax bill is what the Budget in Brief
 * total comes to for one household; and "Revenue Sources", ours, the same
 * relationship to this page's own bar that "Departments" has to spending's.
 *
 * Called "Revenue" rather than either of the book's names for the reason
 * `+page.ts` gave before this split: the year is in the bar above every page
 * of this book already, and a chart headed "Revenue" leading to "2027
 * Revenue Estimates" would read as two different things.
 *
 * A `+layout.ts` rather than a `+page.ts` now, the same change `spending`
 * made first: eight topics below are their own routes, one directory each,
 * and every one of them wants this same title, width and reference list.
 */
export const load: LayoutLoad = () => ({
  section: { title: "Revenue", page: 48 },

  /**
   * Laid out as `spending`, `reserves` and `debt` are: a chart down the left
   * and the reading in the only box that scrolls. Fifty-four segments want
   * more room than a 48rem strip has to give, the same reason `spending`
   * carries this flag.
   */
  wide: true,

  /**
   * The other two buckets `BudgetColumns` draws: what the revenue in this
   * column pays for, and what is held rather than spent -- both discussed on
   * this page (the free-cash paragraphs under "2027 Revenue Projection", and
   * the general-fund reconciliation under "Budget in Brief") without being
   * this page's own subject.
   */
  references: [
    { title: "Spending", section: "spending/goals-recommendations" },
    { title: "Fiscal Reserves", section: "reserves" },
  ],
})

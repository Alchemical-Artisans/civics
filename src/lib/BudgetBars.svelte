<!--
  A ranked bar chart: one row per category, longest first.

  Why bars and not the pie the book draws. A pie asks the reader to compare
  angles, which nobody can do past the biggest two or three slices, and it caps
  out at a handful of categories -- the book's own pie collapses fourteen
  spending categories into five, and its revenue pie does not add up (see the
  page for the figures). Ranked bars carry all of them, in order, with the
  numbers beside each, and a reader gets both the ranking and the magnitudes
  without decoding anything.

  There is no tooltip, deliberately. A hover layer earns its place when it
  carries something the chart cannot show; here every value is already printed
  beside its own bar, so a tooltip would restate what is on the page -- and it
  would put a script on a page that otherwise needs none.

  One series, so one colour and no legend: the heading says what is plotted, and
  colouring fourteen categories differently would be decoration standing in for
  information. Every value is printed beside its bar, so the chart is also its
  own table -- nothing here is available only to someone who can see it.
-->
<script lang="ts">
  export interface Slice {
    /** The category, exactly as the budget book's table prints it. */
    label: string
    /** Dollars. */
    amount: number
  }

  let {
    rows,
    /**
     * The amount a full-width bar represents. Pass the same value to two charts
     * that are meant to be read against each other, or each scales to its own
     * largest row and bars of different lengths silently mean the same number.
     */
    scaleTo,
  }: { rows: Slice[]; scaleTo?: number } = $props()

  const sorted = $derived([...rows].sort((a, b) => b.amount - a.amount))
  const largest = $derived(scaleTo ?? sorted[0]?.amount ?? 0)

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  /**
   * Scaled against the largest category rather than the total, so the shape of
   * the ranking is visible. Against the total, Education would fill half the
   * track and everything below it would be a sliver.
   */
  const width = (amount: number) => (largest ? Number(((amount / largest) * 100).toFixed(2)) : 0)
</script>

<ul class="not-prose m-0 list-none space-y-0 p-0">
  {#each sorted as row (row.label)}
    <!--
      Two columns on a phone and three from `sm` up. The DOM order is label,
      value, bar, which is the phone layout -- the figure belongs beside the
      name it labels, with the bar spanning underneath. From `sm` the `order`
      utilities put the bar back between them, which is the reading order when
      there is room for one line.
    -->
    <li
      class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1 border-b border-slate-100 py-1.5 sm:grid-cols-[minmax(7rem,13rem)_minmax(0,1fr)_auto] sm:items-center"
    >
      <span class="text-sm text-slate-700 sm:order-1">{row.label}</span>

      <!-- Right-aligned so the digits line up: with `tabular-nums` that puts
           every thousands separator in the same column, which is what makes a
           list of figures scannable. -->
      <span class="text-right text-sm text-slate-600 tabular-nums sm:order-3">
        {money.format(row.amount)}
      </span>

      <!--
        Decorative: the label and the value already say everything the bar does,
        so announcing it again would only repeat them.
      -->
      <span
        class="col-span-2 h-3 rounded-r-[4px] bg-slate-100 sm:order-2 sm:col-span-1"
        aria-hidden="true"
      >
        <!--
          `max()` keeps the smallest categories visible as a mark rather than
          rounding away to nothing: Overlay is 1/589th of Education, which is
          well under one pixel on any real width. The floor is 2px, so the
          distortion is under half a percent of the track and never enough to
          reorder two bars.
        -->
        <span
          class="block h-full rounded-r-[4px] bg-sky-700"
          style="width: max(2px, {width(row.amount)}%)"
        ></span>
      </span>
    </li>
  {/each}
</ul>

<!--
  A household's own water use, against the one number the city actually
  publishes a target for: gallons per person per day (RGPCD), which the
  city's Water Management Act permit caps at 65.

  There is no published figure for what it would take for the city as a
  whole to stop drawing the reservoirs down -- no safe yield, no inflow rate,
  nothing this calculator could hold a household's number against without
  inventing it. What is real is the RGPCD target itself and the "How Much Do
  You Use?" table below, in `WATER_USE_CHART` -- so this compares a
  household to the target the city states, and leaves the rest to that
  table rather than to a formula of this site's own.

  `days` defaults to 30 because that is what a water bill states usage over,
  not because the city recommends it -- its own conservation page suggests a
  three-day meter reading instead, which is why the field is editable rather
  than fixed.
-->
<script lang="ts">
  import BudgetColumns from "./BudgetColumns.svelte"
  import BudgetTable from "./BudgetTable.svelte"
  import { RGPCD_TARGET, CONSERVATION_TIPS, WATER_USE_CHART, gallonsPerPersonPerDay } from "./water"

  // `undefined`, not `null`: that is what an empty `<input type="number">`
  // binds to.
  let gallons = $state<number | undefined>(undefined)
  let people = $state<number | undefined>(undefined)
  let days = $state<number | undefined>(30)

  const gpcd = $derived(gallonsPerPersonPerDay(gallons ?? 0, people ?? 0, days ?? 0))

  const format = (n: number) => `${Math.round(n * 10) / 10} gal`

  const columns = $derived(
    gpcd === null
      ? []
      : [
          {
            label: "Your household",
            parts: [{ label: "Gallons per person per day", amount: gpcd }],
          },
          {
            label: "City target",
            parts: [{ label: "Gallons per person per day", amount: RGPCD_TARGET }],
          },
        ],
  )

  const over = $derived(gpcd === null ? null : gpcd - RGPCD_TARGET)

  let doing = $state<boolean[]>(CONSERVATION_TIPS.map(() => false))
</script>

<div class="not-prose water-calculator">
  <div class="grid gap-4 sm:grid-cols-3">
    <label class="flex flex-col gap-1 text-sm text-slate-700">
      Gallons used
      <input
        type="number"
        min="0"
        class="rounded border border-slate-300 px-2 py-1.5 text-slate-900"
        bind:value={gallons}
      />
    </label>

    <label class="flex flex-col gap-1 text-sm text-slate-700">
      People in the household
      <input
        type="number"
        min="1"
        class="rounded border border-slate-300 px-2 py-1.5 text-slate-900"
        bind:value={people}
      />
    </label>

    <label class="flex flex-col gap-1 text-sm text-slate-700">
      Over how many days
      <input
        type="number"
        min="1"
        class="rounded border border-slate-300 px-2 py-1.5 text-slate-900"
        bind:value={days}
      />
      <span class="text-xs text-slate-500">A water bill usually covers about 30.</span>
    </label>
  </div>

  {#if gpcd !== null}
    <div class="mt-6 flex flex-wrap items-end gap-8">
      <BudgetColumns rows={columns} minHeight={180} {format} />

      <p class="m-0 max-w-sm text-sm text-slate-700">
        {#if over !== null && over > 0}
          Your household uses about <strong>{format(gpcd)}</strong> per person per day —
          {format(over)} more than the city's target of {RGPCD_TARGET} gal.
        {:else}
          Your household uses about <strong>{format(gpcd)}</strong> per person per day, at or under
          the city's target of {RGPCD_TARGET} gal.
        {/if}
      </p>
    </div>
  {/if}

  <fieldset class="mt-8 border-0 p-0">
    <legend class="text-sm font-medium text-slate-900">
      Conservation steps you're already taking
    </legend>
    <ul class="not-prose mt-2 space-y-1">
      {#each CONSERVATION_TIPS as tip, at (tip)}
        <li>
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" bind:checked={doing[at]} />
            {tip}
          </label>
        </li>
      {/each}
    </ul>
  </fieldset>

  <div class="mt-8">
    <p class="text-sm font-medium text-slate-900">How much a habit is worth</p>
    <p class="mt-1 text-sm text-slate-600">
      Figures the city publishes for common activities, with and without the change — whatever's
      still unchecked above is where a household's own gap is likely to be.
    </p>
    <div class="mt-3 overflow-x-auto">
      <BudgetTable table={WATER_USE_CHART} />
    </div>
  </div>
</div>

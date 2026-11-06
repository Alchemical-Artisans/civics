<!--
  Where Kenoza Lake sits on the city's own drought scale: four ordered
  stages, mild to severe, the current one marked.

  This is what actually shows a drought, which the citywide usage split
  never did -- residential-versus-non-residential is true in a wet year as
  much as a dry one. A stage is what changes when conditions do.

  One `role="img"` for the whole scale rather than a per-segment hover the
  way `BudgetStack` reads out a dollar figure: four fixed stages and their
  four fixed percentages are few enough to say once, in one accessible name,
  rather than four separate announcements for words that never change. The
  stage names and percentages underneath are visible rather than hover-only
  for the same reason -- eight short words and numbers is not a chart
  flooded with labels, it is a scale read the way a scale is: at a glance.
  Each percentage is `DROUGHT_ZONES`' own `range`, compacted -- a scale that
  only named its stages, with no figure behind any of them, would read as
  decoration rather than a measurement. It is Kenoza Lake's deficit against
  its own average reservoir capacity for the day of year, not the "average
  level" line the source chart plots in feet -- see the comment on
  `DROUGHT_ZONES` for what is and is not independently confirmed of that.
-->
<script lang="ts">
  import { DROUGHT_ZONES } from "./water"
  import { DROUGHT_SCALE_COLOURS } from "./drought-colours"

  let { current }: { current: string } = $props()

  const at = DROUGHT_ZONES.findIndex((zone) => zone.name === current)
</script>

<div class="drought-scale not-prose">
  <div
    class="flex gap-0.5"
    role="img"
    aria-label="Drought stage: {DROUGHT_ZONES.map(
      (zone) => `${zone.name} (${zone.percent} below average reservoir capacity)`,
    ).join(', ')} -- currently {current}"
  >
    {#each DROUGHT_ZONES as zone, i (zone.name)}
      <div
        class="h-3 flex-1 rounded-xs {i === at ? 'ring-2 ring-slate-900 ring-offset-1' : ''}"
        style="background: {DROUGHT_SCALE_COLOURS[i]}"
      ></div>
    {/each}
  </div>

  <div class="mt-1 flex gap-0.5 text-[10px]" aria-hidden="true">
    {#each DROUGHT_ZONES as zone, i (zone.name)}
      <div class="flex-1 text-center {i === at ? 'text-slate-900' : 'text-slate-500'}">
        <p class="m-0 truncate {i === at ? 'font-semibold' : ''}">{zone.name}</p>
        <p class="m-0 truncate tabular-nums">{zone.percent}</p>
      </div>
    {/each}
  </div>
</div>

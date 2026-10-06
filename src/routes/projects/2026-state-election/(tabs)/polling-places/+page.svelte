<!--
  The warrant's table of polling places, in its order and spelling: the map's
  content in words, for a reader who would rather read a list than find a
  shape. Each row opens its precinct's page.
-->
<script lang="ts">
  import { formatLongDate } from "$lib/calendar"
  import { Router } from "$lib/router"
  import { ELECTION, POLLING_PLACES, PROJECT } from "../../election"

  /** The precinct page a warrant row links to: the row's first precinct, less any `A`. */
  const pageOf = (serves: string[]) => serves[0].replace(/A$/, "")
</script>

<svelte:head>
  <title>Polling places - {PROJECT.title} - Haverhill</title>
  <meta
    name="description"
    content="Where each of Haverhill's precincts votes in the {PROJECT.title} on {formatLongDate(
      ELECTION.date,
    )}, as the election warrant lists them."
  />
</svelte:head>

<table class="w-full text-left text-sm">
  <caption class="sr-only">Polling places by ward and precinct</caption>
  <thead class="border-b border-slate-300 text-slate-500">
    <tr>
      <th scope="col" class="py-1 pr-3 font-medium">Ward and Precinct</th>
      <th scope="col" class="py-1 pr-3 font-medium">Polling place</th>
      <th scope="col" class="py-1 font-medium">Address</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-slate-100">
    {#each POLLING_PLACES as place (place.label)}
      <tr>
        <th scope="row" class="py-1.5 pr-3 font-normal">
          <a
            class="text-sky-800 underline hover:text-slate-900"
            href={Router.precinct(PROJECT.slug, pageOf(place.serves))}>{place.label}</a
          >
        </th>
        <td class="py-1.5 pr-3 text-slate-700">{place.name}</td>
        <td class="py-1.5 text-slate-700">{place.address}</td>
      </tr>
    {/each}
  </tbody>
</table>

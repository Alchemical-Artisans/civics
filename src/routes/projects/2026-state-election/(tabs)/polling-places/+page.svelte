<!--
  Where to vote is the City Clerk's to say, not ours: she asked that this site
  link her page of polling locations rather than state a place of its own, so
  this tab is that link and, beneath it, a way to each precinct's ballot.
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
    )}, from the City Clerk's website."
  />
</svelte:head>

<p class="text-sm text-slate-700">
  The City Clerk publishes where each ward and precinct votes.
  <a
    class="text-sky-800 underline hover:text-slate-900"
    href={Router.pollingLocations()}
    target="_blank"
    rel="external noopener noreferrer"
    >See the polling locations on the City Clerk's website<span class="sr-only"
      >, opens in a new tab</span
    ></a
  >.
</p>

<h2 class="mt-6 text-sm font-semibold text-slate-900">Ballots by precinct</h2>
<ul class="mt-1 grid grid-cols-2 gap-x-4 text-sm">
  {#each POLLING_PLACES as place (place.label)}
    <li class="py-0.5">
      <a
        class="text-sky-800 underline hover:text-slate-900"
        href={Router.precinct(PROJECT.slug, pageOf(place.serves))}>{place.label}</a
      >
    </li>
  {/each}
</ul>

<!--
  The Battery Energy Storage Systems Ordinance, as a project: the zoning
  amendment that would create a BESS Overlay District, followed from its filing
  on 24 March 2026 through each sitting that has taken it up.

  The timeline is the whole of the page. The Hilldale Avenue location is a step
  of its own on the timeline, because it is a different document with a packet
  of its own, and the ordinance is not decided until both are.
-->
<script lang="ts">
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { PROJECTS, type Project } from "$lib/projects"
  import { Router } from "$lib/router"

  let { data } = $props()

  const PROJECT = PROJECTS.find(
    (p) => p.slug === "battery-energy-storage-systems-ordinance",
  ) as Project
  const sharedUrl = Router.sharedProject(PROJECT.slug)
  const description = `Haverhill's ${PROJECT.title}: the zoning amendment that would create a BESS Overlay District, and every sitting that has taken it up.`
</script>

<ShareMeta url={sharedUrl} title={PROJECT.title} {description} />

<svelte:head>
  <title>{PROJECT.title} - Haverhill</title>
  <meta name="description" content={description} />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
  <header class="mb-6 border-b border-slate-200 pb-6">
    <p class="text-sm text-slate-500">Project</p>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{PROJECT.title}</h1>
    <div class="mt-2">
      <ShareButton url={sharedUrl} text={PROJECT.title} />
    </div>
  </header>

  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <section aria-labelledby="amendment">
      <h2 id="amendment" class="text-lg font-semibold text-slate-900">The amendment</h2>
      <blockquote class="mt-3 border-l-4 border-slate-200 pl-4 text-slate-800">
        <p>
          Planning Director, Jacki Byerley, requests a hearing for the following Zoning Amendment
          &ndash; Battery Energy Storage Systems Ordinance: re: Amend Chapter 255 Zoning Ordinance
          and Zoning Map &ndash; Battery Energy Storage Systems Overlay District (BESS)&ndash; by
          inserting a new section 7.9 Battery Energy Storage Systems
        </p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From the
        <a
          class="text-sky-800 underline hover:text-slate-900"
          href={Router.meetingItem(
            "city-council-2026-10-27",
            "battery-energy-storage-systems-ordinance",
          )}>City Council agenda of October 27, 2026</a
        >, Doc. 21-B, the petition as the Council has it.
      </p>
    </section>

    <ProjectTimeline project={PROJECT} today={data.today} />
  </div>
</div>

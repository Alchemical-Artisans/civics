<!--
  The ordinance restricting e-bikes and scooters, as a project: the Council's
  discussion of 30 June 2026, which sent the matter to the Public Safety
  Committee, and the ordinance the Mayor filed in September.

  The ordinance's text, and how it changes Chapter 222, is drawn as a diff on
  the 22 September item page rather than repeated here.
-->
<script lang="ts">
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { PROJECTS, type Project } from "$lib/projects"
  import { Router } from "$lib/router"

  let { data } = $props()

  const PROJECT = PROJECTS.find(
    (p) => p.slug === "recreational-motorized-vehicles-ordinance",
  ) as Project
  const sharedUrl = Router.sharedProject(PROJECT.slug)
  const description = `Haverhill's ${PROJECT.title}: the restrictions on motorized bicycles and scooters, from the Council's first discussion to the ordinance.`
</script>

<ShareMeta url={sharedUrl} title={PROJECT.title} {description} />

<svelte:head>
  <title>{PROJECT.title} - Haverhill</title>
  <meta name="description" content={description} />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
  <header class="mb-6 border-b border-slate-200 pb-6">
    <p class="text-sm text-slate-500">Project</p>
    <h1>{PROJECT.title}</h1>
    <div class="mt-2">
      <ShareButton url={sharedUrl} text={PROJECT.title} />
    </div>
  </header>

  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <section aria-labelledby="ordinance">
      <h2 id="ordinance">The ordinance</h2>
      <blockquote class="mt-3 border-l-4 border-slate-200 pl-4 text-slate-800">
        <p>
          Mayor Barrett submits an ordinance relating to amending Chapter 222 Article XI
          Recreational Motorized Vehicles of the Haverhill City Ordinance restricting the use of
          motorized bicycles and scooters
        </p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From the
        <a
          class="text-sky-800 underline hover:text-slate-900"
          href={Router.meetingItem(
            "city-council-2026-10-06",
            "recreational-motorized-vehicles-ordinance",
          )}>City Council agenda of October 6, 2026</a
        >.
      </p>
    </section>

    <!-- Three steps: nothing to fold. -->
    <ProjectTimeline project={PROJECT} today={data.today} fold={false} />
  </div>
</div>

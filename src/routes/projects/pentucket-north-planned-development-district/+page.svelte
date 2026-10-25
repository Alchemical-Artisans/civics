<!--
  The Pentucket North Planned Development District, as a project: the petition
  to rezone 931 Boston Road, followed from its referral to the Planning Board
  on 30 June 2026 through each sitting that has taken it up.

  The timeline is the whole of the page. A petition is decided by one vote at
  the end of it, and until then the record is what the page has to show.
-->
<script lang="ts">
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { PROJECTS, type Project } from "$lib/projects"
  import { Router } from "$lib/router"

  let { data } = $props()

  const PROJECT = PROJECTS.find(
    (p) => p.slug === "pentucket-north-planned-development-district",
  ) as Project
  const sharedUrl = Router.sharedProject(PROJECT.slug)
  const description = `Haverhill's ${PROJECT.title}: the petition to build six duplex units and two single family units off Boston Road, and every sitting that has taken it up.`
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
    <section aria-labelledby="petition">
      <h2 id="petition" class="text-lg font-semibold text-slate-900">The petition</h2>
      <blockquote class="mt-3 border-l-4 border-slate-200 pl-4 text-slate-800">
        <p>
          Attorney Russell Channen for client <em>Pentucket North Development, LLC</em> requests to amend
          Chapter 255 Zoning Ordinance and Zoning Map by creating a Special Permit Planned Development
          District in accordance with Section 8.5 of the Zoning Ordinance.
        </p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From the
        <a
          class="text-sky-800 underline hover:text-slate-900"
          href={Router.meetingItem(
            "city-council-2026-10-27",
            "pentucket-north-planned-development-district",
          )}>City Council agenda of October 27, 2026</a
        >, Doc. 21-G, the petition as the Council has it.
      </p>
    </section>

    <ProjectTimeline project={PROJECT} today={data.today} />
  </div>
</div>

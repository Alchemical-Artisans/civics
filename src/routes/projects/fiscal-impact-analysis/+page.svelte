<!--
  The Fiscal Impact Analysis, as a project: the study Barrett Planning Group
  prepared for the City Council, followed from the progress report of
  9 December 2025 to the Planning and Development Committee it was sent to.

  The page is the motion and the timeline, as the Infrastructure Risk
  Assessment's is. What the study found, as far as the record has it, is in
  the minutes on the 9 December item page; the study itself is not in any
  packet the calendar carries.
-->
<script lang="ts">
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { PROJECTS, type Project } from "$lib/projects"
  import { Router } from "$lib/router"

  let { data } = $props()

  const PROJECT = PROJECTS.find((p) => p.slug === "fiscal-impact-analysis") as Project
  const sharedUrl = Router.sharedProject(PROJECT.slug)
  const description = `Haverhill's ${PROJECT.title}: the study Barrett Planning Group prepared for the City Council, and every sitting that has taken it up.`
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
    <!-- The motion as the minutes record it; the account of the report that
         led to it is on the item's page. -->
    <section aria-labelledby="motion">
      <h2 id="motion">The motion</h2>
      <blockquote class="mt-3 border-l-4 border-slate-200 pl-4 text-slate-800">
        <p>
          Motion by Councilor Michitson to send to Planning and Development subcommittee, second by
          Vice President Jordan
        </p>
        <p class="mt-2">PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Rogers)</p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From the minutes of the
        <a
          class="text-sky-800 underline hover:text-slate-900"
          href={Router.meetingItem(
            "city-council-2025-12-09",
            "fiscal-impact-analysis-progress-report",
          )}>City Council meeting of December 9, 2025</a
        >, on Judi Barrett&rsquo;s progress report on the Fiscal Impact Analysis.
      </p>
    </section>

    <!-- Two steps so far: nothing to fold. -->
    <ProjectTimeline project={PROJECT} today={data.today} fold={false} />
  </div>
</div>

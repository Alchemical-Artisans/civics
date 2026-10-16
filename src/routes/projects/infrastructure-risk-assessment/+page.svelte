<!--
  The Infrastructure Risk Assessment, as a project: the study the Council set
  going on 14 July 2026, after the 42" force main failed, followed from the
  motion to whatever the Planning and Development Committee reports.

  The page is the motion and the timeline and nothing else yet. An election
  had a map and a ballot to draw from the day the warrant was received; a
  study has nothing of its own to show until it produces something, and what
  it produces -- a ranking, a scope, a schedule -- is for the committee to
  decide at its first sitting, so this page grows as the study does.
-->
<script lang="ts">
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import { PROJECTS, type Project } from "$lib/projects"
  import { Router } from "$lib/router"

  let { data } = $props()

  const PROJECT = PROJECTS.find((p) => p.slug === "infrastructure-risk-assessment") as Project
</script>

<svelte:head>
  <title>{PROJECT.title} - Haverhill</title>
  <meta
    name="description"
    content="Haverhill's {PROJECT.title}: the City Council's motion for a risk-based assessment of the city's critical infrastructure, and every sitting that has taken it up."
  />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
  <header class="mb-6 border-b border-slate-200 pb-6">
    <p class="text-sm text-slate-500">Project</p>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{PROJECT.title}</h1>
  </header>

  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <!-- The motion as the minutes record it, the Council's own words for what
         the study is to do; the minutes' longer account of what the Vice
         President asked for is on the item's page. -->
    <section aria-labelledby="motion">
      <h2 id="motion" class="text-lg font-semibold text-slate-900">The motion</h2>
      <blockquote class="mt-3 border-l-4 border-slate-200 pl-4 text-slate-800">
        <p>
          Motion by Vice President Michitson to send to Planning and Development to work with the
          Administration and appropriate departments on an initial risk based assessment of the
          city&rsquo;s critical infrastructure beginning with the wastewater and drinking water
          systems. Second by Councilor Lewandowski
        </p>
        <p class="mt-2">PASSED &ndash; Yeas 9, Nays 0, Absent 2 (Toohey and Diodati)</p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From the minutes of the
        <a
          class="text-sky-800 underline hover:text-slate-900"
          href={Router.meetingItem("city-council-2026-07-14", "force-main-sewer-break-update")}
          >City Council meeting of July 14, 2026</a
        >, on the update on the 42&rdquo; force main sewer break.
      </p>
    </section>

    <ProjectTimeline project={PROJECT} today={data.today} />
  </div>
</div>

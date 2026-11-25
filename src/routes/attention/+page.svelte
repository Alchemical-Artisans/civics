<script lang="ts">
  import { enhance } from "$app/forms"

  let { data, form } = $props()

  // Every answer on this page rewrites a file, and the page then reloads from
  // those files, so what is on screen is always what is on disk.
  const LABELS: Record<string, { label: string; hint: string }> = {
    "date-right": { label: "Date is right", hint: "Stop asking about this date." },
    "set-date": { label: "Set date", hint: "Use the date in the box." },
    settle: { label: "Settle", hint: "Nothing more to do with this record." },
    drop: { label: "Drop from site", hint: "Remove the document from the calendar." },
    promote: { label: "Promote", hint: "Let the recording stand as the meeting's document." },
  }

  let filter = $state("")
  const needle = $derived(filter.trim().toLowerCase())
  const matches = (...parts: (string | null | undefined)[]) =>
    !needle || parts.some((p) => p?.toLowerCase().includes(needle))

  const groups = $derived(
    data.groups.map((g) => ({
      ...g,
      shown: g.records.filter((r) =>
        matches(r.board, r.title, r.filename, r.date, r.filenameDate, r.key),
      ),
    })),
  )
  const leads = $derived(
    data.leads.filter((l) => matches(l.slug, l.title, l.url, l.publisher, l.source, l.excerpt)),
  )
  const acted = $derived(data.sources.filter((s) => s.status !== "unreachable"))
  const blocked = $derived(data.sources.filter((s) => s.status === "unreachable"))
  const sources = $derived(acted.filter((s) => matches(s.slug, s.url)))
  const blockedShown = $derived(blocked.filter((s) => matches(s.slug, s.url)))

  const sections = $derived([
    ...data.groups.map((g) => ({ id: g.key, title: g.title, count: g.records.length })),
    { id: "leads", title: "Issue pages behind", count: data.leads.length },
    { id: "sources", title: "Cited pages changed", count: acted.length },
    { id: "unreachable", title: "Cited pages unreachable", count: blocked.length },
  ])
  const total = $derived(sections.reduce((n, s) => n + s.count, 0))

  const button =
    "rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-700"
</script>

<svelte:head>
  <title>Needs attention</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main id="main" class="mx-auto max-w-5xl px-4 py-6">
  <h1>Needs attention</h1>
  <p class="text-sm text-slate-600">
    Development only: this page is not part of the built site, and its buttons write to
    <code>reviews.json</code>, <code>meetings.json</code> and the issue pages'
    <code>leads.json</code>
    and <code>sources.json</code>. {#if data.linksCheckedAt}Links last checked {data.linksCheckedAt.slice(
        0,
        10,
      )}.{:else}Broken links are not counted: run <code>npm run links:check</code>.{/if}
  </p>

  {#if form?.message}
    <p
      role="status"
      class="sticky top-2 z-10 my-3 rounded border px-3 py-2 text-sm {form.ok
        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
        : 'border-red-300 bg-red-50 text-red-900'}"
    >
      {form.message}
    </p>
  {/if}

  {#if !total}
    <p class="my-8 text-lg">Nothing needs your attention.</p>
  {:else}
    <div
      class="sticky top-0 z-10 -mx-4 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur"
    >
      <input
        type="search"
        bind:value={filter}
        placeholder="Filter by board, title, filename, date…"
        aria-label="Filter"
        class="min-w-64 flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
      />
      <nav aria-label="Sections" class="flex flex-wrap gap-1 text-xs">
        {#each sections.filter((s) => s.count) as s (s.id)}
          <a
            href="#{s.id}"
            class="rounded-full bg-slate-100 px-2 py-1 text-slate-800 hover:bg-slate-200"
          >
            {s.title} <b>{s.count}</b>
          </a>
        {/each}
      </nav>
    </div>

    {#each groups as g (g.key)}
      <details id={g.key} open class="my-4 scroll-mt-16">
        <summary class="cursor-pointer text-lg font-semibold text-slate-900">
          {g.title}
          <span class="font-normal text-slate-500">
            -- {needle ? `${g.shown.length} of ` : ""}{g.records.length}
          </span>
        </summary>
        <p class="mt-1 text-sm text-slate-600">{g.note}</p>
        <ul class="mt-2 divide-y divide-slate-200 rounded border border-slate-200">
          {#each g.shown as r (r.key)}
            <li class="grid gap-2 p-3 md:grid-cols-[1fr_auto]">
              <div class="min-w-0 text-sm">
                <div class="flex flex-wrap items-baseline gap-x-2">
                  <b class="tabular-nums">{r.date ?? "????-??-??"}</b>
                  <span class="text-slate-600">{r.board}</span>
                  {#if r.kind}<span class="rounded bg-slate-100 px-1 text-xs">{r.kind}</span>{/if}
                </div>
                <div class="break-words">{r.title}</div>
                <div class="text-xs break-all text-slate-600">
                  {#if r.url}
                    <a href={r.url} target="_blank" rel="external noopener noreferrer"
                      >{r.filename}</a
                    >
                  {:else}{r.filename}{/if}
                  {#if r.filenameDate}
                    -- filename says <b>{r.filenameDate}</b>{/if}
                  {#if r.dateSource}
                    <span class="text-slate-400">({r.dateSource})</span>{/if}
                  {#if r.pageUrl && r.pageUrl !== r.url}
                    · <a href={r.pageUrl} target="_blank" rel="external noopener noreferrer">page</a
                    >{/if}
                </div>
              </div>
              <form
                method="POST"
                action="?/record"
                use:enhance
                class="flex flex-wrap items-center gap-1"
              >
                <input type="hidden" name="key" value={r.key} />
                {#if g.answers.includes("set-date")}
                  <input
                    type="date"
                    name="date"
                    aria-label="Correct date for {r.title}"
                    class="rounded border border-slate-300 px-1 py-0.5 text-xs"
                  />
                {/if}
                {#each g.answers as a (a)}
                  <button name="answer" value={a} title={LABELS[a].hint} class={button}
                    >{LABELS[a].label}</button
                  >
                {/each}
              </form>
            </li>
          {/each}
        </ul>
      </details>
    {/each}

    {#if data.leads.length}
      <section id="leads" class="my-6 scroll-mt-16">
        <h2>
          Issue pages behind
          <span class="font-normal text-slate-500">
            -- {needle ? `${leads.length} of ` : ""}{data.leads.length}
          </span>
        </h2>
        <p class="text-sm text-slate-600">
          Found by each page's saved search (<code>watch.json</code>). Read each, bring the page up
          to date, then mark it incorporated -- or irrelevant.
        </p>
        {#each Object.entries(Object.groupBy(leads, (l) => l.slug)) as [slug, ls] (slug)}
          <h3><code>/issues/{slug}</code> -- {ls?.length}</h3>
          <ul class="divide-y divide-slate-200 rounded border border-slate-200">
            {#each ls ?? [] as l (l.id)}
              <li class="grid gap-2 p-3 md:grid-cols-[1fr_auto]">
                <div class="min-w-0 text-sm">
                  <div class="text-xs text-slate-600">
                    <b class="tabular-nums">{l.date ?? "????-??-??"}</b>
                    {l.source}{l.publisher ? ` -- ${l.publisher}` : ""}
                  </div>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="external noopener noreferrer"
                    class="break-words">{l.title}</a
                  >
                  {#if l.excerpt}<div class="text-xs text-slate-600">“{l.excerpt}”</div>{/if}
                  {#if l.note}<div class="text-xs text-slate-600">{l.note}</div>{/if}
                </div>
                <form method="POST" action="?/issue" use:enhance class="flex items-center gap-1">
                  <input type="hidden" name="id" value={l.id} />
                  <button name="answer" value="incorporated" class={button}>Incorporated</button>
                  <button name="answer" value="irrelevant" class={button}>Irrelevant</button>
                </form>
              </li>
            {/each}
          </ul>
        {/each}
      </section>
    {/if}

    {#each [{ id: "sources", title: "Cited pages changed or gone", list: sources, all: acted.length, note: "Read it, bring the guide into line if it needs it, then accept the new version -- or ignore it to stop watching." }, { id: "unreachable", title: "Cited pages unreachable", list: blockedShown, all: blocked.length, note: "Refused or timed out, so not checked. Usually a site that turns scripts away, and the same every run; ignore the ones that will never answer." }] as s (s.id)}
      {#if s.all}
        <section id={s.id} class="my-6 scroll-mt-16">
          <h2>
            {s.title}
            <span class="font-normal text-slate-500">
              -- {needle ? `${s.list.length} of ` : ""}{s.all}
            </span>
          </h2>
          <p class="text-sm text-slate-600">{s.note}</p>
          <ul class="divide-y divide-slate-200 rounded border border-slate-200">
            {#each s.list as src (src.id)}
              <li class="grid gap-2 p-3 md:grid-cols-[1fr_auto]">
                <div class="min-w-0 text-sm">
                  <div class="text-xs text-slate-600">
                    <code>/issues/{src.slug}</code> -- <b>{src.status}</b>
                    {#if src.changed}since {src.changed}{/if}
                    {#if src.error}({src.error}){/if}
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="external noopener noreferrer"
                    class="break-all">{src.url}</a
                  >
                  {#if src.status === "changed"}
                    {#if !src.diff}
                      <div class="text-xs text-slate-500">
                        No earlier text kept to compare -- a file, or a fresh <code>.cache/</code>.
                      </div>
                    {:else}
                      <ul class="mt-1 space-y-1 text-xs">
                        {#each src.diff.removed as t (t)}
                          <li class="rounded bg-red-50 px-1 text-red-900">− {t.slice(0, 220)}</li>
                        {/each}
                        {#each src.diff.added as t (t)}
                          <li class="rounded bg-emerald-50 px-1 text-emerald-900">
                            + {t.slice(0, 220)}
                          </li>
                        {/each}
                        {#if src.diff.more}
                          <li class="text-slate-500">…and {src.diff.more} more sentence(s)</li>
                        {/if}
                        {#if !src.diff.removed.length && !src.diff.added.length}
                          <li class="text-slate-500">Same sentences, reordered or re-spaced.</li>
                        {/if}
                      </ul>
                    {/if}
                  {/if}
                </div>
                <form method="POST" action="?/issue" use:enhance class="flex items-center gap-1">
                  <input type="hidden" name="id" value={src.id} />
                  {#if src.status !== "unreachable"}
                    <button name="answer" value="accept" class={button}>Accept</button>
                  {/if}
                  <button name="answer" value="ignore" class={button}>Ignore</button>
                </form>
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    {/each}
  {/if}
</main>

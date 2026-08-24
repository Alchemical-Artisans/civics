<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="mx-auto max-w-2xl px-4 py-12">
	<h1 class="text-3xl font-bold tracking-tight text-slate-900">Haverhill Civics</h1>
	<p class="mt-3 text-slate-600">
		Public meeting records for the City of Haverhill, Massachusetts.
	</p>
	<a
		href={resolve('/calendar')}
		class="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700"
	>
		Meeting calendar
	</a>
</div>

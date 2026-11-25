<script lang="ts">
  import IssueVersion from "$lib/IssueVersion.svelte"
  import { Router } from "$lib/router"

  let { data } = $props()
</script>

<IssueVersion {data} guide="Haverhill Drought Guide" home={Router.droughtPage()} />

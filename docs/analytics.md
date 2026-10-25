# Analytics

The site reports page views to [Umami](https://umami.is), a cookieless
analytics service. The script is in
[`src/routes/+layout.svelte`](../src/routes/+layout.svelte), loaded on every
page of the built site:

```html
<script
  defer
  src="https://cloud.umami.is/script.js"
  data-website-id="f60433e7-985a-456f-8f49-ccb955e2dc65"
></script>
```

## What it does

Umami sets no cookies and keeps no per-visitor identifier, so there is no
consent banner and nothing to record consent against. It reports page views,
referrers and countries as counts rather than as the modelled estimates Google
Analytics gave when consent was denied.

The script is not included in `npm run dev`, so running the site locally does
not count the developer's own visits.

## Turning it off or moving it

Remove the `<script>` from `+layout.svelte`. To point it at another Umami
website, change `data-website-id` to that site's ID from the Umami dashboard.

## Checking it works

- After a deploy, the Umami dashboard's Realtime view should show a visit
  within a minute of loading any page of the site.
- `npm run build`, then `grep -o 'cloud.umami.is/script.js' build/index.html`
  should match once.

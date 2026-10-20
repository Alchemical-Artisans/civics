# Analytics

The site reports page views to Google Analytics 4, with Google's Consent Mode
set to **denied** for every signal and nothing in the site ever granting it.
There is no cookie banner, because there is no choice being offered for one to
record.

The code is [`src/lib/analytics.ts`](../src/lib/analytics.ts), loaded by
[`src/routes/+layout.svelte`](../src/routes/+layout.svelte) on every page.

## Turning it on

1. In Google Analytics, create a GA4 property and a web data stream for
   `haverhill.alchemicalartisans.com`. The stream shows a **Measurement ID**
   beginning `G-`.
2. Put that ID in `GA_MEASUREMENT_ID` in `src/lib/analytics.ts`, and deploy.

While the constant is empty, the layout writes no analytics markup at all, so
the site is byte-for-byte what it was before. Local development (`npm run dev`)
never loads the script either, whatever the constant holds, so running the site
does not count the developer's own visits.

## What "denied" does

Consent Mode v2 has four signals: `ad_storage`, `ad_user_data`,
`ad_personalization` and `analytics_storage`. The site sets all four to
`"denied"` before the Google library loads, and `allow_google_signals` is off.

Note the values are the strings `"denied"` and `"granted"`, not booleans.

With `analytics_storage` denied, GA4:

- sets no cookies and writes no `_ga` identifier, so it cannot tell one visitor
  from another or recognise a return visit;
- still sends a cookieless ping for each page view, with the IP address
  truncated;
- has its totals **modelled** by Google from the pings that come back, so the
  reports are estimates rather than counts.

So what the property will show is an estimate. Page-view totals will be a
rough floor and visitor counts a loose guess, and on a site with modest traffic
Google may not model at all. Read the numbers as "roughly how much is read, and
when", not as counts.

## Is this a GDPR exemption?

It is a reasonable position but not one this file can settle, and it is not
legal advice.

- Consent Mode with denied defaults is the mechanism Google documents for
  measuring without consent. It is not a blanket exemption: whether cookieless
  measurement needs consent depends on how each regulator reads ePrivacy and
  GDPR, and some European regulators have been critical of Google Analytics
  even without cookies, because the data still reaches Google in the United
  States.
- The site is run from Massachusetts and reports on a US city, so GDPR and UK
  GDPR reach it only through visitors who happen to be in the EU or UK. That
  is more likely than it sounds: the calendar is linked from search and
  social, and a visitor's location is not checked before the page is served.
- A short privacy statement saying what is measured and by whom is worth
  having whatever the consent setting. Google's own terms also ask a site
  using its measurement to disclose it. No such page exists here yet.

If the legal reading changes, the site can grant consent for everyone with one
call, or present a banner and grant it only on a yes. The denied defaults stay
in place either way, because the library needs them before any choice is made.

## Adding a banner later

Consent is granted by calling `gtag` once a visitor has chosen:

```js
gtag("consent", "update", { analytics_storage: "granted" })
```

`gtag` is the function `analyticsHead` in `src/lib/analytics.ts` defines on
`window`. A banner would call that, and would also store the choice so it is
not asked again. Until a banner exists, nothing calls it, and measurement stays
cookieless.

## Checking it works

- `npm run build`, then `grep -o 'analytics_storage: "denied"' build/index.html`
  should match once the ID is set. With the ID empty it prints nothing.
- In a browser's developer tools, the Network tab should show a request to
  `googletagmanager.com/gtag/js` and, after a page view, a request to
  `google-analytics.com/g/collect` with no `_ga` cookie set alongside it.
- Cookies for the site should not include `_ga` after a visit.

The unit tests in `src/lib/analytics.spec.ts` pin the four denied signals, their
ordering before the library, and the ID's use in both places.

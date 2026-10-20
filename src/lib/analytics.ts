/**
 * The Google Analytics 4 measurement ID this site reports to, `G-` followed by
 * ten or so characters, from the property's Data Streams page.
 *
 * Empty means no analytics at all: the layout writes no script, so a build
 * without an ID is the site as it was before. Local development never loads
 * the script either, whatever this holds, so running the site does not count
 * the developer's own visits.
 *
 * Consent is denied by default and nothing grants it -- there is no banner.
 * Google's Consent Mode is what makes that workable: with analytics storage
 * denied, GA4 sets no cookies and identifies no visitor, and sends only
 * cookieless pings, from which Google models the totals. The numbers that
 * come back are estimates, and the page-level counts are the ones to trust
 * least. See docs/analytics.md before reading anything into them.
 */
export const GA_MEASUREMENT_ID = "G-E5GNQLES7G"

/**
 * The `<head>` markup that loads Google Analytics with consent denied, as an
 * HTML string for `{@html}`. Svelte does not interpolate inside `<script>`
 * bodies, so the ID is written in here rather than in the component's markup.
 *
 * The consent default has to be in the page before gtag.js runs, so the inline
 * block comes first and the library is async behind it. `allow_google_signals`
 * is off so that Google's own advertising features stay out of it too.
 */
export function analyticsHead(id: string): string {
  return `<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  gtag("js", new Date());
  gtag("config", "${id}", { allow_google_signals: false });
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`
}

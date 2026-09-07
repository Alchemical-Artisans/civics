<!--
  The one line on any page that is the site's own words rather than the city's:
  who made it, linking the note that explains why.

  It is placed by the layouts, not by itself: the calendar half renders it in
  the flow at the end of the page, and the budget half renders it just above the
  budget calendar that is fixed to the bottom of every one of its pages -- which
  is why there is no route check in here. The height is fixed at 40px (`h-10`,
  border included) so the budget half's single-screen `calc(100vh - ...)` has a
  constant to subtract.
-->
<footer
  class="flex h-10 items-center justify-center border-t border-slate-200 px-4 text-xs text-slate-500"
>
  <a
    class="hover:text-slate-700"
    href="https://www.alchemicalartisans.com/2026/09/06/meetinghouse-civics-transparency.html"
    target="_blank"
    rel="external noopener noreferrer"
  >
    Created by Alchemical Artisans
  </a>
</footer>

<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "snow-plowing-rates"
</script>

<p>Mayor Barrett proposes an Order to amend Existing Snow Plowing Rates</p>

<ul>
  <li>
    <strong>5.3.1</strong> Order- Amend
    <a href={Router.meeting("city-council-2025-10-21")}>Document 94-O of 2025</a>
  </li>
</ul>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 16, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/dpw-directors-memo`)} target="_blank" rel="noopener">
      Memo from Robert Kimball, Director, Department of Public Works, October 16, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/city-solicitors-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Lisa L. Mead, City Solicitor, October 16, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/current-rates`)} target="_blank" rel="noopener">
      Document 94-O of 2025, the rates now in force<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      An Order to Amend Document 94-O of 2025, as filed<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order-marked`)} target="_blank" rel="noopener">
      The same order with the changed figures and wording marked<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<hr />

<!-- The marked copy rather than the order as filed: the two carry the same
     schedule, but this one also carries the figures the order drops, struck
     through, and emboldens the ones it puts in their place -- which is what
     the Council is being asked to vote on. Struck wording is <del>, added
     wording <strong>, as the city prints them.

     This is the one amendment on the site not drawn as an OrdinanceDiff. What
     the order amends is a four-column rate table, and a redline is a run of
     paragraphs: flattening a row to "7,001 to 9,000 lbs. GVWR $91 $5 $96"
     would lose which column each figure sits in, which is the whole of what
     the schedule says. The table is the document's own shape and keeps it. -->

<h2>An Order to Amend Document 94-O of 2025</h2>

<p>October___, 2026</p>

<p>AN ORDER TO AMEND DOCUMENT ___ OF 2026</p>

<p>That the fees for private snow plowing and hauling by the City shall be as follows:</p>

<p>
  <em>
    Amended by inserting the following <strong>emboldened</strong> language and removing the
    language <del>stricken through</del>:
  </em>
</p>

<p>That the fees for private snow plowing and hauling by the City shall be as follows:</p>

<table>
  <caption>Rates For Plowing, Clearing, and Hauling Sow</caption>
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Base Hourly Rate</th>
      <th scope="col">Early Sign-up Bonus</th>
      <th scope="col">Base Hourly with Sign-up Bonus</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" colspan="4">Vehicles</th>
    </tr>
    <tr>
      <td>7,001 to 9,000 lbs. GVWR</td>
      <td><del>$91</del> <strong>$96</strong></td>
      <td>$5</td>
      <td><del>$96</del> <strong>$101</strong></td>
    </tr>
    <tr>
      <td>9,001 to 11,000 lbs. GVWR</td>
      <td><del>$105</del> <strong>$110</strong></td>
      <td>$5</td>
      <td><del>$110</del> <strong>$115</strong></td>
    </tr>
    <tr>
      <td>11,001 to 16,000 lbs. GVWR</td>
      <td><del>$119</del> <strong>$124</strong></td>
      <td><del>$7</del> <strong>$5</strong></td>
      <td><del>$126</del> <strong>$129</strong></td>
    </tr>
    <tr>
      <td>16,001 to 25,800 lbs. GVWR</td>
      <td><del>$125</del> <strong>$130</strong></td>
      <td><del>$7</del> <strong>$5</strong></td>
      <td><del>$132</del> <strong>$135</strong></td>
    </tr>
    <tr>
      <td>25,801 to 36,000 lbs. GVWR</td>
      <td><del>$131</del> <strong>$136</strong></td>
      <td><del>$7</del> <strong>$5</strong></td>
      <td><del>$138</del> <strong>$141</strong></td>
    </tr>
    <tr>
      <th scope="row" colspan="4">Tractor</th>
    </tr>
    <tr>
      <td>Plow size under 10 feet</td>
      <td><del>$137</del> <strong>$142</strong></td>
      <td><del>$7</del> <strong>$5</strong></td>
      <td><del>$144</del> <strong>$147</strong></td>
    </tr>
    <tr>
      <td>Plow size 10 feet and greater</td>
      <td><del>$144</del> <strong>$149</strong></td>
      <td><del>$7</del> <strong>$5</strong></td>
      <td><del>$151</del> <strong>$154</strong></td>
    </tr>
    <tr>
      <th scope="row" colspan="4">Front end loaders and backhoes</th>
    </tr>
    <tr>
      <td>Backhoe</td>
      <td><del>$137</del> <strong>$142</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Less than 2 CY</td>
      <td><del>$137</del> <strong>$142</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>2-3.99 CY</td>
      <td><del>$137</del> <strong>$142</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>4 CY and greater</td>
      <td><del>$149</del> <strong>$154</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th scope="row" colspan="4">Special Equipment</th>
    </tr>
    <tr>
      <td>Skid steer with AWD</td>
      <td><del>$110</del> <strong>$115</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Skid steer with snowblower attachment</td>
      <td><del>$118</del> <strong>$123</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Bombardier with snowblower</td>
      <td><del>$105</del> <strong>$110</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Other Special Equipment</td>
      <td><del>$161</del> <strong>$166</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th scope="row" colspan="4">Spreaders</th>
    </tr>
    <tr>
      <td>2 to 5.99 CY</td>
      <td><del>$10</del> <strong>$15</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>6 to 9.99 CY</td>
      <td><del>$15</del> <strong>$20</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>10 CY and greater</td>
      <td><del>$20</del> <strong>$25</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th scope="row" colspan="4">Snow Hauling</th>
    </tr>
    <tr>
      <td>10-Wheeler, Tri-axle, and Dump Trailer</td>
      <td><del>$120</del> <strong>$125</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th scope="row" colspan="4">Wing Plows</th>
    </tr>
    <tr>
      <td>Wing Plows</td>
      <td><del>$25</del> <strong>$30</strong></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

<ol>
  <li>Owner must furnish frame, pump and ram, plow and cutting edges.</li>
  <li>
    If ballast is supplied to contractor by the City, it shall be returned at the end of each storm.
  </li>
  <li>Haverhill contractors will be given first consideration when being called.</li>
  <li>
    Other Special Equipment - Equipment defined as &ldquo;Special&rdquo; will be determined by the
    <del>Highway Superintendent</del>
    <strong>Director of the Department of Public Works - Highway/Park and Tree</strong> or his
    agents. The hourly wage for said special equipment will be negotiated at the time of hire. This
    equipment is to be determined &ldquo;Special&rdquo; because it is not specified in this Order.
    Rates are not to exceed <del>$161.00</del> <strong>$166.00</strong> per hour for hiring of said Special
    Equipment unless directed by the City Council,
  </li>
  <li>
    Snow plow contractors shall be guaranteed a minimum of four (4) hour time allotment for each
    call out by the City.
  </li>
  <li>
    Early Sign-up Bonus is only available to Vendors that submit all required documents and
    completed the vehicle inspection by November <del>14, 2025.</del> <strong>20, 2026</strong>.
  </li>
  <li>The spreader rate and wing plow rate is added to the vehicle base hourly rate.</li>
</ol>

<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2016-09-27"
  const ITEM = "documents-referred-to-committee-study"
</script>

<!-- The clerk prints no heading row over these columns, so the table has none.
     Two rows carry two dates, stacked in the last column; they are kept on
     separate lines as printed. The Date Sent sittings are not written up yet,
     so no row links on to the motion it records. -->

<table>
  <tbody>
    <tr>
      <td></td>
      <td>Suspension of Rules to discuss unpermitted BnB&rsquo;s operating in City of Haverhill</td>
      <td>A &amp; F</td>
      <td>10/20/15<br />1/27/16</td>
    </tr>
    <tr>
      <th scope="row">6-Q</th>
      <td
        >Communication from Councillor Macek requesting a discussion on the establishment of an
        Adult Fitness and Wellness zone</td
      >
      <td>NRPP</td>
      <td>2/9/16</td>
    </tr>
    <tr>
      <th scope="row">6-W</th>
      <td
        >Communication from Councillor Bevilacqua requesting to discuss Wood School Play- ground</td
      >
      <td>NRPP</td>
      <td>2/23/16</td>
    </tr>
    <tr>
      <th scope="row">38-F</th>
      <td
        >Communication from Councillors Barrett and LePage requesting to discuss double poles in the
        City</td
      >
      <td>A &amp; F</td>
      <td>3/15/16<br />9/6/16</td>
    </tr>
    <tr>
      <th scope="row">38-W</th>
      <td
        >Communication from Councillor Barrett requesting to give an update on response from
        MBTA/Keolis &amp; US EPA about idling trains in Bradford</td
      >
      <td>Citizen Outreach</td>
      <td>4/5/16</td>
    </tr>
    <tr>
      <th scope="row">51</th>
      <td
        >Communication from Pres. Michitson requesting to submit petition from Burnham St. residents
        requesting Burnham St. be made one way coming in from Groveland St. onto Burnham</td
      >
      <td>Public Safety</td>
      <td>4/12/16</td>
    </tr>
    <tr>
      <th scope="row">26E</th>
      <td
        >City of Haverhill &ndash; Mayor&rsquo;s Recommendations, Capital Improvement Program
        &ndash; 2016-2020</td
      >
      <td>A &amp; F</td>
      <td>5/31/16</td>
    </tr>
    <tr>
      <th scope="row">69</th>
      <td
        >Communication from John Guerin, Chair, submitting findings &amp; recommendations of Salary
        Survey Commission</td
      >
      <td>A &amp; F</td>
      <td>6/7/16</td>
    </tr>
    <tr>
      <td></td>
      <td>Application for Permit for Amusements, Public Shows and Exhibitions</td>
      <td>A &amp; F</td>
      <td>7/26/16</td>
    </tr>
    <tr>
      <th scope="row">82-T</th>
      <td
        >Communication from Councillor Vargas requesting to introduce Keith Boucher of Urban
        Kindness to discuss &ldquo;Pop-Up&rdquo; City Halls</td
      >
      <td>Citizen Outreach</td>
      <td>8/23/16</td>
    </tr>
    <tr>
      <th scope="row">96-B</th>
      <td
        >Communication from Councillor LePage requesting discussion regarding local regulations of
        building permit fees</td
      >
      <td>A &amp; F</td>
      <td>9/6/16</td>
    </tr>
  </tbody>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/list`)} target="_blank" rel="noopener">
      Documents Referred to Committee Study<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

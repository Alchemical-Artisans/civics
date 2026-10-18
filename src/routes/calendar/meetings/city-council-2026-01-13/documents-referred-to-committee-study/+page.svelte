<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "documents-referred-to-committee-study"
</script>

<!-- The clerk prints this across two pages, the second with its own heading
     and each footed "Updated December 17, 2025"; it is one list, so it is one
     table here, with the date under it once. -->

<table>
  <thead>
    <tr>
      <th scope="col">Document Number</th>
      <th scope="col">Motion Details</th>
      <th scope="col">Committee</th>
      <th scope="col">Date Sent</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">103-HH</th>
      <td>
        Motion by Councilor Michitson to send the <em
          >Home Rule Petition &ndash; An act establishing guidelines for the installation of and use
          of Electric vehicle charging stations in the City of Haverhill</em
        >, to committee in order to coordinate with condo associations.
      </td>
      <td>A&amp;F</td>
      <td>12/23/23</td>
    </tr>
    <tr>
      <th scope="row">40</th>
      <td>
        Motion by Councilor Lewandowski to send updated Cannabis Social Equity Best Practices for
        the Cannabis Control Commission to A&amp;F for further review.
      </td>
      <td>A&amp;F</td>
      <td>4/2/24</td>
    </tr>
    <tr>
      <th scope="row">12-P</th>
      <td>
        Motion by Councilor Jordan to send possible conditions on new development and potential
        changes to our zoning ordinances.
      </td>
      <td>Planning &amp; Development</td>
      <td>5/21/24</td>
    </tr>
    <tr>
      <th scope="row">12-S</th>
      <td>
        Motion by Councilor Ferreira to send the City&rsquo;s Swimming Ordinance Chapter 193 Article
        III and related items at Lake Saltonstall, aka Plug Pond to NRPP for further discussion.
      </td>
      <td>NRPP</td>
      <td>6/18/24</td>
    </tr>
    <tr>
      <th scope="row">33-F</th>
      <td>
        Motion by Councilor Basiliere to send resident winter parking concerns and offer suggestions
        for improvements
      </td>
      <td>Public Health Safety</td>
      <td>3/11/25</td>
    </tr>
    <tr>
      <th scope="row">60</th>
      <td>
        Motion by Councilor Michitson to send the
        <a href={Router.meetingItem(MEETING, "housing-production-plan")}>
          Haverhill Housing Production Plan
        </a> to P&amp;D for further discussion
      </td>
      <td>Planning &amp; Development</td>
      <td>5/6/25</td>
    </tr>
    <tr>
      <th scope="row">33-L</th>
      <td>
        Motion by Councilor Lewandowski to send Bill 3360 (vacancy tax on residential properties)
        for review and also further review of MVSP (Massachusetts Vacant Storefront Program)
      </td>
      <td>Planning &amp; Development</td>
      <td>6/24/25</td>
    </tr>
    <tr>
      <th scope="row">33-M</th>
      <td>
        Motion by Councilor Michitson to send for feedback on Cross-Cutting Career training event
        from various participants
      </td>
      <td>Planning &amp; Development</td>
      <td>6/24/25</td>
    </tr>
    <tr>
      <th scope="row">33-P</th>
      <td>
        Motion by Councilor Ferreira to send for review as to what our local strategies are for
        traffic and safety as well as looking into these intersections for public safety (Amesbury
        Line Road/Merrimac Road)
      </td>
      <td>Public Health Safety</td>
      <td>9/16/25</td>
    </tr>
    <tr>
      <th scope="row">94-B</th>
      <td>
        Motion by Councilor Ferreira to look at updating the standards of Ch. 250 article VI of the
        Haverhill Zoning Code regarding water use restrictions established in 2016
      </td>
      <td>Planning &amp; Development</td>
      <td>9/16/25</td>
    </tr>
    <tr>
      <th scope="row">33-T</th>
      <td>
        Motion by Councilor Lewandowski to establish a working group previously discussed to
        implement a control management plan for the vegetation in Riverside Park/Edible Avenue along
        the river
      </td>
      <td>NRPP</td>
      <td>9/30/25</td>
    </tr>
    <tr>
      <th scope="row">33-Z</th>
      <td>
        Motion by Councilor Michitson to look at pedestrian safety in Haverhill for further
        discussion
      </td>
      <td>Planning &amp; Development</td>
      <td>12/9/25</td>
    </tr>
    <tr>
      <th scope="row">85-E</th>
      <td>
        Motion by Councilor Michitson to send Judi Barrett&rsquo;s progress report on the fiscal
        impact analysis prepared for Council for further discussion
      </td>
      <td>Planning &amp; Development</td>
      <td>12/9/25</td>
    </tr>
    <tr>
      <th scope="row">111-D</th>
      <td>
        Motion by Councilor Lewandowski to look at private wells in new developments over 10 units
        for further review
      </td>
      <td>Planning &amp; Development</td>
      <td>12/16/25</td>
    </tr>
  </tbody>
</table>

<p>Updated December 17, 2025</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Documents Referred to Committee Study, updated December 17, 2025<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

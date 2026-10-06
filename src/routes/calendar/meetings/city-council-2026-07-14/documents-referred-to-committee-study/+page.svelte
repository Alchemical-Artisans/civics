<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-07-14"
  const ITEM = "documents-referred-to-committee-study"
</script>

<!-- The clerk prints this across two pages, the second with its own heading row
     and each footed "Updated: July 8, 2026"; it is one list, so it is one
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
      <td
        >Motion by Councilor Michitson to send the Home Rule Petition &ndash; <em
          >An Act Establishing Guidelines for the Installation and Use of Electric Vehicle Charging
          Stations in the City of Haverhill</em
        > to committee in order to coordinate with condominium associations.</td
      >
      <td>A&amp;F</td>
      <td>12/23/23</td>
    </tr>
    <tr>
      <th scope="row">40</th>
      <td
        >Motion by Councilor Lewandowski to send updated <em
          >Cannabis Social Equity Best Practices</em
        > for the Cannabis Control Commission to A&amp;F for further review.</td
      >
      <td>A&amp;F</td>
      <td>4/2/24</td>
    </tr>
    <tr>
      <th scope="row">12-S</th>
      <td
        >Motion by Councilor Ferreira to send the City&rsquo;s Swimming Ordinance (Chapter 193,
        Article III) and related items at Lake Saltonstall (Plug Pond) to NRPP for further
        discussion.</td
      >
      <td>NRPP</td>
      <td>6/18/24</td>
    </tr>
    <tr>
      <th scope="row">33-F</th>
      <td
        >Motion by Councilor Basiliere to send resident winter parking concerns and offer
        suggestions for improvements to the Public Health &amp; Safety Committee.</td
      >
      <td>Public Health &amp; Safety</td>
      <td>3/11/25</td>
    </tr>
    <tr>
      <th scope="row">33-L</th>
      <td
        >Motion by Councilor Lewandowski to send Bill 3360 (vacancy tax on residential properties)
        for review, along with further review of the Massachusetts Vacant Storefront Program (MVSP).</td
      >
      <td>Planning &amp; Development</td>
      <td>6/24/25</td>
    </tr>
    <tr>
      <th scope="row">33-P</th>
      <td
        >Motion by Councilor Ferreira to send for review the City&rsquo;s local strategies regarding
        traffic and safety, including evaluation of intersections at Amesbury Line Road and Merrimac
        Road for public safety improvements.</td
      >
      <td>Public Health &amp; Safety</td>
      <td>9/16/25</td>
    </tr>
    <tr>
      <th scope="row">94-B</th>
      <td
        >Motion by Councilor Ferreira to review and update standards of Chapter 250, Article VI of
        the Haverhill Zoning Code regarding water use restrictions established in 2016.</td
      >
      <td>Planning &amp; Development</td>
      <td>9/16/25</td>
    </tr>
    <tr>
      <th scope="row">33-T</th>
      <td
        >Motion by Councilor Lewandowski to establish a working group, as previously discussed, to
        implement a control management plan for vegetation in Riverside Park / Edible Avenue along
        the river.</td
      >
      <td>NRPP</td>
      <td>9/30/25</td>
    </tr>
    <tr>
      <th scope="row">85-E</th>
      <td
        >Motion by Councilor Michitson to send Judi Barrett&rsquo;s progress report on the fiscal
        impact analysis prepared for the Council for further discussion.</td
      >
      <td>Planning &amp; Development</td>
      <td>12/9/25</td>
    </tr>
    <tr>
      <th scope="row">1-F</th>
      <td
        >Motion by Councilor Lewandowski to send for discussion the establishment or formalization
        of an ordinance regarding a water conservation program.</td
      >
      <td>Planning &amp; Development</td>
      <td>1/27/26</td>
    </tr>
    <tr>
      <th scope="row">1-Q / 1-QQ</th>
      <td
        >Motion by Councilor Lewandowski to send for further discussion amendments to Chapter 216
        &ndash; Snow and Ice Removal, including changes to Sections 1-16, Article 1, Chapter 1
        (General Provisions), to increase fines for violations.</td
      >
      <td>Public Health &amp; Safety</td>
      <td>3/17/26</td>
    </tr>
    <tr>
      <th scope="row">21-B</th>
      <td
        >Motion by Councilor Sullivan to send for further discussion Chapter 255-Zoning Ordinance
        and Zoning Map &ndash; Battery Energy Storage Systems Overlay District (BESS)</td
      >
      <td>Planning &amp; Development</td>
      <td>5/19/26</td>
    </tr>
    <tr>
      <th scope="row">32-C</th>
      <td>Motion by Councilor McGonagle to send for further discussion fixed vendor locations</td>
      <td>NRPP</td>
      <td>6/16/26</td>
    </tr>
    <tr>
      <th scope="row">33-F</th>
      <td
        >Motion by Councilor Lewandowski to refer matter of e-bike safety for further review and
        discussion</td
      >
      <td>Public Safety</td>
      <td>6/30/26</td>
    </tr>
  </tbody>
</table>

<p>Updated: July 8, 2026</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Documents Referred to Committee Study, updated July 8, 2026<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>

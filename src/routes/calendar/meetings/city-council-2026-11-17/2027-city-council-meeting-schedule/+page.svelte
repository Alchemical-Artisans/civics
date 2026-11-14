<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "2027-city-council-meeting-schedule"
</script>

<p>President Jordan wishes to announce the 2027 City Council meeting schedule</p>

<hr />

<h2>City Council Meeting Schedule, Calendar Year 2027</h2>

<p><em>7:00 PM Council Chambers Room 202</em></p>

<table>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Dates</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">JANUARY</th><td>5, 12, 26</td></tr>
    <tr><th scope="row">FEBRUARY</th><td>2, 9, 23</td></tr>
    <tr><th scope="row">MARCH</th><td>2, 9, 16, 23, 30</td></tr>
    <tr><th scope="row">APRIL</th><td>6, 13, 27</td></tr>
    <tr><th scope="row">MAY</th><td>4, 11, 18, 25</td></tr>
    <tr><th scope="row">JUNE</th><td>15, 29</td></tr>
    <tr><th scope="row">JULY</th><td>13, 27</td></tr>
    <tr><th scope="row">AUGUST</th><td>10, 24</td></tr>
    <tr><th scope="row">SEPTEMBER</th><td>14, 21, 28</td></tr>
    <tr><th scope="row">OCTOBER</th><td>5, 19, 26</td></tr>
    <tr><th scope="row">NOVEMBER</th><td>16, 30</td></tr>
    <tr><th scope="row">DECEMBER</th><td>7, 14</td></tr>
  </tbody>
</table>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/presidents-letter`)} target="_blank" rel="noopener">
      Letter from President Timothy J. Jordan, November 12, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/schedule`)} target="_blank" rel="noopener">
      City Council Meeting Schedule, Calendar Year 2027<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

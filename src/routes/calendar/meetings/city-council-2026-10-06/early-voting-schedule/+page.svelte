<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "early-voting-schedule"
</script>

<p>
  Kaitlin M. Wright Esposito, <em>City Clerk</em>, requests to announce Early Voting schedule and
  pertinent election-related deadlines for the upcoming State Election to be held on Tuesday,
  November 3, 2026, from 7 AM to 8 PM
</p>

<hr />

<!-- The Clerk's letter is the item, and the hours are a table in it, so they
     are transcribed rather than left inside a scan. The letter prints the two
     weeks side by side in two columns; they are one run of days, so they are
     one column of rows here. -->

<p>
  I would like to provide pertinent information to you and the voters of Haverhill regarding
  important election opportunities and deadlines for the upcoming State Election.
</p>

<p>
  Early voting will take place in the Early Voting Room, located on the basement level of City Hall,
  during the following dates and times:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Day</th>
      <th scope="col">Hours</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Saturday, October 17</th><td>9:00 AM to 3:00 PM</td></tr>
    <tr><th scope="row">Sunday, October 18</th><td>9:00 AM &ndash; 3:00 PM</td></tr>
    <tr><th scope="row">Monday, October 19</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
    <tr><th scope="row">Tuesday, October 20</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
    <tr><th scope="row">Wednesday, October 21</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
    <tr><th scope="row">Thursday, October 22</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
    <tr><th scope="row">Friday, October 23</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
    <tr><th scope="row">Saturday, October 24</th><td>9:00 AM to 5:00 PM</td></tr>
    <tr><th scope="row">Sunday, October 25</th><td>9:00 AM &ndash; 3:00 PM</td></tr>
    <tr><th scope="row">Monday, October 26</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
    <tr><th scope="row">Tuesday, October 27</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
    <tr><th scope="row">Wednesday, October 28</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
    <tr><th scope="row">Thursday, October 29</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
    <tr><th scope="row">Friday, October 30</th><td>8:00 AM &ndash; 4:00 PM</td></tr>
  </tbody>
</table>

<p>
  Voters who are unable to participate during these hours are encouraged to vote on
  <strong>Election Day, Tuesday, November 3</strong>, between <strong>7:00 AM and 8:00 PM</strong>,
  or to request a vote-by-mail ballot. Please note that
  <strong>
    vote-by-mail applications must be received no later than 5:00 PM on Tuesday, October 27.
  </strong>
</p>

<p>
  Voters choosing to vote by mail are strongly encouraged to return their ballot using the secure
  election drop box located on the Main Street side of City Hall, to ensure timely receipt.
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/clerks-letter`)} target="_blank" rel="noopener">
      Letter from Kaitlin M. Wright Esposito, City Clerk, September 23, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/poll-workers`)} target="_blank" rel="noopener">
      &ldquo;Poll Workers Power Democracy!&rdquo;, the Clerk&rsquo;s call for poll workers<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

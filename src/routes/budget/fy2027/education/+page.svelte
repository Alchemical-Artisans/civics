<script lang="ts">
  // A script here for the two parts of the book this page covers that nobody
  // has transcribed; see this page's `+page.ts` and docs/budget-pages.md.
  let { data } = $props()
</script>

<!-- The page the book prints under this name. The other two sections it covers
     are below, as links into the city's file. -->
<h2>Net School Spending</h2>

<p>
  <em>
    Net School Spending (NSS) in Massachusetts is the minimum legal, annual funding level for school
    districts, established by the state's Chapter 70 program to ensure an adequate education. It
    comprises state Chapter 70 aid and required local property tax contributions, acting as a
    mandatory floor&mdash;not a ceiling&mdash;for school budgets.
  </em>
</p>

<blockquote>
  <p>
    <em>
      "Long-term budget projections indicate that the city will continue to exceed Net School
      Spending Requirements by several million dollars annually."
    </em>
  </p>
</blockquote>

<p>
  <em>
    Chapter 70 state funding has increased in recent years due to the implementation of the Student
    Opportunity Act (SOA), which significantly revised the state formula to better address student
    needs by increasing funding for low-income students, English Language Learners, special
    education, and other high-need areas. Haverhill's Chapter 70 funding has increased from $63.3M
    in 2021 to a proposed $96.4M in 2027.
  </em>
</p>

<p>
  <em>
    The City's direct contribution to the School Department has been budgeted to increase by 2.5%
    annually, consistent with the rate used for all city departments. This is lower than the desired
    budgetary increase and reflects budget pressure from revenue estimates that are not keeping pace
    with inflation, as well as high health insurance, energy, and operating costs.
  </em>
</p>

<p>
  <em>
    The City's Indirect Contribution to the School Department has increased on average 7.2% per year
    from 2024 to 2026, rising from $32.7M in 2024 to $37.4M in 2026. Indirect Contributions include
    employee benefits, administrative support, snow removal, and facility usage at City Hall.
  </em>
</p>

<blockquote>
  <p>
    <em>
      "It is important to note that Indirect costs do not include debt service payments made by the
      General Fund, which will total $5,865,903 in 2027 and represent outstanding School Department
      debt of $71,517,300."
    </em>
  </p>
</blockquote>

<h2>Historical &amp; Projected Net School Spending</h2>

<!--
  The charter tuition row's label is clipped by its own cell in the book, which
  prints "Less Charter Tuition Reimbursem"; the word it runs out of room for is
  written out here.
-->
<table>
  <thead>
    <tr>
      <th scope="col">Net School Spending</th>
      <th scope="col">2024</th>
      <th scope="col">2025</th>
      <th scope="col">2026</th>
      <th scope="col">2027</th>
      <th scope="col">2028</th>
      <th scope="col">2029</th>
      <th scope="col">2030</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Chapter 70</th>
      <td>$82,633,811</td>
      <td>$87,968,052</td>
      <td>$94,219,635</td>
      <td>$96,427,042</td>
      <td>$98,355,583</td>
      <td>$100,322,694</td>
      <td>$102,329,148</td>
    </tr>
    <tr>
      <th scope="row">City Direct Contribution</th>
      <td>$36,548,274</td>
      <td>$38,616,610</td>
      <td>$39,582,025</td>
      <td>$40,571,576</td>
      <td>$41,585,865</td>
      <td>$42,625,512</td>
      <td>$43,691,150</td>
    </tr>
    <tr>
      <th scope="row">City Indirect Contribution</th>
      <td>$32,723,674</td>
      <td>$33,937,540</td>
      <td>$37,442,505</td>
      <td>$40,694,090</td>
      <td>$42,728,795</td>
      <td>$44,865,234</td>
      <td>$47,108,496</td>
    </tr>
    <tr>
      <th scope="row">Less Transportation</th>
      <td>$(7,600,000)</td>
      <td>$(6,646,810)</td>
      <td>$(8,651,163)</td>
      <td>$(9,429,767)</td>
      <td>$(9,712,660)</td>
      <td>$(10,004,040)</td>
      <td>$(10,304,161)</td>
    </tr>
    <tr>
      <th scope="row">Less Charter Tuition Reimbursement</th>
      <td>$(1,377,211)</td>
      <td>$(1,345,511)</td>
      <td>$(787,542)</td>
      <td>$(942,297)</td>
      <td>$(970,566)</td>
      <td>$(999,683)</td>
      <td>$(1,029,673)</td>
    </tr>
    <tr>
      <th scope="row">Total NSS Contribution</th>
      <td>$142,928,548</td>
      <td>$152,529,881</td>
      <td>$161,805,460</td>
      <td>$167,320,644</td>
      <td>$171,987,017</td>
      <td>$176,809,718</td>
      <td>$181,794,960</td>
    </tr>
    <tr>
      <th scope="row">Required Net School Spending</th>
      <td>$132,551,888</td>
      <td>$140,785,594</td>
      <td>$149,713,125</td>
      <td>$154,969,204</td>
      <td>$161,167,972</td>
      <td>$167,614,691</td>
      <td>$174,319,279</td>
    </tr>
    <tr>
      <th scope="row">Over / (Under) NSS</th>
      <td>$10,376,660</td>
      <td>$11,744,287</td>
      <td>$12,092,335</td>
      <td>$12,351,440</td>
      <td>$10,819,045</td>
      <td>$9,195,027</td>
      <td>$7,475,681</td>
    </tr>
  </tbody>
</table>

<p>Projection assumes the following annual increases:</p>

<ul>
  <li>Chapter 70 - 2%</li>
  <li>City Direct Contribution - 2.5%</li>
  <li>City Indirect Contribution - 5%</li>
  <li>Transportation - 3%</li>
  <li>Charter Tuition - 3%</li>
  <li>Required NSS - 4%</li>
</ul>

<!-- Ours, not the book's: it heads the two sections of the book this page
     covers and nobody has transcribed. They open the city's own file at the
     page the book gives them, which is what a contents line does for any
     section with no page here. -->
<h2>Elsewhere in the book</h2>

<ul>
  {#each data.elsewhere as part (part.title)}
    <li>
      <a href={part.href} target="_blank" rel="external noopener noreferrer">
        {part.title}<span class="sr-only">, in the city's PDF, opens in a new tab</span>
      </a>
    </li>
  {/each}
</ul>

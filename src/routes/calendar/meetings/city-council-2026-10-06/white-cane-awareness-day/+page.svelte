<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "white-cane-awareness-day"
</script>

<p>
  Mayor Barrett requests to present a proclamation recognizing October 15<sup>th</sup>, 2026, as
  White Cane Awareness Day in the City of Haverhill
</p>

<hr />

<!-- The proclamation itself, which is what the Mayor is asking to present. -->

<h2>City Of Haverhill Proclamation</h2>

<p>
  <strong><em>WHEREAS,</em></strong> The white cane, which every blind citizen of Haverhill and the Commonwealth
  has the right to carry, demonstrates and symbolizes the ability to achieve a full and independent life
  and the capacity to work productively in competitive employment; and
</p>

<p>
  <strong><em>WHEREAS,</em></strong> The white cane, allows every blind person to move freely and safely
  from place to place, making it possible for the blind to fully participate in and contribute to our
  society and to live the lives they want; and
</p>

<p>
  <strong><em>WHEREAS,</em></strong> Every citizen should be aware that the law requires that motorists
  and cyclists exercise appropriate caution when approaching a blind person carrying a white cane; and
</p>

<p>
  <strong><em>WHEREAS,</em></strong> Massachusetts law also calls upon employers, both public and private,
  to be aware of and utilize the employment skills of our blind citizens by recognizing their worth as
  individuals and their productive capacities; and
</p>

<p>
  NOW THEREFORE, I, MELINDA E. BARRETT, MAYOR of the City of Haverhill, do hereby proclaim October
  15, 2026, as
</p>

<p><strong>WHITE CANE AWARENESS DAY</strong></p>

<p>
  I call upon our schools, colleges, and universities to offer opportunities for learning and
  training to blind persons; upon employers and the public to utilize the available skills of
  competent blind persons and to be open to offering new opportunities to the blind in our rapidly
  changing society; and upon all citizens to recognize the white cane as a tool of independence for
  blind pedestrians on our streets and highways.
</p>

<p>
  <em>
    IN WITNESS WHEREOF I have hereunto set my hand and caused the Seal of the City of Haverhill to
    be affixed this 6<sup>th</sup> day of October in the Year of Our Lord, Two Thousand and Twenty-Six.
  </em>
</p>

<p>MAYOR MELINDA E. BARRETT</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 2, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/proclamation`)} target="_blank" rel="noopener">
      The proclamation as signed<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

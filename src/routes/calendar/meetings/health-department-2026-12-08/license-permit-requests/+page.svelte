<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
</script>

<!-- Every address but 52 Center St. resolved to its own building on
     Nominatim; that one turned up nothing at all, so it has no map. -->

<p>LICENSE/PERMIT REQUESTS:</p>

<ol type="a">
  <li>
    <p>Horse Stabling Permit request for Nancy Langevin - 75 Vale St - one horse.</p>
    <AddressMap address="75 Vale St, Haverhill, MA" lat={42.8017725} lon={-71.1277974} />
  </li>
  <li>
    <p>
      Keeping of Domestic Animals Permit request for Makayla Nolan - 449 Amesbury Rd - currently has
      departmental approval for 6 chickens - applicant wants to add 3 additional chickens and 1
      rooster.
    </p>
    <AddressMap address="449 Amesbury Rd, Haverhill, MA" lat={42.805752} lon={-71.0480532} />
  </li>
  <li>
    <p>
      Keeping of Domestic Animals Permit request for Nancy Bowes - 52 Center St. - to keep 9 Indian
      Fantail Pigeons.
    </p>
  </li>
  <li>
    <p>
      Keeping of Domestic Animals Permit request for Andriano Cataluna - 21 Greenlawn Ave -
      currently has departmental approval for 6 chickens - applicant wants to add 2 additional
      chickens, 2 geese and 1 turkey.
    </p>
    <AddressMap address="21 Greenlawn Ave, Haverhill, MA" lat={42.7714603} lon={-71.1062456} />
  </li>
  <li>
    <p>
      Keeping of Domestic Animals Permit request for John Joyce - 327 Lake St.- currently has
      departmental approval for 6 chickens applicant wants to add 6 additional chickens.
    </p>
    <AddressMap address="327 Lake St, Haverhill, MA" lat={42.7893067} lon={-71.1379108} />
  </li>
  <li>
    <p>
      Keeping of Domestic Animals Permit request for Michael Schroeder - 28 Forest St - to keep 12
      chickens. Applicant also requests a waiver from the 5&prime; setback requirement for the
      chicken coop. The coop is currently 1.5&prime; from the property line.
    </p>
    <AddressMap address="28 Forest St, Haverhill, MA" lat={42.7764073} lon={-71.1294495} />
  </li>
  <li>
    <p>
      Keeping of Domestic Animals Permit request for Steve Grasso - 50 Sun Valley Dr. - to keep 2
      goats, 10 hens, 2 roosters and 2 Guinea hens.
    </p>
    <AddressMap address="50 Sun Valley Dr, Haverhill, MA" lat={42.7452893} lon={-71.0524093} />
  </li>
</ol>

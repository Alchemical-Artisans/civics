<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "school-committee-2026-10-22"
  const ITEM = "secure-firearm-storage-communications"

  /** `Router.excerpt`'s second argument for one document in this item's packet. */
  const excerpt = (document: string) => Router.excerpt(MEETING, `${ITEM}/${document}`)
</script>

<p>
  Dr. Grannemann &amp; Ms. Collins: Request the Diversity, Health, and Safety Subcommittee to
  develop recommendations for policy and/or directives for communications to families on secure
  firearm storage.
</p>

<h2>Safe Gun Storage Packet</h2>

<ul>
  <li>
    <a href={excerpt("masc-draft-resolution")} target="_blank" rel="noopener">
      MASC draft resolution 2023<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={excerpt("gun-safety-and-your-health")} target="_blank" rel="noopener">
      Gun Safety and Your Health<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={excerpt("ask-me-safe-gun-storage")} target="_blank" rel="noopener">
      Ask Me Safe Gun Storage &ndash; English<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={excerpt("school-committee-reaffirms-support")} target="_blank" rel="noopener">
      School Committee reaffirms support<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={excerpt("massachusetts-law-on-safe-gun-storage")} target="_blank" rel="noopener">
      Massachusetts Law on safe gun storage<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={excerpt("who-owns-guns-in-adolescent-suicides")} target="_blank" rel="noopener">
      National Institutes of Health: Who owns guns in adolescent suicides?<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={excerpt("child-and-adolescent-firearm-deaths")} target="_blank" rel="noopener">
      Child and Adolescent Firearm deaths &ndash; KFF<span class="sr-only">
        , PDF, eleven pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={excerpt("cbs-news-on-oregon-shooting")} target="_blank" rel="noopener">
      CBS News on Oct 17 2026 Oregon shooting<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<h2>Resolutions on Student Safety</h2>

<h3>Resolution 3: Safe Storage of Firearms</h3>

<p><em>(Sponsored by the Framingham School Committee)</em></p>

<p>
  WHEREAS safety and well-being of our students, teachers, and staff is a top priority in schools
  and keeping them safe from the threat of gun violence should be the responsibility of all adult
  stakeholders at each of our school sites; and
</p>

<p>
  WHEREAS in the United States, gun violence is the leading cause of death in children and teens<sup
    >1</sup
  >, and
</p>

<p>
  WHEREAS approximately 1200 children and teens die by gun suicide each year, and over 80 percent of
  children under age 18 who died by firearm suicide used a gun belonging to a family member, and
</p>

<p>
  WHEREAS in incidents of gun violence on school grounds, up to 80 percent of shooters under the age
  of 18 obtained their guns from their own home or that of relatives or friends<sup>3</sup>; and
</p>

<p>
  WHEREAS an estimated 4.6 million American children live in households with at least one loaded,
  unlocked firearm2 and every year<sup>2</sup>; and
</p>

<p>
  WHEREAS research shows that secure firearm storage practices are associated with up to a 78
  percent reduction in the risk of self-inflicted firearm injuries and up to an 85 percent reduction
  in the risk of unintentional firearm injuries among children and teens<sup>7</sup>; and
</p>

<p>
  WHEREAS evidence strongly suggests that secure firearm storage is an essential component to any
  effective strategy to keep schools and students safe<sup>6</sup>;
</p>

<p>
  WHEREAS the US Secret Service National Threat Assessment Center recommends the importance of
  appropriate storage of weapons because many school attackers used firearms acquired from their
  homes; and
</p>

<p>
  WHEREAS, across the country, lawmakers, community members and local leaders are working together
  to implement public awareness campaigns, such as the Be SMART Program, which is endorsed by the
  National PTA and encourages secure gun storage practices and highlights the public safety risks of
  unsecured guns; and
</p>

<p>
  WHEREAS secure storage of firearms is a legal requirement in Massachusetts pursuant to G.L.
  Chapter 140, sections 131L and 131C, and failure to comply with secure storage laws can lead to
  criminal prosecution, jail time, fines, and/or revocation of FID card or license, depending on the
  offence; and
</p>

<p>
  WHEREAS the American Academy of Pediatrics recommends storing firearms unloaded and locked, with
  ammunition locked separately to reduce risks of injury to children;<sup>9</sup>
</p>

<p>
  WHEREAS in order to continue with preventive measures to increase student and school safety we
  must act now.
</p>

<p>
  THEREFORE BE IT RESOLVED that MASC recommends all districts direct their Superintendent and staff
  to create an appropriate communication to parents and guardians that explains the importance of
  secure firearm storage to protect children and teens from unauthorized access to unsecured
  firearms, and their legal obligations consistent with Massachusetts safe storage law.
</p>

<p>
  FURTHERMORE BE IT RESOLVED that MASC urges other communities to work with their local law
  enforcement agencies, health agencies and non-profit organizations to collaborate and increase
  efforts to inform District parents and guardians of their obligations regarding secure storage of
  firearms in their homes and vehicles.
</p>

<h4>References:</h4>

<ol>
  <li>
    Centers for Disease Control and Prevention, National Center for Health Statistics. WONDER Online
    Database, Underlying Cause of Death, Injury Mechanism &amp; All Other Leading Causes. Data from
    2020. Analysis includes children and teens aged 1 to 19.
  </li>
  <li>
    Matthew Miller and Deborah Azrael, &ldquo;Firearm Storage in US Households with Children:
    Findings from the 2021 National Firearm Survey,&rdquo; JAMA Network Open 5, no. 2 (2022):
    e2148823, https://doi.org/10.1001/jamanetworkopen.2021.48823
  </li>
  <li>
    Everytown for Gun Safety. #NotAnAccident Index. 2020.
    https://everytownresearch.org/maps/notanaccident/ Analysis includes incidents that occurred
    between 2015 and 2019.
  </li>
  <li>
    Everytown for Gun Safety. #NotAnAccident Index. 2020.
    https://everytownresearch.org/maps/notanaccident/. Analysis includes homes of the shooter, the
    victim, relatives&rsquo; homes, friends&rsquo; homes, and &ldquo;other&rdquo; homes.
  </li>
  <li>
    &ldquo;Centers for Disease Control and Prevention, National Center for Health Statistics. WONDER
    Online Database, Underlying Cause of Death. A yearly average was developed using five years of
    the most recent available data: 2016 to 2020. Children and teens aged 0 to 19.
  </li>
  <li>
    Johnson RM, Barber C, Azrael D, Clark DE, Hemenway D. Who are the owners of firearms used in
    adolescent suicides? Suicide and Life-Threatening Behavior. 2010;40(6):609-611. Study defined
    children as under the age of 18.
  </li>
  <li>
    Everytown for Gun Safety Support Fund, American Federation of Teachers, and National Education
    Association, &ldquo;Keeping Our Schools Safe: A Plan for Preventing Mass Shootings and Ending
    All Gun Violence in American Schools,&rdquo; 2020.
    https://everytownresearch.org/report/preventing-gunviolence-in-american-schools/
  </li>
  <li>
    Grossman DC, Mueller BA, Riedy C, et al. Gun storage practices and risk of youth suicide and
    unintentional injuries. JAMA. 2005; 293(6):707-714.
  </li>
  <li>
    M.J. Bull, et al., &ldquo;Firearm-related Injuries Affecting the Pediatric Population,&rdquo;
    Pediatrics 105, no. 4 (2000): 888-895.
  </li>
</ol>

<hr />

<ul>
  <li>
    <a href={excerpt("packet-contents")} target="_blank" rel="noopener">
      Safe Gun Storage Packet, contents<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXX/Chapter140/Section131L"
      target="_blank"
      rel="external noopener noreferrer"
    >
      G.L. c. 140, &sect; 131L, on the Legislature&rsquo;s own site<span class="sr-only">
        , opens in a new tab</span
      >
    </a>
  </li>
</ul>

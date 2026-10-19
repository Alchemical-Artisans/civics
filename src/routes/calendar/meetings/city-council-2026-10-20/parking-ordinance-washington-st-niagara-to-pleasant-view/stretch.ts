import type { LonLat } from "$lib/map"

/**
 * Washington Street from Niagara Street to Pleasant View Avenue: the stretch
 * the ordinance bans parking on, as OpenStreetMap draws the street.
 *
 * An ordinance that names two cross streets names a run of road, and nothing
 * on this site could draw one until the election's map learnt to. A point
 * would be a claim the ordinance does not make -- which is why this page
 * carried no map at all -- and a hand-drawn line between the two junctions
 * would cut the corner the street actually takes.
 *
 * So it is the street's own line, taken once by hand the way an address's
 * point is (docs/document-pages.md): Overpass for the ways named Washington
 * Street, Niagara Street and Pleasant View Avenue inside Haverhill, the one
 * node Washington shares with each of the other two, and the chain of
 * Washington's own nodes between them -- 22 points over about 420 metres,
 * north from Niagara. The data is OpenStreetMap's, under the ODbL, and the
 * map credits it.
 */
export const STRETCH: LonLat[] = [
  [-71.104605, 42.76726],
  [-71.104703, 42.76737],
  [-71.104731, 42.767386],
  [-71.104752, 42.767589],
  [-71.104722, 42.767763],
  [-71.104636, 42.768014],
  [-71.104627, 42.768033],
  [-71.104556, 42.76819],
  [-71.104456, 42.768414],
  [-71.104354, 42.768674],
  [-71.104242, 42.768942],
  [-71.104186, 42.76915],
  [-71.104179, 42.769315],
  [-71.104178, 42.769333],
  [-71.104209, 42.76945],
  [-71.104318, 42.769831],
  [-71.10447, 42.770319],
  [-71.10451, 42.770475],
  [-71.104515, 42.770494],
  [-71.104517, 42.770504],
  [-71.10453, 42.770559],
  [-71.104614, 42.770916],
]

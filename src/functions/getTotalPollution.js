import { expandCoordinates } from "./expandCoordinates";

export function getTotalPollution(lat, lon, data, radiusKm = 5) {

  const { north, south, east, west } = expandCoordinates(lat, lon, radiusKm);

  const inside = data.filter(f =>
    parseFloat(f.Latitude)  >= south &&
    parseFloat(f.Latitude)  <= north &&
    parseFloat(f.Longitude) >= west  &&
    parseFloat(f.Longitude) <= east
  );

  const total = inside.reduce((sum, f) => {
    const val = parseFloat(f.Releases);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return total;
}
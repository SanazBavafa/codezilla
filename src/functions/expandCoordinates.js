/**
 * Expands a coordinate point by a given distance in all 4 directions.
 * Returns a bounding box (NW, NE, SW, SE corners) + center.
 *
 * @param {number} lat       - center latitude
 * @param {number} lon       - center longitude
 * @param {number} radiusKm  - distance in kilometers (default: 20)
 * @returns {object} boundingBox with 4 corners + center
 */
export function expandCoordinates(lat, lon, radiusKm = 500) {
  const EARTH_RADIUS_KM = 6371;

  // Convert km offset to degrees
  const deltaLat = (radiusKm / EARTH_RADIUS_KM) * (180 / Math.PI);
  const deltaLon = (radiusKm / (EARTH_RADIUS_KM * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);

  return {
    center: { lat, lon },
    north:  lat + deltaLat,
    south:  lat - deltaLat,
    east:   lon + deltaLon,
    west:   lon - deltaLon,
    // Ready-to-use bounding box [minLon, minLat, maxLon, maxLat]
    bbox:   [lon - deltaLon, lat - deltaLat, lon + deltaLon, lat + deltaLat],
  };
}
export function getDistanceKm(latA, lonA, latB, lonB) {
  const earthRadiusKm = 6371
  const deltaLat = ((latB - latA) * Math.PI) / 180
  const deltaLon = ((lonB - lonA) * Math.PI) / 180
  const latARad = (latA * Math.PI) / 180
  const latBRad = (latB * Math.PI) / 180

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.sin(deltaLon / 2) ** 2 * Math.cos(latARad) * Math.cos(latBRad)

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine))
}
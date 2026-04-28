import { expandCoordinates } from './expandCoordinates'
import { getDistanceKm } from './getDistanceKm'

export function getTotalPollution(lat, lon, data, radiusKm = 5) {

  const { north, south, east, west } = expandCoordinates(lat, lon, radiusKm)

  const inside = data.filter((facility) => {
    const latitude = Number(facility.Latitude)
    const longitude = Number(facility.Longitude)

    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= south &&
      latitude <= north &&
      longitude >= west &&
      longitude <= east &&
      getDistanceKm(lat, lon, latitude, longitude) <= radiusKm
    )
  })

  const total = inside.reduce((sum, facility) => {
    const releaseValue = Number(facility.Releases)
    return sum + (Number.isFinite(releaseValue) ? releaseValue : 0)
  }, 0);

  return total
}
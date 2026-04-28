import { expandCoordinates } from './expandCoordinates'
import { getDistanceKm } from './getDistanceKm'

export function filterPollutionDataByCoordinates(lat, lon, data, radiusKm = 5) {
  const { north, south, east, west } = expandCoordinates(lat, lon, radiusKm)

  return data.filter((row) => {
    const latitude = Number(row.Latitude)
    const longitude = Number(row.Longitude)

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
}
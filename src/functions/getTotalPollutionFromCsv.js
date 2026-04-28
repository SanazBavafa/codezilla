import { loadPollutionCsv } from './loadPollutionCsv'
import { getTotalPollution } from './getTotalPollution'

export async function getTotalPollutionFromCsv(lat, lon, radiusKm = 5, csvUrl) {
  const data = await loadPollutionCsv(csvUrl)

  return getTotalPollution(lat, lon, data, radiusKm)
}
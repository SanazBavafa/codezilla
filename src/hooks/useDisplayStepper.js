import { useCallback, useEffect, useState } from 'react'
import { filterPollutionDataByCoordinates } from '../functions/filterPollutionDataByCoordinates'
import { loadPollutionCsv } from '../functions/loadPollutionCsv'
import { getLatestYearRows, summarizeReleaseRows } from '../functions/summarizeReleaseRows'
import { fetchAirQualityFromCoordinates } from '../Fetch/fetchAirQualityFromCoordinates'

export function useDisplayStepper() {
  const [active, setActive] = useState(0)
  const [coordinates, setCoordinates] = useState(null)
  const [mapImage, setMapImage] = useState(null)
  const [mapFacilities, setMapFacilities] = useState([])
  const [releaseSummaries, setReleaseSummaries] = useState({ air: null, water: null, airquality: null })
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(false)
  const [radiusKm, setRadiusKm] = useState(20)

  const handleCoordinatesFound = useCallback((coords) => {
    setCoordinates(coords)
    setActive(1)
  }, [])

  const handleMapImageCaptured = useCallback((image) => {
    setMapImage(image)
  }, [])

  const goToStep = useCallback((step) => {
    setActive(step)
  }, [])

  useEffect(() => {
    if (!coordinates) {
      return undefined
    }

    let isCancelled = false

    const loadAndFilterData = async () => {
      try {
        setIsLoadingSummaries(true)

        const [airRows, waterRows] = await Promise.all([
          loadPollutionCsv('/Data/F1_4_Air_Releases_Facilities_Nordics.csv'),
          loadPollutionCsv('/Data/F2_4_Water_Releases_Facilities_Nordics.csv'),
        ])

        const { latestYear: airLatestYear, rows: airLatestRows } = getLatestYearRows(airRows)
        const { latestYear: waterLatestYear, rows: waterLatestRows } = getLatestYearRows(waterRows)

        const filteredAirRows = filterPollutionDataByCoordinates(
          Number(coordinates.lat),
          Number(coordinates.lon),
          airLatestRows,
          radiusKm,
        )

        const filteredWaterRows = filterPollutionDataByCoordinates(
          Number(coordinates.lat),
          Number(coordinates.lon),
          waterLatestRows,
          radiusKm,
        )

        if (!isCancelled) {
          const airFacilities = filteredAirRows.map((row) => ({
            source: 'air',
            facilityName: row.facilityName ?? 'Air facility',
            city: row.city ?? '',
            latitude: Number(row.Latitude),
            longitude: Number(row.Longitude),
          }))

          const waterFacilities = filteredWaterRows.map((row) => ({
            source: 'water',
            facilityName: row.facilityName ?? 'Water facility',
            city: row.city ?? '',
            latitude: Number(row.Latitude),
            longitude: Number(row.Longitude),
          }))

          setReleaseSummaries({
            air: summarizeReleaseRows(filteredAirRows, { releaseType: 'AIR', latestYear: airLatestYear }),
            water: summarizeReleaseRows(filteredWaterRows, { releaseType: 'WATER', latestYear: waterLatestYear }),
            airquality: await fetchAirQualityFromCoordinates(Number(coordinates.lat), Number(coordinates.lon)),
          })
          setMapFacilities([...airFacilities, ...waterFacilities])
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error calculating release summaries:', error)
          setReleaseSummaries({ air: null, water: null })
          setMapFacilities([])
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSummaries(false)
        }
      }
    }

    loadAndFilterData()

    return () => {
      isCancelled = true
    }
  }, [coordinates, radiusKm])

  return {
    active,
    coordinates,
    mapImage,
    releaseSummaries,
    mapFacilities,
    isLoadingSummaries,
    radiusKm,
    handleCoordinatesFound,
    handleMapImageCaptured,
    goToStep,
    setCoordinates,
    setRadiusKm,
  }
}
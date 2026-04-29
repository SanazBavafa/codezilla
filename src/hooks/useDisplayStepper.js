import { useCallback, useEffect, useState } from 'react'
import { filterPollutionDataByCoordinates } from '../functions/filterPollutionDataByCoordinates'
import { loadPollutionCsv } from '../functions/loadPollutionCsv'
import { getLatestYearRows, summarizeReleaseRows } from '../functions/summarizeReleaseRows'
import { normalizeRowsToEvents } from '../functions/emissionAdapters'
import { scoreEmissions } from '../functions/scoreEmissions'

export function useDisplayStepper() {
  const [active, setActive] = useState(0)
  const [coordinates, setCoordinates] = useState(null)
  const [mapImage, setMapImage] = useState(null)
  const [releaseSummaries, setReleaseSummaries] = useState({ air: null, water: null })
  const [scoreSummaries, setScoreSummaries] = useState({ air: null, water: null })
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
          const airSummary = summarizeReleaseRows(filteredAirRows, { releaseType: 'AIR', latestYear: airLatestYear })
          const waterSummary = summarizeReleaseRows(filteredWaterRows, { releaseType: 'WATER', latestYear: waterLatestYear })

          setReleaseSummaries({ air: airSummary, water: waterSummary })

          // Score
          const airEvents = normalizeRowsToEvents(filteredAirRows, 'AIR')
          const waterEvents = normalizeRowsToEvents(filteredWaterRows, 'WATER')
          setScoreSummaries({
            air: scoreEmissions(airEvents),
            water: scoreEmissions(waterEvents),
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
    scoreSummaries,
    isLoadingSummaries,
    radiusKm,
    handleCoordinatesFound,
    handleMapImageCaptured,
    goToStep,
    setCoordinates,
    setRadiusKm,
  }
}
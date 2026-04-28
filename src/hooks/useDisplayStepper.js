import { useCallback, useEffect, useState } from 'react'
import { filterPollutionDataByCoordinates } from '../functions/filterPollutionDataByCoordinates'
import { loadPollutionCsv } from '../functions/loadPollutionCsv'

export function useDisplayStepper() {
  const [active, setActive] = useState(0)
  const [coordinates, setCoordinates] = useState(null)
  const [mapImage, setMapImage] = useState(null)
  const [pollutionTotal, setPollutionTotal] = useState(null)
  const [pollutionData, setPollutionData] = useState([])
  const radiusKm = 5

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
      setPollutionTotal(null)
      setPollutionData([])
      return undefined
    }

    let isCancelled = false

    const loadAndFilterData = async () => {
      try {
        const csvRows = await loadPollutionCsv()
        const filteredRows = filterPollutionDataByCoordinates(
          Number(coordinates.lat),
          Number(coordinates.lon),
          csvRows,
          radiusKm,
        )
        const total = filteredRows.reduce((sum, row) => {
          const releaseValue = Number(row.Releases)
          return sum + (Number.isFinite(releaseValue) ? releaseValue : 0)
        }, 0)

        if (!isCancelled) {
          setPollutionData(filteredRows)
          setPollutionTotal(total)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error calculating total pollution:', error)
          setPollutionTotal(null)
          setPollutionData([])
        }
      }
    }

    loadAndFilterData()

    return () => {
      isCancelled = true
    }
  }, [coordinates])

  return {
    active,
    coordinates,
    mapImage,
    pollutionTotal,
    pollutionData,
    radiusKm,
    handleCoordinatesFound,
    handleMapImageCaptured,
    goToStep,
    setCoordinates,
  }
}
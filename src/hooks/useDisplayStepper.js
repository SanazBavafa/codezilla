import { useCallback, useState } from 'react'

export function useDisplayStepper() {
  const [active, setActive] = useState(0)
  const [coordinates, setCoordinates] = useState(null)
  const [mapImage, setMapImage] = useState(null)

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

  return {
    active,
    coordinates,
    mapImage,
    handleCoordinatesFound,
    handleMapImageCaptured,
    goToStep,
    setCoordinates,
  }
}
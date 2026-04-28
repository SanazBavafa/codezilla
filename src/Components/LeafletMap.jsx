import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, Circle, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import marker from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
import { captureLeafletMapImage } from '../Utils/captureLeafletMapImage'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: shadow,
})

export default function LeafletMap({ coordinates, rangeKm = 5, onImageCaptured }) {
  const mapCaptureRef = useRef(null)

  useEffect(() => {
    if (!coordinates || !mapCaptureRef.current) {
      return undefined
    }

    let isCancelled = false

    const captureMapImage = async () => {
      if (isCancelled || !mapCaptureRef.current) {
        return
      }

      const imageUrl = await captureLeafletMapImage(mapCaptureRef.current)

      if (!imageUrl) {
        return
      }

      onImageCaptured?.(imageUrl)
    }

    captureMapImage().catch((error) => {
      console.error('Error capturing map image:', error)
    })

    return () => {
      isCancelled = true
    }
  }, [coordinates, rangeKm, onImageCaptured])

  if (!coordinates) {
    return null
  }

  const position = [Number(coordinates.lat), Number(coordinates.lon)]
  const radiusInMeters = Number(rangeKm || 0) * 1000

  return (
    <div style={{ marginTop: '1rem' }}>
      <div ref={mapCaptureRef} style={{ height: '480px', width: '100%' }}>
        <MapContainer key={position.join(',')} center={position} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            crossOrigin="anonymous"
          />
          <Marker position={position}>
            <Popup>
              <strong>Selected location</strong>
              <br />
              {coordinates.lat}, {coordinates.lon}
            </Popup>
          </Marker>
          <Circle
            center={position}
            radius={radiusInMeters}
            pathOptions={{ color: '#228be6', fillColor: '#74c0fc', fillOpacity: 0.2 }}
          />
        </MapContainer>
      </div>
    </div>
  )
}
import { useEffect, useRef, useState } from 'react'
import { Circle, CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
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

function getFacilityColor(source) {
  if (source === 'water') {
    return '#1098ad'
  }

  return '#e8590c'
}

export default function LeafletMap({ coordinates, rangeKm = 5, facilities = [], onImageCaptured }) {
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
  }, [coordinates, rangeKm, facilities, onImageCaptured])

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
          <CircleMarker
            center={position}
            radius={9}
            pathOptions={{
              color: '#1c7ed6',
              fillColor: '#4dabf7',
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Popup>
              <strong>Selected location</strong>
              <br />
              {coordinates.lat}, {coordinates.lon}
            </Popup>
          </CircleMarker>
          <Circle
            center={position}
            radius={radiusInMeters}
            pathOptions={{ color: '#228be6', fillColor: '#74c0fc', fillOpacity: 0.2 }}
          />
          {facilities
            .filter((facility) => Number.isFinite(facility.latitude) && Number.isFinite(facility.longitude))
            .map((facility, index) => (
              <CircleMarker
                key={`${facility.source}-${facility.facilityName}-${index}`}
                center={[facility.latitude, facility.longitude]}
                radius={5}
                pathOptions={{
                  color: getFacilityColor(facility.source),
                  fillColor: getFacilityColor(facility.source),
                  fillOpacity: 0.95,
                  weight: 2,
                }}
              >
                <Popup>
                  <strong>{facility.facilityName}</strong>
                  <br />
                  {facility.city || 'Unknown city'}
                  <br />
                  {facility.latitude}, {facility.longitude}
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>
      </div>
    </div>
  )
}
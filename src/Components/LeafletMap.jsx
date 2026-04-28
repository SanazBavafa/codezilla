import { MapContainer, Marker, Popup, Circle, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import marker from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: shadow,
})

export default function LeafletMap({ coordinates, rangeKm = 5 }) {
  if (!coordinates) {
    return null
  }

  const position = [Number(coordinates.lat), Number(coordinates.lon)]
  const radiusInMeters = Number(rangeKm || 0) * 1000

  return (
    <div style={{ height: '480px', width: '100%', marginTop: '1rem' }}>
      <MapContainer key={position.join(',')} center={position} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
  )
}
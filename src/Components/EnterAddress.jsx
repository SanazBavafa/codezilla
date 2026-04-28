import fetchCoordinatesFromAddress from '../Fetch/fetchCoordinatesFromAdress'
import { useState } from 'react'
import { Button, TextInput } from '@mantine/core'
import LeafletMap from './LeafletMap'

export default function EnterAddress({ onCoordinatesFound }) {
  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const coords = await fetchCoordinatesFromAddress(address)
      setCoordinates(coords)
      onCoordinatesFound?.(coords)
    } catch (error) {
      console.error('Error fetching coordinates:', error)
    }
    mapDisplay();
  }

  const mapDisplay = () => {
    if (!coordinates) return null
    return (
      <LeafletMap lat={coordinates.lat} lon={coordinates.lon} />
    )
  }

  console.log('EnterAddress rendered')

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address"
      />
      <Button type="submit" mt="sm">
        Get Coordinates
      </Button>

      {coordinates && (
        <div>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lon}</p>
        </div>
      )}
    </form>
  )
}
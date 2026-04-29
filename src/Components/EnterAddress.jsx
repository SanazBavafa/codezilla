import { useState } from 'react'
import { Button, Stack, Text, TextInput } from '@mantine/core'
import fetchCoordinatesFromAddress from '../Fetch/fetchCoordinatesFromAdress'

export default function EnterAddress({ onCoordinatesFound }) {
  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const coords = await fetchCoordinatesFromAddress(address)
      setCoordinates(coords)
      onCoordinatesFound?.(coords)
    } catch (error) {
      console.error('Error fetching coordinates:', error)
    }
  }

  return (
    <Stack gap="sm" component="form" onSubmit={handleSubmit}>
      <TextInput
        label="Address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Enter address"
      />
      <Button type="submit">Search</Button>

      {coordinates && (
        <Stack gap={0}>
          <Text size="sm">Latitude: {coordinates.lat}</Text>
          <Text size="sm">Longitude: {coordinates.lon}</Text>
        </Stack>
      )}
    </Stack>
  )
}
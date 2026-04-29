import { useState } from 'react'
import { Box, Button, Stack, Text, TextInput } from '@mantine/core'
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
    <Box maw={420} w="100%" mx="auto">
      <Stack gap="sm" component="form" onSubmit={handleSubmit} align="center">
        <TextInput
          label="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Enter address"
          w="100%"
        />
        <Button type="submit" w={140}>
          Search
        </Button>

        {coordinates && (
          <Stack gap={0} align="center">
            <Text size="sm">Latitude: {coordinates.lat}</Text>
            <Text size="sm">Longitude: {coordinates.lon}</Text>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
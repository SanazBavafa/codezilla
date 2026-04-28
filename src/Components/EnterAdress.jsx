import fetchCoordinatesFromAddress from '../Fetch/fetchCoordinatesFromAdress'
import { useState } from 'react'
import { TextInput, Button } from '@mantine/core'

export default function EnterAdress() {
    const [address, setAddress] = useState('')
    const [coordinates, setCoordinates] = useState(null)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const coords = await fetchCoordinatesFromAddress(address)
            setCoordinates(coords)
        } catch (error) {
            console.error('Error fetching coordinates:', error)
        }
    }
    console.log("ENTERADRESS RENDERED")
    return (
        <form onSubmit={handleSubmit}>
            <TextInput
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
            />
            <Button type="submit">Get your location Data</Button>
            Temporary solution to display coordinates until map is implemented:
            {coordinates && (
                <div>
                    <p>Latitude: {coordinates.lat}</p>
                    <p>Longitude: {coordinates.lon}</p>
                </div>
            )}
        </form>
    
    )
}
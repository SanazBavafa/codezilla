export default async function fetchMapFromCoordinates(lat, lon) {

    const apiUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=15&size=600x400&markers=${lat},${lon},red-pushpin`
    const response = await fetch(apiUrl)
    return response.blob()
    
}
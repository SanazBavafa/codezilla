export function buildNominatimQuery(address) {
    const knownCorrections = [
        [/\bSt\b/gi, 'Street'],
    ]

    let normalizedAddress = address

    for (const [pattern, replacement] of knownCorrections) {
        normalizedAddress = normalizedAddress.replace(pattern, replacement)
    }

    return normalizedAddress
        .replace(/\b\d{5}\b/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s+,/g, ',')
        .replace(/,\s+/g, ', ')
        .trim()
}

export function buildNominatimSearchUrl(address) {
    const query = buildNominatimQuery(address)
    const language = typeof navigator !== 'undefined' ? navigator.language : 'en'
    const email = import.meta.env.VITE_NOMINATIM_EMAIL?.trim()
    const params = new URLSearchParams({
        q: query,
        format: 'jsonv2',
        addressdetails: '1',
        limit: '1',
        'accept-language': language,
    })

    if (email) {
        params.set('email', email)
    }

    return `https://nominatim.openstreetmap.org/search?${params.toString()}`
}

export default async function fetchCoordinatesFromAddress(address) {
    const apiUrl = buildNominatimSearchUrl(address)

    try {
        const language = typeof navigator !== 'undefined' ? navigator.language : 'en'
        const response = await fetch(apiUrl, {
            headers: {
                'Accept-Language': language,
            },
            referrerPolicy: 'strict-origin-when-cross-origin',
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        if (data.length === 0) {
            throw new Error('No results found for the given address')
        }

        const { lat, lon } = data[0]
        return { lat, lon }
    } catch (error) {
        console.error('Error fetching coordinates:', error)
        throw error
    }
}
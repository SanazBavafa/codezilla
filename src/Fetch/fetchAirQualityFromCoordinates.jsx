
function getAverage(values) {
    const numericValues = Array.isArray(values)
        ? values.map((value) => Number(value)).filter((value) => Number.isFinite(value))
        : []

    if (numericValues.length === 0) {
        return null
    }

    const total = numericValues.reduce((sum, value) => sum + value, 0)
    return total / numericValues.length
}

export function summarizeAirQualityData(data) {
    const hourly = data?.hourly ?? {}

    return {
        latitude: data?.latitude ?? null,
        longitude: data?.longitude ?? null,
        timezone: data?.timezone ?? data?.timezone_abbreviation ?? null,
        sampleCount: Array.isArray(hourly.time) ? hourly.time.length : 0,
        averagePm2_5: getAverage(hourly.pm2_5),
        averagePm10: getAverage(hourly.pm10),
        averageCarbonDioxide: getAverage(hourly.carbon_dioxide),
        // derive a simple pollution level from PM2.5, PM10 and CO2
        pollutionLabel: (() => {
            const pm25 = getAverage(hourly.pm2_5) ?? 0
            const pm10 = getAverage(hourly.pm10) ?? 0
            const co2 = getAverage(hourly.carbon_dioxide) ?? 0

            // thresholds (simple heuristic): if any pollutant is high => High, else if any is medium => Medium, else Low
            const isHigh = pm25 > 15 || pm10 > 25 || co2 > 1000
            const isMedium = pm25 > 5 || pm10 > 10 || co2 > 600

            if (isHigh) return 'High'
            if (isMedium) return 'Medium'
            return 'Low'
        })(),
        pollutionColor: (() => {
            const label = (() => {
                const pm25 = getAverage(hourly.pm2_5) ?? 0
                const pm10 = getAverage(hourly.pm10) ?? 0
                const co2 = getAverage(hourly.carbon_dioxide) ?? 0
                if (pm25 > 15 || pm10 > 25 || co2 > 1000) return 'High'
                if (pm25 > 5 || pm10 > 10 || co2 > 600) return 'Medium'
                return 'Low'
            })()

            if (label === 'High') return 'red'
            if (label === 'Medium') return 'yellow'
            return 'green'
        })(),
    }
}

export async function fetchAirQualityFromCoordinates(lat, lon) {
    const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,carbon_dioxide&past_days=92&forecast_days=1`,
    )

    const data = await response.json()

    console.log('Fetched air quality data:', data)
    return summarizeAirQualityData(data)
}

export default fetchAirQualityFromCoordinates
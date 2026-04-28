export async function fetchAirPollutionFromCoordinates(lat, lon) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,nitrogen_dioxide,european_aqi&hourly=pm10,pm2_5,nitrogen_dioxide&past_days=1&forecast_days=1`

  const res = await fetch(url)
  const data = await res.json()

  return {
    aqi: data.current.european_aqi,
    pm25: data.current.pm2_5,
    pm10: data.current.pm10,
    no2: data.current.nitrogen_dioxide,
  }
}
// Normalize different source rows into a canonical emission event shape
// Event shape: { id, facilityId, facilityName, lat, lon, pollutant, amount, year, source }

export function normalizeRowsToEvents(rows, source = 'CSV') {
  if (!Array.isArray(rows)) return []

  return rows.map((r, idx) => ({
    id: r.FacilityInspireId ?? `${source}-${idx}`,
    facilityId: r.FacilityInspireId ?? r.facilityName ?? `${r.Longitude}-${r.Latitude}`,
    facilityName: r.facilityName ?? null,
    lat: Number(r.Latitude),
    lon: Number(r.Longitude),
    pollutant: (r.Pollutant ?? 'UNKNOWN').toString().trim().toUpperCase(),
    amount: Number(r.Releases) || 0,
    year: r.reportingYear ?? null,
    source,
  }))
}

export function normalizeJsonEvents(jsonArray, source = 'JSON') {
  // Basic JSON adapter: expects objects with {lat, lon, pollutant, amount}
  if (!Array.isArray(jsonArray)) return []

  return jsonArray.map((e, idx) => ({
    id: e.id ?? `${source}-${idx}`,
    facilityId: e.facilityId ?? e.name ?? `${e.lon}-${e.lat}`,
    facilityName: e.facilityName ?? e.name ?? null,
    lat: Number(e.lat),
    lon: Number(e.lon),
    pollutant: (e.pollutant ?? 'UNKNOWN').toString().trim().toUpperCase(),
    amount: Number(e.amount) || 0,
    year: e.year ?? null,
    source,
  }))
}

function normalizePollutantName(name) {
  const pollutant = String(name ?? '').trim().toUpperCase()

  if (pollutant === 'N20') {
    return 'N2O'
  }

  return pollutant || 'UNKNOWN'
}

function getFacilityKey(row) {
  return row.FacilityInspireId ?? row.facilityName ?? `${row.Longitude}-${row.Latitude}`
}

function getIntensityLabel(averageRelease) {
  if (averageRelease < 10000) {
    return 'Low'
  }

  if (averageRelease < 100000) {
    return 'Average'
  }

  return 'High'
}

function getIntensityColor(label) {
  if (label === 'Low') {
    return 'green'
  }

  if (label === 'Average') {
    return 'yellow'
  }

  return 'red'
}

export function getLatestYearRows(rows) {
  const years = rows
    .map((row) => Number(row.reportingYear))
    .filter((year) => Number.isFinite(year))

  const latestYear = years.length > 0 ? Math.max(...years) : null

  return {
    latestYear,
    rows: latestYear === null ? [] : rows.filter((row) => Number(row.reportingYear) === latestYear),
  }
}

export function summarizeReleaseRows(rows, { releaseType, latestYear }) {
  const facilities = new Map()
  const pollutantTotals = new Map()

  for (const row of rows) {
    const facilityKey = getFacilityKey(row)
    const facilityName = row.facilityName ?? 'Unknown facility'
    const city = row.city ?? ''
    const pollutant = normalizePollutantName(row.Pollutant)
    const releaseValue = Number(row.Releases)
    const safeReleaseValue = Number.isFinite(releaseValue) ? releaseValue : 0

    const facility = facilities.get(facilityKey) ?? {
      facilityKey,
      facilityName,
      city,
      totalRelease: 0,
      pollutantTotals: new Map(),
    }

    facility.totalRelease += safeReleaseValue
    facility.pollutantTotals.set(pollutant, (facility.pollutantTotals.get(pollutant) ?? 0) + safeReleaseValue)
    facilities.set(facilityKey, facility)

    pollutantTotals.set(pollutant, (pollutantTotals.get(pollutant) ?? 0) + safeReleaseValue)
  }

  const facilityEntries = [...facilities.values()].sort((first, second) => second.totalRelease - first.totalRelease)
  const totalRelease = facilityEntries.reduce((sum, facility) => sum + facility.totalRelease, 0)
  const totalFacilities = facilityEntries.length
  const averageReleasePerFacility = totalFacilities > 0 ? totalRelease / totalFacilities : 0
  const largeFacilityCount = facilityEntries.filter((facility) => facility.totalRelease >= averageReleasePerFacility && facility.totalRelease > 0).length
  const intensityLabel = getIntensityLabel(averageReleasePerFacility)
  const intensityColor = getIntensityColor(intensityLabel)

  return {
    releaseType,
    latestYear,
    totalFacilities,
    largeFacilityCount,
    totalRelease,
    averageReleasePerFacility,
    intensityLabel,
    intensityColor,
    pollutantTotals: [...pollutantTotals.entries()].sort((first, second) => second[1] - first[1]),
    facilityExamples: facilityEntries.slice(0, 3).map((facility) => ({
      facilityName: facility.facilityName,
      city: facility.city,
      totalRelease: facility.totalRelease,
      topPollutant: [...facility.pollutantTotals.entries()].sort((first, second) => second[1] - first[1])[0] ?? null,
    })),
  }
}
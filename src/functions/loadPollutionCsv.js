import Papa from 'papaparse'

export function parsePollutionCsvToObjects(csvText) {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  })

  if (parsed.errors?.length) {
    const firstError = parsed.errors[0]
    throw new Error(`Failed to parse CSV: ${firstError.message}`)
  }

  return parsed.data.map((row) => ({
    PublicationDate: row.PublicationDate?.trim?.() ?? row.PublicationDate,
    countryName: row.countryName?.trim?.() ?? row.countryName,
    reportingYear: row.reportingYear ? Number(row.reportingYear) : null,
    EPRTR_SectorCode: row.EPRTR_SectorCode ? Number(row.EPRTR_SectorCode) : null,
    EPRTR_SectorName: row.EPRTR_SectorName?.trim?.() ?? row.EPRTR_SectorName,
    EPRTRAnnexIMainActivity: row.EPRTRAnnexIMainActivity?.trim?.() ?? row.EPRTRAnnexIMainActivity,
    FacilityInspireId: row.FacilityInspireId?.trim?.() ?? row.FacilityInspireId,
    facilityName: row.facilityName?.trim?.() ?? row.facilityName,
    city: row.city?.trim?.() ?? row.city,
    Longitude: row.Longitude ? Number(row.Longitude) : null,
    Latitude: row.Latitude ? Number(row.Latitude) : null,
    addressConfidentialityReason: row.addressConfidentialityReason?.trim?.() ?? row.addressConfidentialityReason,
    TargetRelease: row.TargetRelease?.trim?.() ?? row.TargetRelease,
    Pollutant: row.Pollutant?.trim?.() ?? row.Pollutant,
    Releases: row.Releases ? Number(row.Releases) : 0,
    confidentialityReason: row.confidentialityReason?.trim?.() ?? row.confidentialityReason,
  }))
}

export async function loadPollutionCsv(csvUrl = '/Data/F1_4_Air_Releases_Facilities_Nordics.csv') {
  const response = await fetch(csvUrl)

  if (!response.ok) {
    throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`)
  }

  const csvText = await response.text()

  return parsePollutionCsvToObjects(csvText)
}
// Score canonical emission events (from emissionAdapters) into a 0-100 value
// Output: { score, label, barValue, drivers }

const POLLUTANT_WEIGHTS = {
  CO2: 1,
  NOX: 2,
  SO2: 2,
  NH3: 1.5,
  CH4: 1.2,
  N2O: 1.2,
  MERCURY: 5,
  LEAD: 4,
  UNKNOWN: 1,
}

function getPollutantWeight(pollutant) {
  return POLLUTANT_WEIGHTS[pollutant] || POLLUTANT_WEIGHTS.UNKNOWN
}

export function scoreEmissions(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return { score: 0, label: 'No data', barValue: 0, drivers: { total: 0, facilities: 0, weighted: 0 } }
  }

  // Aggregate
  let total = 0
  let weighted = 0
  const facilities = new Set()
  const pollutantTotals = {}

  for (const e of events) {
    facilities.add(e.facilityId)
    total += e.amount
    const w = getPollutantWeight(e.pollutant)
    weighted += e.amount * w
    pollutantTotals[e.pollutant] = (pollutantTotals[e.pollutant] || 0) + e.amount
  }

  // Normalize: scale weighted emissions to a 0-100 range
  // (for demo: 0 = 0, 100 = 100,000 weighted units; clamp above 100)
  const maxWeighted = 100000
  let rawScore = Math.min(100, Math.round((weighted / maxWeighted) * 100))

  // Facility density: more facilities = worse (up to a point)
  const facilityPenalty = Math.min(20, (facilities.size - 1) * 2)
  let score = Math.max(0, rawScore - facilityPenalty)

  // Label
  let label = 'Low'
  if (score > 66) label = 'High'
  else if (score > 33) label = 'Medium'

  return {
    score,
    label,
    barValue: score,
    drivers: {
      total,
      weighted,
      facilities: facilities.size,
      pollutantTotals,
    },
  }
}
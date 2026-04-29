function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normalizeLinearSeverity(value, badValue) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return null
  }

  return clamp(numericValue / badValue, 0, 1)
}

function normalizeLogSeverity(value, badValue) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return null
  }

  return clamp(Math.log1p(numericValue) / Math.log1p(badValue), 0, 1)
}

export const DEFAULT_POLLUTION_SCORE_FACTORS = [
  {
    key: 'airReleaseTotal',
    label: 'Air releases',
    weight: 0.3,
    select: (input) => input?.airSummary?.totalRelease,
    normalize: (value) => normalizeLogSeverity(value, 100000),
  },
  {
    key: 'waterReleaseTotal',
    label: 'Water releases',
    weight: 0.2,
    select: (input) => input?.waterSummary?.totalRelease,
    normalize: (value) => normalizeLogSeverity(value, 100000),
  },
  {
    key: 'pm2_5',
    label: 'PM2.5',
    weight: 0.2,
    select: (input) => input?.airQualitySummary?.averagePm2_5,
    normalize: (value) => normalizeLinearSeverity(value, 25),
  },
  {
    key: 'pm10',
    label: 'PM10',
    weight: 0.15,
    select: (input) => input?.airQualitySummary?.averagePm10,
    normalize: (value) => normalizeLinearSeverity(value, 50),
  },
  {
    key: 'carbonDioxide',
    label: 'Carbon dioxide',
    weight: 0.15,
    select: (input) => input?.airQualitySummary?.averageCarbonDioxide,
    normalize: (value) => normalizeLinearSeverity(value, 1200),
  },
]

export function updatePollutionFactorWeights(factors, weightUpdates = {}) {
  return factors.map((factor) => (
    Object.prototype.hasOwnProperty.call(weightUpdates, factor.key)
      ? { ...factor, weight: weightUpdates[factor.key] }
      : factor
  ))
}

export function getPollutionLevel(score) {
  if (!Number.isFinite(score)) {
    return null
  }

  if (score <= 33) {
    return 'Low'
  }

  if (score <= 66) {
    return 'Medium'
  }

  return 'High'
}

export function getPollutionLevelColor(score) {
  const level = getPollutionLevel(score)

  if (level === 'Low') {
    return 'green'
  }

  if (level === 'Medium') {
    return 'yellow'
  }

  if (level === 'High') {
    return 'red'
  }

  return 'gray'
}

export function calculatePollutionScore(input, factors = DEFAULT_POLLUTION_SCORE_FACTORS) {
  const contributions = factors
    .map((factor) => {
      const rawValue = factor.select(input)
      const severity = factor.normalize(rawValue)

      if (!Number.isFinite(severity)) {
        return null
      }

      return {
        key: factor.key,
        label: factor.label,
        weight: Number(factor.weight) || 0,
        rawValue,
        severity,
      }
    })
    .filter(Boolean)

  if (contributions.length === 0) {
    return {
      score: null,
      level: null,
      color: 'gray',
      contributions: [],
    }
  }

  const weightedSeverity = contributions.reduce(
    (sum, contribution) => sum + contribution.severity * contribution.weight,
    0,
  )

  const totalWeight = contributions.reduce((sum, contribution) => sum + contribution.weight, 0)

  if (totalWeight <= 0) {
    return {
      score: null,
      level: null,
      color: 'gray',
      contributions,
    }
  }

  const normalizedSeverity = clamp(weightedSeverity / totalWeight, 0, 1)
  const score = clamp(Math.round(1 + normalizedSeverity * 99), 1, 100)

  return {
    score,
    level: getPollutionLevel(score),
    color: getPollutionLevelColor(score),
    contributions,
  }
}
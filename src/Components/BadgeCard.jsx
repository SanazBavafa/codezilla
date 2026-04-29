import { Badge, Box, Card, Flex, Group, Image, Stack, Text } from '@mantine/core'
import {
  calculatePollutionScore,
  DEFAULT_POLLUTION_SCORE_FACTORS,
  getPollutionLevelColor,
  updatePollutionFactorWeights,
} from '../functions/calculatePollutionScore'

function formatCompactNumber(value) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatScore(score) {
  if (!Number.isFinite(score)) {
    return 'N/A'
  }

  return String(score)
}

function formatAverage(value, suffix) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/A'
  }

  return `${value.toFixed(2)} ${suffix}`
}

function PollutionScoreBanner({ result }) {
  if (!result || !Number.isFinite(result.score)) {
    return (
      <Card withBorder radius="md" padding="md">
        <Text fw={700} size="sm" c="dimmed">
          Calculating pollution score...
        </Text>
      </Card>
    )
  }

  const markerLeft = `${((result.score - 1) / 99) * 100}%`

  return (
    <Card
      withBorder
      radius="md"
      padding="lg"
      style={{
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(47, 158, 68, 0.08), rgba(240, 62, 62, 0.08))',
      }}
    >
      <Group justify="space-between" align="flex-start" mb="md">
        <Stack gap={2}>
          <Text fw={700} size="sm" c="dimmed" tt="uppercase">
            Pollution score
          </Text>
          <Text fw={800} size="3rem" lh={1}>
            {formatScore(result.score)}
          </Text>
        </Stack>

        <Badge color={result.color ?? getPollutionLevelColor(result.score)} variant="filled" size="lg">
          {result.level}
        </Badge>
      </Group>

      <Box
        aria-hidden="true"
        style={{
          height: 14,
          borderRadius: 999,
          position: 'relative',
          background: 'linear-gradient(90deg, #2f9e44 0%, #ffd43b 50%, #f03e3e 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: -4,
            left: `calc(${markerLeft} - 7px)`,
            width: 14,
            height: 22,
            borderRadius: 999,
            background: 'white',
            border: '2px solid rgba(0, 0, 0, 0.2)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
          }}
        />
      </Box>

      <Group justify="space-between" mt="xs">
        <Text size="xs" c="dimmed">
          Good
        </Text>
        <Text size="xs" c="dimmed">
          Bad
        </Text>
      </Group>
    </Card>
  )
}

function ReleaseSection({ title, summary }) {
  if (!summary) {
    return (
      <Card withBorder radius="md" padding="md">
        <Text fw={700}>{title}</Text>
        <Text size="sm" c="dimmed" mt="xs">
          Summary is loading.
        </Text>
      </Card>
    )
  }

  return (
    <Card withBorder radius="md" padding="md">
      <Group justify="space-between" align="flex-start">
        <Text fw={700} size="lg">
          {title}
        </Text>
        <Badge color={summary.intensityColor} variant="filled">
          {summary.intensityLabel}
        </Badge>
      </Group>

      <Stack gap={4} mt="md">
        <Text size="sm" fw={600}>
          Total releases in the latest year:
        </Text>
        <Text size="sm">
          {Number.isFinite(summary.totalRelease) ? formatCompactNumber(summary.totalRelease) : 'No data'}
        </Text>
      </Stack>
    </Card>
  )
}

function AirQualitySection({ summary }) {
  if (!summary) {
    return (
      <Card withBorder radius="md" padding="md">
        <Text fw={700}>Air pollution</Text>
        <Text size="sm" c="dimmed" mt="xs">
            Summary is loading.
        </Text>
      </Card>
    )
  }

  return (
    <Card withBorder radius="md" padding="md">
      <Group justify="space-between" align="flex-start">
        <Text fw={700} size="lg">
          Air pollution
        </Text>
        <Badge color={summary.pollutionColor} variant="filled">
          {summary.pollutionLabel}
        </Badge>
      </Group>

      <Stack gap={4} mt="md">
        <Text size="sm" fw={600}>
          Average PM2.5 partcile concentration:
        </Text>
        <Text size="sm">
          {summary.averagePm2_5 ? formatAverage(summary.averagePm2_5, 'μg/m³') : 'No data'}
        </Text>
      </Stack>
    </Card>
  )
}

export function BadgeCard({
  airSummary,
  waterSummary,
  mapImage,
  airQualitySummary,
  pollutionScoreFactors = DEFAULT_POLLUTION_SCORE_FACTORS,
  pollutionWeights,
}) {
  const scoreFactors = pollutionWeights
    ? updatePollutionFactorWeights(pollutionScoreFactors, pollutionWeights)
    : pollutionScoreFactors

  const pollutionScore = calculatePollutionScore(
    {
      airSummary,
      waterSummary,
      airQualitySummary,
    },
    scoreFactors,
  )

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <PollutionScoreBanner result={pollutionScore} />

                <Flex direction="row" gap="md" wrap="wrap">
          <ReleaseSection title="Air releases" summary={airSummary} />
          <ReleaseSection title="Water releases" summary={waterSummary} />
          <AirQualitySection summary={airQualitySummary} />
        </Flex>

        {mapImage && (
          <Card withBorder radius="md" padding="md">
            <Text fw={600} size="sm" mb="xs">
              Map image
            </Text>
            <Image
              src={mapImage}
              alt="Captured map preview"
              radius="md"
              style={{ maxHeight: 260, objectFit: 'cover' }}
            />
          </Card>
        )}


      </Stack>
    </Card>
  )
}

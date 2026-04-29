import { Badge, Box, Card, Divider, Group, SimpleGrid, Stack, Table, Text } from '@mantine/core'
import LeafletMap from './LeafletMap.jsx'
import {
  calculatePollutionScore,
  DEFAULT_POLLUTION_SCORE_FACTORS,
  getPollutionLevelColor,
  updatePollutionFactorWeights,
} from '../functions/calculatePollutionScore'

function formatCompactNumber(value) {
  if (!Number.isFinite(value)) {
    return 'No data'
  }

  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function MetricCard({ label, value }) {
  return (
    <Card withBorder radius="md" padding="md">
      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
        {label}
      </Text>
      <Text fw={800} size="lg" mt={4}>
        {value}
      </Text>
    </Card>
  )
}

function formatScore(score) {
  if (!Number.isFinite(score)) {
    return 'N/A'
  }

  return String(score)
}

function SectionHeader({ title, subtitle, badgeLabel, badgeColor }) {
  return (
    <Group justify="space-between" align="flex-start">
      <Stack gap={2} style={{ flex: 1 }}>
        <Text fw={800} size="lg">
          {title}
        </Text>
        {subtitle && (
          <Text size="sm" c="dimmed">
            {subtitle}
          </Text>
        )}
      </Stack>
      {badgeLabel && (
        <Badge color={badgeColor ?? 'blue'} variant="filled">
          {badgeLabel}
        </Badge>
      )}
    </Group>
  )
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

function FacilityTable({ examples }) {
  if (!examples || examples.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        No matching facilities were found in this area.
      </Text>
    )
  }

  return (
    <Box style={{ overflowX: 'auto' }}>
      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        verticalSpacing="xs"
        horizontalSpacing="xs"
        style={{ width: '100%', minWidth: 0, tableLayout: 'fixed' }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: '52%' }}>
              <Text size="xs" fw={700} tt="uppercase">
                Facility
              </Text>
            </Table.Th>
            <Table.Th style={{ width: '28%' }}>
              <Text size="xs" fw={700} tt="uppercase">
                City
              </Text>
            </Table.Th>
            <Table.Th ta="right" style={{ width: '20%' }}>
              <Text size="xs" fw={700} tt="uppercase">
                Total release
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {examples.map((facility, index) => (
            <Table.Tr key={`${facility.facilityName}-${index}`}>
              <Table.Td style={{ wordBreak: 'break-word' }}>
                <Text size="xs">{facility.facilityName}</Text>
              </Table.Td>
              <Table.Td style={{ wordBreak: 'break-word' }}>
                <Text size="xs">{facility.city || 'Unknown'}</Text>
              </Table.Td>
              <Table.Td ta="right">
                <Text size="xs">{formatCompactNumber(facility.totalRelease)}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  )
}

function PollutantTable({ pollutantTotals }) {
  if (!pollutantTotals || pollutantTotals.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        No pollutant data was found for this area.
      </Text>
    )
  }

  return (
    <Box style={{ overflowX: 'auto' }}>
      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        verticalSpacing="xs"
        horizontalSpacing="xs"
        style={{ width: '100%', minWidth: 0, tableLayout: 'fixed' }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: '70%' }}>
              <Text size="xs" fw={700} tt="uppercase">
                Pollutant
              </Text>
            </Table.Th>
            <Table.Th ta="right" style={{ width: '30%' }}>
              <Text size="xs" fw={700} tt="uppercase">
                Total release
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pollutantTotals.map(([pollutant, total]) => (
            <Table.Tr key={pollutant}>
              <Table.Td style={{ wordBreak: 'break-word' }}>
                <Text size="xs">{pollutant}</Text>
              </Table.Td>
              <Table.Td ta="right">
                <Text size="xs">{formatCompactNumber(total)}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  )
}

function PollutionSection({ title, summary, tone }) {
  if (!summary) {
    return (
      <Card withBorder radius="md" padding="lg" h="100%">
        <Text fw={800} size="lg">
          {title}
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          Summary is loading.
        </Text>
      </Card>
    )
  }

  return (
    <Card withBorder radius="md" padding="lg" h="100%">
      <Stack gap="md">
        <SectionHeader
          title={title}
          subtitle={`Latest year: ${summary.latestYear ?? 'N/A'}`}
          badgeLabel={summary.intensityLabel}
          badgeColor={summary.intensityColor ?? tone}
        />

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
          <MetricCard label="Facilities in range" value={summary.totalFacilities} />
          <MetricCard label="Larger facilities" value={summary.largeFacilityCount} />
          <MetricCard label="Total release" value={formatCompactNumber(summary.totalRelease)} />
        </SimpleGrid>

        <Divider label="Example facilities" labelPosition="left" />
        <FacilityTable examples={summary.facilityExamples} />

        <Divider label="Main pollutants" labelPosition="left" />
        <PollutantTable pollutantTotals={summary.pollutantTotals} />
      </Stack>
    </Card>
  )
}

function AirQualitySection({ summary }) {
  if (!summary) {
    return (
      <Card withBorder radius="md" padding="lg" h="100%">
        <Text fw={800} size="lg">
          Air quality
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          Summary is loading.
        </Text>
      </Card>
    )
  }

  return (
    <Card withBorder radius="md" padding="lg" h="100%">
      <Stack gap="md">
        <SectionHeader
          title="Air quality"
          subtitle={`Latitude ${summary.latitude ?? 'N/A'}, longitude ${summary.longitude ?? 'N/A'}`}
          badgeLabel={summary.pollutionLabel}
          badgeColor={summary.pollutionColor}
        />

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <MetricCard label="PM2.5 average" value={`${Number(summary.averagePm2_5 ?? 0).toFixed(2)} μg/m³`} />
          <MetricCard label="PM10 average" value={`${Number(summary.averagePm10 ?? 0).toFixed(2)} μg/m³`} />
          <MetricCard label="CO2 average" value={`${Number(summary.averageCarbonDioxide ?? 0).toFixed(2)} ppm`} />
          <MetricCard label="Samples" value={summary.sampleCount ?? 0} />
        </SimpleGrid>
      </Stack>
    </Card>
  )
}

export function DetailedReport({
  airSummary,
  waterSummary,
  airQualitySummary,
  coordinates,
  radiusKm,
  facilities,
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
    <Stack gap="md">
      <Card withBorder radius="md" padding="lg">
        <SectionHeader
          title="Detailed report"
          subtitle="Air quality, air pollutant facilities, and water pollutant facilities are organized below."
        />
      </Card>

      <PollutionScoreBanner result={pollutionScore} />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <AirQualitySection summary={airQualitySummary} />
        {coordinates && (
          <Card withBorder radius="md" padding="lg">
            <Stack gap="sm">
              <Text fw={800} size="lg">
                Area map
              </Text>
              <Text size="sm" c="dimmed">
                The map is centered on the coordinates you entered, 
                and shows facilities within the selected radius.
              </Text>
              <Card withBorder radius="md" padding="0" style={{ overflow: 'hidden' }}>
                <LeafletMap coordinates={coordinates} rangeKm={radiusKm} facilities={facilities} />
              </Card>
            </Stack>
          </Card>
        )}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <PollutionSection title="Air pollutant facilities" summary={airSummary} tone="orange" />
        <PollutionSection title="Water pollutant facilities" summary={waterSummary} tone="blue" />
      </SimpleGrid>
    </Stack>
  )
}

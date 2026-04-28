import { Badge, Card, Group, Image, Progress, Stack, Text } from '@mantine/core'

function formatCompactNumber(value) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function ReleasePill({ active, label, color }) {
  return (
    <Badge variant={active ? 'filled' : 'light'} color={active ? color : 'gray'}>
      {label}
    </Badge>
  )
}

function ReleaseSection({ title, summary, score }) {
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
        <Stack gap={2}>
          <Text fw={700} size="lg">
            {title}
          </Text>
          <Text size="sm" c="dimmed">
            Latest year: {summary.latestYear ?? 'N/A'}
          </Text>
        </Stack>
        <Badge color={summary.intensityColor} variant="filled">
          {summary.intensityLabel}
        </Badge>
      </Group>

      {score && (
        <Stack gap={2} mt="sm">
          <Text fw={600} size="sm">
            Score: {score.score} / 100
          </Text>
          <Progress value={score.barValue} color={score.score > 66 ? 'red' : score.score > 33 ? 'yellow' : 'green'} size="lg" radius="xl" />
          <Text size="xs" c="dimmed">{score.label}</Text>
        </Stack>
      )}

      <Group gap="xs" mt="sm">
        <ReleasePill active={summary.intensityLabel === 'Low'} label="Low" color="green" />
        <ReleasePill active={summary.intensityLabel === 'Average'} label="Average" color="yellow" />
        <ReleasePill active={summary.intensityLabel === 'High'} label="High" color="red" />
      </Group>

      <Stack gap={4} mt="md">
        <Text size="sm">
          Total facilities in range: {summary.totalFacilities}
        </Text>
        <Text size="sm">
          Larger facilities nearby: {summary.largeFacilityCount}
        </Text>
        <Text size="sm" fw={600}>
          Total releases in the latest year: {formatCompactNumber(summary.totalRelease)}
        </Text>
      </Stack>

      {summary.totalFacilities > 0 ? (
        <>
          <Stack gap={4} mt="md">
            <Text fw={600} size="sm">
              A few examples
            </Text>
            {summary.facilityExamples.slice(0, 2).map((facility, index) => (
              <Text key={`${facility.facilityName}-${index}`} size="sm">
                {facility.facilityName} {facility.city ? `(${facility.city})` : ''} — {formatCompactNumber(facility.totalRelease)}
              </Text>
            ))}
          </Stack>

          <Stack gap={4} mt="md">
            <Text fw={600} size="sm">
              Main pollutants
            </Text>
            {summary.pollutantTotals.slice(0, 2).map(([pollutant, total]) => (
              <Text key={pollutant} size="sm">
                {pollutant}: {formatCompactNumber(total)}
              </Text>
            ))}
          </Stack>
        </>
      ) : (
        <Text size="sm" c="dimmed" mt="md">
          No matching facilities were found in this area.
        </Text>
      )}
    </Card>
  )
}

export function BadgeCard({ airSummary, waterSummary, airScore, waterScore, mapImage }) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <Stack gap={4}>
          <Text fw={700} size="lg">
            What is nearby?
          </Text>
          <Text c="dimmed" size="sm">
            A simple overview of air and water releases in the area around your address.
          </Text>
        </Stack>

        <ReleaseSection title="Air releases" summary={airSummary} score={airScore} />
        <ReleaseSection title="Water releases" summary={waterSummary} score={waterScore} />

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
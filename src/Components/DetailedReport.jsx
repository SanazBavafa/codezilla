import { Badge, Card, Group, Image, Stack, Text } from '@mantine/core'

function formatCompactNumber(value) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function ReportSection({ title, summary }) {
  if (!summary) {
    return null
  }

  return (
    <Card withBorder radius="md" padding="lg">
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

      <Text size="sm" mt="md">
        In the selected area we found {summary.totalFacilities} facilities for {title.toLowerCase()}.
      </Text>
      <Text size="sm">
        Larger facilities nearby: {summary.largeFacilityCount}
      </Text>
      <Text size="sm" fw={600}>
        Total releases: {formatCompactNumber(summary.totalRelease)}
      </Text>

      {summary.totalFacilities > 0 ? (
        <>
          <Stack gap={4} mt="md">
            <Text fw={600} size="sm">
              Example facilities
            </Text>
            {summary.facilityExamples.map((facility, index) => (
              <Text key={`${facility.facilityName}-${index}`} size="sm">
                {facility.facilityName} {facility.city ? `(${facility.city})` : ''} — {formatCompactNumber(facility.totalRelease)}
              </Text>
            ))}
          </Stack>

          <Stack gap={4} mt="md">
            <Text fw={600} size="sm">
              Main pollutants
            </Text>
            {summary.pollutantTotals.map(([pollutant, total]) => (
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

export function DetailedReport({ airSummary, waterSummary, mapImage }) {
  return (
    <Stack gap="md">
      <Card withBorder radius="md" padding="lg">
        <Text fw={700} size="lg">
          Detailed report
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          This report keeps the language simple and focuses on the latest year only.
        </Text>
      </Card>

      <ReportSection title="Air releases" summary={airSummary} />
      <ReportSection title="Water releases" summary={waterSummary} />

      {mapImage && (
        <Card withBorder radius="md" padding="lg">
          <Text fw={700} size="lg" mb="sm">
            Map preview
          </Text>
          <Image src={mapImage} alt="Captured map preview" radius="md" />
        </Card>
      )}
    </Stack>
  )
}
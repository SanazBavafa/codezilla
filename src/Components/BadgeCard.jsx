import { Badge, Card, Group, Image, Stack, Text } from '@mantine/core'

export function BadgeCard({ mapImage, pollutionTotal, pollutionData = [] }) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Text fw={700} size="lg">
            Result Title
          </Text>
          <Text c="dimmed" size="sm">
            Default result card for the selected location.
          </Text>
        </Stack>
        <Badge variant="light">Default</Badge>
      </Group>

      {pollutionTotal !== null && (
        <Text fw={600} mt="md">
          Total pollution: {pollutionTotal}
        </Text>
      )}

      <Text size="sm" c="dimmed" mt="sm">
        Facilities in range: {pollutionData.length}
      </Text>

      {pollutionData.slice(0, 3).map((row, index) => (
        <Text key={`${row.FacilityInspireId ?? row.facilityName ?? 'facility'}-${index}`} size="sm" mt={4}>
          {row.facilityName} - {row.Pollutant} ({row.Releases})
        </Text>
      ))}

      {mapImage && (
        <Image
          src={mapImage}
          alt="Captured map preview"
          radius="md"
          mt="md"
          style={{ maxHeight: 240, objectFit: 'cover' }}
        />
      )}
    </Card>
  )
}
import { Badge, Card, Group, Image, Stack, Text } from '@mantine/core'

export function BadgeCard({ mapImage }) {
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
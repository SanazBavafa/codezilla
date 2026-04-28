import { AppShell, Burger, Container, Group, NavLink, NumberInput, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Link as RouterLink } from 'react-router-dom'
import EnterAddress from './Components/EnterAddress.jsx'
import { SearchInput } from './components/SearchInput'
import LeafletMap from './Components/LeafletMap.jsx'
import { BadgeCard } from './Components/BadgeCard.jsx'

export default function Home() {
  const [opened, { toggle }] = useDisclosure()
  const [coordinates, setCoordinates] = useState(null)
  const [rangeKm, setRangeKm] = useState(5)
  const [mapImage, setMapImage] = useState(null)

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1} size="h2">
            My App
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Stack p="md" gap="sm">
          <NavLink
            label="Home"
            to="/"
            component={RouterLink}
            active
          />
          <NavLink
            label="About"
            to="/about"
            component={RouterLink}
          />
          <NavLink
            label="Display"
            to="/display"
            component={RouterLink}
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="md" py="lg">
          <Title order={2} mb="md">
            Welcome to My App
          </Title>
          <SearchInput
            placeholder="Skriv in din plats..."
            onChange={(e) => console.log(e.target.value)}
          />
          <BadgeCard /> {}
          <Text c="dimmed" mb="xl">
            This is the home page built with Mantine AppShell component.
          </Text>
          <EnterAddress onCoordinatesFound={setCoordinates} />
          <NumberInput
            label="Range (km)"
            value={rangeKm}
            onChange={setRangeKm}
            min={1}
            max={100}
            step={1}
            mt="md"
          />
          <LeafletMap coordinates={coordinates} rangeKm={rangeKm} onImageCaptured={setMapImage} />
          {mapImage && (
            <Text size="sm" c="gray" mt="sm">
              Map image is ready and stored in memory for later use.
            </Text>
          )}
          <Stack gap="sm">
            <Text>Navigate using the sidebar or links above.</Text>
            <Text size="sm" c="gray">
              You can customize this AppShell further with your own components
              and styling.
            </Text>
          </Stack>
          
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

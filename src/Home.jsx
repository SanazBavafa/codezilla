import { AppShell, Burger, Container, Group, NavLink, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link as RouterLink } from 'react-router-dom'
import { SearchInput } from './components/SearchInput'

export default function Home() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
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
          <Text c="dimmed" mb="xl">
            This is the home page built with Mantine AppShell component.
          </Text>
          <Stack gap="sm">
            <Text>Navigate using the sidebar or links above.</Text>
            <Text size="sm" c="gray">
              You can customize this AppShell further with your own components and styling.
            </Text>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

import { AppShell, Burger, Group, MantineProvider, NavLink, Stack, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { HashRouter, Link as RouterLink, Route, Routes, useLocation } from 'react-router-dom'
import Display from './Pages/Display'

import '@mantine/core/styles.css'

function About() {
  return (
    <section>
      <h1>About</h1>
      <p>This project is ready for react-router-dom pages.</p>
    </section>
  )
}

function SiteShell({ children }) {
  const location = useLocation()
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={1} size="h3">
              Codezilla
            </Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <NavLink
            label="Home"
            component={RouterLink}
            to="/"
            active={location.pathname === '/'}
          />
          <NavLink
            label="About"
            component={RouterLink}
            to="/about"
            active={location.pathname === '/about'}
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}

function NotFound() {
  return (
    <section>
      <h1>Not Found</h1>
      <p>The page you requested does not exist.</p>
    </section>
  )
}

export default function AppRoutes() {
  return (
    <MantineProvider>
      <HashRouter>
        <SiteShell>
          <Routes>
            <Route path="/" element={<Display />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SiteShell>
      </HashRouter>
    </MantineProvider>
  )
}
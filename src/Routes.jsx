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
      
      padding="md"
    >
      

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
    <MantineProvider theme={{
  primaryColor: 'moss',
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Fraunces, Georgia, serif',
    fontWeight: '700',
  },
  colors: {
    moss: ['#f0f5f1','#d6e8d9','#aed1b4','#7db88a','#4e9e62','#2d7a44','#1e5c30','hsl(140,35%,25%)','#0f3318','#071a0c'],
  },
  defaultRadius: 'md',
  components: {
    AppShell: {
      styles: {
        main: { background: 'hsl(40, 33%, 96%)' },
      },
    },
  },
}}>
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
import { MantineProvider } from '@mantine/core'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'

import '@mantine/core/styles.css'

function About() {
  return (
    <section>
      <h1>About</h1>
      <p>This project is ready for react-router-dom pages.</p>
    </section>
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </MantineProvider>
  )
}
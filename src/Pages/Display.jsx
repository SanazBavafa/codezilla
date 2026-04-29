import { Badge, Box, Button, Card, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import LeafletMap from '../Components/LeafletMap.jsx'
import { BadgeCard } from '../Components/BadgeCard.jsx'
import { DetailedReport } from '../Components/DetailedReport.jsx'
import EnterAddress from '../Components/EnterAddress.jsx'
import { useDisplayStepper } from '../hooks/useDisplayStepper.js'

const C = {
  primary:  'hsl(140, 35%, 25%)',  // deep moss green
  accent:   'hsl(80, 35%, 55%)',   // leaf green
  sand:     'hsl(40, 25%, 90%)',   // warm sand
  good:     'hsl(110, 55%, 45%)',  // aqi good
  moderate: 'hsl(45, 90%, 55%)',   // aqi moderate
  bad:      'hsl(12, 78%, 52%)',   // aqi bad
  bg:       'hsl(40, 33%, 96%)',   // off-white
  fg:       'hsl(140, 25%, 12%)',  // deep forest
}



function Hero() {
  return (
    <Stack align="center" gap="sm" mb="xl" ta="center">
      <Title ff="Fraunces, Georgia, serif" fw={700} fz={32} lh={1.2} c={C.fg}>
        See what's being released near your address
      </Title>
      <Text c="dimmed" fz="sm" maw={420} lh={1.7}>
        Instant industrial emission data for any location. Free, no account needed.
      </Text>
    </Stack>
  )
}



function StepHeader({ step, active, done, label, sub }) {
  return (
    <Group gap="sm" mb="md">
      
      <div>
        <Text fw={600} fz="sm" c={active ? C.primary : done ? C.primary : 'dimmed'}>{label}</Text>
        <Text fz="xs" c="dimmed">{sub}</Text>
      </div>
    </Group>
  )
}

export default function Display() {
  const {
    active, coordinates, mapImage, releaseSummaries,
    isLoadingSummaries, radiusKm,
    handleCoordinatesFound, handleMapImageCaptured,
    setRadiusKm, goToStep,
  } = useDisplayStepper()

  const [email, setEmail]             = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const handleEmail = () => {
    if (!email.includes('@')) return
    localStorage.setItem('greendum_email', email)
    setEmailSubmitted(true)
  }

  const liUrl  = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
  const liText = `"Checked industrial emissions near our site with GreenDue — sustainability due diligence in seconds. Built for the Icons Of hackathon 🌿 #ESG #Sustainability"`

  return (
    <Box maw={640} mx="auto" py="xl" px="md">
     
      <Hero />

      {/* ── STEP 1: Enter address ── */}
      {active === 0 && (
  <Card withBorder radius="md" p="lg" mb="md" bg="white"
    style={{ borderLeft: `3px solid ${C.primary}` }}>
    <EnterAddress onCoordinatesFound={handleCoordinatesFound} />
    <Group justify="flex-end" mt="md">
      
    </Group>
  </Card>
)}

      {/* ── STEP 2: Results ── */}
      {active >= 1 && (
        <Card withBorder radius="md" p="lg" mb="md" bg="white"
          style={{ borderLeft: active === 1 ? `3px solid ${C.primary}` : `3px solid ${C.primary}` }}>

          {active === 1 && (
            <Stack gap="md">
              {/* Stat chips */}
              {releaseSummaries.air && (
                <Group grow>
                  {[
                    { label: 'Facilities nearby', val: releaseSummaries.air.totalFacilities, unit: `within ${radiusKm} km`, color: C.primary },
                    { label: 'Air releases', val: `${(releaseSummaries.air.totalRelease / 1000).toFixed(0)}K kg`, unit: 'per year', color: C.moderate },
                    { label: 'Water releases', val: releaseSummaries.water ? `${(releaseSummaries.water.totalRelease / 1000).toFixed(0)}K kg` : '–', unit: 'per year', color: C.bad },
                  ].map((s) => (
                    <Card key={s.label} withBorder radius="md" p="sm" bg="#F7F7F8" style={{ borderLeft: `3px solid ${s.color}` }}>
                      <Text fz={10} tt="uppercase" c="dimmed" fw={500} style={{ letterSpacing: '0.07em' }}>{s.label}</Text>
                      <Text ff="Syne, sans-serif" fw={800} fz={20} lh={1} mt={4}>{s.val}</Text>
                      <Text fz={10} c="dimmed">{s.unit}</Text>
                    </Card>
                  ))}
                </Group>
              )}

              <BadgeCard
                airSummary={releaseSummaries.air}
                waterSummary={releaseSummaries.water}
                mapImage={mapImage}
              />

              {isLoadingSummaries && <Text fz="sm" c="dimmed">Loading summaries...</Text>}
<Card withBorder radius="md" p="md" bg="white">
  <Group justify="center" direction="column" align="center" gap="sm">
    <a href={liUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0A66C2', color: 'white', borderRadius: 9, padding: '10px 16px', fontSize: 13, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      Share on LinkedIn
    </a>
    <Text fz="xs" c="dimmed" fs="italic" lh={1.5}>{liText}</Text>
  </Group>
</Card>
              <Group justify="space-between">
                <Button variant="default" onClick={() => goToStep(0)}>← Back</Button>
                <Button onClick={() => goToStep(2)} style={{ background: C.primary }}>
                  Get full report →
                </Button>
              </Group>
            </Stack>
          )}
        </Card>
      )}

      {/* ── STEP 3: Email gate + Detailed report ── */}
      {active >= 2 && (
        <Card withBorder radius="md" p="lg" mb="md" bg="white"
          style={{ borderLeft: `3px solid ${C.primary}` }}>
          <StepHeader step={3} active={active === 2} done={false} label="Full risk report" sub="Detailed analysis with ESG recommendations" />

          {active === 2 && (
            <Stack gap="md">
              {!emailSubmitted ? (
                <Card radius="md" p="lg" style={{ border: `2px solid ${C.primary}`, background: '#F9F6FF' }}>
                  <Group align="flex-start" gap="sm" mb="md">
                    <Box w={36} h={36} style={{ background: C.primary, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Text c="white" fz={16}>🔒</Text>
                    </Box>
                    <div>
                      <Text ff="Syne, sans-serif" fw={800} fz="md" c="#3B1F7A">Unlock your full risk report</Text>
                      <Text fz="sm" c="#5a4a7a" lh={1.55} mt={2}>
                        Enter your work email for a detailed report — pollutant breakdown, facility profiles, 10-year trends, and ESG recommendations.
                      </Text>
                    </div>
                  </Group>
                  <Group gap="sm">
                    <TextInput flex={1} placeholder="you@company.com" type="email"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEmail()}
                      styles={{ input: { borderColor: C.primary } }} />
                    <Button onClick={handleEmail} style={{ background: C.primary }}>Get report →</Button>
                  </Group>
                  <Group gap={6} mt="sm" wrap="wrap">
                    {['Full pollutant breakdown', '10-year trend', 'ESG recommendations', 'Export PDF'].map(p => (
                      <Box key={p} px={10} py={2} style={{ border: `0.5px solid #C4A8F0`, borderRadius: 999, fontSize: 11, color: '#6B3FA0', background: 'white' }}>{p}</Box>
                    ))}
                  </Group>
                </Card>
              ) : (
                <Card radius="md" p="md" style={{ border: `2px solid ${C.primary}`, background: '#EBF4FF' }}>
                  <Text fw={600} c={C.primary}>✅ Report unlocked!</Text>
                </Card>
              )}

              {emailSubmitted && (
                <DetailedReport
                  airSummary={releaseSummaries.air}
                  waterSummary={releaseSummaries.water}
                  mapImage={mapImage}
                />
              )}

              <Group justify="space-between">
                <Button variant="default" onClick={() => goToStep(1)}>← Back</Button>
                <Button variant="light" onClick={() => goToStep(0)}>Start over</Button>
              </Group>
            </Stack>
          )}
        </Card>
      )}

      {/* ── Footer ── */}
      <Group justify="space-between" mt="xl" pb="md">
        <Text fz="xs" c="dimmed">
          Built for the{' '}
          <a href="https://www.iconsof.se" target="_blank" rel="noreferrer" style={{ color: C.primary, textDecoration: 'none' }}>Icons Of</a>
          {' '}hackathon
        </Text>
        <a href="https://www.linkedin.com/company/iconsof" target="_blank" rel="noreferrer"
          style={{ fontSize: 12, color: C.primary, textDecoration: 'none' }}>Icons Of on LinkedIn ↗</a>
      </Group>

      {/* Hidden map renderer */}
      {coordinates && (
        <Box aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 0, width: '480px', pointerEvents: 'none', opacity: 0 }}>
          <LeafletMap coordinates={coordinates} rangeKm={radiusKm} onImageCaptured={handleMapImageCaptured} />
        </Box>
      )}
    </Box>
  )
}
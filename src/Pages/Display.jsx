import { useState } from 'react'
import {
  Anchor,
  Box,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import LeafletMap from '../Components/LeafletMap.jsx'
import { BadgeCard } from '../Components/BadgeCard.jsx'
import { DetailedReport } from '../Components/DetailedReport.jsx'
import EnterAddress from '../Components/EnterAddress.jsx'
import { useDisplayStepper } from '../hooks/useDisplayStepper.js'
// Pollution score is rendered by BadgeCard; calculations live in src/functions/calculatePollutionScore.js

const C = {
  primary: 'hsl(140, 35%, 25%)',
  accent: 'hsl(80, 35%, 55%)',
  sand: 'hsl(40, 25%, 90%)',
  good: 'hsl(110, 55%, 45%)',
  moderate: 'hsl(45, 90%, 55%)',
  bad: 'hsl(12, 78%, 52%)',
  bg: 'hsl(40, 33%, 96%)',
  fg: 'hsl(140, 25%, 12%)',
}

function formatCompactNumber(value) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function Hero() {
  return (
    <Card withBorder radius="md" p="lg" style={{ borderLeft: `3px solid ${C.primary}`, background: 'white' }}>
      <Stack gap={4}>
        <Text
          fw={900}
          c={C.primary}
          style={{
            letterSpacing: '0.02em',
            fontSize: 'clamp(2rem, 6vw, 3.25rem)',
            lineHeight: 0.95,
            marginBottom: 20,
          }}
        >
          GreenHouse
        </Text>
        <Title order={2}>Emissions near your site</Title>
        <Text c="dimmed" maw={520}>
          Search a location, review nearby facilities and pollutants in the area,
           and unlock the detailed report with a work email.
        </Text>
      </Stack>
    </Card>
  )
}

function SectionFrame({ children, active = false }) {
  return (
    <Card
      withBorder
      radius="md"
      p="lg"
      mb="md"
      bg="white"
      style={{ borderLeft: `3px solid ${active ? C.primary : C.sand}` }}
    >
      {children}
    </Card>
  )
}

function StatChip({ label, val, unit, color }) {
  return (
    <Card withBorder radius="md" p="sm" bg="#F7F7F8" style={{ borderLeft: `3px solid ${color}` }}>
      <Text fz={10} tt="uppercase" c="dimmed" fw={500} style={{ letterSpacing: '0.07em' }}>
        {label}
      </Text>
      <Text
        fw={800}
        lh={1}
        mt={4}
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(13px, 3.5vw, 18px)',
        }}
      >
        {val}
      </Text>
      <Text fz={10} c="dimmed">
        {unit}
      </Text>
    </Card>
  )
}

function StepNav({ active, goToStep }) {
  return (
    <Group justify="space-between" align="center" gap={4} wrap="nowrap" w="100%">
      <Button
        size="compact-xs"
        variant="subtle"
        px={8}
        onClick={() => goToStep(Math.max(active - 1, 0))}
        disabled={active === 0}
      >
        ←
      </Button>
      <Button
        size="compact-xs"
        variant="subtle"
        px={8}
        onClick={() => goToStep(Math.min(active + 1, 2))}
        disabled={active === 2}
      >
        →
      </Button>
    </Group>
  )
}



function EmailGate({ email, setEmail, emailSubmitted, handleEmail }) {
  if (emailSubmitted) {
    return (
      <Card radius="md" p="md" style={{ border: '2px solid hsl(140, 35%, 25%)', background: '#EBF4FF' }}>
        <Text fw={700} c={C.primary}>
          Report unlocked
        </Text>
      </Card>
    )
  }

  return (
    <Card radius="md" p="lg" style={{ border: `2px solid ${C.primary}`, background: '#F9F6FF' }}>
      <Group align="flex-start" gap="sm" mb="md">
        <Box
          w={36}
          h={36}
          style={{
            background: C.primary,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Text c="white" fz={16}>
            🔒
          </Text>
        </Box>
        <div>
          <Text fw={800} fz="md" c="#3B1F7A" style={{ fontFamily: 'Syne, sans-serif' }}>
            Unlock your full risk report
          </Text>
          <Text fz="sm" c="#5a4a7a" lh={1.55} mt={2}>
            Enter your work email for a detailed report with pollutant breakdown, facility profiles, trends, and ESG recommendations.
          </Text>
        </div>
      </Group>

      <Group gap="sm" align="flex-start">
        <TextInput
          flex={1}
          placeholder="you@company.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleEmail()}
          styles={{ input: { borderColor: C.primary } }}
        />
        <Button onClick={handleEmail} style={{ background: C.primary }}>
          Get report →
        </Button>
      </Group>

      {/* feature snippets moved to Results page under the pollution score */}
    </Card>
  )
}

export default function Display() {
  const {
    active,
    coordinates,
    mapImage,
    mapFacilities,
    releaseSummaries,
    isLoadingSummaries,
    radiusKm,
    handleCoordinatesFound,
    handleMapImageCaptured,
    setRadiusKm,
    goToStep,
  } = useDisplayStepper()

  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const handleEmail = () => {
    if (!email.includes('@')) {
      return
    }

    localStorage.setItem('greendum_email', email)
    setEmailSubmitted(true)
  }

  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
  const liText = '"Checked emissions near of our location with GreenHouse — sustainability due diligence in seconds. Built for the Icons Of hackathon 🌿 #ESG #Sustainability"'

  return (
    <Box maw={640} mx="auto" pt="sm" pb="xl" px="md" style={{ color: C.fg }}>
      <Stack gap="lg">
        <Hero />

        {active === 0 && (
        <SectionFrame active={active === 0}>
          <Stack gap="md" align="center">
            <StepNav active={active} goToStep={goToStep} />
            <Stack gap={2} align="center" ta="center" w="100%">
              <Text fw={700} tt="uppercase" fz="xs" c="dimmed" style={{ letterSpacing: '0.08em' }}>
                Step 1
              </Text>
              <Title order={3}>Enter address</Title>
              <Text size="sm" c="dimmed" maw={420}>
                Search for a location and set the radius.
              </Text>
            </Stack>

            <EnterAddress onCoordinatesFound={handleCoordinatesFound} />
            <Box w="100%" maw={220}>
              <NumberInput
                label="Radius (km)"
                value={radiusKm}
                onChange={setRadiusKm}
                min={1}
                max={100}
                step={1}
                w="100%"
              />
            </Box>
          </Stack>
        </SectionFrame>
        )}

        {active === 1 && (
        <SectionFrame active={active === 1}>
          <Stack gap="md">
            <StepNav active={active} goToStep={goToStep} />
            
            

            {releaseSummaries.air && (
              <Group grow align="stretch">
                {[
                  {
                    label: 'Air quality',
                    val: releaseSummaries.airquality ? releaseSummaries.airquality.pollutionLabel : '–',
                    unit: '',
                    color: releaseSummaries.airquality ? releaseSummaries.airquality.pollutionColor : C.primary,
                  },
                  {
                    label: 'Air releases',
                    val: `${formatCompactNumber(releaseSummaries.air.totalRelease)} kg`,
                    unit: 'per year',
                    color: C.moderate,
                  },
                  {
                    label: 'Water releases',
                    val: releaseSummaries.water ? `${formatCompactNumber(releaseSummaries.water.totalRelease)} kg` : '–',
                    unit: 'per year',
                    color: C.bad,
                  },
                ].map((stat) => (
                  <StatChip key={stat.label} {...stat} />
                ))}
              </Group>
            )}

            {isLoadingSummaries && (
              <Text fz="sm" c="dimmed">
                Loading summaries...
              </Text>
            )}
            <BadgeCard
              airSummary={releaseSummaries.air}
              waterSummary={releaseSummaries.water}
              mapImage={mapImage}
              airQualitySummary={releaseSummaries.airquality}
            />


            <Card withBorder radius="md" p="md" bg="white">
              <Stack gap="sm" align="center">
                <Button
                  component="a"
                  href={liUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#0A66C2',
                    color: 'white',
                    borderRadius: 9,
                    padding: '10px 16px',
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Share on LinkedIn
                </Button>
                <Text fz="xs" c="dimmed" fs="italic" lh={1.5} ta="center">
                  {liText}
                </Text>
              </Stack>
            </Card>

            <Group justify="space-between">
              <Button variant="default" onClick={() => goToStep(0)}>
                ← Back
              </Button>
              <Button onClick={() => goToStep(2)} style={{ background: C.primary }}>
                Get full report →
              </Button>
            </Group>
          </Stack>
        </SectionFrame>
        )}

        {active === 2 && (
        <SectionFrame active={active === 2}>
          <Stack gap="md">
            <StepNav active={active} goToStep={goToStep} />
            <EmailGate email={email} setEmail={setEmail} emailSubmitted={emailSubmitted} handleEmail={handleEmail} />

            {emailSubmitted && (
              <DetailedReport
                airSummary={releaseSummaries.air}
                waterSummary={releaseSummaries.water}
                airQualitySummary={releaseSummaries.airquality}
                coordinates={coordinates}
                radiusKm={radiusKm}
                facilities={mapFacilities}
              />
            )}

            <Group justify="space-between">
              <Button variant="default" onClick={() => goToStep(1)}>
                ← Back
              </Button>
              <Button variant="light" onClick={() => goToStep(0)}>
                Start over
              </Button>
            </Group>
          </Stack>
        </SectionFrame>
        )}

        <Box ta="center" mt="xl" pb="md">
          <Group justify="center" align="center" gap={6}>
            <Text fz="xs" c="dimmed">
              Built for the
            </Text>
            <Anchor href="https://www.iconsof.se" target="_blank" rel="noreferrer">
              <img src="/iconsOf.png" alt="Icons Of" style={{ height: 16, verticalAlign: 'middle' }} />
            </Anchor>
            <Text fz="xs" c="dimmed">
              hackathon
            </Text>
          </Group>
          <Anchor
            href="https://www.linkedin.com/company/iconsof"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, color: C.primary, textDecoration: 'none' }}
          >
            Icons Of on LinkedIn ↗
          </Anchor>
        </Box>
      </Stack>

      {coordinates && (
        <Box
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-10000px',
            top: 0,
            width: '480px',
            pointerEvents: 'none',
            opacity: 0,
          }}
        >
          <LeafletMap coordinates={coordinates} rangeKm={radiusKm} facilities={mapFacilities} onImageCaptured={handleMapImageCaptured} />
        </Box>
      )}
    </Box>
  )
}

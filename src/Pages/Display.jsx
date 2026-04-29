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
        releaseSummaries,
        scoreSummaries,
        isLoadingSummaries,
        radiusKm,
        handleCoordinatesFound,
        handleMapImageCaptured,
        setRadiusKm,
        goToStep,
    } = useDisplayStepper()

    return (
        <Stack gap="xl" p="lg">
            <Title order={2}>Search flow</Title>

            <Stepper active={active} onStepClick={goToStep} allowNextStepsSelect={false}>
                <Stepper.Step label="Enter address" description="Search for a location">
                    <Stack gap="md" pt="md">
                        <EnterAddress onCoordinatesFound={handleCoordinatesFound} />
                        <NumberInput
                            label="Radius (km)"
                            value={radiusKm}
                            onChange={setRadiusKm}
                            min={1}
                            max={100}
                            step={1}
                        />
                        <Group justify="flex-end">
                            <Button onClick={() => goToStep(1)} disabled={!coordinates}>
                                Continue
                            </Button>
                        </Group>
                    </Stack>
                </Stepper.Step>

                <Stepper.Step label="Display results" description="Show the result card">
                    <Stack gap="md" pt="md">
                        <BadgeCard
                            airSummary={releaseSummaries.air}
                            waterSummary={releaseSummaries.water}
                            airScore={scoreSummaries.air}
                            waterScore={scoreSummaries.water}
                            mapImage={mapImage}
                        />
                        {isLoadingSummaries && (
                            <Text size="sm" c="dimmed">
                                Loading the latest air and water summaries...
                            </Text>
                        )}
                        <Group justify="space-between">
                            <Button variant="default" onClick={() => goToStep(0)}>
                                Back
                            </Button>
                            <Button onClick={() => goToStep(2)}>Continue</Button>
                        </Group>
                    </Stack>
                </Stepper.Step>

                <Stepper.Step label="Detailed report" description="Placeholder for the report">
                    <Stack gap="md" pt="md">
                        <DetailedReport
                            airSummary={releaseSummaries.air}
                            waterSummary={releaseSummaries.water}
                            mapImage={mapImage}
                        />
                        <Group justify="space-between">
                            <Button variant="default" onClick={() => goToStep(1)}>
                                Back
                            </Button>
                            <Button variant="light" onClick={() => goToStep(0)}>
                                Start over
                            </Button>
                        </Group>
                    </Stack>
                </Stepper.Step>

                <Stepper.Completed>
                    <Text>All steps completed.</Text>
                </Stepper.Completed>
            </Stepper>

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

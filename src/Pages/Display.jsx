import {
    Button,
    Box,
    Group,
    NumberInput,
    Stack,
    Stepper,
    Text,
    Title,
} from '@mantine/core'
import LeafletMap from '../Components/LeafletMap.jsx'
import { BadgeCard } from '../Components/BadgeCard.jsx'
import { DetailedReport } from '../Components/DetailedReport.jsx'
import EnterAddress from '../Components/EnterAddress.jsx'
import { useDisplayStepper } from '../hooks/useDisplayStepper.js'
import { DEFAULT_RANGE_KM } from '../Constants/DefaultValues.js'

export default function Display() {
    const {
        active,
        coordinates,
        mapImage,
        releaseSummaries,
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
                            value={DEFAULT_RANGE_KM}
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
                    <LeafletMap
                        coordinates={coordinates}
                        rangeKm={radiusKm}
                        onImageCaptured={handleMapImageCaptured}
                    />
                </Box>
            )}
        </Stack>
    )
}
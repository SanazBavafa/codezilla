import { useState } from 'react'
import {
    Badge,
    Button,
    Card,
    Group,
    Stack,
    Stepper,
    Text,
    Title,
} from '@mantine/core'
import EnterAddress from '../Components/EnterAddress.jsx'

function BadgeCard() {
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
        </Card>
    )
}

export default function Display() {
    const [active, setActive] = useState(0)
    const [coordinates, setCoordinates] = useState(null)

    const handleCoordinatesFound = (coords) => {
        setCoordinates(coords)
        setActive(1)
    }

    return (
        <Stack gap="xl" p="lg">
            <Title order={2}>Search flow</Title>

            <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
                <Stepper.Step label="Enter address" description="Search for a location">
                    <Stack gap="md" pt="md">
                        <EnterAddress onCoordinatesFound={handleCoordinatesFound} />
                        {coordinates && (
                            <Text size="sm" c="dimmed">
                                Coordinates found: {coordinates.lat}, {coordinates.lon}
                            </Text>
                        )}
                        <Group justify="flex-end">
                            <Button onClick={() => setActive(1)} disabled={!coordinates}>
                                Continue
                            </Button>
                        </Group>
                    </Stack>
                </Stepper.Step>

                <Stepper.Step label="Display results" description="Show the result card">
                    <Stack gap="md" pt="md">
                        <BadgeCard />
                        <Group justify="space-between">
                            <Button variant="default" onClick={() => setActive(0)}>
                                Back
                            </Button>
                            <Button onClick={() => setActive(2)}>Continue</Button>
                        </Group>
                    </Stack>
                </Stepper.Step>

                <Stepper.Step label="Detailed report" description="Placeholder for the report">
                    <Stack gap="md" pt="md">
                        <Card withBorder radius="md" padding="lg">
                            <Text fw={600} mb="xs">
                                Detailed report placeholder
                            </Text>
                            <Text c="dimmed">
                                Add the detailed report content here later.
                            </Text>
                        </Card>
                        <Group justify="space-between">
                            <Button variant="default" onClick={() => setActive(1)}>
                                Back
                            </Button>
                            <Button variant="light" onClick={() => setActive(0)}>
                                Start over
                            </Button>
                        </Group>
                    </Stack>
                </Stepper.Step>

                <Stepper.Completed>
                    <Text>All steps completed.</Text>
                </Stepper.Completed>
            </Stepper>
        </Stack>
    )
}
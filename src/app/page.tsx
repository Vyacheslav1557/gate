import React from "react";
import {DefaultLayout} from "@/components/Layout";
import { Center, Stack, Title, Text} from "@mantine/core";

export const metadata = {
    title: 'Главная',
    // description: 'Gate - платформа sch9',
};

export default function Page() {
    return (
        <DefaultLayout>
            <Center h="100vh" style={{ flexDirection: 'column' }}>
                <Stack align="center" gap="md">
                    <Title order={1} style={{ fontSize: '4rem', fontWeight: 900 }}>
                        Gate
                    </Title>
                    <Text size="xl" c="dimmed" ta="center">
                        Разработанная с нуля платформа для проведения контестов по программированию
                    </Text>
                </Stack>
            </Center>
        </DefaultLayout>
    );
}

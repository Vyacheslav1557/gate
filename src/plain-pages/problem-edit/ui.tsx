'use client';

import React from 'react';
import {Button, Group, NumberInput, Stack, Textarea, TextInput, Title} from "@mantine/core";
import {Header} from "@/components/header";
import * as testerv1 from "../../../proto/tester/v1/api";
import {useForm} from "@mantine/form";
import {useMutation} from "@tanstack/react-query";
import {UpdateProblem} from "@/shared/api";
import {useRouter} from "next/navigation";

type Props = {
    problem: testerv1.Problem
}

const ClientPage = ({problem}: Props) => {
    const router = useRouter();

    const form = useForm({
        initialValues: {
            title: problem.title,
            time_limit: problem.time_limit,
            memory_limit: problem.memory_limit,
            legend: problem.legend,
            input_format: problem.input_format,
            output_format: problem.output_format,
            notes: problem.notes,
            scoring: problem.scoring
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            return await UpdateProblem(problem.id, data);
        },
        onSuccess: async () => {
            form.resetDirty();
            await router.refresh();
        },
        onError: (error) => {
            form.clearErrors();
        },
        retry: false
    });

    const onSubmit = (event) => {
        event.preventDefault();
        mutation.mutate(form.getValues())
    }

    return (
        <>
            <Header/>
            <main>
                <form onSubmit={onSubmit}>
                    <Stack px="16" pb="16" maw="1920px" align="center" m="0 auto">
                        <Group justify="flex-end" position="apart" w="100%" mt="16">
                            <Button type="submit" disabled={!form.isDirty()}>
                                Сохранить
                            </Button>
                        </Group>
                        <Stack align="center" w="65em" gap="16">
                            <Title order={2}>{problem.title}</Title>
                            <TextInput
                                label="Название задачи"
                                w="100%"
                                key={form.key('title')}
                                {...form.getInputProps('title')}
                            />
                            <Title order={2}>Ограничения</Title>
                            <Group w="100%" justify="space-evenly">
                                <NumberInput
                                    label="Ограничение по времени в мс"
                                    placeholder="1000"
                                    flex={1}
                                    key={form.key('time_limit')}
                                    {...form.getInputProps('time_limit')}
                                />
                                <NumberInput
                                    label="Ограничение по памяти в мб"
                                    placeholder="64"
                                    flex={1}
                                    key={form.key('memory_limit')}
                                    {...form.getInputProps('memory_limit')}
                                />
                            </Group>
                            <Title order={2}>Условие</Title>
                            <Textarea
                                label="Легенда"
                                autosize
                                placeholder="Условие"
                                w="100%"
                                key={form.key('legend')}
                                {...form.getInputProps('legend')}
                            />
                            <Textarea
                                label="Формат входных данных"
                                autosize
                                placeholder="Условие"
                                w="100%"
                                key={form.key('input_format')}
                                {...form.getInputProps('input_format')}
                            />
                            <Textarea
                                label="Формат выходных данных"
                                autosize
                                placeholder="Условие"
                                w="100%"
                                key={form.key('output_format')}
                                {...form.getInputProps('output_format')}
                            />
                            <Textarea
                                label="Система оценки"
                                autosize
                                placeholder="Условие"
                                w="100%"
                                key={form.key('scoring')}
                                {...form.getInputProps('scoring')}
                            />
                            <Textarea
                                label="Примечание"
                                autosize
                                placeholder="Условие"
                                w="100%"
                                key={form.key('notes')}
                                {...form.getInputProps('notes')}
                            />
                        </Stack>
                    </Stack>
                </form>
            </main>
        </>
    );
};

export {ClientPage};
'use client';

import React, { useState } from 'react';
import { Button, Group, NumberInput, Stack, Textarea, TextInput, Title, Modal, FileInput } from "@mantine/core";
import * as testerv1 from "../../contracts/tester/v1/api";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DefaultLayout } from "@/components/Layout";

type Props = {
    problem: testerv1.Problem;
    onSubmitFn: (id: number, data: any) => Promise<any>;
    onUploadFn: (id: number, data: FormData) => Promise<any>;
}

const ProblemForm = ({ problem, onSubmitFn, onUploadFn }: Props) => {
    const router = useRouter();
    const [opened, setOpened] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const form = useForm({
        initialValues: {
            title: problem.title,
            time_limit: problem.time_limit,
            memory_limit: problem.memory_limit,
            legend: problem.legend,
            input_format: problem.input_format,
            output_format: problem.output_format,
            notes: problem.notes,
            scoring: problem.scoring,
        },
    });

    const mutation = useMutation({
        mutationFn: (data: any) => onSubmitFn(problem.id, data),
        onSuccess: async () => {
            form.resetDirty();
            router.refresh();
        },
        onError: (_) => {
            form.clearErrors();
        },
        retry: false,
    });

    const uploadMutation = useMutation({
        mutationFn: (formData: FormData) => onUploadFn(problem.id, formData),
        onSuccess: () => {
            setOpened(false);
            setFile(null);
        },
        onError: (error) => {
            console.error("Upload failed:", error);
        },
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        mutation.mutate(form.getValues());
    };

    const handleUpload = () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            uploadMutation.mutate(formData);
        }
    };

    return (
        <DefaultLayout>
            <form onSubmit={onSubmit}>
                <Stack px="16" pb="16" maw="1920px" align="center" m="0 auto">
                    <Group justify="flex-end" w="100%" mt="16">
                        <Button type="submit" disabled={!form.isDirty()}>
                            Сохранить
                        </Button>
                        <Button onClick={() => setOpened(true)}>
                            Загрузить файл
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

            {/* Modal for file upload */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Загрузить файл"
                centered
            >
                <Stack>
                    <FileInput
                        label="Выберите файл"
                        placeholder="Выберите файл"
                        onChange={setFile}
                        value={file}
                    />
                    <Button
                        onClick={handleUpload}
                        disabled={!file}
                        loading={uploadMutation.isPending}
                    >
                        Загрузить
                    </Button>
                </Stack>
            </Modal>
        </DefaultLayout>
    );
};

export { ProblemForm };
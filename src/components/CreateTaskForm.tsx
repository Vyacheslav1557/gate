"use client";

import React from "react";
import {useMutation} from "@tanstack/react-query";
import {ActionIcon, Button, Group, Loader, Modal, Table, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {IconPlus} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {useRouter} from "next/navigation";
import {ProblemsListItem} from "../../contracts/tester/v1/api";

type CreateTaskParams = {
    contest_id: number | undefined;
    problem_id: number | undefined;
};

type CreateTaskFormProps = {
    contest_id: number;
    fetchProblems: (title: string) => Promise<ProblemsListItem[] | null>;
    onSubmitFn: (params: CreateTaskParams) => Promise<number | null>;
};

interface FormValues {
    problemTitle: string;
}

const CreateTaskForm = ({contest_id, fetchProblems, onSubmitFn}: CreateTaskFormProps) => {
    const [opened, setOpened] = React.useState(false);
    const [problems, setProblems] = React.useState<ProblemsListItem[]>([]);
    const router = useRouter();

    const form = useForm<FormValues>({
        initialValues: {
            problemTitle: "",
        },
    });

    const searchMutation = useMutation({
        mutationFn: async (title: string) => {
            const result = await fetchProblems(title);
            return result || [];
        },
        onSuccess: (data) => {
            setProblems(data);
        },
    });

    const addMutation = useMutation({
        mutationFn: onSubmitFn,
        onSuccess: () => {
            notifications.show({
                title: "Успех",
                message: "Задача успешно добавлена",
                color: "teal",
            });
            setOpened(false);
            form.reset();
            setProblems([]);
            router.refresh();
        },
        onError: () => {
            notifications.show({
                title: "Ошибка",
                message: "Не удалось добавить задачу",
                color: "red",
            });
        },
    });

    const handleSearch = (values: FormValues) => {
        searchMutation.mutate(values.problemTitle);
    };

    const handleAddProblem = (problemId: number) => {
        addMutation.mutate({
            contest_id,
            problem_id: problemId,
        });
    };

    return (
        <>
            <Button
                variant="light"
                leftSection={<IconPlus size={16}/>}
                onClick={() => setOpened(true)}
                color="blue"
            >
                Добавить задачу
            </Button>

            <Modal
                opened={opened}
                onClose={() => {
                    setOpened(false);
                    form.reset();
                    setProblems([]);
                }}
                title="Добавить задачу"
                size="lg"
                // centered
            >
                <form onSubmit={form.onSubmit(handleSearch)}>
                    <Group w="100%" align="center">
                        <TextInput
                            placeholder="Введите название задачи"
                            {...form.getInputProps("problemTitle")}
                            flex="1"
                        />
                        <Button type="submit" loading={searchMutation.isPending}>
                            Найти
                        </Button>
                    </Group>
                </form>

                {searchMutation.isPending && <Loader/>}

                {problems.length > 0 && (
                    <Table mt="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Название</Table.Th>
                                <Table.Th>Лимит памяти (MB)</Table.Th>
                                <Table.Th>Лимит времени (ms)</Table.Th>
                                <Table.Th>Дата создания</Table.Th>
                                <Table.Th/>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {problems.map((problem) => (
                                <Table.Tr key={problem.id}>
                                    <Table.Td>{problem.title}</Table.Td>
                                    <Table.Td>{problem.memory_limit}</Table.Td>
                                    <Table.Td>{problem.time_limit}</Table.Td>
                                    <Table.Td>{new Date(problem.created_at).toLocaleDateString()}</Table.Td>
                                    <Table.Td>
                                        <Group justify="flex-end">
                                            <ActionIcon
                                                onClick={() => handleAddProblem(problem.id)}
                                                loading={addMutation.isPending}
                                                color="green"
                                            >
                                                <IconPlus size={16}/>
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}
            </Modal>
        </>
    );
};

export {CreateTaskForm};
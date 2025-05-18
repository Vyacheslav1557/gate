"use client";

import React from 'react';
import {useMutation} from '@tanstack/react-query';
import {ActionIcon, Button, Group, Loader, Modal, Table, TextInput,} from '@mantine/core';
import {useForm} from '@mantine/form';
import {IconPlus} from '@tabler/icons-react';
import * as testerv1 from '../../contracts/tester/v1/api';

type CreateParticipantFormProps = {
    fetchUsers: (username: string) => Promise<testerv1.User[] | null>;
    onSubmitFn: (userId: number) => Promise<any>;
};

interface FormValues {
    username: string;
}

const roles = [
    "Студент",
    "Преподаватель",
    "Администратор",
];

const CreateParticipantForm = ({fetchUsers, onSubmitFn}: CreateParticipantFormProps) => {
    const [opened, setOpened] = React.useState(false);
    const [users, setUsers] = React.useState<testerv1.User[]>([]);

    const form = useForm<FormValues>({
        initialValues: {
            username: '',
        },
    });

    const searchMutation = useMutation({
        mutationFn: async (username: string) => {
            const result = await fetchUsers(username);
            return result || [];
        },
        onSuccess: (data) => {
            setUsers(data);
        },
    });

    const addMutation = useMutation({
        mutationFn: onSubmitFn,
        onSuccess: () => {
            setOpened(false);
            form.reset();
            setUsers([]);
        },
    });

    const handleSearch = (values: FormValues) => {
        searchMutation.mutate(values.username);
    };

    const handleAddUser = (userId: number) => {
        addMutation.mutate(userId);
    };

    return (
        <>
            <Button
                variant="light"
                leftSection={<IconPlus size={16}/>}
                onClick={() => setOpened(true)}
            >
                Добавить участника
            </Button>

            <Modal
                opened={opened}
                onClose={() => {
                    setOpened(false);
                    form.reset();
                    setUsers([]);
                }}
                title="Добавить участника"
                size="lg"
            >
                <form onSubmit={form.onSubmit(handleSearch)}>
                    <Group w="100%" align="center">
                        <TextInput
                            placeholder="Введите имя пользователя"
                            {...form.getInputProps('username')}
                            flex="1"
                        />
                        <Button type="submit" loading={searchMutation.isPending}>
                            Найти
                        </Button>
                    </Group>
                </form>

                {searchMutation.isPending && <Loader/>}

                {users.length > 0 && (
                    <Table mt="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Имя пользователя</Table.Th>
                                <Table.Th>Роль</Table.Th>
                                <Table.Th/>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {users.map((user) => (
                                <Table.Tr key={user.id}>
                                    <Table.Td>{user.username}</Table.Td>
                                    <Table.Td>{roles[user.role]}</Table.Td>
                                    <Table.Td>
                                        <Group justify="flex-end">
                                            <ActionIcon
                                                onClick={() => handleAddUser(user.id)}
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

export {CreateParticipantForm};
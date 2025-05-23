"use client";

import * as testerv1 from "../../contracts/tester/v1/api";
import Link from "next/link";
import {
    ActionIcon,
    Pagination,
    Stack,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Title
} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import React from "react";
import {useMutation} from "@tanstack/react-query";
import {notifications} from "@mantine/notifications";
import {useRouter} from "next/navigation";

type UsersListProps = {
    contest: testerv1.Contest,
    users: testerv1.User[],
    pagination: testerv1.Pagination,
    onDeleteFn: (id: number) => Promise<any>
};

const roles = [
    "Студент",
    "Преподаватель",
    "Администратор",
];

const ParticipantsList = ({users, pagination, contest, onDeleteFn}: UsersListProps) => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: onDeleteFn,
        onSuccess: async () => {
            // notifications.show({
            //     title: "Успех",
            //     message: "Пользователь успешно удален",
            //     color: "teal",
            // });

            router.refresh();
        },
        onError: () => {
            notifications.show({
                title: "Ошибка",
                message: "Не удалось удалить пользователя",
                color: "red",
            });
        },
        retry: false,
    });

    const getControlProps = (control: 'first' | 'previous' | 'last' | 'next') => {
        if (control === 'next') {
            if (pagination.page === pagination.total) {
                return {component: Link, href: `contests/${contest.id}/participants?page=${pagination.page}`};
            }
            return {component: Link, href: `contests/${contest.id}/participants?page=${+pagination.page + 1}`};
        }

        if (control === 'previous') {
            if (pagination.page === 1) {
                return {component: Link, href: `contests/${contest.id}/participants?page=${pagination.page}`};
            }
            return {component: Link, href: `contests/${contest.id}/participants?page=${+pagination.page - 1}`};
        }

        return {};
    };

    const getItemProps = (page: number) => {
        return {
            component: Link,
            href: `/users?page=${page}`,
        };
    };

    const rows = users.map((user) => (
        <TableTr key={user.id}>
            <TableTd>{user.username}</TableTd>
            <TableTd>{roles[user.role]}</TableTd>
            <TableTd>
                <ActionIcon
                    size="xs"
                    onClick={() => mutation.mutate(user.id)}
                    loading={mutation.isPending}
                    color="red"
                >
                    <IconTrash/>
                </ActionIcon>
            </TableTd>
        </TableTr>
    ));

    return (
        <Stack px="16">
            <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
                <Title>Участники</Title>
                <Table horizontalSpacing="xl">
                    <TableThead>
                        <TableTr>
                            <TableTh>Никнейм</TableTh>
                            <TableTh>Роль</TableTh>
                            <TableTh></TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>{rows}</TableTbody>
                </Table>
                <Pagination
                    total={pagination.total}
                    value={pagination.page}
                    getItemProps={getItemProps}
                    getControlProps={getControlProps}
                />
            </Stack>
        </Stack>
    );
};

export {ParticipantsList};
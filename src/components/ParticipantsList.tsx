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
import {IconPencil} from "@tabler/icons-react";
import React from "react";

type UsersListProps = {
    contest: testerv1.Contest,
    users: testerv1.User[],
    pagination: testerv1.Pagination
};

const roles = [
    "Студент",
    "Преподаватель",
    "Администратор",
];

const ParticipantsList = ({users, pagination, contest}: UsersListProps) => {
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
    }

    const getItemProps = (page: number) => {
        return {
            component: Link,
            href: `/users?page=${page}`,
        }
    };

    const rows = users.map((user) => (
        <TableTr key={user.id}>
            <TableTd>{user.username}</TableTd>
            {/*<TableTd>{user.email}</TableTd>*/}
            <TableTd>{roles[user.role]}</TableTd>
            <TableTd>{<ActionIcon size="xs" component={Link} href={`/users/${user.id}`}>
                <IconPencil/>
            </ActionIcon>}
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
                            {/*<TableTh>Почта</TableTh>*/}
                            <TableTh>Роль</TableTh>
                            <TableTh></TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>{rows}</TableTbody>
                </Table>
                <Pagination total={pagination.total}
                            value={pagination.page}
                            getItemProps={getItemProps}
                            getControlProps={getControlProps}
                />
            </Stack>
        </Stack>
    );
};

export {ParticipantsList};
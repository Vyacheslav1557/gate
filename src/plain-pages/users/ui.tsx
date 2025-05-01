"use client";

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
import Link from "next/link";
import {IconPencil} from "@tabler/icons-react";
import {Header} from "@/components/header";
import React from "react";
import * as userv1 from "../../../proto/user/v1/api";


type Props = {
    users: userv1.User[],
    pagination: userv1.Pagination
};

const roles = [
    "Студент",
    "Преподаватель",
    "Администратор",
];


const ClientPage = ({users, pagination}: Props) => {
    const getControlProps = (control) => {
        if (control === 'next') {
            if (pagination.page === pagination.total) {
                return {component: Link, href: `/users?page=${pagination.page}`};
            }

            return {component: Link, href: `/users?page=${+pagination.page + 1}`};
        }

        if (control === 'previous') {
            if (pagination.page === 1) {
                return {component: Link, href: `/users?page=${pagination.page}`};
            }
            return {component: Link, href: `/users?page=${+pagination.page - 1}`};
        }

        return {};
    }

    const getItemProps = (page) => ({
        component: Link,
        href: `/users?page=${page}`,
    });

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
        <>
            <Header/>
            <main>
                <Stack px="16">
                    <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
                        <Title>Пользователи</Title>
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
            </main>

            {/*<AppShellAside withBorder={false} px="16">*/}
            {/*    <Stack pt="16">*/}
            {/*        <TextInput placeholder="Поиск"/>*/}
            {/*        <Button component={Link} href="/users/new">*/}
            {/*            Добавить пользователя*/}
            {/*        </Button>*/}
            {/*    </Stack>*/}
            {/*</AppShellAside>*/}
        </>
    );
};

export {ClientPage};
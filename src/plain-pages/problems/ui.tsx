'use client';

import React from 'react';
import {
    ActionIcon,
    AppShellAside,
    Button,
    Group,
    Pagination,
    Stack,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import {IconCheck, IconPencil, IconUser} from "@tabler/icons-react";
import Link from "next/link";
import {Header} from "@/components/header";
import * as testerv1 from "../../../proto/tester/v1/api";

type Props = {
    problems: testerv1.ProblemsListItem[],
    pagination: testerv1.Pagination,
}

const ClientPage = ({problems, pagination}: Props) => {
    const getItemProps = (page) => ({
        component: Link,
        href: `/problems?page=${page}`,
    });

    const getControlProps = (control) => {
        if (control === 'next') {
            if (pagination.page === pagination.total) {
                return {component: Link, href: `/problems?page=${pagination.page}`};
            }

            return {component: Link, href: `/problems?page=${+pagination.page + 1}`};
        }

        if (control === 'previous') {
            if (pagination.page === 1) {
                return {component: Link, href: `/problems?page=${pagination.page}`};
            }
            return {component: Link, href: `/problems?page=${+pagination.page - 1}`};
        }

        return {};
    };

    const rows = problems.map((problem) => (
        <TableTr key={problem.id}>
            <TableTd>
                <Text td="underline">{problem.title}</Text>
            </TableTd>
            <TableTd>
                <Group align="end" gap="2" justify="center">
                    <IconUser/>
                    <Text td="underline">{123}</Text>
                </Group>
            </TableTd>
            <TableTd>
                <ActionIcon
                    size="xs"
                    component={Link}
                    href={`/problems/${problem.id}`}
                >
                    <IconPencil/>
                </ActionIcon>
            </TableTd>
        </TableTr>
    ));

    return (
        <>
            <Header/>
            <main>
                <Group px="16">
                    <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
                        <Title>Архив задач</Title>
                        <Table horizontalSpacing="xl">
                            <TableThead>
                                <TableTr>
                                    <TableTh>Название</TableTh>
                                    <TableTh><IconCheck/></TableTh>
                                    <TableTh><IconPencil/></TableTh>
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
                </Group>
            </main>
            {/*<aside>*/}
            {/*    <Stack px="16">*/}
            {/*        <Stack pt="16">*/}
            {/*            <Stack gap="5">*/}
            {/*                <Button title="Создать контест">Создать контест</Button>*/}
            {/*                <Button title="Создать задачу">Создать задачу</Button>*/}
            {/*            </Stack>*/}
            {/*            <TextInput placeholder="Поиск"/>*/}
            {/*        </Stack>*/}
            {/*    </Stack>*/}
            {/*</aside>*/}
        </>
    );
};

export {ClientPage};
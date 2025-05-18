'use client';

import React from 'react';
import {
    ActionIcon,
    AppShellAside,
    AppShellFooter,
    AppShellHeader,
    AppShellMain,
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
    Title
} from "@mantine/core";
import {IconPencil} from "@tabler/icons-react";
import Link from "next/link";
import * as testerv1 from "../../contracts/tester/v1/api";
import {CreateProblemForm} from "@/components/CreateProblemForm";
import {CreateContestForm} from "@/components/CreateContestForm";
import {Layout} from "@/components/Layout";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";

type Props = {
    onCreateProblem: () => Promise<number | null>,
    onCreateContest: () => Promise<number | null>,
    problems: testerv1.ProblemsListItem[],
    pagination: testerv1.Pagination,
}

const ProblemsList = ({problems, pagination, onCreateProblem, onCreateContest}: Props) => {
    const getItemProps = (page: number) => ({
        component: Link,
        href: `/problems?page=${page}`,
    });

    const getControlProps = (control: 'first' | 'previous' | 'last' | 'next') => {
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
            {/*<TableTd>*/}
            {/*    <Group align="end" gap="2" justify="center">*/}
            {/*        <IconUser/>*/}
            {/*        <Text td="underline">{123}</Text>*/}
            {/*    </Group>*/}
            {/*</TableTd>*/}
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
        <Layout>
            <AppShellHeader>
                <Header/>
            </AppShellHeader>
            <AppShellMain>
                <Group px="16">
                    <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
                        <Title>Архив задач</Title>
                        <Table horizontalSpacing="xl">
                            <TableThead>
                                <TableTr>
                                    <TableTh>Название</TableTh>
                                    {/*<TableTh><IconCheck/></TableTh>*/}
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
            </AppShellMain>
            <AppShellAside withBorder={false}>
                <Stack px="16">
                    <Stack pt="16">
                        <Stack gap="5">
                            <CreateContestForm onSubmitFn={onCreateContest}/>
                            <CreateProblemForm onSubmitFn={onCreateProblem}/>
                        </Stack>
                        {/*<TextInput placeholder="Поиск"/>*/}
                    </Stack>
                </Stack>
            </AppShellAside>
            <AppShellFooter withBorder={false}>
                <Footer/>
            </AppShellFooter>
        </Layout>
    );
};

export {ProblemsList};
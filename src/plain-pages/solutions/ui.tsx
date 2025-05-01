'use client';

import React from 'react';
import {Pagination, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, Title} from "@mantine/core";
import Link from "next/link";
import {Header} from "@/components/header";
import * as testerv1 from "../../../proto/tester/v1/api";

type Props = {
    solutions: testerv1.SolutionsListItem[],
    pagination: testerv1.Pagination,
}

const ClientPage = ({solutions, pagination}: Props) => {
    const getItemProps = (page) => ({
        component: Link,
        href: `/solutions?page=${page}`,
    });

    const getControlProps = (control) => {
        if (control === 'next') {
            if (pagination.page === pagination.total) {
                return {component: Link, href: `/solutions?page=${pagination.page}`};
            }

            return {component: Link, href: `/solutions?page=${+pagination.page + 1}`};
        }

        if (control === 'previous') {
            if (pagination.page === 1) {
                return {component: Link, href: `/solutions?page=${pagination.page}`};
            }
            return {component: Link, href: `/solutions?page=${+pagination.page - 1}`};
        }

        return {};
    };

    const rows = solutions.map((solution) => (
        <TableTr key={solution.id}>
            <TableTd>
                <Text>{solution.created_at}</Text>
            </TableTd>
            <TableTd>
                <Text td="underline">user123</Text>
            </TableTd>
            <TableTd>
                <Text td="underline">C. Арбуз</Text>
            </TableTd>
            <TableTd>
                <Text>PyPy 3.12</Text>
            </TableTd>
            <TableTd>
                <Text c="green">AC</Text>
            </TableTd>
            <TableTd>
                <Text>91 мс</Text>
            </TableTd>
            <TableTd>
                <Text>4600 КБ</Text>
            </TableTd>
        </TableTr>
    ));

    return (
        <>
            <Header/>
            <main>
                <Stack px="16">
                    <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
                        <Title>Посылки</Title>
                        <Table horizontalSpacing="xl">
                            <TableThead>
                                <TableTr>
                                    <TableTh>Когда</TableTh>
                                    <TableTh>Кто</TableTh>
                                    <TableTh>Задача</TableTh>
                                    <TableTh>Язык</TableTh>
                                    <TableTh>Вердикт</TableTh>
                                    <TableTh>Время</TableTh>
                                    <TableTh>Память</TableTh>
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
            </main>
        </>
    );
};

export {ClientPage};
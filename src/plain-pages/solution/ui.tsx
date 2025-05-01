'use client';

import React from 'react';
import {Code, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, Title} from "@mantine/core";
import {Header} from "@/components/header";
import * as testerv1 from "../../../proto/tester/v1/api";

type Props = {
    solution: testerv1.Solution
}

const ClientPage = ({solution}: Props) => {
    const rows = [solution].map((solution) => (
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
                        <Stack alig="flex-start" w="100%">
                            <Title order={2}>Код решения</Title>
                            <Code block w="100%" style={{minHeight: 100}}>
                                {solution.solution}
                            </Code>
                        </Stack>
                    </Stack>
                </Stack>
            </main>
        </>
    );
};

export {ClientPage};
import React from 'react';
import {Metadata} from "next";
import {Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, Title} from "@mantine/core";
import {notFound, redirect} from "next/navigation";
import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {testerApi} from "@/lib/api";
import {DefaultLayout} from "@/components/Layout";
import {LangNameToString, LangString, ProblemTitle, StateColor, StateString, TimeBeautify} from "@/lib/lib";
import Link from "next/link";
import {CodeBlock} from "@/components/CodeBlock";

type Props = {
    params: Promise<{ solution_id: number }>
}

const GetSolution = async (token: string | undefined, id: number | undefined) => {
    if (!id) {
        notFound();
    }
    if (!token) {
        redirect("/login");
    }
    const options = withBearerAuth(token);
    try {
        const response = await testerApi.getSolution(id, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}

const metadata: Metadata = {
    title: `Просмотр посылки`,
    description: '',
}

const Page = async (props: Props) => {
    const solutionId = (await props.params).solution_id;
    const token = await getAuthToken();

    const resp = await GetSolution(token, solutionId);

    if (!resp) {
        return (
            <div>Что-то пошло не так!</div>
        );
    }

    const {solution} = resp;

    const rows = [solution].map((solution) => (
        <TableTr key={solution.id}>
            <TableTd ta="center">
                <Text>{TimeBeautify(solution.created_at)}</Text>
            </TableTd>
            <TableTd ta="center">
                <Text
                    component={Link}
                    href={`/users/${solution.user_id}`}
                    td="underline"
                >
                    {solution.username}
                </Text>
            </TableTd>
            <TableTd ta="center">
                <Text component={Link}
                      href={`/contests/${solution.contest_id}/problems/${solution.problem_id}`}
                      td="underline"
                >
                    {ProblemTitle(solution.position, solution.problem_title)}
                </Text>
            </TableTd>
            <TableTd ta="center">
                <Text>{LangString(solution.language)}</Text>
            </TableTd>
            <TableTd ta="center">
                <Text c={StateColor(solution.state)} fw={500}>{StateString(solution.state)}</Text>
            </TableTd>
            <TableTd ta="center">
                <Text>{solution.time_stat} ms</Text>
            </TableTd>
            <TableTd ta="center">
                <Text>{solution.memory_stat} KB</Text>
            </TableTd>
        </TableTr>
    ));

    return (
        <DefaultLayout>
            <Stack px="16">
                <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
                    <Table horizontalSpacing="sm">
                        <TableThead>
                            <TableTr>
                                <TableTh ta="center">Когда</TableTh>
                                <TableTh ta="center">Кто</TableTh>
                                <TableTh ta="center">Задача</TableTh>
                                <TableTh ta="center">Язык</TableTh>
                                <TableTh ta="center">Вердикт</TableTh>
                                <TableTh ta="center">Время</TableTh>
                                <TableTh ta="center">Память</TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>{rows}</TableTbody>
                    </Table>
                    <Stack align="flex-start" w="100%">
                        <Title order={2}>Код решения</Title>
                        <CodeBlock code={solution.solution} language={LangNameToString(solution.language)}/>
                    </Stack>
                </Stack>
            </Stack>
        </DefaultLayout>
    );
};

export {Page as default, metadata};

import {Metadata} from "next";
import {
    Anchor,
    AppShellAside,
    AppShellFooter,
    AppShellHeader,
    AppShellMain,
    Button,
    Card,
    Stack,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    Title,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import * as testerv1 from "../../../../contracts/tester/v1/api";
import {notFound, redirect} from "next/navigation";
import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {testerApi} from "@/lib/api";
import {CreateTaskForm} from "@/components/CreateTaskForm";
import {CreateTask, fetchProblems} from "@/app/contests/[contest_id]/actions";
import {numberToLetters} from "@/lib/lib";
import {Layout} from "@/components/Layout";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {CreateParticipantForm} from "@/components/CreateParticipantForm";
import {IconDeviceDesktop, IconMail, IconUsers} from "@tabler/icons-react";

type Props = {
    params: Promise<{ contest_id: number }>;
};

const GetContest = async (token: string | undefined, id: number | undefined) => {
    if (!id) notFound();
    if (!token) redirect("/login");

    try {
        const response = await testerApi.getContest(id, withBearerAuth(token));
        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
};

export const generateMetadata = async ({params}: Props): Promise<Metadata> => {
    const {contest_id} = await params;
    const token = await getAuthToken();
    const response = await GetContest(token, contest_id);

    return {
        title: response?.contest.title || "Контест не найден",
        description: response?.contest.title || "",
    };
};

type ContestProps = {
    contest: testerv1.Contest;
    tasks: Array<testerv1.ContestProblemListItem>;
};

const Contest = ({contest, tasks}: ContestProps) => {
    const formatTimeLimit = (timeMs: number) => {
        if (timeMs % 1000 === 0) {
            return `${timeMs / 1000} s`;
        }
        return `${timeMs} ms`;
    };

    const formatMemoryLimit = (memoryKb: number) => {
        return `${memoryKb} MB`;
    };


    const fetchUsers = async (username: string) => {
        "use server";

        const token = await getAuthToken();
        if (!token || !username || username === "") {
            return null;
        }

        try {
            const response = await testerApi.listUsers(1, 20, undefined, undefined, username, withBearerAuth(token));
            return response.data.users;
        } catch (error) {
            return handleResponseError(error);
        }
    }

    const submitCreateParticipant = async (userId: number) => {
        "use server";

        const token = await getAuthToken();
        if (!token) {
            return null;
        }

        try {
            const response = await testerApi.createParticipant(contest.id, userId, withBearerAuth(token));
            return response.data;
        } catch (error) {
            return handleResponseError(error);
        }
    }

    return (
        <Layout>
            <AppShellHeader>
                <Header/>
            </AppShellHeader>
            <AppShellMain>
                <Stack gap="lg" align="center" style={{padding: '2rem'}}>
                    <Title order={1} ta="center" style={{marginBottom: '1.5rem'}}>
                        {contest.title}
                    </Title>
                    <Card
                        withBorder
                        radius="md"
                        w="100%"
                        maw={900}
                        shadow="sm"
                        style={{
                            padding: '1.5rem',
                        }}
                    >
                        <Table
                            verticalSpacing="md"
                            horizontalSpacing="xl"
                        >
                            <TableThead>
                                <TableTr>
                                    <TableTh style={{textAlign: 'center', padding: '1rem'}}>
                                        Название
                                    </TableTh>
                                    <TableTh style={{textAlign: 'center', padding: '1rem'}}>
                                        Ограничения
                                    </TableTh>
                                </TableTr>
                            </TableThead>
                            <TableTbody>
                                {tasks.map((task) => (
                                    <TableTr
                                        key={task.problem_id}
                                    >
                                        <TableTd style={{padding: '1rem'}}>
                                            <Anchor
                                                component={Link}
                                                href={`/contests/${contest.id}/problems/${task.problem_id}`}
                                                c="blue"
                                                fw={500}
                                                style={{
                                                    textDecoration: 'none',
                                                    '&:hover': {textDecoration: 'underline'}
                                                }}
                                            >
                                                {`${numberToLetters(task.position)}. ${task.title}`}
                                            </Anchor>
                                        </TableTd>
                                        <TableTd style={{textAlign: 'center', padding: '1rem'}}>
                                            <Text fw={500}>
                                                {formatTimeLimit(task.time_limit)}, {formatMemoryLimit(task.memory_limit)}
                                            </Text>
                                        </TableTd>
                                    </TableTr>
                                ))}
                                {tasks.length === 0 && (
                                    <TableTr>
                                        <TableTd colSpan={3} style={{padding: '2rem'}}>
                                            <Text
                                                c="dimmed"
                                                ta="center"
                                                size="lg"
                                                style={{fontStyle: 'italic'}}
                                            >
                                                Нет задач в контесте
                                            </Text>
                                        </TableTd>
                                    </TableTr>
                                )}
                            </TableTbody>
                        </Table>
                    </Card>
                </Stack>
            </AppShellMain>

            <AppShellAside p="md">
                <Stack gap="md">
                    <Button
                        variant="light"
                        component={Link}
                        href={`/solutions?contestId=${contest.id}&order=-1`}
                        leftSection={<IconMail size={16}/>}
                    >
                        Все посылки
                    </Button>
                    <Button
                        variant="light"
                        component={Link}
                        href={`/contests/${contest.id}/monitor`}
                        leftSection={<IconDeviceDesktop size={16}/>}
                    >
                        Монитор
                    </Button>
                    {/*<Button*/}
                    {/*    variant="outline"*/}
                    {/*>*/}
                    {/*    Редактировать контест*/}
                    {/*</Button>*/}
                    <CreateParticipantForm
                        fetchUsers={fetchUsers}
                        onSubmitFn={submitCreateParticipant}
                    />
                    <Button
                        variant="light"
                        component={Link}
                        href={`/contests/${contest.id}/participants`}
                        leftSection={<IconUsers size={16}/>}
                    >
                        Участники
                    </Button>
                    <CreateTaskForm contest_id={contest.id}
                                    onSubmitFn={CreateTask}
                                    fetchProblems={fetchProblems}
                    />
                </Stack>
            </AppShellAside>
            <AppShellFooter withBorder={false}>
                <Footer/>
            </AppShellFooter>
        </Layout>
    );
};

const Page = async ({params}: Props) => {
    const {contest_id} = await params;
    const token = await getAuthToken();
    const response = await GetContest(token, contest_id);

    if (!response) {
        return (
            <Stack align="center" mt="xl">
                <Text c="red">Не удалось загрузить контест</Text>
                <Button component={Link} href="/">
                    Вернуться на главную
                </Button>
            </Stack>
        );
    }

    return <Contest contest={response.contest} tasks={response.problems}/>;
};

export default Page;
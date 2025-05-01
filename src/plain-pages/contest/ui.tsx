"use client";

import React from 'react';
import {Header} from "@/components/header";
import {Contest, GetContestResponseTasksInner} from "../../../proto/tester/v1/api";
import {
    ActionIcon,
    Anchor,
    Button,
    Center,
    Group,
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
import {IconMail, IconTrash} from "@tabler/icons-react";
import {DeleteTask} from "@/shared/api";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {numberToLetters} from "@/shared/lib";

type PageProps = {
    contest: Contest,
    tasks: Array<GetContestResponseTasksInner>
}

const Page = (props: PageProps) => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: DeleteTask,
        onSuccess: async () => {
            await router.refresh();
        },
        retry: false
    });

    const rows = props.tasks.map((task) => (
        <TableTr key={task.task.id}>
            <TableTd>
                <Anchor component={Link}
                        href={`/contests/${props.contest.id}/tasks/${task.task.id}`}
                        c="var(--mantine-link-color)"
                        underline="always"
                >
                    {`${numberToLetters(task.task.position)}. ${task.task.title}`}
                </Anchor>
            </TableTd>
            <TableTd>{task.solution.score}</TableTd>
            <TableTd>
                <Button component={Link} href={`/`} size="xs">
                    Мои посылки
                </Button>
            </TableTd>
            <TableTd>
                <ActionIcon onClick={() => mutation.mutate(task.task.id)}>
                    <IconTrash/>
                </ActionIcon>
            </TableTd>
        </TableTr>
    ))

    return (
        <>
            <Header/>
            <main>
                <Stack gap="xl" align="center" mt="md">
                    <Title order={1}>{props.contest.title}</Title>
                    <Table horizontalSpacing="xl" align="center" w="fit-content">
                        <TableThead>
                            <TableTr>
                                <TableTh>Название</TableTh>
                                <TableTh>Баллы</TableTh>
                                <TableTh>
                                    <Center>
                                        <IconMail/>
                                    </Center>
                                </TableTh>
                                <TableTh>
                                    <Center>
                                        <IconTrash/>
                                    </Center>
                                </TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>{rows}</TableTbody>
                    </Table>
                    <Stack>
                        <Center>
                            <Group>
                                <Button>
                                    Все посылки
                                </Button>
                                <Button>
                                    Редактировать контест
                                </Button>
                            </Group>
                        </Center>
                        <Center>
                            <Group>
                                <Button>
                                    Добавить пользователя
                                </Button>
                                <Button>
                                    Добавить задачу
                                </Button>
                            </Group>
                        </Center>
                    </Stack>
                </Stack>
            </main>
        </>
    );
};

export {Page as ClientPage};

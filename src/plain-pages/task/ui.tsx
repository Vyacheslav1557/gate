"use client";

import React from 'react';
import {Anchor, Group, SegmentedControl, Stack, Text, Title} from "@mantine/core";
import {Header} from "@/components/header";
import {Code} from "@/components/code";
import Link from "next/link";
import * as testerv1 from "../../../proto/tester/v1/api";
import {Problem} from "@/components/problem";
import {numberToLetters} from "@/shared/lib";

type PageProps = {
    tasks: testerv1.TasksListItem[]
    contest: testerv1.Contest,
    task: testerv1.Task
}


const Page = ({tasks, contest, task}: PageProps) => {
    const getTaskData = item => ({
        label: `${numberToLetters(item.position)}. ${item.title}`,
        value: item
    });

    return (
        <>
            <Header/>
            <Group align="start" justify="center" mt="md">
                <nav style={{padding: "var(--mantine-spacing-xs) var(--mantine-spacing-md)", width: "fit-content"}}>
                    <Stack w={200}>
                        <Anchor component={Link} href={`/contests/${contest.id}`} c="var(--mantine-color-bright)">
                            <Title c="black" order={4} ta="center">
                                {contest.title}
                            </Title>
                        </Anchor>
                        <SegmentedControl
                            orientation="vertical"
                            withItemsBorders={false}
                            data={tasks.map(getTaskData)}
                            fullWidth
                            defaultValue={getTaskData(tasks.find((item) => item.id === task.id))}
                        />
                    </Stack>
                </nav>
                <Problem problem={task} letter={numberToLetters(task.position)}/>
                <aside style={{padding: "var(--mantine-spacing-xs) var(--mantine-spacing-md)", width: "fit-content"}}>
                    <Stack>
                        <Code/>
                        <Text fw={500}>Последние посылки&nbsp;
                            <Anchor
                                component={Link}
                                href="/"
                                fs="italic"
                                c="var(--mantine-color-bright)" fw={500}>
                                (посмотреть все)
                            </Anchor>:
                        </Text>
                    </Stack>
                </aside>
            </Group>
        </>
    );
};

export {Page as ClientPage};

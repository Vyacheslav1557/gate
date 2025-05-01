'use client';

import React from 'react';
import {Button, Group, Stack} from "@mantine/core";
import {Header} from "@/components/header";
import * as testerv1 from "../../../proto/tester/v1/api";
import {Problem} from "@/components/problem";
import Link from "next/link";

type Props = {
    problem: testerv1.Problem
}

const ClientPage = ({problem}: Props) => {
    return (
        <>
            <Header/>
            <main>
                <Stack px="16" pb="16" maw="1920px" m="0 auto">
                    <Group justify="flex-end" w="100%" mt="16">
                        <Button component={Link} href={`/problems/${problem.id}/edit`}>
                            Редактировать
                        </Button>
                    </Group>
                    <Stack align="center" w="fit-content" gap="16" m="0 auto">
                        <Problem problem={problem} letter="A"/>
                    </Stack>
                </Stack>
            </main>
        </>
    );
};

export {ClientPage};
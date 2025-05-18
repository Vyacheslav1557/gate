'use server';

import React from 'react';
import {Metadata} from "next";
import {Button, Group, Stack} from "@mantine/core";
import Link from "next/link";
import {Problem} from "@/components/Problem";
import {notFound, redirect} from 'next/navigation';
import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {testerApi} from "@/lib/api";
import {DefaultLayout} from "@/components/Layout";

type Props = {
    params: Promise<{ problem_id: number }>
}

const GetProblem = async (token: string | undefined, problem_id: number | undefined) => {
    if (!problem_id) {
        notFound();
    }
    if (!token) {
        redirect("/login");
    }
    const options = withBearerAuth(token);


    try {
        const response = await testerApi.getProblem(problem_id, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}

const generateMetadata = async (props: Props): Promise<Metadata> => {
    const problem_id = (await props.params).problem_id;
    const token = await getAuthToken();

    const response = await GetProblem(token, problem_id);
    if (!response) {
        return {
            title: "Что-то пошло не так!",
        }
    }

    return {
        title: `A. ${response.problem.title}`,
        description: '',
    };
}

const Page = async (props: Props) => {
    const problem_id = (await props.params).problem_id;
    const token = await getAuthToken();
    const response = await GetProblem(token, problem_id);
    if (!response) {
        return (
            <div>Что-то пошло не так!</div>
        );
    }

    const problem = response.problem;

    return (
        <DefaultLayout>
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
        </DefaultLayout>
    )
};

export {Page as default, generateMetadata};

import {Metadata} from "next";
import React from "react";
import {forbidden, notFound, redirect} from "next/navigation";
import {getAuthToken, handleResponseError, parseAuthToken, Role, withBearerAuth} from "@/lib/auth";
import {testerApi} from "@/lib/api";
import {AppShellAside, AppShellHeader, AppShellMain, Stack} from "@mantine/core";
import {Layout} from "@/components/Layout";
import {Header} from "@/components/Header";
import {ParticipantsList} from "@/components/ParticipantsList";

type Props = {
    params: Promise<{ contest_id: number }>
    searchParams: Promise<{ page: number }>
}

const metadata: Metadata = {
    title: 'Участники',
    description: '',
}

const ListParticipants = async (page: number, pageSize: number, contestId: number) => {
    const token = await getAuthToken();
    if (!token) {
        redirect("/login");
    }

    const jwt = parseAuthToken(token);
    if (jwt.role !== Role.Admin && jwt.role !== Role.Teacher) {
        forbidden();
    }

    const options = withBearerAuth(token);

    try {
        const response = await testerApi.listParticipants(contestId, page, pageSize, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}

const GetContest = async (contestId: number) => {
    const token = await getAuthToken();
    if (!token) {
        redirect("/login");
    }

    const options = withBearerAuth(token);

    try {
        const response = await testerApi.getContest(contestId, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}

const Page = async (props: Props) => {
    const page = (await props.searchParams).page || 1;
    const contestId = (await props.params).contest_id;

    if (!contestId) {
        notFound()
    }

    const contest = await GetContest(contestId)
    const usersList = await ListParticipants(page, 15, contestId);

    if (!usersList || !contest) {
        return (
            <div>Что-то пошло не так!</div>
        );
    }

    const onDeleteFn = async (id: number) => {
        "use server";

        const token = await getAuthToken();
        if (!token) {
            return null;
        }

        const options = withBearerAuth(token);
        try {
            const response = await testerApi.deleteParticipant(id, contestId, options);

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
                <ParticipantsList
                    users={usersList.users}
                    pagination={usersList.pagination}
                    contest={contest.contest}
                    onDeleteFn={onDeleteFn}
                />
            </AppShellMain>
            <AppShellAside withBorder={false} px="16">
                <Stack pt="16">
                    {/*<TextInput placeholder="Поиск"/>*/}
                    {/*<CreateUserForm onSubmitFn={CreateUser}/>*/}
                </Stack>
            </AppShellAside>
        </Layout>
    )
}

export {Page as default, metadata};
import {Metadata} from "next";
import React from "react";
import {UsersList} from "@/components/UsersList";
import {forbidden, redirect} from "next/navigation";
import {getAuthToken, handleResponseError, parseAuthToken, Role, withBearerAuth} from "@/lib/auth";
import {testerApi} from "@/lib/api";
import {AppShellAside, AppShellFooter, AppShellHeader, AppShellMain, Stack} from "@mantine/core";
import {Layout} from "@/components/Layout";
import {Header} from "@/components/Header";
import {CreateUserForm} from "@/components/CreateUserForm";
import {CreateUser} from "./actions";
import {Footer} from "@/components/Footer";

type Props = {
    searchParams: Promise<{ page: number }>
}

const metadata: Metadata = {
    title: 'Пользователи',
    description: '',
}

const GetUsers = async (page: number, pageSize: number) => {
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
        const response = await testerApi.listUsers(page,
            pageSize,
            undefined,
            undefined,
            undefined,
            options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}

const Page = async (props: Props) => {
    const page = (await props.searchParams).page || 1;

    const usersList = await GetUsers(page, 10);

    if (!usersList) {
        return (
            <div>Что-то пошло не так!</div>
        );
    }

    return (
        <Layout>
            <AppShellHeader>
                <Header/>
            </AppShellHeader>
            <AppShellMain>
                <UsersList users={usersList.users} pagination={usersList.pagination}/>
            </AppShellMain>
            <AppShellAside withBorder={false} px="16">
                <Stack pt="16">
                    {/*<TextInput placeholder="Поиск"/>*/}
                    <CreateUserForm onSubmitFn={CreateUser}/>
                </Stack>
            </AppShellAside>
            <AppShellFooter withBorder={false}>
                <Footer/>
            </AppShellFooter>
        </Layout>
    )
}

export {Page as default, metadata};
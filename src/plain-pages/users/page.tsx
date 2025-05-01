"use server";

import {GetUsers} from "@/shared/api";
import {ClientPage} from "./ui";
import {Metadata} from "next";

const generateMetadata = async ({params}: Props): Promise<Metadata> => {
    return {
        title: 'Пользователи',
        description: '',
    };
}


type Props = {
    searchParams: Promise<{ page: number }>
}

const Page = async (props: Props) => {
    const page = (await props.searchParams).page || 1;

    const usersList = await GetUsers(page, 10);

    return (
        <ClientPage users={usersList.users} pagination={usersList.pagination}/>
    )
}

export {Page as UsersPage, generateMetadata};
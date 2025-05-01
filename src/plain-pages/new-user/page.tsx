"use server";

import {ClientPage} from "./ui";
import {Metadata} from "next";

const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: 'Добавить пользователя',
        description: '',
    };
}

const Page = async () => {
    return (
        <ClientPage/>
    )
}

export {Page as NewUserPage, generateMetadata};
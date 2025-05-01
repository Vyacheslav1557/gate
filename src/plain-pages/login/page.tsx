"use server";

import {ClientPage} from "./ui";
import {Metadata} from "next";

const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: 'Вход в аккаунт',
        description: '',
    };
}

const Page = async () => {
    return (
        <ClientPage/>
    )
}

export {Page as LoginPage, generateMetadata};
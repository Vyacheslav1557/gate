"use server";

import {Metadata} from "next";
import {ClientPage} from "@/plain-pages/user/ui";
import {GetUser, ParseJWT} from "@/shared/api";
import {notFound} from "next/navigation";

type Props = {
    params: Promise<{ user_id: number }>
}

const generateMetadata = async ({params}: Props): Promise<Metadata> => {
    const user_id = (await params).user_id;

    try {
        const response = await GetUser(user_id);
        return {
            title: `Профиль пользователя ${response.user.username}`,
        }
    } catch (e) {
        notFound();
    }
}

const ServerPage = async ({params}: Props) => {
    const user_id = (await params).user_id;

    try {
        const response = await GetUser(user_id);
        const jwt = await ParseJWT();

        let canEdit = false;

        if (jwt.user_id === response.user.id && jwt.hasPermission({action: "update", resource: "me-user"})) {
            canEdit = true;
        }

        if (jwt.user_id !== response.user.id && jwt.hasPermission({action: "read", resource: "another-user"})) {
            canEdit = true;
        }

        return (
            <ClientPage user={response.user} canEdit={canEdit}/>
        )
    } catch (e) {
        notFound();
    }
}

export {ServerPage as UserPage, generateMetadata};

"use server";

import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {testerApi} from "@/lib/api";

type Credentials = {
    username: string,
    password: string
}

export const CreateUser = async (credentials: Credentials) => {
    const token = await getAuthToken();
    if (!token) {
        redirect("/login");
    }

    const options = withBearerAuth(token);

    try {
        const response = await testerApi.createUser(credentials, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}

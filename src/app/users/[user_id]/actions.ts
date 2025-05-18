"use server";

import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {testerApi} from "@/lib/api";

export const UpdateUser = async (id: number, role?: any, username?: string) => {
    const token = await getAuthToken();
    if (!token) {
        redirect("/login");
    }
    const options = withBearerAuth(token);

    const req = {
        role: role,
        username: username
    }

    try {
        const response = await testerApi.updateUser(id, req, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
};
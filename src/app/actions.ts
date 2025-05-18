"use server";

import {
    clearAuthToken,
    getAuthToken,
    handleResponseError,
    parseAuthToken,
    setAuthToken,
    withBearerAuth
} from "@/lib/auth";
import {redirect} from "next/navigation";
import {testerApi} from "@/lib/api";

export const Refresh = async (): Promise<string | null> => {
    const token = await getAuthToken();
    if (!token) {
        return null;
    }
    const options = withBearerAuth(token);

    try {
        const response = await testerApi.refresh(options);

        const token = response.headers["authorization"]?.split(" ")[1];
        await setAuthToken(token);
        return token;
    } catch (error) {
        return handleResponseError(error);
    }
};

export const Logout = async () => {
    const token = await getAuthToken();
    if (!token) {
        redirect("/login");
    }

    const options = withBearerAuth(token);
    try {
        const response = await testerApi.logout(options)
        await clearAuthToken();
        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
};

export const GetMe = async () => {
    const token = await getAuthToken();
    if (!token) {
        return null;
    }

    const jwt = parseAuthToken(token);
    const options = withBearerAuth(token);

    try {
        const response = await testerApi.getUser(jwt.user_id, options);
        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
};
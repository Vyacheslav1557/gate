"use server";

import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {testerApi} from "@/lib/api";
import {redirect} from "next/navigation";

export const CreateProblem = async () => {
    const token = await getAuthToken();
    if (!token) {
        redirect("/login");
    }
    const options = withBearerAuth(token);

    try {
        const response = await testerApi.createProblem("Пустая задача", options);

        return response.data.id;
    } catch (error) {
        return handleResponseError(error);
    }
}

export const CreateContest = async () => {
    const token = await getAuthToken();
    if (!token) {
        redirect("/login");
    }
    const options = withBearerAuth(token);

    try {
        const response = await testerApi.createContest("Пустой контест", options);

        return response.data.id;
    } catch (error) {
        return handleResponseError(error);
    }
}
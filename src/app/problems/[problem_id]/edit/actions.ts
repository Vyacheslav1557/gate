"use server";

import {UpdateProblemRequest} from "../../../../../contracts/tester/v1/api";
import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {testerApi} from "@/lib/api";

export const UpdateProblem = async (id: number, data: UpdateProblemRequest) => {
    const token = await getAuthToken();
    if (!token) {
        redirect("/login");
    }
    const options = withBearerAuth(token);

    try {
        const response = await testerApi.updateProblem(id, data, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}
"use server";

import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {testerApi} from "@/lib/api";

type CreateTaskParams = {
    contest_id: number | undefined,
    problem_id: number | undefined,
}

export const CreateTask = async (
    {contest_id, problem_id}: CreateTaskParams,
): Promise<number | null> => {
    const token = await getAuthToken();
    if (!token) {
        return null;
    }
    if (!contest_id || !problem_id) {
        return null;
    }

    const options = withBearerAuth(token);

    try {
        const response = await testerApi.createContestProblem(contest_id, problem_id, options);

        return response.data.id;
    } catch (error) {
        return handleResponseError(error);
    }
};

export const fetchProblems = async (title: string) => {
    const token = await getAuthToken();
    if (!token) {
        return null;
    }

    try {
        const response = await testerApi.listProblems(1, 20, title, 1, withBearerAuth(token));
        return response.data.problems;
    } catch (error) {
        return handleResponseError(error);
    }
}
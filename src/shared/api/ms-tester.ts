"use server";

import {Configuration, DefaultApi, UpdateProblemRequest} from "../../../proto/tester/v1/api";
import {cookies} from "next/headers";
import {AxiosRequestConfig} from "axios";

const configuration = new Configuration({
    basePath: "http://localhost:60060",
});

const testerApi = new DefaultApi(configuration);

const CookieName: any = "SESSIONID";

export const ListContests = async (page: number, pageSize: number) => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    };

    const response = await testerApi.listContests(page, pageSize, options);

    return response.data;
};

export const GetContest = async (id: number) => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    }

    const response = await testerApi.getContest(id, options);

    return response.data;
};

export const DeleteTask = async (taskId: number) => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    };

    const response = await testerApi.deleteTask(taskId, options);
    return response.data;
}

export const ListProblems = async (page: number, pageSize: number) => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    };

    const response = await testerApi.listProblems(page, pageSize, options);

    return response.data;
}

export const ListSolutions = async (page: number, pageSize: number) => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    };

    const response = await testerApi.listSolutions(
        page,
        pageSize,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        options,
    );

    return response.data;
}

export const GetProblem = async (id: number) => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    };

    const response = await testerApi.getProblem(id, options);

    return response.data;
}

export const GetSolution = async (id: number) => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    };

    const response = await testerApi.getSolution(id, options);

    return response.data;
}

export const GetTask = async (id: number) => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    };

    const response = await testerApi.getTask(id, options);

    return response.data;
}

export const UpdateProblem = async (id: number, data: UpdateProblemRequest) => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    };

    const response = await testerApi.updateProblem(id, data, options);

    return response.data;
}
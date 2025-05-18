"use server";

import {AxiosRequestConfig} from "axios";
import {handleResponseError, setAuthToken} from "@/lib/auth";
import {testerApi} from "@/lib/api";

type Credentials = {
    username: string,
    password: string
}

export const Login = async (credentials: Credentials) => {
    const options: AxiosRequestConfig = {
        headers: {
            "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password)
        }
    }

    try {
        const response = await testerApi.login(options)
        const token = response.headers["authorization"]?.split(" ")[1];

        await setAuthToken(token);

    } catch (error) {
        return handleResponseError(error);
    }
}
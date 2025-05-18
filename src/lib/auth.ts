import {cookies} from "next/headers";
import {decode} from "jsonwebtoken";
import axios, {AxiosRequestConfig} from "axios";
import {forbidden, notFound, unauthorized} from "next/navigation";

export const COOKIE_NAME = "SESSIONID";

export enum Role {
    Student = 0,
    Teacher = 1,
    Admin = 2
}

export interface JWT {
    session_id: string;
    user_id: number;
    role: number;
    iat: number;
}

export const setAuthToken = async (token: string) => {
    const decoded = decode(token) as JWT;
    const expires = decoded.iat * 1000 + 35 * 60 * 1000;

    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        expires,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
}

export const clearAuthToken = async () => {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export const getAuthToken = async (): Promise<string | undefined> => {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export const parseAuthToken = (token: string): JWT => {
    return decode(token) as JWT;
}

export const withBearerAuth = (token: string) => {
    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + token
        }
    };

    return options;
}

export const handleResponseError = (error: any) => {
    if (!axios.isAxiosError(error)) {
        console.log(error);
        return null;
    }

    if (error.response?.status === 401) {
        unauthorized();
    }

    if (error.response?.status === 403) {
        forbidden();
    }

    if (error.response?.status === 404) {
        notFound();
    }

    if (error.response?.status === 500) {
        console.log(error);
        return null;
    }

    console.log(error);
    return null;
}
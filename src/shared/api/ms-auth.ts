"use server";

import {AxiosRequestConfig} from "axios";
import {decode} from "jsonwebtoken";
import {cookies} from "next/headers";
import {Configuration, DefaultApi} from "../../../proto/user/v1/api";

const configuration = new Configuration({
    basePath: "http://localhost:60005",
});

const authApi = new DefaultApi(configuration);

export type Credentials = {
    username: string,
    password: string
}

const CookieName: any = "SESSIONID";

type Grant = {
    action: "create" | "read" | "update" | "delete";
    resource: "another-user" | "me-user" | "list-user" | "own-session";
}

type JWT = {
    session_id: string
    user_id: number
    role: number
    exp: number
    iat: number
    nbf: number
    permissions: Grant[]
}

class JWTWithPermissions {
    public session_id: string
    public user_id: number
    public role: number
    public exp: number
    public iat: number
    public nbf: number
    public permissions: Grant[]

    constructor(jwt: JWT) {
        this.session_id = jwt.session_id;
        this.user_id = jwt.user_id;
        this.role = jwt.role;
        this.exp = jwt.exp;
        this.iat = jwt.iat;
        this.nbf = jwt.nbf;
        this.permissions = jwt.permissions;
    }

    public hasPermission(grant: Grant): boolean {
        return this.permissions.some((permission) => permission.action === grant.action && permission.resource === grant.resource);
    }
}


export const ParseJWT = async () => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
    }

    const token = session.value;

    return new JWTWithPermissions(decode(token) as JWT);
}


export const Login = async (credentials: Credentials) => {
    const options: AxiosRequestConfig = {
        headers: {
            "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password)
        }
    }

    const response = await authApi.login(options)

    const token = response.headers["authorization"].split(" ")[1];
    const decoded = decode(token) as JWT;

    const cookieArgs: any = {
        httpOnly: true,
        expires: new Date(decoded["exp"] * 1000),
        sameSite: 'strict',
    };

    const cookieStore = await cookies();

    cookieStore.set(CookieName, token, cookieArgs);

    return response.data;
};
export const GetUser = async (id: number) => {
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

    const response = await authApi.getUser(id, options);

    return response.data;
};

export const UpdateUser = async (id: number, role?: any, username?: string) => {
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

    const req = {
        role: role,
        username: username
    }

    const response = await authApi.updateUser(id, req, options);

    return response.data;
};

export const Logout = async () => {
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

    const response = await authApi.logout(options)

    return response.data;
};

export const GetMe = async () => {
    const cookieStore = await cookies();

    const session = cookieStore.get(CookieName);

    if (session === undefined) {
        throw new Error("Session id not found");
        // redirect("/login");
    }

    const options: AxiosRequestConfig = {
        headers: {
            'Authorization': "Bearer " + session.value
        }
    };

    const token = new JWTWithPermissions(decode(session.value) as JWT);

    // if (token.exp < Date.now() / 1000) {
    //     redirect("/login");
    // }

    const response = await authApi.getUser(token.user_id, options);

    return response.data;
};

export const GetUsers = async (page: number, pageSize: number) => {
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

    const response = await authApi.listUsers(page, pageSize, options);

    return response.data;
}

export const CreateUser = async (credentials: Credentials) => {
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

    const response = await authApi.createUser(credentials, options);

    return response.data;
}
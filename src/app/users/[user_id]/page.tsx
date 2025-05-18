import {Metadata} from "next";
import {getAuthToken, handleResponseError, parseAuthToken, Role, withBearerAuth} from "@/lib/auth";
import {ProfileForm} from "@/components/ProfileForm";
import {notFound, redirect} from "next/navigation";
import {testerApi} from "@/lib/api";
import {UpdateUser} from "@/app/users/[user_id]/actions";

type Props = {
    params: Promise<{ user_id: number }>
}

const GetUser = async (token: string | undefined, user_id: number | undefined) => {
    if (!user_id) {
        notFound();
    }
    if (!token) {
        redirect("/login");
    }
    const options = withBearerAuth(token);

    try {
        const response = await testerApi.getUser(user_id, options);

        return response.data.user;
    } catch (error) {
        return handleResponseError(error);
    }
}

const generateMetadata = async ({params}: Props): Promise<Metadata> => {
    const user_id = (await params).user_id;
    const token = await getAuthToken();

    const user = await GetUser(token, user_id);

    if (!user) {
        return {
            title: "Что-то пошло не так!",
        }
    }

    return {
        title: `Профиль пользователя ${user.username}`,
    }
}

const Page = async ({params}: Props) => {
    const user_id = (await params).user_id;
    const token = await getAuthToken();

    const user = await GetUser(token, user_id);

    if (!user) {
        return (
            <div>Что-то пошло не так!</div>
        );
    }

    const jwt = parseAuthToken(token!);

    const canEdit = (jwt.role === Role.Teacher || jwt.role === Role.Admin) && jwt.user_id != user_id;

    return (
        <ProfileForm user={user} canEdit={canEdit} onSubmit={UpdateUser}/>
    )
}

export {Page as default, generateMetadata};

import {Metadata} from "next";
import {LoginForm} from "@/components/LoginForm";
import {Login} from "./actions";
import {DefaultLayout} from "@/components/Layout";

const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: 'Вход в аккаунт',
        description: "Войдите в Gate для доступа к вашему профилю",
    };
}

const Page = async () => {
    return (
        <DefaultLayout>
            <LoginForm onSubmitFn={Login}/>
        </DefaultLayout>
    )
}

export {Page as default, generateMetadata};
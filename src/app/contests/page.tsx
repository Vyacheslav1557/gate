import {Metadata} from "next";
import {ContestsList} from "@/components/ContestsList";
import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {testerApi} from "@/lib/api";

const metadata: Metadata = {
    title: 'Контесты',
    description: '',
}

type Props = {
    searchParams: Promise<{ page: number }>
}

const ListContests = async (token: string | undefined, page: number, pageSize: number) => {
    if (!token) {
        redirect("/login");
    }

    const options = withBearerAuth(token);
    try {
        const response = await testerApi.listContests(page, pageSize, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
};

const Page = async (props: Props) => {
    const page = (await props.searchParams).page || 1;
    const token = await getAuthToken();

    const contestsList = await ListContests(token, page, 10);
    if (!contestsList) {
        return (
            <div>Что-то пошло не так!</div>
        );
    }

    return (
        <ContestsList contests={contestsList.contests} pagination={contestsList.pagination}/>
    )
}

export {Page as default, metadata};
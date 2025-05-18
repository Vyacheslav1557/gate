import React from 'react';
import {Metadata} from "next";
import {ProblemsList} from "@/components/ProblemsList";
import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {testerApi} from "@/lib/api";
import {CreateContest, CreateProblem} from "./actions";

const metadata: Metadata = {
    title: 'Мастерская',
    description: '',
}

type Props = {
    searchParams: Promise<{ page: number }>
}

const ListProblems = async (token: string | undefined, page: number, pageSize: number) => {
    if (!token) {
        redirect("/login");
    }

    const options = withBearerAuth(token);

    try {
        const response = await testerApi.listProblems(page, pageSize, undefined, undefined, options);
        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}


const Page = async (props: Props) => {
    const page = (await props.searchParams).page || 1;
    const token = await getAuthToken();

    const problemsList = await ListProblems(token, page, 10);
    if (!problemsList) {
        return (
            <div>Что-то пошло не так!</div>
        );
    }

    return (
        <ProblemsList
            onCreateContest={CreateContest}
            onCreateProblem={CreateProblem}
            problems={problemsList.problems}
            pagination={problemsList.pagination}
        />
    )
};

export {Page as default, metadata};

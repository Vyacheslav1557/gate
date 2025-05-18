'use server';

import React from 'react';
import {Metadata} from "next";
import {ProblemForm} from '@/components/ProblemForm';
import {notFound, redirect} from "next/navigation";
import {getAuthToken, handleResponseError, withBearerAuth} from "@/lib/auth";
import {testerApi} from "@/lib/api";
import {UpdateProblem} from "@/app/problems/[problem_id]/edit/actions";

type Props = {
    params: Promise<{ problem_id: number }>
}

const GetProblem = async (token: string | undefined, problem_id: number | undefined) => {
    if (!problem_id) {
        notFound();
    }
    if (!token) {
        redirect("/login");
    }
    const options = withBearerAuth(token);

    try {
        const response = await testerApi.getProblem(problem_id, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}

const generateMetadata = async (props: Props): Promise<Metadata> => {
    const problem_id = (await props.params).problem_id;
    const token = await getAuthToken();

    const problem = await GetProblem(token, problem_id);
    if (!problem) {
        return {
            title: "Что-то пошло не так!",
        }
    }

    return {
        title: `Редактирование  ${problem.problem.title}`,
        description: '',
    };
}

const Page = async (props: Props) => {
    const problem_id = (await props.params).problem_id;
    const token = await getAuthToken();

    const problem = await GetProblem(token, problem_id);

    if (!problem) {
        return (
            <div>Что-то пошло не так!</div>
        );
    }

    return (
        <ProblemForm problem={problem.problem} onSubmitFn={UpdateProblem}/>
    )
};

export {Page as default, generateMetadata};

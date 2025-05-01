'use server';

import React from 'react';
import {Metadata} from "next";
import {ClientPage} from "./ui";
import {GetProblem} from "@/shared/api";

type Props = {
    params: Promise<{ problem_id: number }>
}

const generateMetadata = async (props: Props): Promise<Metadata> => {
    const problem_id = (await props.params).problem_id;

    const problem = await GetProblem(problem_id);

    return {
        title: problem.problem.title,
        description: '',
    };
}

const Page = async (props: Props) => {
    const problem_id = (await props.params).problem_id;

    const problem = await GetProblem(problem_id);

    return (
        <ClientPage problem={problem.problem}/>
    )
};

export {Page as ProblemEditPage, generateMetadata};

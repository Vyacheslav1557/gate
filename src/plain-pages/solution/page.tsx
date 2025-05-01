'use server';

import React from 'react';
import {Metadata} from "next";
import {ClientPage} from "./ui";
import {GetSolution} from "@/shared/api";

type Props = {
    params: Promise<{ solution_id: number }>
}

const generateMetadata = async (props: Props): Promise<Metadata> => {
    const solutionId = (await props.params).solution_id;

    const solution = await GetSolution(solutionId);

    return {
        title: `Посылка #${solution.solution.id}`,
        description: '',
    };
}

const Page = async (props: Props) => {
    const solutionId = (await props.params).solution_id;

    console.log(solutionId);

    const solution = await GetSolution(solutionId);

    return (
        <ClientPage solution={solution.solution}/>
    )
};

export {Page as SolutionPage, generateMetadata};

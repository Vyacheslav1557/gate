import React from 'react';
import {Metadata} from "next";
import {Task} from "@/components/Task";
import {numberToLetters} from "@/lib/lib";
import {testerApi} from "@/lib/api";
import {notFound, redirect} from "next/navigation";
import {getAuthToken, handleResponseError, withBearerAuth} from '@/lib/auth';
import {CreateSolution} from "@/app/contests/[contest_id]/problems/[problem_id]/actions";

type Props = {
    params: Promise<{ contest_id: number, problem_id: number }>
}

const GetProblem = async (
    token: string | undefined,
    contest_id: number | undefined,
    problem_id: number | undefined,
) => {
    if (!token) {
        redirect("/login");
    }
    if (!contest_id || !problem_id) {
        notFound();
    }
    const options = withBearerAuth(token);

    try {
        const response = await testerApi.getContestProblem(problem_id, contest_id, options);

        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}

const GetContest = async (token: string | undefined, id: number | undefined) => {
    if (!id) {
        notFound();
    }
    if (!token) {
        redirect("/login");
    }

    try {
        const response = await testerApi.getContest(id, withBearerAuth(token));
        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
}

const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params;
    const token = await getAuthToken();

    const problem = await GetProblem(token, params.contest_id, params.problem_id);
    if (!problem) {
        return {
            title: "Что-то пошло не так!",
        }
    }

    return {
        title: `${numberToLetters(problem.problem.position)}. ${problem.problem.title}`,
        description: problem.problem.legend_html,
    };
}

const Page = async (props: Props) => {
    const params = await props.params;
    const token = await getAuthToken();


    const GetSolutions = async () => {
        const token = await getAuthToken();
        if (!token) {
            redirect("/login");
        }

        try {
            const response = await testerApi.listSolutions(
                1, 20,
                params.contest_id,
                undefined,
                undefined,
                undefined,
                -1,
                undefined,
                withBearerAuth(token),
            );
            return response.data.solutions;
        } catch (error) {
            return handleResponseError(error);
        }
    }

    const solutions = await GetSolutions();

    const problem = await GetProblem(token, params.contest_id, params.problem_id);
    const contest = await GetContest(token, params.contest_id);

    if (!problem || !contest) {
        return (
            <div>Что-то пошло не так!</div>
        );
    }

    const onSubmit = async (solution: FormData, language: string): Promise<number | null> => {
        "use server";

        return await CreateSolution(contest.contest.id, problem.problem.problem_id, solution, language);
    }

    return (
        <Task task={problem.problem}
              contest={contest.contest}
              tasks={contest.problems}
              onSubmit={onSubmit}
              solutions={solutions || []}
        />
    )
};

export {Page as default, generateMetadata};

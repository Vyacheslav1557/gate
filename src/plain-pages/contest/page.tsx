"use server";

import {ClientPage} from "./ui";
import {Metadata} from "next";
import {GetContest} from "@/shared/api";

type Props = {
    params: Promise<{ contest_id: number }>
}

const generateMetadata = async (props: Props): Promise<Metadata> => {
    const contest_id = (await props.params).contest_id;

    const response = await GetContest(contest_id);

    return {
        title: response.contest.title,
        description: '',
    };
}


const Page = async (props: Props) => {
    const contest_id = (await props.params).contest_id;

    const response = await GetContest(contest_id);

    return (
        <ClientPage contest={response.contest} tasks={response.tasks}/>
    )
}

export {Page as ContestPage, generateMetadata};
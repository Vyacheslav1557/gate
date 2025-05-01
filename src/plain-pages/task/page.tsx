'use server';

import React from 'react';
import {Metadata} from "next";
import {ClientPage} from "./ui";
import {GetTask} from "@/shared/api";
import {numberToLetters} from "@/shared/lib";

type Props = {
    params: Promise<{ task_id: number }>
}

const generateMetadata = async (props: Props): Promise<Metadata> => {
    const task_id = (await props.params).task_id;

    const task = await GetTask(task_id);

    return {
        title: `${numberToLetters(task.task.position)}. ${task.task.title}`,
        description: '',
    };
}

const Page = async (props: Props) => {
    const task_id = (await props.params).task_id;

    const task = await GetTask(task_id);

    return (
        <ClientPage tasks={task.tasks} task={task.task} contest={task.contest}/>
    )
};

export {Page as TaskPage, generateMetadata};

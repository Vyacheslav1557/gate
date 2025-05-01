'use server';

import React from 'react';
import {Metadata} from "next";
import {ClientPage} from "./ui";
import {ListProblems} from "@/shared/api";

const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: 'Мастерская',
        description: '',
    };
}

type Props = {
    searchParams: Promise<{ page: number }>
}


const Page = async (props: Props) => {
    const page = (await props.searchParams).page || 1;

    const problemsList = await ListProblems(page, 10);

    return (
        <ClientPage problems={problemsList.problems} pagination={problemsList.pagination}/>
    )
};

export {Page as ProblemsPage, generateMetadata};

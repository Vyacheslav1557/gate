'use server';

import React from 'react';
import {Metadata} from "next";
import {ClientPage} from "./ui";
import {ListSolutions} from "@/shared/api";

const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: 'Посылки',
        description: '',
    };
}

type Props = {
    searchParams: Promise<{ page: number }>
}


const Page = async (props: Props) => {
    const page = (await props.searchParams).page || 1;

    const problemsList = await ListSolutions(page, 10);

    return (
        <ClientPage solutions={problemsList.solutions} pagination={problemsList.pagination}/>
    )
};

export {Page as SolutionsPage, generateMetadata};

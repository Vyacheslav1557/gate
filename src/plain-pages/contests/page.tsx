"use server";

import {ClientPage} from "./ui";
import {Metadata} from "next";
import {ListContests} from "@/shared/api";

const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: 'Контесты',
        description: '',
    };
}

type Props = {
    searchParams: Promise<{ page: number }>
}

const Page = async (props: Props) => {
    const page = (await props.searchParams).page || 1;

    const contestsList = await ListContests(page, 10);

    return (
        <ClientPage contests={contestsList.contests} pagination={contestsList.pagination}/>
    )
}

export {Page as ContestsPage, generateMetadata};
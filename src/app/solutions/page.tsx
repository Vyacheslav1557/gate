import React from 'react';
import {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {getAuthToken, handleResponseError, parseAuthToken, Role, withBearerAuth} from '@/lib/auth';
import {testerApi} from '@/lib/api';
import * as testerv1 from '../../../contracts/tester/v1/api';
import {Stack, Title} from '@mantine/core';
import {DefaultLayout} from '@/components/Layout';
import {NextPagination} from '@/components/Pagination';
import {SolutionsListWithWS} from '@/components/SolutionsList'; // New Client Component

export const metadata: Metadata = {
    title: 'Посылки',
    description: '',
};

interface SearchParams {
    page?: string;
    contestId?: string;
    userId?: string;
    problemId?: string;
    state?: string;
    order?: string;
    language?: string;
}

const PAGE_SIZE = 15;

interface ListSolutionsParams {
    page: number;
    pageSize: number;
    contestId?: number;
    userId?: number;
    problemId?: number;
    state?: number;
    order?: number;
    language?: number;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

const isValidInteger = (value: unknown): boolean =>
    typeof value === 'string' && !isNaN(Number(value)) && Number.isInteger(Number(value));

const parseSearchParams = (searchParams: SearchParams): ListSolutionsParams => {
    const params: ListSolutionsParams = {page: 1, pageSize: PAGE_SIZE};

    const fields: (keyof SearchParams)[] = [
        'page',
        'contestId',
        'userId',
        'problemId',
        'state',
        'order',
        'language',
    ];

    fields.forEach((field) => {
        if (searchParams[field] && isValidInteger(searchParams[field])) {
            (params as any)[field] = Number(searchParams[field]);
        }
    });

    return params;
};

const fetchSolutions = async (
    params: ListSolutionsParams
): Promise<testerv1.ListSolutionsResponse | null> => {
    const token = await getAuthToken();
    if (!token) {
        redirect('/login');
    }

    const jwt = parseAuthToken(token);

    if (jwt.role !== Role.Admin && jwt.role !== Role.Teacher) {
        params.userId = jwt.user_id;
    }

    // console.log(params)

    try {
        const response = await testerApi.listSolutions(
            params.page,
            params.pageSize,
            params.contestId,
            params.userId,
            params.problemId,
            params.state,
            params.order,
            params.language,
            withBearerAuth(token)
        );
        return response.data;
    } catch (error) {
        return handleResponseError(error);
    }
};

const Page = async ({searchParams}: PageProps) => {
    const params = parseSearchParams(await searchParams);
    const solutionsList = await fetchSolutions(params);

    if (!solutionsList) {
        return <div>Что-то пошло не так!</div>;
    }

    const queryParams: Record<string, string | number | undefined> = {
        page: params.page,
        pageSize: params.pageSize,
        contestId: params.contestId,
        userId: params.userId,
        problemId: params.problemId,
        state: params.state,
        order: params.order,
        language: params.language,
    };

    const token = solutionsList["access-token"];

    const wsUrl = process.env.NEXT_PUBLIC_WS_TESTER_URL! + "/solutions";

    return (
        <DefaultLayout>
            <Stack px="16">
                <Stack align="center" w="fit-content" m="auto" pt="16" gap="16">
                    <Title>Посылки</Title>
                    <SolutionsListWithWS
                        initialSolutions={solutionsList.solutions}
                        wsUrl={wsUrl}
                        token={token!}
                        queryParams={queryParams}
                    />
                    <NextPagination
                        pagination={solutionsList.pagination}
                        baseUrl="/solutions"
                        queryParams={queryParams}
                    />
                </Stack>
            </Stack>
        </DefaultLayout>
    );
};

export default Page;
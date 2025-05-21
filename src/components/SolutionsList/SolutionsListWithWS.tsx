'use client';

import React, {useEffect, useState} from 'react';
import {SolutionsList} from '@/components/SolutionsList';
import * as testerv1 from '../../../contracts/tester/v1/api';

interface Message {
    message_type: string;
    items?: testerv1.ListSolutionsResponse;
    item?: SolutionItem;
}

interface SolutionItem {
    solution_id: number;
    message?: any; // FIXME
    state?: number;
    score?: number;
    memory_stat?: number;
    time_stat?: number;
}

interface SolutionsListWithWebSocketProps {
    initialSolutions: testerv1.SolutionsListItem[];
    wsUrl: string;
    token: string;
    queryParams: Record<string, string | number | undefined>;
    pagination: testerv1.Pagination;
}

// @ts-ignore
const SolutionsListWithWS: React.FC<SolutionsListWithWebSocketProps> = (
    {
        initialSolutions,
        wsUrl,
        token,
        queryParams,
    }
) => {
    const [solutions, setSolutions] = useState<testerv1.SolutionsListItem[]>(initialSolutions);
    const [ws, setWs] = useState<WebSocket | null>(null);

    const buildQueryString = (params: Record<string, string | number | undefined>) => {
        const validParams = Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== '')
            .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`);
        return validParams.length > 0 ? `?${validParams.join('&')}` : '';
    };

    const url = `${wsUrl}${buildQueryString(queryParams)}&token=${encodeURIComponent("Bearer " + token)}`;

    // console.log(url);

    useEffect(() => {

        const websocket = new WebSocket(url);

        websocket.onopen = () => {
            console.log('WebSocket connected');

            const interval = setInterval(() => {
                if (websocket.readyState === WebSocket.OPEN) {
                    websocket.send(JSON.stringify({}));
                }
            }, 10000);

            (websocket as any).interval = interval; // FIXME
        };

        websocket.onmessage = (event) => {
            try {
                const message: Message = JSON.parse(event.data);
                if (message.message_type === 'SYNC') {

                    if (message.items?.solutions) {
                        setSolutions(message.items.solutions);
                    }
                } else if (message.message_type === 'UPDATE') {

                    if (message.item) {
                        setSolutions((prevSolutions) =>
                            prevSolutions.map((solution) =>
                                solution.id === message.item!.solution_id
                                    ? {
                                        ...solution,
                                        state: message.item!.state ?? message.item?.message ?? solution.state,
                                        score: message.item!.score ?? solution.score,
                                        memory_stat: message.item!.memory_stat ?? solution.memory_stat,
                                        time_stat: message.item!.time_stat ?? solution.time_stat,
                                    }
                                    : solution
                            )
                        );
                    }
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setWs(websocket);

        return () => {
            if ((websocket as any).interval) {
                clearInterval((websocket as any).interval);
            }

            websocket.close();
        };
    }, [wsUrl, token]);

    return <SolutionsList solutions={solutions}/>;
};

export {SolutionsListWithWS};
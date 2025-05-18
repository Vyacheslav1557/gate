"use client";

import React from 'react';
import {Button} from "@mantine/core";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";


type CreateContestFormProps = {
    onSubmitFn: () => Promise<number | null>
};

const CreateContestForm = (props: CreateContestFormProps) => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async () => {
            const resp = await props.onSubmitFn();
            if (!resp) {
                return 0;
            }

            return resp;
        },
        onSuccess: async (data: number) => {
            router.push(`/contests/${data}`)
        },
        onError: (error) => {
            console.error("Не удалось создать контест. Попробуйте позже.", error)
        }
    });

    return (
        <>
            <Button title="Создать задачу" onClick={() => mutation.mutate()}>
                Создать контест
            </Button>
        </>
    );
};

export {CreateContestForm};
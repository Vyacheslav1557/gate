"use client";

import React from 'react';
import {Button} from "@mantine/core";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";


type CreateProblemFormProps = {
    onSubmitFn: () => Promise<number | null>
};

const CreateProblemForm = (props: CreateProblemFormProps) => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async () => {
            const resp = await props.onSubmitFn();

            if (resp === null) {
                return 0;
            }

            return resp;
        },
        onSuccess: async (data: number) => {
            router.push(`/problems/${data}`)
        },
        onError: (error) => {
            console.error("Не удалось создать задачу. Попробуйте позже.", error)
        }
    });

    return (
        <>
            <Button title="Создать задачу" onClick={() => mutation.mutate()}>
                Создать задачу
            </Button>
        </>
    );
};

export {CreateProblemForm};
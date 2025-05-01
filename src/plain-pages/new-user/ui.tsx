"use client";

import {Button, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {Header} from "@/components/header";
import React from "react";
import {useForm} from "@mantine/form";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {CreateUser, Credentials} from "@/shared/api";
import {CreateUserResponse} from "../../../proto/user/v1/api";

const Page = () => {
    const router = useRouter();

    const form = useForm({
        initialValues: {
            username: "",
            password: ""
        },
    });

    const mutation = useMutation({
        mutationFn: async (credentials: Credentials) => {
            return await CreateUser(credentials)
        },
        onSuccess: async (data: CreateUserResponse) => {
            await router.push(`/users/${data.id}`)
        },
        onError: (error) => {
            form.clearErrors();

            form.setFieldError("username", "Что-то пошло не так. Попробуйте позже.")
        },
        retry: false
    });

    const onSubmit = (event) => {
        event.preventDefault()
        mutation.mutate(form.getValues())
    }

    return (
        <>
            <Header/>
            <main>
                <form onSubmit={onSubmit}>
                    <Stack
                        align="center"
                        justify="center"
                        w="fit-content"
                        m="auto"
                        mt="5%"
                        p="md"
                        style={{color: "var(--mantine-color-bright)"}}
                    >
                        <Title>Добавить пользователя</Title>
                        <Stack w="100%" gap="0" align="center">
                            <TextInput
                                label="Username"
                                placeholder="Username"
                                key={form.key('username')}
                                w="250"
                                {...form.getInputProps('username')}
                            />
                            <PasswordInput
                                label="Пароль"
                                placeholder="Пароль"
                                w="250"
                                key={form.key('password')}
                                {...form.getInputProps('password')}
                            />
                        </Stack>
                        <Button type="submit" loading={mutation.isPending}>Добавить</Button>
                    </Stack>
                </form>
            </main>
        </>
    );
};

export {Page as ClientPage};

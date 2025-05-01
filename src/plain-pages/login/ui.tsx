"use client";

import {Button, Image, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {Header} from "@/components/header";
import React from "react";
import {useForm} from "@mantine/form";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import NextImage from "next/image";
import {Login} from "@/shared/api";

const Page = () => {
    const router = useRouter();

    const form = useForm({
        initialValues: {
            username: "",
            password: ""
        },
    });

    const mutation = useMutation({
        mutationFn: Login,
        onSuccess: async () => {
            await router.push("/")
        },
        onError: (error) => {
            form.clearErrors();

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    form.setFieldError("username", "Неверный юзернейм или пароль")
                    return
                }
            }

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
                <form
                    onSubmit={onSubmit}
                >
                    <Stack
                        align="center"
                        justify="center"
                        w="fit-content"
                        m="auto"
                        mt="5%"
                        p="md"
                        style={{color: "var(--mantine-color-bright)"}}
                    >
                        <Image
                            component={NextImage}
                            src="/gate_logo.svg"
                            alt="Gate logo"
                            width="40"
                            height="40"
                            maw="40"
                            mah="40"
                        />
                        <Title>Войти в Gate</Title>
                        <Stack w="100%" gap="0">
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
                        <Button type="submit" loading={mutation.isPending}>Войти</Button>
                    </Stack>
                </form>
            </main>
        </>
    );
};

export {Page as ClientPage};

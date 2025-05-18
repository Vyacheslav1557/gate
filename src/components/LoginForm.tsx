"use client";

import {useForm} from "@mantine/form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {Button, Image, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import NextImage from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

type Credentials = {
    username: string
    password: string
}

type LoginFormProps = {
    onSubmitFn: (credentials: Credentials) => Promise<any>
}

const LoginForm = ({onSubmitFn}: LoginFormProps) => {
    const form = useForm<Credentials>({
        initialValues: {
            username: "",
            password: ""
        },
    });
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: onSubmitFn,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['me'] });
            await router.push("/");
        },
        onError: (error) => {
            form.clearErrors();

            if (!axios.isAxiosError(error)) {
                form.setFieldError(
                    "username",
                    "Что-то пошло не так. Возможно, ошибка сети. Попробуйте позже.",
                );
                return
            }

            if (error.response?.status === 401 || error.response?.status === 404) {
                form.setFieldError("username", "Неверный юзернейм или пароль");
                return
            }

            if (error.response?.status === 500) {
                form.setFieldError("username", "Серверная ошибка. Попробуйте позже.");
                return
            }

            form.setFieldError("username", "Неизвестная ошибка. Попробуйте позже.");
        },
        retry: false
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (form.validate().hasErrors)
            return;
        mutation.mutate(form.getValues())
    }

    return (
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
                <Button type="submit"
                        loading={mutation.isPending}
                        disabled={mutation.isPending || !form.isValid()}
                >
                    Войти
                </Button>
            </Stack>
        </form>
    )
}

export {LoginForm};
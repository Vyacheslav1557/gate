"use client";

import {
    Anchor,
    Avatar,
    Burger,
    Button,
    Divider,
    Drawer,
    Group,
    Image,
    ScrollArea,
    Skeleton,
    Stack,
    Title
} from '@mantine/core';
import classes from './header.module.css';
import React from "react";
import Link from "next/link";
import NextImage from "next/image"
import {IconUser} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {GetMe, Logout} from "@/shared/api";

const Profile = () => {
    const router = useRouter();

    const {isPending, isSuccess} = useQuery({
        queryKey: ['me'],
        queryFn: GetMe,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const mutation = useMutation({
        mutationFn: Logout,

        onSuccess: async () => {
            await router.push("/login")
        },
        onError: (error) => {
            console.error("Не удалось выйти из аккаунта. Попробуйте позже.", error)
        },
    });

    if (isPending) {
        return (
            <Group justify="flex-end">
                <Button component={Link} href="/login" variant="default">
                    Войти
                </Button>
                <Skeleton height="60" circle/>
            </Group>
        )
    }

    if (isSuccess) {
        return (
            <Group justify="flex-end">
                <Button variant="default" visibleFrom="sm" onClick={() => mutation.mutate()}>
                    Выйти
                </Button>
                <Avatar component={Link} href="/users/1" color="gray" size="60">
                    <IconUser size="32"/>
                </Avatar>
            </Group>
        );
    }

    return (
        <Group justify="flex-end">
            <Button ml="76" component={Link} href="/login" variant="default">
                Войти
            </Button>
        </Group>
    );
}

const Header = () => {
    const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] = useDisclosure(false);

    return (
        <header>
            <div className={classes.header}>
                <Group justify="space-between" h="100%" maw="1920px" mx="auto">
                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="xs"/>
                    <Group component={Link} href="/" className={classes.link} visibleFrom="xs">
                        <Image component={NextImage} src="/gate_logo.svg" alt="Gate logo" width="40" height="40"/>
                        <Title visibleFrom="md">Gate</Title>
                    </Group>
                    <Group h="100%" gap={0}>
                        <Anchor component={Link} href="/contests" className={classes.link} underline="never"
                                visibleFrom="xs">
                            Контесты
                        </Anchor>
                        <Anchor component={Link} href="/users" className={classes.link} underline="never"
                                visibleFrom="xs">
                            Пользователи
                        </Anchor>
                        <Anchor component={Link} href="/problems" className={classes.link} underline="never"
                                visibleFrom="xs">
                            Мастерская
                        </Anchor>
                    </Group>
                    <Profile/>
                </Group>
            </div>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                hiddenFrom="xs"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px)" mx="-md">
                    <Stack>
                        <Anchor component={Link} href="/" className={classes.link} underline="never">
                            Главная
                        </Anchor>
                        <Anchor component={Link} href="/contests" className={classes.link} underline="never">
                            Контесты
                        </Anchor>
                        <Anchor component={Link} href="/users" className={classes.link} underline="never">
                            Пользователи
                        </Anchor>
                        <Anchor component={Link} href="/workshop" className={classes.link} underline="never">
                            Мастерская
                        </Anchor>
                    </Stack>

                    <Divider my="sm"/>
                </ScrollArea>
            </Drawer>
        </header>
    );
}

export {Header};

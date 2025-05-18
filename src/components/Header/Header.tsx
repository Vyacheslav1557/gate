"use client";

import {
    ActionIcon,
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
    Title,
    useComputedColorScheme,
    useMantineColorScheme
} from '@mantine/core';
import classes from './styles.module.css';
import React, {useEffect} from "react";
import Link from "next/link";
import NextImage from "next/image"
import {IconMoon, IconSun, IconUser} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {GetMe, Logout, Refresh} from "@/app/actions";
import cx from 'clsx';

// type Props = {
//     GetMe: () => Promise<User | null>
//     Logout: () => Promise<void>
// }

const REFRESH_INTERVAL = 5 * 60 * 1000;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
const INITIAL_REFRESH_DELAY = 5 * 1000;

const Profile = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {isPending, isSuccess, data} = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await GetMe();
            if (!res) {
                throw new Error()
            }
            return res;
        },
        retry: false,
        refetchOnWindowFocus: false,
        // staleTime: 1000 * 60 * 5
    });

    const logoutMutation = useMutation({
        mutationFn: Logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['me']});
            router.push("/login");
        },
        onError: (error) => {
            console.error("Не удалось выйти из аккаунта. Попробуйте позже.", error)
        },
    });

    const refreshMutation = useMutation({
        mutationFn: Refresh,
        // onError: (error) => {
        //     console.error("Не удалось обновить сессию.", error);
        //     logoutMutation.mutate(); // Выполняем logout, если refresh не удался
        // },
    });

    useEffect(() => {
        if (!isSuccess)
            return;

        let inactivityTimer: NodeJS.Timeout;
        let refreshInterval: NodeJS.Timeout;

        const initialRefresh = setTimeout(() => {
            refreshMutation.mutate();
        }, INITIAL_REFRESH_DELAY);

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                logoutMutation.mutate()
            }, INACTIVITY_TIMEOUT);
        };

        const handleActivity = () => {
            resetInactivityTimer();
        };

        refreshInterval = setInterval(() => {
            refreshMutation.mutate();
        }, REFRESH_INTERVAL);

        resetInactivityTimer();

        const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

        activityEvents.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            clearTimeout(initialRefresh);
            clearTimeout(inactivityTimer);
            clearInterval(refreshInterval);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('scroll', handleActivity);
        };
    }, [isSuccess]);

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
                <Button variant="default" visibleFrom="sm" onClick={() => logoutMutation.mutate()}>
                    Выйти
                </Button>
                <Avatar component={Link} href={`/users/${data?.user.id}`} color="gray" size="60">
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

    const {setColorScheme} = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});

    return (
        <>
            <div className={classes.header}>
                <Group justify="space-between" h="100%" maw="1920px" mx="auto">
                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="xs"/>
                    <Link href="/" className={classes.link}>
                        <Group gap="xs" wrap="nowrap" visibleFrom="xs">
                            <Image
                                component={NextImage}
                                src="/gate_logo.svg"
                                alt="Gate logo"
                                width={40}
                                height={40}
                            />
                            <Title order={1} visibleFrom="md">
                                Gate
                            </Title>
                        </Group>
                    </Link>
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
                    <Group>
                        <ActionIcon
                            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                            variant="default"
                            size="input-sm"
                            aria-label="Toggle color scheme"
                        >
                            <IconSun className={cx(classes.icon, classes.light)} stroke={1.5}/>
                            <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                        </ActionIcon>
                        <Profile/>
                    </Group>
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
        </>
    );
}

export {Header};

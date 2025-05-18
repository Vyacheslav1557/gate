"use client";

import {User} from "../../contracts/tester/v1/api";
import React, {useState} from "react";
import {Button, Group, Select, Stack, TextInput, Title} from "@mantine/core";
import {DefaultLayout} from "@/components/Layout";

const roles = [
    "Студент",
    "Преподаватель",
    "Администратор",
];

type Props = {
    user: User
    onSubmit: (id: number, role?: any, username?: string) => Promise<void | null>
    canEdit: boolean
}

const ProfileForm = (props: Props) => {
    const [user, setUser] = useState(props.user);

    return (
        <DefaultLayout>
            <Group px="sm" w="100%" justify="center">
                <Stack align="center" mt="sm">
                    <Title order={2}>
                        Профиль пользователя {props.user.username}
                    </Title>
                    <Group align="end" w="fit-content" m="auto" pt="sm" gap="sm">
                        <TextInput
                            label="Никнейм"
                            placeholder="Никнейм"
                            defaultValue={user.username}
                            onChange={(event) => setUser({...user, username: event.target.value})}
                            disabled={!props.canEdit}
                        />
                        <Select
                            data={roles}
                            label="Роль"
                            defaultValue={roles[user.role]}
                            allowDeselect={false}
                            onChange={(event) => setUser({...user, role: roles.indexOf(event!)})}
                            disabled={!props.canEdit}
                        />
                    </Group>
                    <Button
                        disabled={JSON.stringify(user) === JSON.stringify(props.user)}
                        w="fit-content"
                        onClick={() => props.onSubmit(user.id!, user.role, user.username)}
                    >
                        Сохранить
                    </Button>
                </Stack>
            </Group>
        </DefaultLayout>
    );
};

export {ProfileForm};

"use client";

import React, {useState} from 'react';
import {Button, Group, Select, Stack, TextInput, Title} from "@mantine/core";
import {Header} from "@/components/header";
import {User} from "../../../proto/user/v1/api";
import {UpdateUser} from "@/shared/api";


const roles = [
    "Студент",
    "Преподаватель",
    "Администратор",
];


type Props = {
    user: User
    canEdit: boolean
}


const ClientPage = (props: Props) => {
    const [user, setUser] = useState(props.user);

    return (
        <>
            <Header/>
            <main>
                <Group px="sm">
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
                                onChange={(event) => setUser({...user, role: roles.indexOf(event)})}
                                disabled={!props.canEdit}
                            />
                        </Group>
                        <Button
                            disabled={JSON.stringify(user) === JSON.stringify(props.user)}
                            w="fit-content"
                            onClick={() => UpdateUser(user.id!, user.role, user.username)}
                        >
                            Сохранить
                        </Button>
                    </Stack>
                </Group>
            </main>
        </>
    );
};

export {ClientPage};

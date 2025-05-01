"use client";

import {Button, Group, rem, SegmentedControl, Select, Stack, Text, Textarea} from "@mantine/core";
import {useState} from "react";
import {Dropzone, DropzoneAccept, DropzoneIdle, DropzoneReject, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {IconCloudUpload, IconUpload, IconX} from "@tabler/icons-react";
import classes from "./code.module.css";

const languages = ["python", "cpp", "golang", "ruby"]

const Code = () => {
    const [value, setValue] = useState("Код");

    return (
        <Stack className={classes.code}>
            <Select data={languages} allowDeselect={false} defaultValue={languages[0]} label="Компилятор"/>
            <Group>
                <Text fw={500}>Решение</Text>
                <SegmentedControl data={['Код', 'Файл']} value={value} onChange={setValue}/>
            </Group>
            {
                value === "Код" ? <Textarea classNames={{input: classes.input}}/> : <Dropzone
                    onDrop={(files) => console.log('accepted files', files)}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    gap={0}
                >
                    <DropzoneAccept>
                        <IconUpload
                            style={{width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)'}}
                            stroke={1.5}
                        />
                    </DropzoneAccept>
                    <DropzoneReject>
                        <IconX
                            style={{width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)'}}
                            stroke={1.5}
                        />
                    </DropzoneReject>
                    <DropzoneIdle>
                        <Stack className={classes.dropzone__content}>
                            <IconCloudUpload
                                style={{
                                    width: rem(52),
                                    height: rem(52),
                                    color: 'var(--mantine-color-bright)',
                                    marginBottom: rem(20)
                                }}
                                stroke={1.5}
                            />
                            <Text size="xl" inline fw={700}>
                                Загрузить решение
                            </Text>
                            <Text size="sm" c="dimmed" inline ta="center">
                                Перетащите сюда файл который вы хотите отправить или выберите его нажав сюда
                            </Text>
                        </Stack>
                    </DropzoneIdle>
                </Dropzone>
            }
            <Button>Отправить решение</Button>
        </Stack>
    )
}

export {Code};

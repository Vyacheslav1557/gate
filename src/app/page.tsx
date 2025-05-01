import {AppShell, AppShellHeader, AppShellMain} from "@mantine/core";
import {Header} from "@/components/header";
import React from "react";

export const metadata = {
    title: 'Главная',
    // description: 'Gate - платформа sch9',
};

export default function Page() {
    return (
        <AppShell header={{height: 70}}>
            <AppShellHeader>
                <Header/>
            </AppShellHeader>
            <AppShellMain>

            </AppShellMain>
        </AppShell>
    );
}

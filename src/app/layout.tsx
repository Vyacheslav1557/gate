"use client";

import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';

import React from 'react';
import {ColorSchemeScript, mantineHtmlProps, MantineProvider} from '@mantine/core';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Notifications} from "@mantine/notifications";

const queryClient = new QueryClient();

export default function RootLayout({children}: { children: any }) {
    return (
        <html lang="ru" {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript defaultColorScheme="auto"/>
            <link rel="shortcut icon" href="/gate_logo.svg"/>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body>
        <QueryClientProvider client={queryClient}>
            <MantineProvider defaultColorScheme="auto" withGlobalClasses>
                <Notifications/>
                {children}
            </MantineProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}

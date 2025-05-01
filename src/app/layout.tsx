"use client";

import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';

import React from 'react';
import {AppShell, ColorSchemeScript, mantineHtmlProps, MantineProvider} from '@mantine/core';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';


const queryClient = new QueryClient();

export default function RootLayout({children}: { children: any }) {
    return (
        <html lang="en" {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript defaultColorScheme="light"/>
            <link rel="shortcut icon" href="/gate_logo.svg"/>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body>
        <QueryClientProvider client={queryClient}>
            <MantineProvider defaultColorScheme="light" withGlobalClasses forceColorScheme="light">
                <AppShell>
                    {children}
                </AppShell>
            </MantineProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}

import type React from "react";
import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import { LayoutContent } from "@/components/layout/layout-content";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/notifications/styles.css";
import StoreProvider from "./StoreProvider";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

export const metadata: Metadata = {
  title: "Procurement Catalogue System",
  description: "Enterprise procurement and catalogue management platform",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning>
        <StoreProvider>
          <MantineProvider
            defaultColorScheme="auto"
            theme={createTheme({
              primaryColor: "cyan",
              colors: {
                dark: [
                  "#C9C9C9",
                  "#b8b8b8",
                  "#828282",
                  "#696969",
                  "#424242",
                  "#3b3b3b",
                  "#2e2e2e",
                  "#242424",
                  "#1f1f1f",
                  "#141414",
                ],
              },
              other: {
                bodyColor:
                  "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
                textColor:
                  "light-dark(var(--mantine-color-black), var(--mantine-color-white))",
              },
            })}
          >
            <Notifications position="bottom-right" />
            <LayoutContent>{children}</LayoutContent>
          </MantineProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

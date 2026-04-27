import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import classNames from "classnames";
import { Column, ThemeInit } from "@once-ui-system/core";
import { Meta } from "@once-ui-system/core/modules";

import { Providers } from "./providers";
import { defaultMeta } from "./resources/seo";
import { fonts, themeInit } from "../resources/once-ui.config";

const rootMetadata = Meta.generate(defaultMeta);

export const metadata: Metadata = {
  ...rootMetadata,
  metadataBase: new URL(defaultMeta.baseURL),
  applicationName: "AEGIS",
  creator: "David Kozák",
  publisher: "D-International",
  category: "security",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "AEGIS",
    "Protokol Aegis",
    "Ultimate OS",
    "AI obrana",
    "detekce manipulace",
    "digitální hygiena",
    "privacy",
    "attention defense",
    "dark patterns",
    "on-premise AI",
  ],
  openGraph: {
    ...rootMetadata.openGraph,
    siteName: "AEGIS",
    locale: "cs_CZ",
    url: defaultMeta.baseURL,
  },
  twitter: {
    ...rootMetadata.twitter,
    title: defaultMeta.title,
    description: defaultMeta.description,
    creator: "David Kozák",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="cs"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={classNames(
        fonts.primary.variable,
        fonts.secondary.variable,
        fonts.tertiary.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <ThemeInit config={themeInit} />
      </head>
      <body>
        <Providers>
          <Column
            as="div"
            background="page"
            fillWidth
            margin="0"
            padding="0"
            style={{ minHeight: "100vh" }}
          >
            {children}
          </Column>
        </Providers>
      </body>
    </html>
  );
}
